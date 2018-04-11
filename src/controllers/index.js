/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import BotsController from "./bots";
import MessengerController from "./messenger";
import SandboxMessengerController from "./sandboxMessenger";
import MetricsController from "./metrics";
import AdminController from "./admin";
import initMiddlewares from "../middlewares";
import { initGatewayClient } from "../utils/gatewayClient";

class ExtensionsController {
  constructor(zoapp, config) {
    this.zoapp = zoapp;
    this.authServer = zoapp.authServer;
    this.config = config;
    this.database = zoapp.database;
    this.bots = new BotsController("Bots", this, "bot");
    this.sandboxMessenger = new SandboxMessengerController(
      "SandboxMessenger",
      this,
      "sandbox",
    );
    this.messenger = new MessengerController("Messenger", this, "messenger");
    this.metrics = new MetricsController("Metrics", this);
    this.admin = new AdminController("Admin", this);
    logger.info("will init");
    if (zoapp.controllers) {
      initMiddlewares(zoapp.controllers.getMiddlewares(), this);
    }
    initGatewayClient(config);
  }

  async getAdminParameters(me, isMaster, params) {
    const bots = await this.getBots().getBots(me, isMaster);
    // TODO
    const conversations = { count: 1 };
    const messages = { count: 2 };
    const users = { count: 1 };

    return {
      conversations,
      messages,
      users,
      bots,
      params,
    };
  }

  async start() {
    await this.bots.open();
    await this.sandboxMessenger.open();
    await this.messenger.open();
    await this.admin.open();
  }

  async stop() {
    await this.bots.close();
    await this.sandboxMessenger.close();
    await this.messenger.close();
    await this.admin.close();
  }

  getBots() {
    return this.bots;
  }

  getSandboxMessenger() {
    return this.sandboxMessenger;
  }

  getMessenger() {
    return this.messenger;
  }

  getMetrics() {
    return this.metrics;
  }

  getAdmin() {
    return this.admin;
  }
}

export default (zoapp, config) => new ExtensionsController(zoapp, config);
