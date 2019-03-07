/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import abstractPlugin from "zoapp-backend/plugins/abstractPlugin";

class WebChat extends abstractPlugin {
  constructor(zoapp) {
    super({
      name: "webchat-connector",
      type: "MessengerConnector",
      classes: ["messenger"],
      title: "Webchat",
      icon: "message",
    });
    this.workers = {};
    this.listener = null;
    this.zoapp = zoapp;
  }

  // legacy
  getName() {
    return this.name;
  }

  // legacy
  getType() {
    return this.type;
  }

  // legacy
  getClasses() {
    return this.classes;
  }

  setEventListener(listener) {
    this.listener = listener;
  }

  fireEvent(eventName) {
    logger.info("WebChat fireEvent", eventName);
    if (this.listener) {
      this.listener.fireEvent(eventName, this);
    }
  }

  async onMiddlewareRegister(middleware) {
    // logger.info("WIP register WebChat ", middleware.name, middleware.token);
    const config = this.zoapp.configuration;
    this.middleware = middleware;
    if (middleware.origin) {
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
        this.middleware.url = `${config.global.botSite.url}${name}`;
        this.middleware.token = name;
      }
    } else {
      logger.info("No origin for WebChat ", middleware.id);
    }

    return middleware;
  }

  async onMiddlewareUnregister(middleware) {
    // WIP
    logger.info("WIP unregister WebChat ", middleware.token);
    this.middleware = null;
    const params = this.zoapp.controllers.getParameters();
    await params.deleteValue(middleware.token, "botParams");
    // TODO delete application
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

const createWebChatPlugin = (pluginManager) => {
  if (!instance) {
    instance = new WebChat(pluginManager);
  }
  return instance;
};

export default createWebChatPlugin;
