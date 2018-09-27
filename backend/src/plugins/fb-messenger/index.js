/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import FBMessengerRoutes from "./FBMessengerRoutes";
import { onDispatch } from "./FBMiddleware";

export const PLUGIN_NAME = "fb-messenger";
class FBMessenger {
  constructor(pluginManager) {
    this.tunnel = null;
    this.listener = null;
    this.name = PLUGIN_NAME;
    this.type = "MessengerConnector";
    this.zoapp = pluginManager.zoapp;
    this.fbMessengerRoutes = new FBMessengerRoutes(this.zoapp);
    // set default middleware value
    // will be override when register
    this.middleware = { token: "" };
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  setEventListener(listener) {
    this.listener = listener;
  }

  static initRoutes(middleware, zoapp, fbMessengerRoutes) {
    const route = zoapp.createRoute("/webhook/fb");
    // facebook messenger callback url
    route.add(
      "GET",
      "/:botId",
      ["*", "open"],
      (context) => {
        // get token from db
        const middlewaresController = zoapp.controllers.getMiddlewares();
        const middlewareVerifyToken = middlewaresController.getMiddlewareById(
          middleware.id,
        ).verifyToken;
        // check verify token
        const query = context.getQuery();
        if (query && query["hub.verify_token"] === middlewareVerifyToken) {
          const c = query["hub.challenge"];
          return parseInt(c, 10);
          // return JSON.stringify(c);
        }
        return "error on token";
      },
      () => true,
    );

    route.add("POST", "/:botId", ["*", "open"], (context) => {
      fbMessengerRoutes.newMessage(context);
    });
  }

  fireEvent(eventName) {
    logger.info("FBMessenger fireEvent", eventName);
    if (this.listener) {
      this.listener.fireEvent(eventName, this);
    }
  }

  async register(middleware) {
    this.middleware = middleware;
    if (middleware.origin) {
      // set middleware application
      if (!middleware.application || !middleware.application.id) {
        const name = `${middleware.name}_${middleware.origin}`;
        // get a previously created app with same name
        let app = await this.zoapp.authServer.getApplicationByName(name);
        if (!app) {
          // TODO generate anonymous_secret
          // WIP create application
          const bot = await this.zoapp.extensions
            .getBots()
            .getBot(middleware.origin);
          const { email } = bot; // WIP get email
          const params = {
            name,
            grant_type: "password",
            email,
            redirect_uri: "localhost",
            policies: { authorizeAnonymous: true, anonymous_secret: "koko" },
          };
          const payload = await this.zoapp.authServer.registerApplication(
            params,
          );
          if (payload && payload.result) {
            app = await this.zoapp.authServer.getApplicationByName(name);
          }
        }
        if (app) {
          this.middleware.application = app;
        }
      }
      if (!middleware.verifyToken) {
        this.middleware.verifyToken = Math.random()
          .toString(36)
          .substring(2);
      }
      if (!middleware.url) {
        this.middleware.url = `/webhook/fb/${middleware.origin}`;
        this.middleware.classes = ["messenger", "bot", "sandbox"];
      }
    } else {
      logger.info("No origin for FBMessengerMiddleware ", middleware.id);
    }
    // set onDispatch function
    this.middleware.onDispatch = onDispatch.bind(this);
    // init routes
    FBMessenger.initRoutes(this.middleware, this.zoapp, this.fbMessengerRoutes);
    return this.middleware;
  }

  async unregister(middleware) {
    // TODO
    this.middleware = null;
    return middleware;
  }
}

let instance = null;

const FBMessengerPlugin = (pluginsManager) => {
  if (!instance) {
    instance = new FBMessenger(pluginsManager);
  }
  return instance;
};

export default FBMessengerPlugin;
