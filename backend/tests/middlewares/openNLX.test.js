/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import OpenNLXMiddleware from "opla-backend/middlewares/openNLX";
import BotsController from "opla-backend/controllers/bots";
import BotsModel from "opla-backend/models/bots";

// mock the BotsModel class as we only want to test the controller code here
jest.mock("../../src/models/bots");

let botsController;
const fakeZoapp = {
  controllers: {
    getMiddlewares: () => ({
      dispatchEvent: () => {
        // noop
      },
    }),
  },
  extensions: {
    getBots: () => botsController,
    getAdmin: () => ({
      getSystemVariables: () => [],
    }),
  },
};

describe("middlewares/openNLX", () => {
  describe("init", () => {
    beforeAll(async () => {
      // configure the model to tell the controller that the move has been
      // performed sucessfully
      BotsModel.mockImplementation(() => ({
        getBots: () => Promise.resolve([]),
      }));
      botsController = new BotsController("Bots", { zoapp: fakeZoapp }, "bots");
    });

    afterAll(async () => {
      // TODO
    });

    it("should init", async () => {
      const middleware = new OpenNLXMiddleware(fakeZoapp.extensions);
      await middleware.init("1234");
    });
  });
});
