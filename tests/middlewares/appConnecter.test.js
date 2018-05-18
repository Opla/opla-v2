/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import AppConnectorMiddleware from "opla-backend/middlewares/appConnector";
import MiddlewaresController from "zoapp-backend/controllers/middlewares";

jest.mock("zoapp-backend/controllers/middlewares");

describe("AppConnectorMiddleware", () => {
  beforeEach(() => {
    MiddlewaresController.mockClear();
  });

  describe("getProperties", () => {
    it("return a property object", () => {
      const controllers = {};

      const middleware = new AppConnectorMiddleware(controllers);
      const properties = middleware.getProperties();

      expect(properties).toMatchObject({
        name: expect.stringContaining("app-connector"),
        status: expect.stringContaining("start"),
        classes: expect.arrayContaining(["bot"]),
        onDispatch: expect.anything(),
      });
    });
  });

  describe("onDispatch", () => {
    describe("publishBot", () => {
      it("start app-connector middleware", async () => {
        const listMock = jest.fn();
        const registeredMiddleware = {
          name: "app-connector",
        };
        listMock.mockReturnValue([registeredMiddleware]);
        const registerMock = jest.fn();
        MiddlewaresController.mockImplementation(() => ({
          list: (botId, type) => listMock(botId, type),
          register: (middleware) => registerMock(middleware),
        }));

        const data = {
          botId: "foo",
          action: "publishBot",
        };

        const controllers = {
          zoapp: {
            controllers: {
              getMiddlewares: () => new MiddlewaresController(),
            },
          },
        };

        const middleware = new AppConnectorMiddleware(controllers);
        await middleware.onDispatch("foo", data);

        expect(listMock).toHaveBeenCalledWith("foo", "MessengerConnector");
        expect(registerMock).toHaveBeenCalledWith({
          ...registeredMiddleware,
          status: "start",
        });
      });

      it("throws an error if no middleware found", async () => {
        const listMock = jest.fn();

        listMock.mockReturnValue([]);
        const registerMock = jest.fn();
        MiddlewaresController.mockImplementation(() => ({
          list: (botId, type) => listMock(botId, type),
          register: (middleware) => registerMock(middleware),
        }));

        const data = {
          botId: "foo",
          action: "publishBot",
        };

        const controllers = {
          zoapp: {
            controllers: {
              getMiddlewares: () => new MiddlewaresController(),
            },
          },
        };

        const middleware = new AppConnectorMiddleware(controllers);
        try {
          await middleware.onDispatch("foo", data);
        } catch (error) {
          expect(error.message).toEqual(
            "app-connector must be registered before trying to publish a bot",
          );
        }

        expect(registerMock).not.toHaveBeenCalled();
      });
    });
  });
});
