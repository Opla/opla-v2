/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Model } from "zoapp-backend";
import descriptor from "../schemas/bots.json";

export default class extends Model {
  constructor(database, config) {
    super("bots", database, config, descriptor);
    this.botsCache = this.database;
  }

  async setBot(bot) {
    const botsCollection = this.database.getTable("bots");
    let botId = null;
    const storageBot = { ...bot };
    if (bot.id) {
      botId = bot.id;
    } else {
      storageBot.id = this.generateId(48); // TODO put token length in config
      storageBot.creation_date = Date.now();
    }
    await botsCollection.setItem(botId, storageBot);
    return storageBot;
  }

  async getBot(botId, userId = null) {
    const collection = this.database.getTable("bots");
    let bot = null;
    if (collection) {
      bot = await collection.getItem(botId);
    }
    if (bot && userId) {
      const c = this.database.getTable("botUsers");
      const q = `botId=${botId} AND userId=${userId}`;
      const botUser = await c.getItem(q);
      if (!botUser) {
        // userId don't have access to bot
        logger.info("userId don't have access to bot");
        bot = null;
      }
    }
    return bot;
  }

  async getBots(user) {
    let bots = [];
    if (user) {
      const collection = this.database.getTable("botUsers");
      const self = this;
      if (collection) {
        await collection.nextItem(async (u) => {
          // logger.info("u=", u);
          // logger.info("user=", user);
          if (
            u.id === user.userId ||
            u.email === user.email ||
            u.username === user.username
          ) {
            const bot = await self.getBot(u.botId);
            if (bot) {
              bots.push({ ...bot });
            }
          }
        });
      }
    } else {
      const collection = this.database.getTable("bots");
      if (collection) {
        const b = await collection.getItems();
        bots = [...b];
      }
    }
    return bots;
  }

  async getUser(botId, user, collection = this.database.getTable("botUsers")) {
    let userRet = null;
    if (collection) {
      await collection.nextItem(async (u) => {
        if (
          botId === u.botId &&
          (u.id === user.id ||
            u.id === user.userId ||
            u.email === user.email ||
            u.username === user.username)
        ) {
          userRet = u;
          return true;
        }
        return false;
      });
    }
    return userRet;
  }

  async setUser(botId, user, role, status = null) {
    // WIP
    let b = true;
    const collection = this.database.getTable("botUsers");
    let u = await this.getUser(botId, user, collection);
    logger.info("u", u);
    let uId = null;
    if (!u) {
      u = {};
      u.id = this.generateId();
      u.botId = botId;
    } else {
      uId = u.id;
    }
    if (user.id) {
      u.userId = user.id;
    } else {
      logger.info("Undefined user Id");
      b = false;
    }
    if (user.email) {
      u.email = user.email;
    }
    if (user.username) {
      u.username = user.username;
    }
    u.role = role;
    u.status = status;
    await collection.setItem(uId, u);
    return b;
  }

  async removeUser(
    botId,
    user,
    collection = this.database.getTable("botUsers"),
  ) {
    // WIP
    const u = await this.getUser(botId, user, collection);
    if (u) {
      await collection.removeItem(u.id);
    }
  }

  async getIntents(botId, versionId = null, query = null) {
    const collection = this.botsCache.getTable("intents");
    const q = `botId=${botId} AND versionId=${versionId || "NULL"}`;
    if (query) {
      logger.info("TODO getIntents query");
    }
    const intents = await collection.getItems(q);
    return intents;
  }

  async putIntent(collection, intent, botId, versionId) {
    let intentId = null;
    if (intent.versionId !== versionId) {
      logger.info("putIntents", versionId, intent.versionId);
    }
    let i = { ...intent };
    // logger.info("i", i, botId);
    if (intent.id && intent.botId === botId) {
      intentId = intent.id;
    } else if (!intent.id && !intent.botId) {
      i.id = this.generateId(48);
    } else {
      // Error botId doesn't match
      i = null;
    }
    if (i) {
      i.botId = botId;
      i.versionId = versionId;
      await collection.setItem(intentId, i);
    }
    return i;
  }

  async setIntents(botId, intents, versionId = null) {
    const array = [];
    const bot = await this.getBot(botId);
    // TODO check if user have the right to access this bot
    if (!bot) {
      // logger.info("no bot found", botId);
      return [];
    }
    const collection = this.botsCache.getTable("intents");

    if (intents && Array.isArray(intents)) {
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */
      for (const intent of intents) {
        const i = await this.putIntent(collection, intent, botId, versionId);
        if (i) {
          array.push(i);
        }
      }
      /* eslint-enable no-restricted-syntax */
      /* eslint-enable no-await-in-loop */
    } else if (intents && typeof intents === "object") {
      const i = await this.putIntent(collection, intents, botId, versionId);
      // logger.info("i", i);
      if (i) {
        array.push(i);
      }
    }
    return array;
  }

  async setIntent(botId, intent, versionId = null) {
    const bot = await this.getBot(botId);
    // TODO versionning
    let i = null;
    if (bot) {
      const collection = this.botsCache.getTable("intents");
      i = await this.putIntent(collection, intent, botId, versionId);
    }
    return i;
  }

  async moveIntent(botId, intentId, fromIndex, toIndex) {
    const bot = await this.getBot(botId);
    let i = false;
    // logger.info("bot=" + bot);
    if (bot) {
      const collection = this.botsCache.getTable("intents");
      const intent = await collection.getItem(intentId);
      // logger.info("intent=" + intent + " id=" + intentId);
      if (intent && intent.botId === botId) {
        // BUG this not the right way if we have multiple bots stored in same database
        i = await collection.moveItem(intentId, fromIndex, toIndex);
      }
    }
    return i;
  }

  async removeIntent(botId, intentId) {
    const bot = await this.getBot(botId);
    let i = null;
    if (bot) {
      const collection = this.botsCache.getTable("intents");
      const intent = await collection.getItem(intentId);
      if (intent && intent.botId === botId) {
        await collection.deleteItem(intentId);
        i = intent;
      }
    }
    return i;
  }

  async removeAllIntents(botId, version = null) {
    const bot = await this.getBot(botId);
    if (bot) {
      const collection = this.botsCache.getTable("intents");
      const query = `botId=${botId} AND versionId=${version || "NULL"}`;
      logger.info("Bots.removeAllIntents query=", query);
      await collection.deleteItems(query);
    }
  }
}
