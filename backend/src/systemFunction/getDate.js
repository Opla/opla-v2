/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default class GetDate {
  constructor(controllers) {
    this.name = "getDate";
    this.description = "This function return the localized bot date";
    this.parameters = [];
    this.controllers = controllers;
  }

  async call(params, botId) {
    const bot = await this.controllers.getBot(botId);
    return new Date().toLocaleString(bot.language, {
      timeZone: bot.timezone,
    });
  }

  getName() {
    return this.name;
  }
}
