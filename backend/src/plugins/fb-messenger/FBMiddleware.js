/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fetch from "node-fetch";
import { PLUGIN_NAME } from "./index";

// Sends response messages via the Send API
const callSendAPI = async (senderPsid, response, accessToken) => {
  // const accesToken = "TOKEN_FROM_FB_APP";
  // Construct the message body
  const requestBody = {
    recipient: {
      id: senderPsid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${accessToken}`,
    {
      qs: { access_token: accessToken },
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    },
  ).then((res) => res.json());
};

const sendResponseToParticipant = (participant, message, accessToken) => {
  const targetPSID = participant.replace("fb_", "");
  const response = { text: message.body };
  // FBMessengerRoutes.callSendAPI(message.from, response);
  callSendAPI(targetPSID, response, accessToken);
};

export async function onDispatch(className, data) {
  logger.info("fbmiddleware ondispatch", className, data);
  if (className === "messenger") {
    const bot = await this.zoapp.extensions
      .getBots()
      .getBot(data.conversationOrigin || data.origin);
    if (!bot) return;

    if (data.action === "newMessages") {
      // get middleware up to date accessToken
      const middlewareController = await this.zoapp.controllers.getMiddlewares();
      const list = await middlewareController.list(data.conversationOrigin);
      // find the middleware with the name "fb-messenger"
      const middleware = list.find((item) => item.name === PLUGIN_NAME);
      const { accessToken } = middleware;

      const fromBot = `bot_${bot.name}_${bot.id}`;
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */
      for (const message of data.messages) {
        // if message send by the bot
        if (message.from === fromBot) {
          // get messages conversation
          const conversation = await this.zoapp.extensions
            .getMessenger()
            .model.getConversation(null, message.conversationId);
          // get facebook participants
          const FBParticipants = conversation.participants.filter((p) =>
            p.startsWith("fb_"),
          );

          // send a response to every facebook participant
          FBParticipants.forEach((participant) => {
            sendResponseToParticipant(participant, message, accessToken);
          });
        }
      }
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */
    }
  }
}
export const getProperties = () => {};
