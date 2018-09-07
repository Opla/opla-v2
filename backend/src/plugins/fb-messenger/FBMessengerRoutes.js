/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fetch from "node-fetch";
import { CommonRoutes } from "zoapp-backend";

export default class FBMessengerRoutes extends CommonRoutes {
  constructor(zoapp) {
    super(zoapp.controllers);
    this.zoapp = zoapp;
  }

  // Sends response messages via the Send API
  static async callSendAPI(senderPsid, response) {
    const PAGE_ACCESS_TOKEN = "TOKEN_FROM_FB_APP";
    // Construct the message body
    const requestBody = {
      recipient: {
        id: senderPsid,
      },
      message: response,
    };

    // Send the HTTP request to the Messenger Platform
    fetch(
      `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      },
    ).then((res) => res.json());
  }

  async newMessage(context) {
    logger.warn("post webhook");
    const { body } = context.req;
    if (body.object === "page") {
      // Iterate over each entry - there may be multiple if batched

      body.entry.forEach(async (entry) => {
        // for (const entry of body.entry) {
        // body.entry.forEach((entry) => {

        // Get the webhook event. entry.messaging is an array, but
        // will only ever contain one event, so we get index 0
        const webhookEvent = entry.messaging[0];
        const senderPsid = webhookEvent.sender.id;
        if (webhookEvent.message && !webhookEvent.message.is_echo) {
          logger.info(webhookEvent.message);
          const receivedMessage = webhookEvent.message;
          // handle message
          // create profile if not existing
          const profile = await this.zoapp.controllers
            .getUsers()
            .model.createProfile({
              username: `fb_${senderPsid}`,
              email: "",
              id: null,
              creation_date: Date.now(),
            });

          const { botId } = context.getParams();
          let bot = await this.zoapp.extensions.getBots().getBot(botId);

          const conversation = await this.zoapp.extensions
            .getMessenger()
            .getConversation(profile, senderPsid);

          if (!conversation) {
            bot = await this.zoapp.extensions
              .getBots()
              .getAnonymousBotConversation(profile, bot);
          } else {
            bot.conversationId = conversation.id;
          }

          if (receivedMessage.text) {
            const payload = await this.zoapp.extensions
              .getMessenger()
              .createMessage(profile, bot.conversationId, {
                body: receivedMessage.text,
                from: senderPsid,
              });
            if (payload === null) {
              return { error: "can't create message" };
            }
            return "EVENT_RECEIVED";
          }
        }
        return "ERROR";
      });

      // Return a '200 OK' response to all events
      // context.res.status(200).send("EVENT_RECEIVED");
      return "EVENT_RECEIVED";
    }
    // context.res.sendStatus(404);
    return "ERROR";
  }
}
