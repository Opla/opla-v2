import { createReducer } from "./";
import { AUTH_INIT_SETTINGS } from "../actions/constants";

const initialState = {};
export default createReducer(initialState, {
  [AUTH_INIT_SETTINGS]: (state, { config }) => ({ ...config }),
});
