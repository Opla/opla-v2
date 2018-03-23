/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import UsersModel from "zoapp-backend/models/users";
import MetricsController from "../../src/controllers/metrics";
import MessengerModel from "../../src/models/messenger";

jest.mock("../../src/models/messenger");
jest.mock("zoapp-backend/models/users");
const fakeZoapp = {
  controllers: {
    getMiddlewares: () => ({
      dispatchEvent: () => {},
    }),
  },
};

describe("controllers/metrics", () => {
  beforeEach(() => {
    UsersModel.mockClear();
    MessengerModel.mockClear();
  });

  describe("getAll()", () => {
    it("returns the metrics", async () => {
      const controller = new MetricsController(
        "Metrics",
        { zoapp: fakeZoapp },
        "metrics",
      );

      const response = await controller.getAll();

      expect(response).toHaveProperty("users.count");
      expect(response).toHaveProperty("conversations.count");
      expect(response).toHaveProperty(
        "conversations.messages_per_conversation",
      );
      expect(response).toHaveProperty("sessions.duration");
      expect(response).toHaveProperty("errors.rate");
      expect(response).toHaveProperty("responses.speed");
    });
  });
});
