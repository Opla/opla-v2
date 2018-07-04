/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Model } from "zoapp-backend";
import descriptor from "../schemas/messenger.json";

class MessengerModel extends Model {
  constructor(database, config) {
    super("messenger", database, config, descriptor);
  }

  static exportConversation(conversation) {
    return {
      id: conversation.id,
      last: conversation.last,
      author: conversation.author,
      created_time: conversation.created_time,
      participants: [...conversation.participants],
      origin: conversation.origin,
    };
  }

  static buildParticipants(username, participants) {
    // remove duplicate
    return [username, ...participants].filter(
      (el, i, arr) => arr.indexOf(el) === i,
    );
  }

  async deleteConversations(user, origin = null) {
    const collection = this.database.getTable("conversations");
    const coll = this.database.getTable("messages");
    const conversations = await this.getAuthorConversations(
      user,
      origin,
      collection,
    );
    const c = [];
    const self = this;
    conversations.forEach(async (conversation) => {
      await collection.deleteItem(conversation.id);
      await self.deleteConversationMessages(conversation.id, coll);
      c.push(conversation.id);
    });
    return c;
  }

  async getAuthorConversations(
    user,
    origin = null,
    collection = this.database.getTable("conversations"),
  ) {
    const conversations = [];
    const { id: userId, username } = user;
    await collection.nextItem(async (conversation) => {
      const o =
        origin === null ||
        (conversation.origin && conversation.origin === origin);
      if (
        o &&
        (conversation.author === userId || conversation.author === username)
      ) {
        conversations.push(conversation);
      }
    });
    return conversations;
  }

  async getConversations(user, since = 0, origin = null) {
    const collection = this.database.getTable("conversations");
    const conversations = [];
    const { userId, username } = user;
    await collection.nextItem(async (conversation) => {
      let b = false;
      if (Array.isArray(conversation.participants)) {
        const { participants } = conversation;
        const last = conversation.last ? conversation.last : 0;
        const o =
          origin === null ||
          (conversation.origin && conversation.origin === origin);
        // logger.info("participants=", participants);
        participants.some((p) => {
          if (
            (p === userId || p === username) &&
            (since < last || since === 0) &&
            o
          ) {
            b = true;
          }
          return b;
        }, this);
      } else if (
        conversation.author === username ||
        conversation.author === userId
      ) {
        b = true;
      }

      if (b) {
        conversations.push(MessengerModel.exportConversation(conversation));
      }
    });
    // logger.info("gcs sql=", collection.sql);
    return conversations;
  }

  async getConversation(user, conversationId = null) {
    // logger.info("getConversation", conversationId);
    const collection = this.database.getTable("conversations");
    const userId = user ? user.id : null;
    const username = user ? user.username : null;
    let conversation = null;
    if (conversationId) {
      conversation = await collection.getItem(conversationId);
      if (!user) {
        return conversation;
      }
    } else if (user) {
      conversation = await collection.getItem(
        `author=${userId} OR author=${username}`,
      );
    }
    // logger.info("gc sql=", collection.sql);
    let b = false;
    // logger.info("user", userId, username);
    if (conversation && Array.isArray(conversation.participants)) {
      conversation.participants.some((p) => {
        // logger.info("participant", p);
        if (p === userId || p === username) {
          b = true;
        }
        return b;
      });
    } else if (
      conversation &&
      (conversation.author === username || conversation.author === userId)
    ) {
      b = true;
    }
    let c = null;
    if (b) {
      c = MessengerModel.exportConversation(conversation);
    }
    // logger.info("conversations=", c);
    return c;
  }

  async createConversation(user, participants, params = null, origin = null) {
    const collection = this.database.getTable("conversations");
    const userId = user ? user.id : null;
    const username = user ? user.username : null;
    let conversation = null;
    this.params = params;
    // logger.info("user=" + JSON.stringify(user));
    if (userId && Array.isArray(participants)) {
      conversation = {
        id: this.generateId(48),
        author: userId,
        origin,
        last: 0,
        created_time: Date.now(),
        participants: MessengerModel.buildParticipants(username, participants),
      };
      // logger.info("p=" +JSON.stringify(conversation.participants));
      await collection.setItem(null, conversation);
    }
    return conversation;
  }

  async storeConversation(conversation) {
    const collection = this.database.getTable("conversations");
    await collection.setItem(conversation.id, conversation);
  }

  async deleteConversationMessages(
    conversationId,
    collection = this.database.getTable("messages"),
  ) {
    await collection.deleteItems(`conversationId=${conversationId}`);
  }

  async getConversationMessages(conversationId, since = 0) {
    // const conversation = await this.getConversation(user, conversationId);
    let messages = null;
    if (conversationId) {
      let query = `conversationId=${conversationId}`;
      if (since) {
        query += ` AND created_time > ${since}`;
      }
      const collection = this.database.getTable("messages");
      messages = await collection.getItems(query);
      if (!messages) {
        messages = [];
      }
    }
    return messages;
  }

  static exportMessage(message) {
    // TODO better data handling
    return { ...message };
  }

  buildTimestamp() {
    let t = Math.round(Date.now() / 1000);
    if (t === this.lastTimestamp) {
      t += 1;
    }
    this.lastTimestamp = t;
    // logger.info("timestamp=", t);
    return t;
  }

  async buildMessage(fromUser, params) {
    let message = null;
    const msg = params;
    if (fromUser && (params.message || params.body || params.attachments)) {
      let { body } = params;
      if (!body && params.message) {
        body = params.message;
        delete msg.message;
      }
      message = {
        ...msg,
        id: this.generateId(52),
        from: fromUser,
        body,
        created_time: Date.now(),
        timestamp: this.buildTimestamp(),
      };
      if (params.input && params.input.created_time) {
        message.response_speed =
          message.created_time - params.input.created_time;
      }
    }
    return message;
  }

  async storeMessage(message, messageId = null) {
    const collection = this.database.getTable("messages");
    try {
      await collection.setItem(messageId, message);
      // logger.info("store message=", message);
    } catch (error) {
      logger.info(error);
      return null;
    }
    return message;
  }
}

export default MessengerModel;
