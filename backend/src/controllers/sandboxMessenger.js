/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import MessengerController from "./messenger";
import Participants from "../utils/participants";

export default class extends MessengerController {
  constructor(name, main, className = null) {
    super(name, main, className);
  }

  async appendConversationsMessages(conversations, since = 0) {
    const convs = [];
    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-await-in-loop */
    for (const conversation of conversations) {
      const messages = await this.getConversationMessages(
        conversation.id,
        since,
      );
      const c = { messages, ...conversation };
      convs.push(c);
    }
    /* eslint-enable no-restricted-syntax */
    /* eslint-enable no-await-in-loop */
    return convs;
  }

  async buildBotConversation(user, botId) {
    const bot = await this.main.getBots().getBot(botId, user.id);
    // logger.info("bot=", bot);
    if (bot) {
      const participants = Participants([
        user,
        { name: bot.name, id: bot.id, type: "bot" },
      ]);
      const conversation = await this.createConversation(user, {
        participants,
        origin: botId,
        channel: "playground",
      });
      return conversation;
    }
    return null;
  }

  async getBotUserConversation(user, botId) {
    const conversations = await this.getConversations(user, 0, botId, false);
    let conversation = null;
    if (conversations.length === 0) {
      conversation = await this.buildBotConversation(user, botId);
    } else {
      [conversation] = conversations;
    }
    return conversation;
  }

  async getFullBotConversations(user, botId, isAdmin = false) {
    const conversations = await this.getConversations(user, 0, botId, isAdmin);
    // logger.info("getFullBotConv", user.username, conversations);
    if (conversations.length === 0) {
      const conversation = await this.buildBotConversation(user, botId);
      if (conversation) {
        conversations.push(conversation);
      } else {
        return { error: "Can't get messages" };
      }
    }
    return this.appendConversationsMessages(conversations);
  }

  async updateMessages(user, botId, conversationId, messages, isAdmin = false) {
    const conversations = await this.getConversations(user, 0, botId, isAdmin);
    if (conversations && conversations.length > 0) {
      const conversation = conversations[0];
      const cId = conversation.id;
      if (cId === conversationId && Array.isArray(messages)) {
        await Promise.all(
          messages.map((message) => {
            if (
              message.id &&
              message.conversationId === conversationId &&
              message.from
            ) {
              return this.model.storeMessage(message, message.id);
            }
            return null;
          }),
        );
      }
      this.updateConversation(
        conversationId,
        conversation.origin,
        conversation.author,
      );
      return { result: "ok" };
    }
    return { result: "error" };
  }

  async updateBotConversation(user, botId, isAdmin = false) {
    const conversations = await this.getConversations(user, 0, botId, isAdmin);
    if (conversations && conversations.length > 0) {
      const conversation = conversations[0];
      await this.updateConversation(
        conversation.id,
        botId,
        conversation.author,
      );
    }
  }

  async updateConversation(conversationId, origin, author) {
    if (this.className) {
      await this.dispatch(this.className, {
        origin,
        author,
        conversationId,
        action: "updateConversation",
      });
    }
  }
  async resetConversations(user, botId, isAdmin = false) {
    // Get old conversation
    const conversations = await this.getFullBotConversations(
      user,
      botId,
      isAdmin,
    );

    // Delete old conversation & this params
    await this.deleteConversations(user, botId, isAdmin);
    if (!conversations.error) {
      const conversation = conversations[0];
      const conversationId = conversation.id;
      if (this.className) {
        await this.dispatch(this.className, {
          origin: conversation.origin,
          author: conversation.author,
          conversationId,
          action: "resetConversation",
        });
      }

      // Get new conversation
      const newConversations = await this.getFullBotConversations(
        user,
        botId,
        isAdmin,
      );
      if (this.className) {
        const newConversation = newConversations[0];
        await this.dispatch(this.className, {
          origin: newConversation.origin,
          author: newConversation.author,
          conversationId: newConversation.id,
          action: "newConversation",
        });
      }
      return newConversations;
    }

    return conversations;
  }
}
