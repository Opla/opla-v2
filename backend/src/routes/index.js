/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import BotsRoutes from "./bots";
import ConversationsRoutes from "./conversations";
import MetricsRoutes from "./metrics";
import AdminRoute from "./admin";

export default (zoapp) => {
  const conversations = new ConversationsRoutes(zoapp);
  const bots = new BotsRoutes(zoapp);
  const metrics = new MetricsRoutes(zoapp);
  const admin = new AdminRoute(zoapp);

  // /conversations routes
  // List all conversations linked to session
  let route = zoapp.createRoute("/conversations");
  route.add("GET", "", ["*", "admin", "master"], conversations.conversations);
  // Get a conversation from its id
  route.add(
    "GET",
    "/:conversationId",
    ["*", "admin", "master"],
    conversations.conversationById,
  );
  // Create a conversation
  route.add(
    "POST",
    "",
    ["*", "admin", "master"],
    conversations.newConversation,
  );
  // Get conversation's messages from its id
  route.add(
    "GET",
    "/:conversationId/messages",
    ["*", "admin", "master"],
    conversations.conversationMessages,
  );
  // Delete conversation's messages from its id
  route.add(
    "DELETE",
    "/:conversationId/messages",
    ["*", "admin", "master"],
    conversations.deleteConversationMessages,
  );
  // Publish a new message in a conversation
  route.add(
    "POST",
    "/:conversationId/messages",
    ["*", "admin", "master"],
    conversations.newMessage,
  );

  // /bots routes
  route = zoapp.createRoute("/bots");
  // Bot create
  route.add("POST", "", ["owner, master"], bots.createBot);
  // bot params
  route.add("GET", "/params/:name", ["open"], bots.getParameters);
  // bot update
  route.add("PUT", "/:botId", ["owner", "admin", "master"], bots.updateBot);

  // get bots
  route.add("GET", "", ["owner", "admin", "master"], bots.getBots);
  // get bot
  route.add(
    "GET",
    "/:botId",
    ["owner", "admin", "master", "default", "anonymous"],
    bots.getBot,
  );

  // bot import
  route.add(
    "POST",
    "/:botId/import",
    ["owner", "admin", "master"],
    bots.import,
  );
  // bot publish
  route.add(
    "POST",
    "/:botId/publish",
    ["owner", "admin", "master"],
    bots.publish,
  );

  // bot get intents
  route.add(
    "GET",
    "/:botId/intents",
    ["owner", "admin", "master"],
    bots.intents,
  );
  // bot get intents
  route.add(
    "GET",
    "/:botId/intents/:version",
    ["owner", "admin", "master"],
    bots.intents,
  );
  // bot create intents
  route.add(
    "POST",
    "/:botId/intents",
    ["owner", "admin", "master"],
    bots.newIntent,
  );
  // bot update an intent
  route.add(
    "PUT",
    "/:botId/intents/:intentId",
    ["owner", "admin", "master"],
    bots.updateIntent,
  );
  // bot update intents
  route.add(
    "PUT",
    "/:botId/intents",
    ["owner", "admin", "master"],
    bots.updateIntents,
  );
  // bot move an intent
  route.add(
    "PUT",
    "/:botId/intents/:intentId/move",
    ["owner", "admin", "master"],
    bots.moveIntent,
  );
  // bot delete an intent
  route.add(
    "DELETE",
    "/:botId/intents/:intentId",
    ["owner", "admin", "master"],
    bots.removeIntent,
  );

  // /bots/sandbox sandbox get messages
  route.add(
    "GET",
    "/:botId/sandbox/messages",
    ["owner", "admin", "master"],
    bots.sandboxMessages,
  );
  // bot sandbox new message
  route.add(
    "POST",
    "/:botId/sandbox/messages/:conversationId",
    ["owner", "admin", "master", "default"],
    bots.sandboxNewMessage,
  );
  // bot sandbox update messages
  route.add(
    "PUT",
    "/:botId/sandbox/messages/:conversationId",
    ["owner", "admin", "master", "default"],
    bots.sandboxUpdateMessages,
  );
  // bot sandbox delete message
  route.add(
    "DELETE",
    "/:botId/sandbox/messages/:conversationId",
    ["owner", "admin", "master", "default"],
    bots.sandboxDeleteMessage,
  );
  // bot sandbox get context
  route.add(
    "POST",
    "/sandbox/variables/:botId",
    ["owner"],
    bots.sandboxSetVariables,
  );
  route.add(
    "GET",
    "/sandbox/variables/:botId",
    ["*"],
    bots.sandboxGetVariables,
  );
  // bot sandbox reset
  route.add(
    "DELETE",
    "/:botId/sandbox",
    ["owner", "admin", "master"],
    bots.sandboxReset,
  );

  route.add("POST", "/variables/:botId", ["owner"], bots.setGlobalVariables);
  route.add("GET", "/variables/:botId", ["*"], bots.getGlobalVariables);

  // Websocket services
  route = `${zoapp.endpoint}/bots/sandbox/messages`;
  zoapp.addWSRoute(
    route,
    ["*", "owner", "admin", "master"],
    ["sandbox"],
    "newMessages",
    async (event, channelId, data, ws) => {
      let response = null;
      // logger.info("sandbox WS", event, channelId);
      if (
        event === "newMessages" ||
        event === "updateConversation" ||
        event === "subscribe"
      ) {
        // logger.info("get me", ws.access);
        const me = await zoapp.controllers.getMe(ws.access.user_id);
        // logger.info("me=", me);
        if (me && channelId) {
          // logger.info("sandbox getFullBotConversations=", channelId);
          const cs = await zoapp.extensions
            .getSandboxMessenger()
            .getFullBotConversations(me, channelId);
          // logger.info("sandbox done getFullBotConversations=", channelId);
          response = { event: "newMessages", result: cs };
        }
      }
      return response;
    },
  );

  route = `${zoapp.endpoint}/conversations/messages`;
  zoapp.addWSRoute(
    route,
    ["*", "owner", "admin", "master", "anonymous"],
    ["messenger"],
    "newMessages",
    async (event, channelId, data, ws) => {
      let response = null;
      if (event === "newMessages" || event === "subscribe") {
        const me = await zoapp.controllers.getMe(ws.access.user_id);
        if (me && channelId) {
          const conversation = await zoapp.extensions
            .getMessenger()
            .getConversation(me, channelId);
          // logger.info("messenger getConversation=", conversation);
          let cs = null;
          if (conversation) {
            const messages = await zoapp.extensions
              .getMessenger()
              .getConversationMessages(channelId);
            cs = [{ messages, ...conversation }];
          }
          response = { event: "newMessages", result: cs };
        }
      }
      return response;
    },
  );

  // /metrics routes
  route = zoapp.createRoute("/metrics");
  route.add("GET", "/:botId", ["*", "admin", "master"], metrics.getForBot);

  // /admin routes
  route = zoapp.createRoute("/admin");
  route.add("GET", "/templates", ["open"], admin.getTemplates);
  route.add("GET", "/languages", ["open"], admin.getLanguages);
  route.add("POST", "/variables", ["admin"], admin.setSystemVariables);
  route.add("GET", "/variables", ["*"], admin.getSystemVariables);
};
