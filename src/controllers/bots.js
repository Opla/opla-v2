/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Controller } from "zoapp-backend";
import BotsModel from "../models/bots";
import Participants from "../utils/participants";

export default class extends Controller {
  constructor(name, main, className) {
    super(name, main, className);
    this.model = new BotsModel(main.database, main.config);
  }

  async getBots(user = null) {
    return this.model.getBots(user);
  }

  async getBot(botId, userId = null) {
    return this.model.getBot(botId, userId);
  }

  async setBot(bot) {
    const b = await this.model.setBot(bot);
    if (b) {
      let action = "createBot";
      if (bot.id) {
        action = "updateBot";
      }
      this.dispatchBotAction(b.id, action, b);
    }
    // TODO error handling
    return b;
  }

  async getAnonymousBotConversation(user, bot) {
    const b = bot;
    delete b.author;
    delete b.email;
    delete b.publishedVersionId;
    // get conversationId linked to this anonymous user and bot
    const messenger = this.main.getMessenger();
    let conversation = await messenger.getConversation(user);
    if (!conversation) {
      const participants = Participants([
        user,
        { name: bot.name, id: bot.id, type: "bot" },
      ]);
      conversation = await messenger.createConversation(user, {
        participants,
        origin: bot.id,
      });
    }
    if (conversation) {
      b.conversationId = conversation.id;
    }
    return b;
  }

  async getUser(botId, user) {
    return this.model.getUser(botId, user);
  }

  async setUser(botId, user, role) {
    const r = await this.model.setUser(botId, user, role);
    // TODO error handling
    return r ? null : { error: "Can't create user" };
  }

  async publish(botId, publisher, channels, toVersion, fromVersion) {
    // WIP
    const bot = await this.model.getBot(botId, publisher.id);
    let res = null;
    if (bot) {
      if (bot.publishedVersionId) {
        // TODO remove previous published intents
      }
      const versionId = this.model.generateId(48);
      bot.publishedVersionId = versionId;
      await this.model.setBot(bot);
      const action = "publishBot";
      // this.dispatchIntentAction(botId, action, { bot, publisher });
      this.dispatch(this.className, {
        botId,
        action,
        bot,
        version: versionId,
        publisher,
        channels,
      });
      const intents = await this.model.getIntents(botId, fromVersion);
      res = await this.duplicateIntents(botId, intents, versionId);
    } else {
      res = { error: "Can't access this bot" };
    }
    return res;
  }

  async duplicateIntents(botId, fromIntents, versionId = null) {
    const intents = [];
    fromIntents.forEach((i) => {
      const intent = { ...i };
      if (intent.id) {
        delete intent.id;
      }
      if (intent.botId) {
        delete intent.botId;
      }
      if (intent.versionId) {
        delete intent.versionId;
      }
      intents.push(intent);
    });
    // logger.info("import intents=", intents);
    await this.setIntents(botId, intents, versionId);
    return this.getIntents(botId, versionId);
  }

  async getIntents(botId, versionId = null) {
    return this.model.getIntents(botId, versionId);
  }

  async setIntents(botId, intents, versionId) {
    const is = await this.model.setIntents(botId, intents, versionId);
    this.dispatchIntentAction(botId, "setIntents", is);
    return is;
  }

  async getIntent(botId, intentId) {
    return this.model.getIntent(botId, intentId);
  }

  async setIntent(botId, intent, versionId) {
    const it = await this.model.setIntent(botId, intent, versionId);
    this.dispatchIntentAction(botId, "setIntents", [it]);
    return it;
  }

  async moveIntent(botId, intentId, fromIndex, toIndex) {
    const ok = await this.model.moveIntent(botId, intentId, fromIndex, toIndex);

    if (ok) {
      const response = {
        botId,
        id: intentId,
        from: fromIndex,
        to: toIndex,
      };

      this.dispatchIntentAction(botId, "moveIntents", response);

      return response;
    }

    return {
      error: `can't move this intent to ${toIndex}`,
    };
  }

  async removeIntent(botId, intentId) {
    const intent = await this.model.removeIntent(botId, intentId);
    if (intent) {
      this.dispatchIntentAction(botId, "removeIntents", [intent]);
      return true;
    }
    return false;
  }

  async removeAllIntents(botId, versionId = null) {
    await this.model.removeAllIntents(botId, versionId);
    this.dispatchIntentAction(botId, "removeAllIntents", { botId, versionId });
    return true;
  }

  dispatchIntentAction(botId, action, intents) {
    this.dispatch(this.className, { botId, action, intents });
  }

  dispatchBotAction(botId, action, bot) {
    this.dispatch(this.className, { botId, action, bot });
  }
}
