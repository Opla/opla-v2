/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fetch from "node-fetch";
import openNLX from "opennlx";
import Contexts from "../controllers/contexts";

class OpenNLXMiddleware {
  constructor(controllers, systemFunctions) {
    this.name = "openNLX";
    this.classes = ["messenger", "bot", "sandbox", "system"];
    this.mainControllers = controllers;
    this.systemFunctions = systemFunctions;
    logger.info("OpenNLXMiddleware");
  }

  getContexts() {
    return this.mainControllers.getContexts();
  }

  async resetContext(bot, conversationId, v) {
    this.openNLX.deleteContext(bot.id, v, conversationId);
    // delete in db parameters
    try {
      await this.getContexts().deleteVariables(conversationId);
    } catch (error) {
      // Silent error :
      // the context could be not stored in Parameters as not previously
      // initialized/used by adding a message
    }
  }

  static async updateInputMessage(messenger, message, response, params, debug) {
    const p = { ...params };
    if (response && response.message) {
      p.message = response.message.text;
    } else if (debug) {
      p.message = "[Error] No intent found";
      p.error = "No intent found";
    } else {
      logger.info("error in response", response);
    }
    if (debug) {
      p.debug = response.debug;
      await messenger.updateMessage({
        ...message,
        debug: response.debug,
      });
    }
    return p;
  }

  async refreshConversation(messenger, conversation, bot, version, v) {
    const { conversationId } = conversation;
    logger.info("conversation=", conversation);
    const messages = await messenger.getConversationMessages(conversationId);
    const localContext = await this.getContexts().initLocalContext(
      conversation,
      bot,
      messenger,
    );
    await this.resetContext(bot, conversationId, v);
    if (Array.isArray(messages)) {
      this.openNLX.setContext(
        { agentId: bot.id, version: v, name: conversationId },
        localContext.variables,
        localContext.attributes,
      );
      const fromBot = `bot_${bot.name}_${bot.id}`;
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */
      for (const message of messages) {
        if (message.from !== fromBot && message.debug) {
          const msg = {
            text: message.body,
            from: message.from,
            conversationId: message.conversationId,
            id: message.id,
            created_time: message.created_time,
          };
          const debug = version === "sandbox";
          const response = await this.openNLX.parse(bot.id, v, msg, debug);
          const params = await OpenNLXMiddleware.updateInputMessage(
            messenger,
            message,
            response,
            {
              from: fromBot,
              speaker: "chatbot",
            },
            debug,
          );
          const outputMessage = messages.find((m) => message.id === m.previous);
          if (params.message && outputMessage) {
            await messenger.updateMessage({
              ...outputMessage,
              body: params.message,
              debug: response.debug,
            });
          } else {
            logger.error("No previous output message to refresh");
          }
        }
      }
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */
      // store in Db parameters
      await this.getContexts().setVariables(
        conversationId,
        localContext.variables,
      );
    } else {
      await this.getContexts().setVariables(
        conversationId,
        localContext.variables,
      );
    }
  }

