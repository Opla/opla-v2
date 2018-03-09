/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

class AppMessenger {
  constructor(pluginManager) {
    this.workers = {};
    this.listener = null;
    this.manager = pluginManager;
    this.name = "app-connector";
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
    logger.info("AppMessenger fireEvent", eventName);
    if (this.listener) {
      this.listener.fireEvent(eventName, this);
    }
  }

  async register(middleware) {
    logger.info("WIP register AppMessenger ", middleware);
    const { zoapp } = this.manager;
    const { config } = this.manager;
    this.middleware = middleware;
    if (!middleware.application) {
      // WIP create application
      const bot = await zoapp.extensions.getBots().getBot(middleware.origin);
      const { email } = bot; // WIP get email
      const name = `${middleware.name}_${middleware.origin}`;
      // get a previously created app with same name
      let app = await zoapp.authServer.getApplicationByName(name);
      if (!app) {
        // TODO generate anonymous_secret
        const params = {
          name,
          grant_type: "password",
          email,
          redirect_uri: "localhost",
          policies: { authorizeAnonymous: true, anonymous_secret: "koko" },
        };
        app = await zoapp.authServer.registerApplication(params);
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

const AppMessengerPlugin = (pluginManager) => {
  if (!instance) {
    instance = new AppMessenger(pluginManager);
  }
  return instance;
};

export default AppMessengerPlugin;
