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

    this.getAll = this.getAll.bind(this);
  }

  getAll() {
    return this.controller.getMetrics().getAll();
  }
}

export default MetricsRoutes;
