/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import MetricsController from "opla-backend/controllers/metrics";

describe("controllers/metrics", () => {
  describe("getAll()", () => {
    it("returns the metrics", () => {
      const controller = new MetricsController("Metrics", {});

      const metrics = controller.getAll();

      expect(metrics).toHaveProperty("users.count");
      expect(metrics).toHaveProperty("conversations.count");
      expect(metrics).toHaveProperty("conversations.messages_per_conversation");
      expect(metrics).toHaveProperty("sessions.duration");
      expect(metrics).toHaveProperty("errors.rate");
      expect(metrics).toHaveProperty("responses.speed");
    });
  });
});
