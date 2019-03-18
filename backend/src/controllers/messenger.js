/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Controller } from "zoapp-backend";
import MessengerModel from "../models/messenger";

export default class extends Controller {
  constructor(name, main, className = null) {
    super(name, main, className);
    this.model = new MessengerModel(main.database, main.config);
  }

  async getConversations(user, since, origin, isAdmin = false) {
    return this.model.getConversations(user, since, origin, isAdmin);
  }

  async getConversation(user, conversationId) {
    return this.model.getConversation(user, conversationId);
  }

  async getConversationUser(conversationId, userId) {
    const conversation = await this.model.getConversation(null, conversationId);
    let user = null;
    if (conversation && Array.isArray(conversation.participants)) {
      // console.log("getConv", userId, conversation.participants);
      conversation.participants.forEach((username) => {
        if (username.indexOf("bot_") === -1 && !user) {
          user = { username, id: userId };
        }
      });
    }
    return user;
  }

  async createConversation(user, params) {
    let conversation = null;
    const { participants, origin, ...p } = params;
    if (participants) {
      conversation = await this.model.createConversation(
        user,
        participants,
        p,
        origin,
      );
    }
    return conversation;
  }

  async getConversationMessages(conversationId, since = 0) {
    return this.model.getConversationMessages(conversationId, since);
  }

  async updateMessage(message) {
    let msg = null;
    if (message.id && message.conversationId) {
      msg = await this.model.storeMessage(message, message.id);
    }
    return msg;
  }

  async createMessage(user, conversationId, params) {
    let fromUser = params.from;
    if (!fromUser && user) {
      fromUser = user.username;
    }
    let message = await this.model.buildMessage(fromUser, params);
    if (message) {
      // TODO queue message
      const conversation = await this.model.getConversation(
        user,
        conversationId,
      );
      if (conversation) {
        message = await this.model.storeMessage({
          conversationId: conversation.id,
          ...message,
        });
        if (conversation.last < message.created_time) {
          conversation.last = message.created_time;
          await this.model.storeConversation(conversation);
        }
        // dispatch message
        // TODO relayed for messages providers
        // logger.info("createMessage dispatch will", this.className, message);

        if (this.className) {
          let { origin } = conversation;
          const conversationOrigin = origin;
          if (this.className === "messenger") {
            origin = conversation.id;
          }
          const payload = {
            origin,
            conversationOrigin,
            author: conversation.author,
            conversationId,
            action: "newMessages",
            messages: [message],
          };
          /* logger.info(
            "createMessage dispatch start",
            this.className,
            message,
            payload,
          ); */
          await this.dispatch(this.className, payload);
          // logger.info("dispatch stop", message.body);
        }
        message = MessengerModel.exportMessage(message);
      } else {
        logger.info("Can't find conversation", conversationId);
      }
    }
    return message;
  }

  async deleteMessage(message, origin, author) {
    let id = null;
    if (message.id && message.conversationId) {
      id = await this.model.deleteMessage(message);
      await this.dispatch(this.className, {
        origin,
        author,
        conversationId: message.conversationId,
        action: "deleteMessage",
      });
    }
    return id;
  }

  async deleteConversationMessages(conversationId) {
    return this.model.deleteConversationMessages(conversationId);
    // TODO dispatch message
  }

  async deleteConversations(user, origin, isAdmin = false) {
    return this.model.deleteConversations(user, origin, isAdmin);
    // TODO dispatch message
  }
}