  async handleMessengerActions(data, version = null) {
    const bot = await this.mainControllers
      .getBots()
      .getBot(data.conversationOrigin || data.origin);
    if (!bot) return;
    let v = version;
    let messenger;
    if (!version) {
      v = bot.publishedVersionId;
      messenger = this.mainControllers.getMessenger();
    } else {
      v = "default";
      messenger = this.mainControllers.getSandboxMessenger();
    }
    if (data.action === "newConversation") {
      // create Conversation / Context
      const localContext = await this.getContexts().initLocalContext(
        data,
        bot,
        messenger,
      );
      const { variables, attributes } = localContext;
      this.openNLX.setContext(
        { agentId: bot.id, version: v, name: data.conversationId },
        variables,
        attributes,
      );
      // store in db parameters
      await this.getContexts().setVariables(data.conversationId, variables);
    } else if (data.action === "resetConversation") {
      // reset Conversation / Context
      this.resetContext(bot, data.conversationId, v);
      // logger.info("reset conversationId=", data.conversationId);
    } else if (data.action === "newMessages") {
      const fromBot = `bot_${bot.name}_${bot.id}`;
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */
      // get params from Db parameters
      let variables = await this.getContexts().getVariables(
        data.conversationId,
      );
      for (const message of data.messages) {
        if (message.from !== fromBot && !message.debug) {
          // set context in OpenNLX
          this.openNLX.setContext(
            { agentId: bot.id, version: v, name: data.conversationId },
            variables,
          );
          const msg = {
            text: message.body,
            from: message.from,
            conversationId: message.conversationId,
            id: message.id,
            created_time: message.created_time,
          };
          const debug = version === "sandbox";
          const response = await this.openNLX.parse(bot.id, v, msg, debug);
          const { conversationId } = message;
          const params = await OpenNLXMiddleware.updateInputMessage(
            messenger,
            message,
            response,
            {
              from: fromBot,
              speaker: "chatbot",
              previous: message.id,
            },
            debug,
          );
          if (params.message) {
            await messenger.createMessage(null, conversationId, params);
          }

          // get context from OpenNLX
          const contextParams = this.openNLX.getContextData({
            agentId: bot.id,
            version: v,
            name: data.conversationId,
          });
          ({ variables } = contextParams);
        }
      }
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */
      // logger.info("contextParams=", contextParams);
      // store in Db parameters
      const localContext = await Contexts.resetLocalContext(
        data.conversationId,
        bot,
        messenger,
        variables,
      );
      ({ variables } = localContext);
      await this.getContexts().setVariables(data.conversationId, variables);
    } else if (
      data.action === "updateConversation" ||
      data.action === "createConversation" ||
      data.action === "deleteMessage"
    ) {
      await this.refreshConversation(messenger, data, bot, version, v);
    }
  }

  async onDispatch(className, data) {
    // logger.info("OpenNLX onDispatch: ", className, data.action);
    if (className === "sandbox") {
      await this.handleMessengerActions(data, "sandbox");
    } else if (className === "bot") {
      // handle intents events
      if (data.action === "createBot") {
        // create bot
        const { bot, botId } = data;
        this.openNLX.createAgent(bot);
        this.openNLX.setCallablesObserver(botId, this.callables.bind(this));
      } else if (data.action === "updateBot") {
        // update bot
        const { bot } = data;
        this.openNLX.updateAgent(bot);
      } else if (data.action === "removeBot") {
        // remove bot
        const { bot } = data;
        this.openNLX.deleteAgent(bot.id);
      } else if (data.action === "publishBot") {
        // publish bot
        const { botId, version } = data;
        this.openNLX.publishIntents(botId, "default", version);
      } else if (data.action === "setIntents") {
        // set Intents
        if (data.intents && data.intents.length > 0) {
          const { botId, versionId } = data.intents[0];
          const version = versionId || "default";
          const bots = this.mainControllers.getBots();
          let intents = await bots.getIntents(botId, versionId);
          intents = intents.map((int) => {
            const toOpenNLXIntent = int;
            if (int.previousId && int.previousId.length > 0) {
              toOpenNLXIntent.previous = int.previousId;
              delete toOpenNLXIntent.previousId;
            }
            toOpenNLXIntent.deactivated =
              int.state && int.state === "deactivated";
            return toOpenNLXIntent;
          });
          this.openNLX.deleteAllIntents(botId, version);
          this.openNLX.setIntents(botId, version, intents);
        }
      } else if (data.action === "moveIntents") {
        // move Intents
        const { botId, id } = data.intents;
        const bots = this.mainControllers.getBots();
        const intent = await bots.getIntent(botId, id);
        if (intent) {
          const { versionId } = intent;
          const version = versionId || "default";
          this.openNLX.deleteAllIntents(botId, version);
          const intents = await bots.getIntents(botId, versionId);
          this.openNLX.setIntents(botId, version, intents);
        }
      } else if (data.action === "removeIntents") {
        // remove Intents
        if (data.intents && data.intents.length === 1) {
          const { botId, versionId, id } = data.intents[0];
          const version = versionId || "default";
          this.openNLX.deleteIntents(botId, version, id);
        } else {
          logger.info(" TODO RemoveIntents > 1");
        }
      } else if (data.action === "removeAllIntents") {
        // remove all Intents
        const { botId, versionId } = data.intents;
        const version = versionId || "default";
        this.openNLX.deleteAllIntents(botId, version);
      } else if (data.action === "setVariables") {
        const { botId, variables } = data;
        const version = "default";
        this.openNLX.setContext(
          { agentId: botId, version, name: "global" },
          Contexts.serializeVariables(variables),
        );
      } else if (data.action === "setEntities") {
        const { botId, entities } = data;
        const entitiesProvider = this.openNLX.getEntitiesProvider(
          botId,
          "default",
        );
        entities.forEach((e) => {
          entitiesProvider.addEnumEntity(e.name, e.values, "global");
        });
      }
    } else if (className === "messenger") {
      await this.handleMessengerActions(data);
    } else if (className === "system") {
      if (data.action === "setVariables") {
        const { variables } = data;
        this.openNLX.setContext(
          { name: "system" },
          Contexts.serializeVariables(variables),
        );
      } else if (data.action === "getEntities") {
        return this.openNLX.getSystemEntities();
      }
    }
    return null;
  }

