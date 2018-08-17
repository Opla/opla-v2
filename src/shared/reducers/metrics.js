/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import createReducer from "zoapp-front/reducers/createReducer";
import {
  FETCH_FAILURE,
  FETCH_REQUEST,
  FETCH_SUCCESS,
} from "zoapp-front/actions/constants";

import { API_GETMETRICS } from "../actions/constants";

export const initialState = {
  loading: false,
  metrics: null,
};

export default createReducer(initialState, {
  [API_GETMETRICS + FETCH_REQUEST]: () => ({
    ...initialState,
    loading: true,
  }),
  [API_GETMETRICS + FETCH_FAILURE]: () => ({ ...initialState }),
  [API_GETMETRICS + FETCH_SUCCESS]: (state, { metrics }) => ({
    ...state,
    loading: false,
    metrics,
  }),
});
