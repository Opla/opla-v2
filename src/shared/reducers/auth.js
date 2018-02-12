import { createReducer } from "./";
import { AUTH_SIGNIN, FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE, AUTH_SIGNOUT } from "../actions/constants";

const initialState = {
  loading: false,
  error: null,
  username: null,
  password: null,
  provider: null,
};

export default createReducer(initialState, {
  [AUTH_SIGNIN + FETCH_REQUEST]: (state, { provider, username, password }) => {
    let newState;
    if (provider) {
      newState = { ...state, [provider]: { loading: false, error: null } };
    } else {
      newState = { ...state, loading: false, error: null };
    }
    return {
      ...newState, username, password, provider,
    };
  },
  [AUTH_SIGNIN + FETCH_SUCCESS]: (state, { provider }) => {
    if (provider) {
      return {
        provider: {
          loading: false,
          error: null,
        },
      };
    }
    return {
      loading: false,
      error: null,
    };
  },
  [AUTH_SIGNIN + FETCH_FAILURE]: (state, { provider, error }) => {
    if (provider) {
      return {
        [provider]: {
          loading: false,
          error,
        },
      };
    }
    return {
      loading: false,
      error,
    };
  },
  [AUTH_SIGNOUT + FETCH_SUCCESS]: () => ({ ...initialState }),
  [AUTH_SIGNOUT + FETCH_REQUEST]: state => ({ ...state, loading: true, error: null }),

  [AUTH_SIGNOUT + FETCH_SUCCESS]: () => ({ ...initialState }),

  [AUTH_SIGNOUT + FETCH_FAILURE]: (state, { error }) => ({ ...state, loading: false, error }),
});
