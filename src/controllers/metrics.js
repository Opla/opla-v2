/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint class-methods-use-this: 0 */
import { Controller } from "zoapp-backend";
import MessengerModel from "../models/messenger";
import BotsModel from "../models/bots";

class MetricsController extends Controller {
  constructor(name, main, className = null) {
    super(name, main, className);
    this.models = {
      bots: new BotsModel(main.database, main.config),
      messenger: new MessengerModel(main.database, main.config),
    };
  }

  async getUsersMetrics(conversationsWithMessages) {
    const participants = conversationsWithMessages
      .reduce(
        (flatParticipants, conversation) =>
          flatParticipants.concat(conversation.participants),
        [],
      )
      .filter((p) => p !== null && !p.startsWith("bot_"));

    return {
      count: participants.length,
    };
  }

  async getConversationsMetrics(conversationsMessages) {
    const messagesCountPerConversation = conversationsMessages.map(
      (c) => c.messages.length,
    );

    const messagesSum = messagesCountPerConversation.reduce(
      (sum, nb) => sum + nb,
      0,
    );

    let averageCountPerConversation = 0;
    if (messagesCountPerConversation.length > 0) {
      averageCountPerConversation =
        messagesSum / messagesCountPerConversation.length;
    }

    return {
      count: conversationsMessages.length,
      messages_per_conversation: averageCountPerConversation,
    };
  }

  async getSessionsMetrics(conversationsMessages) {
    const sessionDurationSum = conversationsMessages.reduce(
      (sum, c) => sum + (c.last - c.created_time),
      0,
    );

    let averageSessionTime = 0;
    if (conversationsMessages.length > 0) {
      averageSessionTime = sessionDurationSum / conversationsMessages.length;
    }

    return {
      duration: averageSessionTime, // ms
    };
  }

  async getErrorsMetrics(conversationsMessages) {
    const messages = conversationsMessages.reduce(
      (flatMessages, conversation) =>
        flatMessages.concat(conversation.messages),
      [],
    );

    const errorMessages = messages.filter((m) => m.error);
    let errorRate = 0;
    if (messages.length > 0) {
      errorRate = errorMessages.length / messages.length;
    }

    return {
      rate: errorRate,
    };
  }

  async getResponsesMetrics(conversationsMessages) {
    const messages = conversationsMessages.reduce(
      (flatMessages, conversation) =>
        flatMessages.concat(conversation.messages),
      [],
    );
    const botsMessages = messages
      .map((message) => message.response_speed)
      .filter((speed) => speed != null);
    const speedSum = botsMessages.reduce((sum, speed) => sum + speed, 0);

    let averageSpeed = 0;
    if (botsMessages.length > 0) {
      averageSpeed = speedSum / botsMessages.length;
    }
    return {
      speed: averageSpeed, // ms
    };
  }

  async getForBot(botId) {
    const bot = await this.models.bots.getBot(botId);

    const conversations = await this.models.messenger.getConversations({
      userId: `bot_${bot.name}_${bot.id}`,
    });
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (c) => ({
        ...c,
        messages: await this.models.messenger.getConversationMessages(c.id),
      })),
    );

    return {
      users: await this.getUsersMetrics(conversationsWithMessages),
      conversations: await this.getConversationsMetrics(
        conversationsWithMessages,
      ),
      sessions: await this.getSessionsMetrics(conversationsWithMessages),
      errors: await this.getErrorsMetrics(conversationsWithMessages),
      responses: await this.getResponsesMetrics(conversationsWithMessages),
    };
  }
}

export default MetricsController;
