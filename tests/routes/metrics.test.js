/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import MetricsRoutes from "opla-backend/routes/metrics";

describe("routes/metrics", () => {
  describe("getAll()", () => {
    it("calls the controller", () => {
      const getAllSpy = jest.fn();
      // we fake a zoapp instance, which should have an `extensions` controller.
      const fakeZoapp = {
        // we also fake the extensions controller, we are only interested in
        // the `getMetrics()` method, which should return an instance of
        // metrics controller.
        extensions: {
          getMetrics: () => ({
            getAll: getAllSpy,
          }),
        },
      };

      const routes = new MetricsRoutes(fakeZoapp);
      expect(getAllSpy).not.toHaveBeenCalled();

      routes.getAll();
      expect(getAllSpy).toHaveBeenCalled();
    });
  });
});
