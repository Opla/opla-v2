/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CommonRoutes } from "zoapp-backend";

export default class EventsRoutes extends CommonRoutes {
  constructor(zoapp) {
    super(zoapp.controllers);
    this.zoapp = zoapp;

    this.initConversationAndMessage = this.initConversationAndMessage.bind(
      this,
    );
  }

  async initConversationAndMessage(context) {
    const me = await this.access(context);
    const queryParams = context.getQuery();
    const payload = await this.zoapp.extensions
      .getMessenger()
      .getConversation(me, queryParams.conversationId);
    if (payload === null) {
      return { error: "can't create conversation" };
    }
    const botUsername = payload.participants.find((p) => p.match(/^bot_.*$/));
    await this.zoapp.extensions.getMessenger().createMessage(null, payload.id, {
      message: queryParams.message,
      from: botUsername,
    });
    return payload;
  }
}
