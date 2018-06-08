/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
export default class PublishConnectorMiddleware {
  constructor(controllers) {
    this.controllers = controllers;
    this.classes = ["bot"];
    this.name = "publish-channel";
    this.onDispatch = this.onDispatch.bind(this);
    // logger.info("Publish-channels");
    this.initChannels();
  }

  async initChannels() {
    const controller = this.getMiddlewaresController();
    const middlewares = await controller.list(null, "MessengerConnector");

    if (Array.isArray(middlewares) && middlewares.length > 0) {
      middlewares.forEach((channel) => {
        // logger.info("init register channel=", index, channel);
        controller.register(channel);
      });
    }
  }

  async onDispatch(className, data) {
    switch (data.action) {
      case "publishBot":
        await this.publishBot(data);
        break;
      default:
        break;
    }
  }

  async publishBot(data) {
    const controller = this.getMiddlewaresController();
    const middlewares = await controller.list(data.botId, "MessengerConnector");
    // logger.info("publishBot register channels=", data.channels);
    if (Array.isArray(data.channels) && data.channels.length > 0) {
      data.chanels.array.forEach((channel) => {
        // logger.info("publishBot register channel=", index, channel);
        let c = middlewares.find((middleware) => middleware.id === channel.id);
        if (!c) {
          // logger.info("publishBot register prev channel=", channel);
          c = {};
        }
      });
    } else {
      // logger.info("No channels to publish to");
    }
    // throw new Error("No channels to publish to");
    /*
    const appConnector = middlewares.find(
      (middleware) => middleware.type === "MessengerConnector",
    );

    if (!appConnector) {
      throw new Error(
        "app-connector must be registered before trying to publish a bot",
      );
    }
    logger.info("publishBot register appConnector=", appConnector);
    logger.info("publishBot register data.channels=", data.channels);
    appConnector.status = "start";
    await controller.register(appConnector); */
  }

  getMiddlewaresController() {
    return this.controllers.zoapp.controllers.getMiddlewares();
  }

  getProperties() {
    return {
      name: this.name,
      classes: this.classes,
      status: "start",
      onDispatch: this.onDispatch,
    };
  }
}
