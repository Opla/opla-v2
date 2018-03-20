/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import createReducer from "zoapp-front/reducers/createReducer";

import {
  initialState as zoappInitialState,
  handlers as zoappHandlers,
  addErrorToState,
} from "zoapp-front/reducers/message";

import { FETCH_FAILURE } from "zoapp-front/actions/constants";

import {
  API_CREATEBOT,
  API_DELETEINTENT,
  API_DELETEMIDDLEWARE,
  API_GETINTENTS,
  API_GETMIDDLEWARES,
  API_IMPORT,
  API_MOVEINTENT,
  API_PUBLISH,
  API_SAVEBOT,
  API_SB_GETCONTEXT,
  API_SB_GETMESSAGES,
  API_SB_RESET,
  API_SB_SENDMESSAGE,
  API_SENDINTENT,
  API_SETMIDDLEWARE,
} from "../actions/constants";

export const initialState = {
  ...zoappInitialState,
};

export default createReducer(initialState, {
  ...zoappHandlers,
  [API_GETMIDDLEWARES + FETCH_FAILURE]: addErrorToState,
  [API_SETMIDDLEWARE + FETCH_FAILURE]: addErrorToState,
  [API_DELETEMIDDLEWARE + FETCH_FAILURE]: addErrorToState,
  [API_CREATEBOT + FETCH_FAILURE]: addErrorToState,
  [API_SAVEBOT + FETCH_FAILURE]: addErrorToState,
  [API_IMPORT + FETCH_FAILURE]: addErrorToState,
  [API_PUBLISH + FETCH_FAILURE]: addErrorToState,
  [API_GETINTENTS + FETCH_FAILURE]: addErrorToState,
  [API_SENDINTENT + FETCH_FAILURE]: addErrorToState,
  [API_DELETEINTENT + FETCH_FAILURE]: addErrorToState,
  [API_MOVEINTENT + FETCH_FAILURE]: addErrorToState,
  [API_SB_GETMESSAGES + FETCH_FAILURE]: addErrorToState,
  [API_SB_SENDMESSAGE + FETCH_FAILURE]: addErrorToState,
  [API_SB_GETCONTEXT + FETCH_FAILURE]: addErrorToState,
  [API_SB_RESET + FETCH_FAILURE]: addErrorToState,
});
