/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import abstractPlugin from "zoapp-backend/plugins/abstractPlugin";

class JSONWebservice extends abstractPlugin {
  constructor(zoapp) {
    super({
      name: "json-webservice",
      type: "WebService",
      classes: ["messenger", "bot", "sandbox"],
      title: "JSON WebService",
      icon: "images/webhook.svg",
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
    if (this.listener) {
      this.listener.fireEvent(eventName, this);
    }
  }

  async onMiddlewareRegister(middleware) {
    this.middleware = middleware;
    if (middleware.origin) {
      // add code here
      // example:
      // if (!middleware.url) {
      //   // this.middleware.url = `${config.global.botSite.url}${name}`;
      //   // this.middleware.token = name;
      // }
    } else {
      logger.info("No origin for jsonwebservice ", middleware.id);
    }

    // set middleware.onDispatch if needed

    return middleware;
  }

  // async onMiddlewareUnregister(middleware) {
  //   // add code here
  // }

  getMiddlewareDefaultProperties() {
    const mdp = super.getMiddlewareDefaultProperties();
    return {
      ...mdp,
      status: "disabled",
    };
  }
}

let instance = null;

const createJSONWebservicePlugin = (pluginManager) => {
  if (!instance) {
    instance = new JSONWebservice(pluginManager);
  }
  return instance;
};

export default createJSONWebservicePlugin;
