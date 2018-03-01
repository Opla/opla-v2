/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { CommonRoutes } from "zoapp-backend";

export default class extends CommonRoutes {
  constructor(zoapp) {
    super(zoapp.controllers);
    this.extensions = zoapp.extensions;

    // Actually NodeJS doesn't support ES7 arrow binding so we need to bind manually
    this.conversations = this.conversations.bind(this);
    this.conversationById = this.conversationById.bind(this);
    this.conversationMessages = this.conversationMessages.bind(this);
    this.newConversation = this.newConversation.bind(this);
    this.newMessage = this.newMessage.bind(this);
  }

  async conversations(context) {
    const me = await this.access(context);
    const since = context.getQuery().since ? context.getQuery().since : 0;
    // Return an array so no check
    return this.extensions.getMessenger().getConversations(me, since, null);
  }

  async conversationById(context) {
    const me = await this.access(context);
    const { conversationId } = context.getParams();
    // logger.info("conversationId=" + conversationId);
    const payload = await this.extensions.getMessenger().getConversation(me, conversationId);
    if (payload === null) {
      return { error: `undefined conversation with id=${conversationId}` };
    }
    return payload;
  }

  async newConversation(context) {
    const me = await this.access(context);
    const params = context.getBody();
    const payload = await this.extensions.getMessenger().createConversation(me, params);
    if (payload === null) {
      return { error: "can't create conversation" };
    }
    return payload;
  }

  async conversationMessages(context) {
    const me = await this.access(context);
    const { conversationId } = context.getParams();
    const since = context.getQuery().since ? context.getQuery().since : 0;
    const payload = await this.extensions.getMessenger().getConversationMessages(
      me,
      conversationId, since,
    );
    if (payload === null) {
      return { error: "can't find conversation's messages" };
    }
    return payload;
  }

  async newMessage(context) {
    const me = await this.access(context);
    const scope = context.getScope();
    const isMaster = scope === "master";
    const { conversationId } = context.getParams();
    const params = { ...context.getBody() };
    let user = me;
    if (isMaster) {
      user = null;
    }
    const payload = await this.extensions.getMessenger().createMessage(
      user,
      conversationId,
      params,
    );
    if (payload === null) {
      return { error: "can't create message" };
    }
    return payload;
  }
}
