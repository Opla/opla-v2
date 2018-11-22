/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import abstractPlugin from "zoapp-backend/plugins/abstractPlugin";

import { onDispatch } from "./skeletonMessengerMiddleware";

class SkeletonMessenger extends abstractPlugin {
  constructor(zoapp) {
    super({
      name: "skeleton-messenger",
      type: "MessengerConnector",
      classes: ["sandbox", "messenger"],
      title: "SkeletonMessenger",
      icon: "message",
      // middlewares properties
      status: "disabled",
      url: "testurlinpulginproperties",
      foo: "bar",
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
    logger.info("SkeletonMessenger fireEvent", eventName);
    if (this.listener) {
      this.listener.fireEvent(eventName, this);
    }
  }

  // eslint-disable-next-line
  async onMiddlewareRegister(middleware) {
    const updatedMiddleware = middleware;
    logger.debug("[+] SkeletonMesssenger onMiddlewareRegister");
    // this plugin is linked to a bot, origin/botId must be set
    if (middleware.origin) {
      // example of settings to define
      if (!middleware.url) {
        updatedMiddleware.url = "newUrl";
      }
      updatedMiddleware.onDispatch = onDispatch.bind(this);
    } else {
      logger.info("No origin for WebChat ", middleware.id);
    }

    return updatedMiddleware;
  }

  // eslint-disable-next-line
  async onMiddlewareUnregister(middleware) {
    logger.debug("[+] SkeletonMesssenger onMiddlewareUnRegister");
    return middleware;
  }

  // can also be set directly with abstractionPlugin Constructor
  // getMiddlewareDefaultProperties() {
  //   return {
  //     ...middlewareDefaultProperties,
  //     status: "disabled",
  //   };
  // }
}

let instance = null;

const createSkeletonMessengerPlugin = (zoapp) => {
  if (!instance) {
    instance = new SkeletonMessenger(zoapp);
  }
  return instance;
};

export default createSkeletonMessengerPlugin;
