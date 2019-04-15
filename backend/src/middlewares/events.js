/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fetch from "node-fetch";

class EventsMiddleware {
  constructor(controllers) {
    this.listener = null;
    this.name = "events";
    this.classes = ["messenger", "bot", "sandbox", "system"];
    this.mainControllers = controllers;
    this.localWs = {};
    logger.info("EventsMiddleware starting");
  }

  async getWS(id, close) {
    let ws = null;
    if (close) {
      ws = this.localWs[id];
      if (ws) {
        delete this.localWs[id];
      }
    } else {
      const middlewares = this.mainControllers.zoapp.controllers.getMiddlewares();
      const wss = await middlewares.list({
        origin: id,
        type: "WebService",
        name: "event-webservice",
      });
      if (wss && wss.length > 0) {
        ws = wss.find((m) => m.classes.includes("events"));
        if (ws) {
          // console.log("ws=", ws, close, id);
          this.localWs[id] = ws;
        }
      }
    }
    return ws;
  }

  async callEventsWS(botId, className, action, parameters, close = false) {
    const ws = await this.getWS(botId, close);
    // console.log("ws=", ws, botId);
    if (ws) {
      logger.info("ws=", ws);
      // WIP
      const post = { action, parameters };
      const path = ws.path || "";
      const url = `${ws.url}${path}?class=${ws.classes[0]}&secret=${ws.secret}`;
      // console.log("url=", url);
      try {
        const response = await fetch(url, {
          method: "post",
          body: JSON.stringify(post),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const json = await response.json();
          if (json && json.result) {
            // logger.info("result=", json.result);
            return json.result;
          }
        } else {
          logger.info("EventsMiddleware.doCall fetch error : ", response);
        }
      } catch (e) {
        logger.info("EventsMiddleware.doCall fetch error : ", e.message);
      }
    }
    return null;
  }

  async doEvent(data, close = false) {
    // console.log("doEvent=", data);
    const ws = this.getWS(data.id, close);
    if (ws && ws.secret === data.secret) {
      // TODO
      const { parameters } = data;
      if (parameters.action === "newMessage") {
        // TODO
        const { message, scope } = parameters;
        let messenger;
        if (scope === "playground") {
          messenger = this.mainControllers.getSandboxMessenger();
        } else {
          messenger = this.mainControllers.getMessenger();
        }
        // console.log("todo sendMessage", message);
        if (parameters.message) {
          await messenger.createMessage(null, message.conversationId, message);
        }
      }
    }
  }

  async dispatchMessenger(scope, action, parameters) {
    // console.log("parameters=", parameters);
    if (action === "newMessages") {
      return this.callEventsWS(
        parameters.conversationOrigin,
        "events",
        action,
        parameters,
      );
    } else if (action === "createConversation") {
      return this.callEventsWS(parameters.origin, "events", action, parameters);
    } else if (action === "deleteConversations") {
      return this.callEventsWS(parameters.origin, "events", action, parameters);
    } else if (action === "deleteConversationMessages") {
      return this.callEventsWS(parameters.origin, "events", action, parameters);
    }
    return null;
  }

  async dispatchBot(action, parameters) {
    // TODO
    if (action === "startBot") {
      return this.callEventsWS(parameters.id, "events", action, parameters);
    }
    this.todo = "todo";
    return null;
  }

  async dispatchStartBot(parameters) {
    // console.log("EventsMiddleware dispatchStartBot: ", parameters.id);
    return this.callEventsWS(parameters.id, "events", "startBot", parameters);
  }

  async dispatchStopBot(parameters) {
    // console.log("EventsMiddleware dispatchStopBot: ", parameters.id);
    return this.callEventsWS(
      parameters.id,
      "events",
      "stopBot",
      parameters,
      true,
    );
  }

  async onDispatch(className, data) {
    const { action, ...parameters } = data;
    logger.info("EventsMiddleware onDispatch: ", className, action);
    if (className === "sandbox") {
      return this.dispatchMessenger("playground", action, parameters);
    } else if (className === "messenger") {
      return this.dispatchMessenger("publish", action, parameters);
    } else if (className === "bot") {
      if (action === "startBot") {
        return this.dispatchStartBot(parameters.bot);
      } else if (action === "stopBot") {
        return this.dispatchStopBot(parameters.bot);
      }
    } else if (className === "system") {
      if (action === "callEvent") {
        return this.doEvent(data);
      } else if (action === "closeServer") {
        // TODO
      } else if (action === "removeMiddleware") {
        return this.dispatchStopBot({ id: parameters.origin });
      } else if (action === "setMiddleware") {
        return this.dispatchStartBot({ id: parameters.origin });
      }
    }
    return null;
  }

  getProperties() {
    return {
      name: this.name,
      classes: this.classes,
      status: "start",
      onDispatch: this.onDispatch.bind(this),
    };
  }
}

export default EventsMiddleware;
