/**
 * OAuth SignIn Action
 */
import { AUTH_SIGNIN, FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE } from "./constants";

export function signIn({ provider, username, password }) {
  return {
    type: AUTH_SIGNIN + FETCH_REQUEST, provider, username, password,
  };
}

export function signInComplete({ user, provider }) {
  return { type: AUTH_SIGNIN + FETCH_SUCCESS, user, provider };
}

export function signInError({ provider, error }) {
  return { type: AUTH_SIGNIN + FETCH_FAILURE, provider, error };
}
