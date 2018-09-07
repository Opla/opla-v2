/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import FBMessengerRoutes from "./FBMessengerRoutes";

const sendResponseToParticipant = (participant, message) => {
  const targetPSID = participant.replace("fb_", "");
  const response = { text: message.body };
  // FBMessengerRoutes.callSendAPI(message.from, response);
  FBMessengerRoutes.callSendAPI(targetPSID, response);
};

export async function onDispatch(className, data) {
  logger.info("fbmiddleware ondispatch", className, data);
  if (className === "messenger") {
    const bot = await this.zoapp.extensions
      .getBots()
      .getBot(data.conversationOrigin || data.origin);
    if (!bot) return;

    if (data.action === "newMessages") {
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
            sendResponseToParticipant(participant, message);
          });
        }
      }
      /* eslint-disable no-restricted-syntax */
      /* eslint-disable no-await-in-loop */
    }
  }
}
export const getProperties = () => {};
