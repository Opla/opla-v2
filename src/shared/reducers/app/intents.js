/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
  FETCH_FAILURE,
  FETCH_REQUEST,
  FETCH_SUCCESS,
} from "zoapp-front/actions/constants";

import {
  /* API Section */
  API_GETINTENTS,
  API_SENDINTENT,
  API_MOVEINTENT,
  API_DELETEINTENT,
  /* APP Section */
  APP_SELECTINTENT,
  APP_UPDATEINTENT,
  APP_SETINTENTACTION,
  APP_DELETEINTENTACTION,
} from "../../actions/constants";

export const initialState = {
  intents: null,
  selectedIntentIndex: 0,
};

export const handlers = {
  /* API Section */

  // GET INTENTS
  [API_GETINTENTS + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_GETINTENTS + FETCH_SUCCESS]: (state, { intents }) => {
    let { selectedIntent, selectedIntentIndex } = state;
    if (!selectedIntentIndex || selectedIntentIndex >= intents.length) {
      selectedIntentIndex = 0;
    }
    if (intents && (!selectedIntent || !selectedIntent.notSaved)) {
      selectedIntent = { ...intents[selectedIntentIndex] };
    } else if (!selectedIntent && !selectedIntent.notSaved) {
      selectedIntent = null;
    } else {
      // TODO handle conflicts
    }
    return {
      ...state,
      loading: false,
      error: null,
      intents: [...intents],
      selectedIntentIndex,
      selectedIntent,
    };
  },
  [API_GETINTENTS + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  // SEND INTENT
  [API_SENDINTENT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_SENDINTENT + FETCH_SUCCESS]: (state, { data }) => {
    // WIP search for intent in intents and add replace it
    let { intents, selectedIntent, selectedIntentIndex } = state;
    let remoteIntents = null;
    if (data.intents) {
      if (Array.isArray(data.intents)) {
        remoteIntents = data.intents;
      }
    } else {
      remoteIntents = [];
      remoteIntents.push(data);
    }
    if (remoteIntents) {
      remoteIntents.forEach((intent) => {
        let previousIntent = null;
        let previousIntentIndex = -1;
        for (let i = 0; i < intents.length; i += 1) {
          const int = intents[i];
          if (!int.id) {
            if (int.name === intent.name) {
              int.id = intent.id;
              previousIntent = { ...int };
              previousIntentIndex = i;
              break;
            }
          } else if (int.id === intent.id) {
            int.name = intent.name;
            if (intent.input) {
              int.input = [...intent.input];
            } else {
              int.input = null;
            }
            if (intent.output) {
              int.output = [...intent.output];
            } else {
              int.output = null;
            }
            previousIntent = { ...int };
            previousIntentIndex = i;
            break;
          }
        }

        if (previousIntent) {
          intents = [...state.intents];
          if (previousIntent.notSaved) {
            delete previousIntent.notSaved;
          }
          intents[previousIntentIndex] = previousIntent;

          if (selectedIntent && selectedIntent.id === intent.id) {
            // WIP Compare input & output arrays
            selectedIntent = { ...intent };
          }
        } else {
          intents.push({ ...intent });
          selectedIntentIndex = intents.length - 1;
          selectedIntent = { ...intent };
        }
      });
    }
    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntentIndex,
      selectedIntent,
    };
  },
  [API_SENDINTENT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  // MOVE INTENT
  [API_MOVEINTENT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_MOVEINTENT + FETCH_SUCCESS]: (state, { from, to }) => {
    const intents = [...state.intents];
    intents.splice(to, 0, intents.splice(from, 1)[0]);

    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntent: intents[to],
      selectedIntentIndex: to,
    };
  },
  [API_MOVEINTENT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  // DELETE INTENT
  [API_DELETEINTENT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_DELETEINTENT + FETCH_SUCCESS]: (state, { intent }) => {
    // WIP search for intentId in intents and remove it
    const intents = [...state.intents];
    let { selectedIntent, selectedIntentIndex } = state;
    for (let i = 0; i < intents.length; i += 1) {
      if (intents[i].id === intent.id) {
        intents.splice(i, 1);
        if (selectedIntentIndex === i) {
          selectedIntentIndex = i - 1;
          if (selectedIntentIndex < 0) {
            selectedIntentIndex = 0;
          }
          if (intents && selectedIntentIndex < intents.length) {
            selectedIntent = { ...intents[selectedIntentIndex] };
          } else {
            selectedIntent = null;
          }
        }
        break;
      }
    }
    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntentIndex,
      selectedIntent,
    };
  },
  [API_DELETEINTENT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  /* APP Section */

  // SELECT INTENT
  [APP_SELECTINTENT]: (state, { selectedBotId, selectedIntentIndex }) => {
    let selectedIntent = null;
    if (state.intents && selectedIntentIndex < state.intents.length) {
      selectedIntent = { ...state.intents[selectedIntentIndex] };
    }
    return {
      ...state,
      selectedBotId,
      selectedIntentIndex,
      selectedIntent,
    };
  },

  // UPDATE INTENT
  [APP_UPDATEINTENT]: (state, { selectedBotId, intent }) => {
    const selectedIntentIndex =
      state.selectedIntentIndex !== undefined ? state.selectedIntentIndex : 0;
    const intents = [...state.intents];
    let selectedIntent = null;
    if (intents.length > 0 && selectedIntentIndex < intents.length) {
      selectedIntent = { ...intent };
      intents[selectedIntentIndex] = selectedIntent;
      selectedIntent.notSaved = true;
    }
    return {
      ...state,
      selectedBotId,
      intents,
      selectedIntentIndex,
      selectedIntent,
    };
  },

  // SET INTENT ACTION
  [APP_SETINTENTACTION]: (
    state,
    { actionContainer, actionType, actionValue, selectedAction },
  ) => {
    const intents = [...state.intents];
    const selectedIntentIndex =
      state.selectedIntentIndex !== undefined ? state.selectedIntentIndex : 0;
    const intent = intents[selectedIntentIndex];
    if (!intent[actionContainer]) {
      intent[actionContainer] = [];
    }
    const actions = intent[actionContainer];

    if (selectedAction === undefined) {
      if (actionType === "condition") {
        // WIP handle Condition type
        let condition;
        if (actions.length === 0) {
          condition = { type: actionType, children: [] };
          actions.push(condition);
        } else {
          [condition] = actions;
        }
        condition.children.push(actionValue);
      } else {
        actions.push(actionValue);
      }
    } else if (actionType === "condition") {
      // WIP handle Condition type
      const condition = actions[0];
      condition.children.splice(selectedAction, 1, actionValue);
    } else {
      actions.splice(selectedAction, 1, actionValue);
    }
    intent.notSaved = true;
    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntentIndex,
      selectedIntent: { ...intent },
    };
  },

  // DELETE INTENT ACTION
  [APP_DELETEINTENTACTION]: (state, { actionContainer, selectedAction }) => {
    const intents = [...state.intents];
    const selectedIntentIndex =
      state.selectedIntentIndex !== undefined ? state.selectedIntentIndex : 0;
    const intent = intents[selectedIntentIndex];
    const actions = intent[actionContainer];
    // WIP handle Condition type
    if (actions && actions.length > 0) {
      if (typeof actions[0] === "string") {
        actions.splice(selectedAction, 1);
      } else if (actions[0].type === "condition") {
        const { children } = actions[0];
        children.splice(selectedAction, 1);
        if (children.length === 0) {
          actions.splice(0, 1);
        }
      }
      intent.notSaved = true;
    }
    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntentIndex,
      selectedIntent: { ...intent },
    };
  },
};
