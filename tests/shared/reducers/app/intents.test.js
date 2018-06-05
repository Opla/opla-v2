/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as apiActions from "shared/actions/api";
import * as appActions from "shared/actions/app";
import reducer, { initialState } from "shared/reducers/app";

describe("reducers/app", () => {
  const defaultIntents = [
    {
      id: "intent-1",
      botId: "bot-123",
      name: "intent 1",
    },
    {
      id: "intent-2",
      botId: "bot-223",
      name: "intent 2",
    },
    {
      id: "intent-3",
      botId: "bot-323",
      name: "intent 3",
    },
  ];

  describe("intents api actions", () => {
    it("enables loading on move intent request", () => {
      const state = reducer(
        undefined,
        apiActions.apiMoveIntentRequest({
          botId: "bot-1",
          intentId: "intent-1",
          from: 0,
          to: 1,
        }),
      );
      expect(state).toEqual({
        ...initialState,
        loading: true,
      });
    });

    it("swaps intents on apiMoveIntentSuccess()", () => {
      let state = reducer(
        undefined,
        apiActions.apiGetIntentsSuccess(defaultIntents),
      );

      let ids = state.intents.map((intent) => intent.id);
      expect(ids).toEqual(["intent-1", "intent-2", "intent-3"]);

      // move the first intent to the second position
      state = reducer(state, apiActions.apiMoveIntentSuccess(0, 1));

      ids = state.intents.map((intent) => intent.id);
      expect(ids).toEqual(["intent-2", "intent-1", "intent-3"]);

      // also check the other state attributes updated
      expect(state.loading).toEqual(false);
      expect(state.error).toEqual(null);
      expect(state.selectedIntent).toEqual(state.intents[1]);
      expect(state.selectedIntentIndex).toEqual(1);

      // move the second intent to the last position
      state = reducer(state, apiActions.apiMoveIntentSuccess(1, 2));

      ids = state.intents.map((intent) => intent.id);
      expect(ids).toEqual(["intent-2", "intent-3", "intent-1"]);

      // move the third intent to the first position
      state = reducer(state, apiActions.apiMoveIntentSuccess(2, 0));

      ids = state.intents.map((intent) => intent.id);
      expect(ids).toEqual(["intent-1", "intent-2", "intent-3"]);
    });

    it("stores the error on move intent failure", () => {
      const e = new Error();

      const state = reducer(undefined, apiActions.apiMoveIntentFailure(e));
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: e,
      });
    });
  });

  describe("intents app actions", () => {
    it("set selectedIntentIndex", () => {
      const state = reducer(
        undefined,
        appActions.appSelectIntent("bot-1", "intent-1"),
      );
      expect(state.selectedBotId).toEqual("bot-1");
      expect(state.selectedIntentIndex).toEqual("intent-1");
    });

    it("update an intent", () => {
      let state = reducer(
        undefined,
        apiActions.apiGetIntentsSuccess(defaultIntents),
      );
      let names = state.intents.map((intent) => intent.name);
      expect(names).toEqual(["intent 1", "intent 2", "intent 3"]);

      const updatedIntent = {
        id: "intent-2",
        botId: "bot-223",
        name: "intent updated",
      };
      state = reducer(
        state,
        appActions.appUpdateIntent("bot-223", updatedIntent),
      );
      expect(state.intents[1].notSaved).toEqual(true);
      names = state.intents.map((intent) => intent.name);
      expect(names).toEqual(["intent 1", "intent updated", "intent 3"]);
    });
  });
});
