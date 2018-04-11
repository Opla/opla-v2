/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { CommonRoutes } from "zoapp-backend";

export default class extends CommonRoutes {
  constructor(zoapp) {
    super(zoapp.controllers);
    this.extensions = zoapp.extensions;
    this.getTemplates = this.getTemplates.bind(this);
  }

  async getTemplates() {
    return this.extensions.getAdmin().getTemplates();
  }
}
