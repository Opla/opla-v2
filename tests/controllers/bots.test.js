/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import BotsController from "opla-backend/controllers/bots";
import BotsModel from "opla-backend/models/bots";

// mock the BotsModel class as we only want to test the controller code here
jest.mock("../../src/models/bots");

const fakeZoapp = {
  controllers: {
    getMiddlewares: () => ({
      dispatchEvent: () => {
        // noop
      },
    }),
  },
};

describe("controllers/bots", () => {
  beforeEach(() => {
    BotsModel.mockClear();
  });

  describe("moveIntent", () => {
    it("returns a response", async () => {
      // configure the model to tell the controller that the move has been
      // performed sucessfully
      BotsModel.mockImplementation(() => ({
        moveIntent: () => Promise.resolve(true),
      }));

      const botId = "bot-123";
      const intentId = "intent-123";

      const controller = new BotsController(
        "Bots",
        { zoapp: fakeZoapp },
        "bots",
      );

      const response = await controller.moveIntent(botId, intentId, 1, 2);

      expect(response).toEqual({
        botId,
        from: 1,
        id: intentId,
        to: 2,
      });
    });

    it("returns an error when operation has failed", async () => {
      // configure the model to tell the controller that the move has failed
      BotsModel.mockImplementation(() => ({
        moveIntent: () => Promise.resolve(false),
      }));

      const botId = "bot-123";
      const intentId = "intent-123";

      const controller = new BotsController(
        "Bots",
        { zoapp: fakeZoapp },
        "bots",
      );

      const response = await controller.moveIntent(botId, intentId, 1, 2);

      expect(response).toEqual({
        error: "can't move this intent to 2",
      });
    });
  });
});
