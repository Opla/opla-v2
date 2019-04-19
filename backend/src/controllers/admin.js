/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Controller } from "zoapp-backend";

export default class extends Controller {
  constructor(name, main, className = null, gatewayClient) {
    super(name, main, className);
    this.gatewayClient = gatewayClient;
    this.getTemplates = this.getTemplates.bind(this);
  }

  async getTemplates() {
    return this.gatewayClient.getTemplates();
  }

  async getLanguages() {
    return this.gatewayClient.getLanguages();
  }

  async setSystemVariables(variables) {
    await this.main.getParameters().setValue("system", variables, "variables");

    await this.dispatchSystemVariables(variables);
    return this.getSystemVariables();
  }

  async getSystemVariables() {
    const variables = await this.main
      .getParameters()
      .getValue("system", "variables");

    return Object.values(variables || {});
  }

  async dispatchSystemVariables(variables) {
    await this.dispatch("system", {
      action: "setVariables",
      variables,
    });
  }

  async getSystemEntities() {
    return this.dispatch("system", {
      action: "getEntities",
    });
  }

  async callAction(data, token) {
    const controller = this.zoapp.controllers.getMiddlewares();
    const { middlewares } = controller;
    let result = null;
    const keys = Object.keys(middlewares);
    const { action, className, ...parameters } = data;
    let plugin = null;
    let middleware = null;
    keys.some((id) => {
      const m = middlewares[id];
      if (m.appToken === token) {
        plugin = m;
      } else if (m.name === "events" && m.call) {
        middleware = m;
      }
      return !!(middleware && plugin);
    });
    if (middleware && plugin && plugin.status === "start") {
      result = await middleware.call(
        className,
        action,
        plugin.origin,
        parameters,
      );
    }
    return result || { result: "not found" };
  }
}
