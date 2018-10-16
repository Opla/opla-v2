/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

class FBMessenger {
  constructor() {
    this.tunnel = null;
    this.listener = null;
    this.name = "fb-messenger";
    this.type = "MessengerConnector";
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
}

let instance = null;

const FBMessengerPlugin = () => {
  if (!instance) {
    instance = new FBMessenger();
  }
  return instance;
};

export default FBMessengerPlugin;
