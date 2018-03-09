/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import openNLX from "opennlx";

class OpenNLXMiddleware {
  constructor(controllers) {
    this.listener = null;
    this.name = "openNLX";
    this.classes = ["messenger", "bot", "sandbox"];
    this.mainControllers = controllers;
  }

  async handleMessengerActions(data, version = null) {
    const bot = await this.mainControllers.getBots().getBot(data.origin);
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
      // TODO create Conversation / Context
    } else if (data.action === "resetConversation") {
      // TODO reset Conversation / Context
      // logger.info("reset conversationId=", data.conversationId);
    } else if (data.action === "newMessages") {
      const fromBot = `bot_${bot.name}_${bot.id}`;
      data.messages.forEach((message) => {
        if (message.from !== fromBot) {
          // logger.info("message=", message);
          const msg = {
            text: message.body,
            from: message.from,
            conversationId: message.conversationId,
            id: message.id,
          };
          const response = this.openNLX.parse(bot.id, v, msg);
          // logger.info("response=", JSON.stringify(response));
          const { conversationId } = message;
          const params = {
            from: fromBot,
            input: msg,
          };
          if (response && response.message) {
            params.message = response.message.text;
            messenger.createMessage(null, conversationId, params);
          } else if (version === "sandbox") {
            params.message = "[Error] No intent found";
            params.error = "No intent found";
            messenger.createMessage(null, conversationId, params);
          } else {
            logger.info("error in response", response);
          }
        }
      });
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
        openNLX.createAgent(bot);
      } else if (data.action === "updateBot") {
        // WIP update bot
        const { bot } = data;
        openNLX.updateAgent(bot);
      } else if (data.action === "removeBot") {
        // WIP remove bot
        const { bot } = data;
        openNLX.deleteAgent(bot.id);
      } else if (data.action === "publishBot") {
        // WIP publish bot
        const { botId, version } = data;
        openNLX.publishIntents(botId, "default", version);
      } else if (data.action === "setIntents") {
        // WIP set Intents
        // logger.info("setIntents data.intents=", data.intents);
        if (data.intents && data.intents.length > 0) {
          const { botId, versionId } = data.intents[0];
          const bots = this.mainControllers.getBots();
          const intents = await bots.getIntents(botId, versionId);
          this.openNLX.deleteAllIntents(botId, versionId);
          this.openNLX.setIntents(botId, versionId, intents);
        }
      } else if (data.action === "moveIntents") {
        // WIP move Intents
        const { botId, id } = data.intents;
        const bots = this.mainControllers.getBots();
        const intent = await bots.getIntent(botId, id);
        if (intent) {
          const { versionId } = intent;
          this.openNLX.deleteAllIntents(botId, versionId);
          const intents = await bots.getIntents(botId, versionId);
          this.openNLX.setIntents(botId, versionId, intents);
        }
      } else if (data.action === "removeIntents") {
        // WIP remove Intents
        if (data.intents && data.intents.length === 1) {
          const { botId, versionId, id } = data.intents[0];
          this.openNLX.deleteIntent(botId, versionId, id);
        } else {
          logger.info(" TODO RemoveIntents > 1");
        }
      } else if (data.action === "removeAllIntents") {
        // WIP remove all Intents
        const { botId, versionId } = data.intents;
        this.openNLX.deleteAllIntents(botId, versionId);
      }
    } else if (className === "messenger") {
      await this.handleMessengerActions(data);
    }
  }

  async init(m) {
    this.id = m.id;
    this.openNLX = openNLX;
    // logger.info("OpenNLX init", this);
    // WIP add bots to openNLX
    const botsController = this.mainControllers.getBots();
    const bots = await botsController.getBots();
    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-await-in-loop */
    for (const bot of bots) {
      // logger.info("bot=", bot);
      openNLX.createAgent(bot);
      // WIP add intents to openNLX
      let intents = await botsController.getIntents(bot.id);
      /* if (bot.id === "nRblp6hnGlYGVaKYhTBVS76fRzunaOUQgM2dyxliQMxjb2Id") {
        intents.forEach((intent) => logger.info("intent=", intent));
      } */
      openNLX.setIntents(bot.id, "default", intents);
      if (bot.publishedVersionId) {
        intents = await botsController.getIntents(
          bot.id,
          bot.publishedVersionId,
        );
        openNLX.setIntents(bot.id, bot.publishedVersionId, intents);
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
