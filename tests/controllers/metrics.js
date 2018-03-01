import MetricsController from "opla-backend/controllers/metrics";

describe("controllers/metrics", () => {
  describe("getAll()", () => {
    it("returns the metrics", () => {
      const controller = new MetricsController();

      expect(controller.getAll()).toEqual({
        user: {},
        conversations: {},
        sessions: {},
        errors: {},
        responses: {},
      });
    });
  });
});
