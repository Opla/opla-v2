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
    logger.info("Publish-channels");
    this.initChannels();
  }

  /**
   * Get all "messengerConnector" middlewares and register them on middlewaresController
   */
  async initChannels() {
    const middlewaresController = this.getMiddlewaresController();
    const middlewares = await middlewaresController.list({
      type: "MessengerConnector",
    });

    if (Array.isArray(middlewares) && middlewares.length > 0) {
      middlewares.forEach((middleware) => {
        // logger.info("init register channel=", index, channel);
        middlewaresController.register(middleware);
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
    const middlewares = await controller.list({
      origin: data.botId,
      type: "MessengerConnector",
    });
    // logger.info("publishBot register channels=", data.channels);
    if (Array.isArray(data.channels) && data.channels.length > 0) {
      const actions = [];
      data.channels.forEach((channel, index) => {
        logger.info(
          "publishBot register channel=",
          index,
          channel.id,
          channel.status,
        );
        const m = middlewares.find(
          (middleware) => middleware.id === channel.id,
        );
        logger.info("publishBot registered middleware=", m.status);
        if (m) {
          if (m.status !== channel.status) {
            if (channel.status !== "start") {
              actions.push(controller.unregister(channel.id));
            } else {
              actions.push(controller.register(channel));
            }
          }
        } else {
          actions.push(controller.register(channel));
        }
      });
      Promise.all(actions);
    } else {
      // logger.info("No channels to publish to");
    }
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
