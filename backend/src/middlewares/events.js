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
    logger.info("EventsMiddleware starting");
  }

  async callEventsWS(botId, className, action, parameters) {
    const middlewares = this.mainControllers.zoapp.controllers.getMiddlewares();
    const wss = await middlewares.list({
      origin: botId,
      type: "EventsService",
    });
    if (wss && wss.length > 0) {
      const ws = wss.find((m) => m.classes.includes(className));
      if (ws) {
        // WIP
        const post = { action, parameters };
        const path = ws.path || "";
        const url = `${ws.url}${path}?class=${ws.classes[0]}&secret=${
          ws.secret
        }`;
        // console.log("url=", url);
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
      }
    }
    return null;
  }

  async doEvent(parameters) {
    const middlewares = this.mainControllers.zoapp.controllers.getMiddlewares();
    const wss = await middlewares.list({
      origin: parameters.id,
      type: "EventsService",
    });
    if (wss && wss.length > 0) {
      const ws = wss.find((m) => m.classes.includes("system"));
      if (ws && ws.secret === parameters.secret) {
        // TODO
        const { call } = parameters;
        if (call.action === "sendMessage") {
          // TODO
        }
      }
    }
  }

  async dispatchMessenger() {
    // TODO
    this.todo = "todo";
  }

  async dispatchBot(action, parameters) {
    // TODO
    if (action === "startBot") {
      return this.callEventsWS(parameters.id, "bot", action, parameters);
    }
    this.todo = "todo";
    return null;
  }

  async onDispatch(className, data) {
    const { action, ...params } = data;
    logger.info("EventsMiddleware onDispatch: ", className, action);
    if (className === "sandbox") {
      return this.dispatchMessenger();
    } else if (className === "messenger") {
      return this.dispatchMessenger();
    } else if (className === "bot") {
      return this.dispatchBot(action, params);
    } else if (className === "system") {
      if (action === "callEvent") {
        return this.callEvent(params);
      } else if (action === "closeServer") {
        // TODO
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
