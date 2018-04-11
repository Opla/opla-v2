/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Controller } from "zoapp-backend";
import { getGatewayClient } from "../utils/gatewayClient";

export default class extends Controller {
  constructor(name, main, className = null) {
    super(name, main, className);
    this.getGatewayClient = getGatewayClient;
    this.getTemplates = this.getTemplates.bind(this);
  }

  async getTemplates() {
    return this.getGatewayClient().getTemplates();
  }
}
