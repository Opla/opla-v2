/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import createOpenNLX from "opennlx";

class OpenNLXConnector {
  constructor() {
    this.openNLX = createOpenNLX;
    this.listener = null;
    this.name = "openNLX";
    this.type = "AIConnector";
    this.classes = ["messenger", "bot", "sandbox"];
    this.icon = "images/opla-logo.png";
    this.system = true;
  }

  getName() {
    return this.name;
  }

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

const createOpenNLXConnector = (pluginManager) => {
  if (!instance) {
    instance = new OpenNLXConnector(pluginManager);
  }
  return instance;
};

export default createOpenNLXConnector;
