/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import BotsModel from "opla-backend/models/bots";

describe("models/bots", () => {
  describe("putIntent", () => {
    const fakeConfig = {};

    it("sets the intent `order` to 1 when it is the first intent", async () => {
      const generatedId = "generated-id";

      // this is a mock for the "intents" collection/table
      const mockCollection = {
        // there is no intent in the collection
        getItems: () => Promise.resolve([]),
        setItem: jest.fn(),
      };
      // this is a mock for the database passed to the model
      const mockDatabase = {
        generateToken: () => generatedId,
        getTable: () => mockCollection,
      };

      const model = new BotsModel(mockDatabase, fakeConfig);

      const botId = "bot-id";
      const versionId = "version-id";
      const intent = {
        name: "intent",
      };

      const savedIntent = await model.putIntent(
        mockCollection,
        intent,
        botId,
        versionId,
      );

      expect(savedIntent).toEqual({
        ...intent,
        botId,
        id: generatedId,
        order: 1,
        versionId,
      });
    });

    it("sets the intent `order` to the next highest order value", async () => {
      const generatedId = "generated-id";

      // this is a mock for the "intents" collection/table
      const mockCollection = {
        // there are two intents in the collection, the second one has a high
        // order to simulate deletions of previous intents (and no reorder)
        getItems: () =>
          Promise.resolve([
            {
              name: "intent-1",
              order: 1,
            },
            {
              name: "intent-10",
              order: 10,
            },
          ]),
        setItem: jest.fn(),
      };
      // this is a mock for the database passed to the model
      const mockDatabase = {
        generateToken: () => generatedId,
        getTable: () => mockCollection,
      };

      const model = new BotsModel(mockDatabase, fakeConfig);

      const botId = "bot-id";
      const versionId = "version-id";
      const intent = {
        name: "intent",
      };

      const savedIntent = await model.putIntent(
        mockCollection,
        intent,
        botId,
        versionId,
      );

      expect(savedIntent).toEqual({
        ...intent,
        botId,
        id: generatedId,
        order: 11,
        versionId,
      });
    });
  });
});
