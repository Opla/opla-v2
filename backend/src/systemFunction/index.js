/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import SendMail from "./sendMail";
import GetDate from "./getDate";

export default class SystemFunctions {
  constructor(extensionsController) {
    logger.info("initSystemFunctions");
    this.functions = [
      new SendMail(extensionsController.zoapp.emailService),
      new GetDate(extensionsController.bots),
    ];
  }

  get(name) {
    const func = this.functions.find((f) => f.getName() === name);
    if (!func) {
      logger.error(`Can't call unrecognized system function ${name}`);
    }
    return func;
  }
}
