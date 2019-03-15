/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fetch from "node-fetch";
import openNLX from "opennlx";

class OpenNLXMiddleware {
  constructor(controllers, systemFunctions) {
    this.listener = null;
    this.name = "openNLX";
    this.classes = ["messenger", "bot", "sandbox"];
    this.mainControllers = controllers;
    this.systemFunctions = systemFunctions;
    logger.info("OpenNLXMiddleware");
  }

  async resetContext(parameters, bot, conversationId, v) {
    this.openNLX.deleteContext(bot.id, v, conversationId);
    // delete in db parameters
    try {
      await parameters.deleteValue(conversationId);
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
    // logger.info("p=", p, debug);
    return p;
  }

  async refreshConversation(messenger, conversationId, bot, version, v) {
    const messages = await messenger.getConversationMessages(conversationId);
    // logger.info("refreshConversation", messages.length);
    const parameters = this.mainControllers.zoapp.controllers.getParameters();
    if (Array.isArray(messages)) {
      await this.resetContext(parameters, bot, conversationId, v);
      const contextParams = {};
      this.openNLX.setContextParameters(
        bot.id,
        v,
        conversationId,
        contextParams,
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
          // logger.info("refreshConversation response", response);
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
          // logger.info("outputMessage=", outputMessage);
          if (params.message && outputMessage) {
            // WIP
            await messenger.updateMessage({
              ...outputMessage,
              body: params.message,
              debug: response.debug,
            });
            // logger.info("refreshConversation output", outputMessage);
          } else {
            logger.error("No previous output message to refresh");
          }
        }
      }
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */
      // store in Db parameters
      await parameters.setValue(conversationId, contextParams);
    }
  }

  async handleMessengerActions(data, version = null) {
    const bot = await this.mainControllers
      .getBots()
      .getBot(data.conversationOrigin || data.origin);
    if (!bot) return;
    const parameters = this.mainControllers.zoapp.controllers.getParameters();
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
      const contextParams = {};
      this.openNLX.setContextParameters(
        bot.id,
        v,
        data.conversationId,
        contextParams,
      );
      // store in db parameters
      await parameters.setValue(data.conversationId, contextParams);
      // logger.info("contextParams=", contextParams);
    } else if (data.action === "resetConversation") {
      // reset Conversation / Context
      this.openNLX.deleteContext(bot.id, v, data.conversationId);
      // delete in db parameters
      try {
        await parameters.deleteValue(data.conversationId);
      } catch (error) {
        // Silent error :
        // the context could be not stored in Parameters as not previously
        // initialized/used by adding a message
      }
      // logger.info("reset conversationId=", data.conversationId);
    } else if (data.action === "newMessages") {
      const fromBot = `bot_${bot.name}_${bot.id}`;
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */
      // get params from Db parameters
      for (const message of data.messages) {
        if (message.from !== fromBot && !message.debug) {
          let contextParams = await parameters.getValue(data.conversationId);
          // logger.info("contextParams=", contextParams);
          // set context in OpenNLX
          this.openNLX.setContextParameters(
            bot.id,
            v,
            data.conversationId,
            contextParams,
          );
          // logger.info("message=", message);
          const msg = {
            text: message.body,
            from: message.from,
            conversationId: message.conversationId,
            id: message.id,
            created_time: message.created_time,
          };
          const debug = version === "sandbox";
          const response = await this.openNLX.parse(bot.id, v, msg, debug);
          // logger.info("response=", JSON.stringify(response));
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
          // logger.info("params=", JSON.stringify(params));
          if (params.message) {
            await messenger.createMessage(null, conversationId, params);
          }

          // get context from OpenNLX
          contextParams = this.openNLX.getContextParameters(
            bot.id,
            v,
            data.conversationId,
          );
          // logger.info("contextParams=", contextParams);
          // store in Db parameters
          await parameters.setValue(data.conversationId, contextParams);
        }
      }
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */
    } else if (data.action === "updateConversation") {
      await this.refreshConversation(
        messenger,
        data.conversationId,
        bot,
        version,
        v,
      );
    } else if (data.action === "deleteMessage") {
      await this.refreshConversation(
        messenger,
        data.conversationId,
        bot,
        version,
        v,
      );
    }
  }

  async onDispatch(className, data) {
    logger.info("OpenNLX onDispatch: ", className, data.action);
    if (className === "sandbox") {
      await this.handleMessengerActions(data, "sandbox");
    } else if (className === "bot") {
      // handle intents events
      if (data.action === "createBot") {
        // WIP create bot
        const { bot } = data;
        this.openNLX.createAgent(bot);
      } else if (data.action === "updateBot") {
        // WIP update bot
        const { bot } = data;
        this.openNLX.updateAgent(bot);
      } else if (data.action === "removeBot") {
        // WIP remove bot
        const { bot } = data;
        this.openNLX.deleteAgent(bot.id);
      } else if (data.action === "publishBot") {
        // WIP publish bot
        const { botId, version } = data;
        this.openNLX.publishIntents(botId, "default", version);
      } else if (data.action === "setIntents") {
        // WIP set Intents
        // logger.info("setIntents data.intents=", data.intents);
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
        // WIP move Intents
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
        // WIP remove Intents
        if (data.intents && data.intents.length === 1) {
          const { botId, versionId, id } = data.intents[0];
          const version = versionId || "default";
          this.openNLX.deleteIntents(botId, version, id);
        } else {
          logger.info(" TODO RemoveIntents > 1");
        }
      } else if (data.action === "removeAllIntents") {
        // WIP remove all Intents
        const { botId, versionId } = data.intents;
        const version = versionId || "default";
        this.openNLX.deleteAllIntents(botId, version);
      }
    } else if (className === "messenger") {
      await this.handleMessengerActions(data);
    }
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
      return this.systemFunctions.get(action).call(parameters);
    }

    const wss = await middlewares.list({ origin: botId, type: "WebService" });
    if (wss && wss.length > 0) {
      const ws = wss[0];
      if (ws) {
        // WIP
        const post = { action, parameters };
        const path = ws.path || "";
        const url = `${ws.url}${path}?class=${className}&secret=${ws.secret}`;
        // console.log("url=", url);
        const response = await fetch(url, {
          method: "post",
          body: JSON.stringify(post),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const json = await response.json();
          if (json && json.result) {
            // logger.info("result=", json.result);
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
    // logger.info("OpenNLX init", this);
    // Add bots to openNLX
    const botsController = this.mainControllers.getBots();
    const bots = await botsController.getBots();
    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-await-in-loop */
    for (const bot of bots) {
      // logger.info("bot=", bot);
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
