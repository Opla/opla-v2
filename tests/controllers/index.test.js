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
