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
        getConversations: jest.fn().mockResolvedValue([
          {
            id: "1",
            participants: ["user1", "user2", "bot_bot1_123"],
            created_time: new Date(Date.now() - 100),
            last: new Date(Date.now()),
          },
          {
            id: "2",
            participants: ["user1", "user3", "bot_bot1_123"],
            created_time: new Date(Date.now() - 200),
            last: new Date(Date.now()),
          },
        ]),
        getConversationMessages: jest
          .fn()
          .mockResolvedValueOnce([
            { error: true, response_speed: 30 },
            { error: false, response_speed: null },
            { error: true, response_speed: 100 },
            { error: false, response_speed: null },
          ])
          .mockResolvedValueOnce([
            { error: true, response_speed: 20 },
            { error: false, response_speed: 80 },
            { error: false, response_speed: null },
          ]),
      }));
      BotsModel.mockImplementation(() => ({
        getBot: jest.fn().mockResolvedValue({ id: "123", name: "bot1" }),
      }));

      const controller = new MetricsController(
        "Metrics",
        { zoapp: fakeZoapp },
        "metrics",
      );

      const response = await controller.getForBot("bot1");

      expect(response.users.count).toEqual(3);
      expect(response.conversations.count).toEqual(2);
      expect(response.conversations.messages_per_conversation).toEqual(3.5);
      expect(response.sessions.duration).toEqual(150);
      expect(response.errors.rate).toEqual(3 / 7);
      expect(response.responses.speed).toEqual(57.5);
    });
  });

  describe("getSessionsMetrics", () => {
    it("should compute average session duration even without messages", async () => {
      const conversationsMessages = [
        {
          id: "1",
          participants: ["user1", "user2", "bot_bot1_123"],
          created_time: new Date(Date.now() - 100),
          last: 0,
        },
        {
          id: "2",
          participants: ["user1", "user3", "bot_bot1_123"],
          created_time: new Date(Date.now() - 200),
          last: new Date(Date.now()),
        },
      ];

      const controller = new MetricsController(
        "Metrics",
        { zoapp: fakeZoapp },
        "metrics",
      );

      const sessionsMetrics = await controller.getSessionsMetrics(
        conversationsMessages,
      );
      expect(sessionsMetrics.duration).toEqual(100);
    });
  });
});
