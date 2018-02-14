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

  async getFullBotConversations(user, botId, isAdmin = false) {
    const conversations = await this.getConversations(user, 0, botId, isAdmin);
    logger.info("getFullBotConv", user.username, conversations);
    if (conversations.length === 0) {
      const bot = await this.main.getBots().getBot(botId, user.id, isAdmin);
      // logger.info("bot=", bot);
      if (bot) {
        const participants = Participants([user, { name: bot.name, id: bot.id, type: "bot" }]);
        const conversation = await this
          .createConversation(user, { participants, origin: botId });
        conversations.push(conversation);
      } else {
        return { error: "Can't get messages" };
      }
    }
    return this.appendConversationsMessages(conversations);
  }


  async resetConversations(user, botId, isAdmin = false) {
    await this.deleteConversations(user, botId, isAdmin);
    const conversations = await this.getFullBotConversations(user, botId, isAdmin);
    if (!conversations.error) {
      const conversation = conversations[0];
      const conversationId = conversation.id;
      if (this.className) {
        this.dispatch(this.className, {
          origin: conversation.origin, author: conversation.author, conversationId, action: "newMessages", messages: [],
        });
      }
      return { result: "ok" };
    }
    return conversations;
  }
}
