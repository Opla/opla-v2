/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fetch from "zoapp-backend/utils/fetch";
import merge from "deepmerge";

let client;

export class GatewayClient {
  constructor(url) {
    this.url = url;
    this.getTemplates = this.getTemplates.bind(this);
  }

  async getTemplates() {
    return fetch(`${this.url}/templates`);
  }

  async getLanguages() {
    return fetch(`${this.url}/languages`);
  }
}

export function getGatewayClient() {
  if (!client) {
    throw new Error("client must be initialized before using it");
  }
  return client;
}

export function initGatewayClient(config = {}) {
  const defaultConfig = {
    global: {
      gateway: {
        url: "",
      },
    },
  };

  const cfg = merge(defaultConfig, config);

  client = new GatewayClient(cfg.global.gateway.url);
}