  async doCall(botId, func, parameters) {
    const middlewares = this.mainControllers.zoapp.controllers.getMiddlewares();
    let className = "";
    let action = "";
    const i = func.indexOf(".");
    if (i > 0) {
      className = func.substring(0, i);
      action = func.substring(i + 1);
      logger.info(" action=", action, " className", className);
    } else {
      logger.info("OpenNLX.doCall Malformed func : ", func);
      return null;
    }

    if (className === "system") {
      return this.systemFunctions.get(action).call(parameters, botId);
    }

    const wss = await middlewares.list({ origin: botId, type: "WebService" });
    if (wss && wss.length > 0) {
      const ws = wss.find((m) => m.classes.includes(className));
      if (ws) {
        const post = { action, parameters };
        const path = ws.path || "";
        const url = `${ws.url}${path}?class=${ws.classes[0]}&secret=${
          ws.secret
        }`;
        const response = await fetch(url, {
          method: "post",
          body: JSON.stringify(post),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const json = await response.json();
          if (json && json.result) {
            return json.result;
          }
        } else {
          logger.info("OpenNLX.doCall fetch error : ", response);
        }
      }
    }
    return null;
  }

  async callables(botId, action, params, target = "default") {
    logger.info(
      "callables botId=",
      botId,
      "action=",
      action,
      "params=",
      params,
      target,
    );
    if (this.mainControllers) {
      return this.doCall(botId, action, params);
    }
    return null;
  }

  async init(m) {
    this.id = m.id;
    this.openNLX = openNLX;
    this.openNLX.instance.setup({ entity: { enableAll: true } });
    const systemVariables = await this.mainControllers
      .getAdmin()
      .getSystemVariables();
    this.openNLX.setContext(
      { name: "system" },
      Contexts.serializeVariables(systemVariables),
    );
    // logger.info("OpenNLX init", this);
    // Add bots to openNLX
    const botsController = this.mainControllers.getBots();
    const bots = await botsController.getBots();
    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-await-in-loop */
    for (const bot of bots) {
      this.openNLX.createAgent(bot);
      // Add intents to openNLX
      let intents = await botsController.getIntents(bot.id);
      this.openNLX.setCallablesObserver(bot.id, this.callables.bind(this));
      this.openNLX.setIntents(bot.id, "default", intents);
      if (bot.publishedVersionId) {
        intents = await botsController.getIntents(
          bot.id,
          bot.publishedVersionId,
        );
        this.openNLX.setIntents(bot.id, bot.publishedVersionId, intents);
      }

      const globalVariables = await botsController.getGlobalVariables(bot.id);
      this.openNLX.setContext(
        { agentId: bot.id, version: "default", name: "global" },
        Contexts.serializeVariables(globalVariables),
      );

      const globalEntities = await botsController.getGlobalEntities(bot.id);
      const entitiesProvider = this.openNLX.getEntitiesProvider(
        bot.id,
        "default",
      );
      globalEntities.forEach((e) => {
        entitiesProvider.addEnumEntity(e.name, e.values, "global");
      });
    }
    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-await-in-loop */
  }

  getProperties() {
    return {
      name: this.name,
      classes: this.classes,
      status: "start",
      onDispatch: this.onDispatch.bind(this),
    };
  }
}

export default OpenNLXMiddleware;
