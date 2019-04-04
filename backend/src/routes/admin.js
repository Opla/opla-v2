/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { CommonRoutes } from "zoapp-backend";
import ApiError from "zoauth-server/errors/ApiError";

export default class extends CommonRoutes {
  constructor(zoapp) {
    super(zoapp.controllers);
    this.extensions = zoapp.extensions;
    this.getTemplates = this.getTemplates.bind(this);
    this.getLanguages = this.getLanguages.bind(this);
    this.setSystemVariables = this.setSystemVariables.bind(this);
    this.getSystemVariables = this.getSystemVariables.bind(this);
  }

  async getTemplates() {
    return this.extensions.getAdmin().getTemplates();
  }

  async getLanguages() {
    const languages = await this.extensions.getAdmin().getLanguages();
    return languages;
  }

  async setSystemVariables(context) {
    const scope = context.getScope();
    if (scope !== "admin") {
      throw new ApiError(403, "Forbiden: can't set system variables");
    }
    const { variables } = context.getBody();
    return this.extensions.getAdmin().setSystemVariables(variables);
  }

  async getSystemVariables() {
    const variables = await this.extensions.getAdmin().getSystemVariables();
    return variables;
  }
}
