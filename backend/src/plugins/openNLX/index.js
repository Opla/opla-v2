/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import createOpenNLX from "opennlx";
import abstractPlugin from "zoapp-backend/plugins/abstractPlugin";

class OpenNLXConnector extends abstractPlugin {
  constructor() {
    super({
      name: "openNLX",
      type: "AIConnector",
      classes: ["messenger", "bot", "sandbox"],
      icon: "images/opla-logo.png",
      system: true,
    });
    this.openNLX = createOpenNLX;
    this.listener = null;
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
    logger.info("OpenNLX setEventListener", listener);
    this.listener = listener;
  }

  fireEvent(eventName) {
    logger.info("OpenNLX fireEvent", eventName);
    if (this.listener) {
      this.listener.fireEvent(eventName, this);
    }
  }

  async onMiddlewareRegister(middleware) {
    logger.info("OpenNLX register", middleware.id);
    this.middleware = middleware;
    return middleware;
  }

  async onMiddlewareUnregister(middleware) {
    logger.info("OpenNLX unregister", middleware.id);
    this.middleware = null;
    return middleware;
  }
}

let instance = null;

const createOpenNLXConnector = (zoapp) => {
  if (!instance) {
    instance = new OpenNLXConnector(zoapp);
  }
  return instance;
};

export default createOpenNLXConnector;
