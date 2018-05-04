/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
export default class AppConnectorMiddleware {
  constructor(controllers) {
    this.controllers = controllers;
    this.classes = ["bot"];
    this.name = "app-connector";
    this.onDispatch = this.onDispatch.bind(this);
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

    const appConnector = middlewares.find(
      (middleware) => middleware.name === "app-connector",
    );

    if (appConnector === undefined) {
      throw new Error(
        "app-connector must be registered before trying to publish a bot",
      );
    }

    appConnector.status = "start";
    await controller.register(appConnector);
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
