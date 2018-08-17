/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import createExtensionsController from "opla-backend/controllers";
import MetricsController from "opla-backend/controllers/metrics";

describe("controllers/index", () => {
  it("returns an instance of MetricsController", () => {
    const fakeZoapp = {};
    const fakeConfig = {};

    const controller = createExtensionsController(fakeZoapp, fakeConfig);

    expect(controller.getMetrics()).toBeInstanceOf(MetricsController);
  });
});
