/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import MetricsRoutes from "opla-backend/routes/metrics";

describe("routes/metrics", () => {
  describe("getForBot()", () => {
    it("calls the controller", () => {
      const getForBotSpy = jest.fn();
      // we fake a zoapp instance, which should have an `extensions` controller.
      const fakeZoapp = {
        // we also fake the extensions controller, we are only interested in
        // the `getMetrics()` method, which should return an instance of
        // metrics controller.
        extensions: {
          getMetrics: () => ({
            getForBot: getForBotSpy,
          }),
        },
      };

      const routes = new MetricsRoutes(fakeZoapp);
      expect(getForBotSpy).not.toHaveBeenCalled();

      const getContextSpy = jest.fn().mockReturnValue({ botId: "bot1" });
      routes.getForBot({ getParams: getContextSpy });
      expect(getForBotSpy).toHaveBeenCalledWith("bot1");
    });
  });
});
