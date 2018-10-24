/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import AbstractPlugin from "zoapp-backend/plugins/abstractPlugin";

class FBMessenger extends AbstractPlugin {
  constructor() {
    // AbstractPlugin constructor(name, title, type, classes, icon)
    super({
      name: "fb-messenger",
      title: "Facebook Messenger",
      type: "MessengerConnector",
      icon: "images/messenger.svg",
    });
    this.tunnel = null;
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
    this.listener = listener;
  }

  fireEvent(eventName) {
    logger.info("FBMessenger fireEvent", eventName);
    if (this.listener) {
      this.listener.fireEvent(eventName, this);
    }
  }

  async onMiddlewareRegister(middleware) {
    // TODO
    this.middleware = middleware;
    return middleware;
  }

  async onMiddlewareUnregister(middleware) {
    // TODO
    this.middleware = null;
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

const FBMessengerPlugin = () => {
  if (!instance) {
    instance = new FBMessenger();
  }
  return instance;
};

export default FBMessengerPlugin;
