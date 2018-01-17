
import { AUTH_SIGNOUT, FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE } from "./constants";

export function signOutComplete({ provider }) {
  return { type: AUTH_SIGNOUT + FETCH_SUCCESS, provider };
}

export function signOutError({ provider, error }) {
  return { type: AUTH_SIGNOUT + FETCH_FAILURE, provider, error };
}

export function signOut({ provider }) {
  return { type: AUTH_SIGNOUT + FETCH_REQUEST, provider };
}
