/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import MetricsController from "../../src/controllers/metrics";
import MessengerModel from "../../src/models/messenger";
import BotsModel from "../../src/models/bots";

jest.mock("../../src/models/messenger");
jest.mock("../../src/models/bots");
const fakeZoapp = {
  controllers: {
    getMiddlewares: () => ({
      dispatchEvent: () => {},
    }),
  },
};

describe("controllers/metrics", () => {
  beforeEach(() => {
    MessengerModel.mockClear();
    BotsModel.mockClear();
  });

  describe("getForBot()", () => {
    it("returns the metrics", async () => {
      MessengerModel.mockImplementation(() => ({
        getConversations: () => Promise.resolve([]),
        getConversationMessages: () => Promise.resolve([]),
      }));
      BotsModel.mockImplementation(() => ({
        getBot: () => Promise.resolve({ id: "bot1", name: "bot1" }),
      }));

      const controller = new MetricsController(
        "Metrics",
        { zoapp: fakeZoapp },
        "metrics",
      );

      const response = await controller.getForBot("bot1");

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
