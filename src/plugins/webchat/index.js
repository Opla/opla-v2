/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

class WebChat {
  constructor(pluginManager) {
    this.workers = {};
    this.listener = null;
    this.manager = pluginManager;
    this.name = "webchat-connector";
    this.type = "MessengerConnector";
    this.classes = ["messenger"];
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

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

  async register(middleware) {
    logger.info("WIP register WebChat ", middleware);
    const { zoapp } = this.manager;
    const { config } = this.manager;
    this.middleware = middleware;
    if (middleware.origin) {
      if (!middleware.application || !middleware.application.id) {
        const name = `${middleware.name}_${middleware.origin}`;
        // get a previously created app with same name
        let app = await zoapp.authServer.getApplicationByName(name);
        if (!app) {
          // TODO generate anonymous_secret
          // WIP create application
          const bot = await zoapp.extensions
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
          const payload = await zoapp.authServer.registerApplication(params);
          if (payload && payload.result) {
            app = await zoapp.authServer.getApplicationByName(name);
          }
        }
        if (app) {
          this.middleware.application = app;
        }
      }
      if (!middleware.url) {
        // WIP create url
        const params = zoapp.controllers.getParameters();
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

  async unregister(middleware) {
    // TODO
    this.middleware = null;
    return middleware;
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
