/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import FBMessengerRoutes from "./FBMessengerRoutes";
import { onDispatch } from "./FBMiddleware";

class FBMessenger {
  constructor(pluginManager) {
    this.tunnel = null;
    this.listener = null;
    this.name = "fb-messenger";
    this.type = "MessengerConnector";
    this.zoapp = pluginManager.zoapp;
    this.fbMessengerRoutes = new FBMessengerRoutes(this.zoapp);
    FBMessenger.initRoutes(this.zoapp, this.fbMessengerRoutes);
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

  static initRoutes(zoapp, fbMessengerRoutes) {
    const route = zoapp.createRoute("/webhook/fb");
    // facebook messenger callback url
    route.add(
      "GET",
      "/:botId",
      ["*", "open"],
      (context) => {
        const verifyToken = "token943";
        logger.warn("get webhook");
        const query = context.getQuery();
        if (query && query["hub.verify_token"] === verifyToken) {
          const c = query["hub.challenge"];
          return parseInt(c, 10);
          // return JSON.stringify(c);
        }
        return "error on token";
      },
      () => true,
    );

    route.add("POST", "/:botId", ["*", "open"], (context) => {
      logger.warn(context);
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
      if (!middleware.url) {
        // WIP create url
        const params = this.zoapp.controllers.getParameters();
        const botParams = {
          botId: middleware.origin,
          application: {
            id: middleware.application.id,
            secret: middleware.application.secret,
            policies: middleware.application.policies,
          },
        };
        const name = await params.generateName(4, "botParams");
        await params.setValue(name, botParams, "botParams");
        this.middleware.url = `/channel/${name}`;
        this.middleware.token = name;
      }
    } else {
      logger.info("No origin for FBMessengerMiddleware ", middleware.id);
    }
    // set onDispatch function
    this.middleware.onDispatch = onDispatch.bind(this);
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
