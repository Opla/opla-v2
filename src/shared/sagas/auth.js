import { put, take, race, call } from "redux-saga/effects";
import { AuthService } from "zoapp-common";
import { AUTH_INIT_SETTINGS, AUTH_SIGNIN, AUTH_SIGNOUT, FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE } from "../actions/constants";
import { authService } from "./services";

function getAuthService(provider) {
  let service = authService;
  if (provider) {
    service = new AuthService({ provider });
  }
  return service;
}

function* authenticate({ username, password, provider }) {
  try {
    const service = getAuthService(provider);

    const response = yield service.authenticateUser({ username, password });
    yield put({ type: `${AUTH_SIGNIN}${FETCH_SUCCESS}`, attributes: response, provider });
  } catch (error) {
    yield put({ type: `${AUTH_SIGNIN}${FETCH_FAILURE}`, provider, error });
  }
}

export function* authInit() {
  const service = getAuthService();
  if (service.isAccessTokenValid()) {
    const attributes = service.getAttributes();
    yield put({ type: `${AUTH_SIGNIN}${FETCH_SUCCESS}`, attributes });
  }
}

export function* signOut(action) {
  const { provider } = action;
  try {
    const service = getAuthService(provider);
    yield service.resetAccess();
    yield put({ type: `${AUTH_SIGNOUT}${FETCH_SUCCESS}`, provider });
  } catch (error) {
    yield put({ type: `${AUTH_SIGNOUT}${FETCH_FAILURE}`, provider, error: error.message });
  }
}

export function* signIn(action) {
  const { username, password, provider } = action;
  const winner = yield race({
    auth: call(authenticate, { username, password, provider }),
    signOut: take(AUTH_SIGNOUT),
  });
  if (winner.auth) {
    // yield put({ type: AUTH_SIGNIN, newAuthState: true });
  } else if (winner.signOut) {
    // yield put({ type: AUTH_SIGNIN, newAuthState: false });
    yield call(signOut);
  }
}

const auth = [
  [AUTH_INIT_SETTINGS, authInit],
  [AUTH_SIGNIN + FETCH_REQUEST, signIn],
  [AUTH_SIGNOUT + FETCH_REQUEST, signOut],
];

export default auth;
