/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AbstractPlugin from "zoapp-backend/plugins/abstractPlugin";
import EventsRoutes from "./EventsRoutes";

class Events extends AbstractPlugin {
  constructor(zoapp) {
    // AbstractPlugin constructor(name, title, type, classes, icon)
    super({
      name: "events",
      title: "Events",
      type: "MessengerConnector",
      icon: "images/messenger.svg",
    });
    this.zoapp = zoapp;
    this.tunnel = null;
    this.listener = null;
    this.route = null;
    this.eventsRoutes = new EventsRoutes(zoapp);
  }

  // legacy
  getName() {
    return this.name;
  }

  // legacy
  getType() {
    return this.type;
  }

  setEventListener(listener) {
    this.listener = listener;
  }

  fireEvent(eventName) {
    logger.info("Events fireEvent", eventName);
    if (this.listener) {
      this.listener.fireEvent(eventName, this);
    }
  }

  async initRoutes() {
    const route = this.zoapp.createRoute("/webhook/events");
    // facebook messenger callback url
    route.add(
      "GET",
      "/:botId",
      ["*", "open"],
      this.eventsRoutes.initConversationAndMessage,
    );
  }

  async onMiddlewareRegister(middleware) {
    this.middleware = middleware;
    if (middleware.origin) {
      // set middleware application
      if (!middleware.application || !middleware.application.id) {
        const name = `${middleware.name}_${middleware.origin}`;
        // get a previously created app with same name
        let app = await this.zoapp.authServer.getApplicationByName(name);
        if (!app) {
          const bot = await this.zoapp.extensions
            .getBots()
            .getBot(middleware.origin);
          const { email } = bot;
          const params = {
            name,
            grant_type: "password",
            email,
            redirect_uri: "localhost",
            policies: { authorizeAnonymous: true, anonymous_secret: "koko2" },
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
        this.middleware.url = `${
          this.zoapp.configuration.global.api_url
        }webhook/events/${middleware.origin}`;
        this.middleware.token = name;
      }
    } else {
      logger.info("No origin for Events ", middleware.id);
    }
    this.initRoutes();
    return this.middleware;
  }

  async onMiddlewareUnregister(middleware) {
    this.middleware = null;
    this.route = null;
    return middleware;
  }

  getMiddlewareDefaultProperties() {
    const mdp = super.getMiddlewareDefaultProperties();
    return {
      ...mdp,
      status: "disabled",
    };
  }
}

let instance = null;

const EventsPlugin = (zoapp) => {
  if (!instance) {
    instance = new Events(zoapp);
  }
  return instance;
};

export default EventsPlugin;
