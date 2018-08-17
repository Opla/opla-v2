/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  /* APP Section */
  APP_SELECTENTITY,
  APP_SELECTFUNCTION,
} from "../../actions/constants";

export const initialState = {
  selectedType: "intent",
  selectedEntityIndex: -1,
  selectedFunctionIndex: -1,
};

export const handlers = {
  /* APP Section */

  // SELECT ENTITY
  [APP_SELECTENTITY]: (state, { selectedBotId, selectedEntityIndex }) => {
    const selectedIntent = null;
    const selectedIntentIndex = -1;
    const selectedFunctionIndex = -1;
    const selectedType = "entity";
    return {
      ...state,
      selectedBotId,
      selectedIntentIndex,
      selectedIntent,
      selectedEntityIndex,
      selectedFunctionIndex,
      selectedType,
    };
  },
  [APP_SELECTFUNCTION]: (state, { selectedBotId, selectedFunctionIndex }) => {
    const selectedIntent = null;
    const selectedIntentIndex = -1;
    const selectedEntityIndex = -1;
    const selectedType = "function";
    return {
      ...state,
      selectedBotId,
      selectedIntentIndex,
      selectedIntent,
      selectedEntityIndex,
      selectedFunctionIndex,
      selectedType,
    };
  },
};
