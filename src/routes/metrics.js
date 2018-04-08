/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { CommonRoutes } from "zoapp-backend";

class MetricsRoutes extends CommonRoutes {
  constructor(zoapp) {
    super(zoapp.extensions);
    this.getForBot = this.getForBot.bind(this);
  }

  getForBot(context) {
    const { botId } = context.getParams();
    return this.controller.getMetrics().getForBot(botId);
  }
}

export default MetricsRoutes;
