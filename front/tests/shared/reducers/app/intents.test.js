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
  const defaultInputActions = [
    "input action 1",
    "input action 2",
    "input action 3",
  ];
  const defaultOutputActions = [
    "output action 1",
    "output action 2",
    "output action 3",
  ];
  const defaultIntents = [
    {
      id: "intent-1",
      botId: "bot-123",
      name: "intent 1",
      input: [...defaultInputActions],
      output: [...defaultOutputActions],
    },
    {
      id: "intent-2",
      botId: "bot-223",
      name: "intent 2",
      input: [...defaultInputActions],
      output: [...defaultOutputActions],
    },
    {
      id: "intent-3",
      botId: "bot-323",
      name: "intent 3",
      input: [...defaultInputActions],
      output: [...defaultOutputActions],
    },
  ];

  it("returns the initial state", () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

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

    it("Set Intent Action", () => {
      // TODO remove selectedIntentIndex need
      const previousState = {
        selectedIntentIndex: 1,
      };
      let state = reducer(
        previousState,
        apiActions.apiGetIntentsSuccess([...defaultIntents]),
      );
      expect(state.intents[1].input).toEqual(defaultInputActions);
      // add an intent action
      state = reducer(
        state,
        appActions.appSetIntentAction("input", undefined, "input action 4", 3),
      );
      expect(state.intents[1].input[3]).toEqual("input action 4");
      // update an intent action
      state = reducer(
        state,
        appActions.appSetIntentAction("input", undefined, "updated action", 1),
      );
      expect(state.intents[1].input[1]).toEqual("updated action");

      // TODO
      // // should not mutate the initial state
      // expect(state.intents[1].input).toEqual([
      //   "input action 1",
      //   "updated action",
      //   "input action 3",
      //   "input action 4",
      // ]);
      // expect(defaultIntents[1].input).toEqual([
      //   "input action 1",
      //   "input action 2",
      //   "input action 3",
      // ]);
    });

    it("delete intent Action", () => {
      // TODO remove selectedIntentIndex need
      const previousState = {
        selectedIntentIndex: 2,
      };
      let state = reducer(
        previousState,
        apiActions.apiGetIntentsSuccess([...defaultIntents]),
      );
      expect(state.intents[2].output).toEqual(defaultOutputActions);
      expect(state.intents[2].output).toHaveLength(3);
      // delete an intent action
      state = reducer(state, appActions.appDeleteIntentAction("output", 2));
      expect(state.intents[2].output).toHaveLength(2);
      expect(state.intents[2].output).toEqual([
        "output action 1",
        "output action 2",
      ]);
    });
  });
});
