import { createReducer } from "./";

/* import { AUTHENTICATE_COMPLETE, AUTHENTICATE_ERROR } from "actions/authenticate"; */
import { AUTH_SIGNIN, API_USERPROFILE, FETCH_SUCCESS, FETCH_REQUEST, FETCH_FAILURE, AUTH_SIGNOUT } from "../actions/constants";

const initialState = {
  attributes: null,
  isSignedIn: false,
  loading: false,
  error: null,
};

export default createReducer(initialState, {
  [AUTH_SIGNIN + FETCH_SUCCESS]: (state, { attributes }) => ({
    attributes,
    isSignedIn: true,
    loading: false,
    error: null,
  }),
  [AUTH_SIGNOUT + FETCH_SUCCESS]: () => ({ ...initialState }),
  [API_USERPROFILE + FETCH_REQUEST]: state => ({ ...state, loading: true, error: null }),
  [API_USERPROFILE + FETCH_SUCCESS]: (state, { profile }) => ({
    ...state,
    loading: false,
    error: null,
    profile: { ...profile },
  }),
  [API_USERPROFILE + FETCH_FAILURE]: (state, { error }) => ({ ...state, loading: false, error }),
});
