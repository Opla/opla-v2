import BotsController from "./bots";
import MessengerController from "./messenger";
import SandboxMessengerController from "./sandboxMessenger";
import MetricsController from "./metrics";

class ExtensionsController {
  constructor(zoapp, config) {
    this.zoapp = zoapp;
    this.authServer = zoapp.authServer;
    this.config = config || {};
    this.database = zoapp.database;
    this.bots = new BotsController("Bots", this, "bot");
    this.sandboxMessenger = new SandboxMessengerController("SandboxMessenger", this, "sandbox");
    this.messenger = new MessengerController("Messenger", this, "messenger");
    this.metrics = new MetricsController("Metrics", this);
  }

  async getAdminParameters(me, isMaster, params) {
    const bots = await this.getBots().getBots(me, isMaster);
    // TODO
    const conversations = { count: 1 };
    const messages = { count: 2 };
    const users = { count: 1 };

    return {
      conversations, messages, users, bots, params,
    };
  }

  async start() {
    await this.bots.open();
    await this.sandboxMessenger.open();
    await this.messenger.open();
  }

  async stop() {
    await this.bots.close();
    await this.sandboxMessenger.close();
    await this.messenger.close();
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
}

export default (zoapp, config) => new ExtensionsController(zoapp, config);
