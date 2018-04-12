/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Controller } from "zoapp-backend";

export default class extends Controller {
  constructor(name, main, className = null, GatewayClient) {
    super(name, main, className);
    this.GatewayClient = GatewayClient;
    this.getTemplates = this.getTemplates.bind(this);
  }

  async getTemplates() {
    return this.GatewayClient.getTemplates();
  }
}
