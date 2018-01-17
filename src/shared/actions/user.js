import {
  API_USERPROFILE,
  FETCH_REQUEST,
} from "./constants";

export function apiUserProfileRequest() {
  return { type: API_USERPROFILE + FETCH_REQUEST };
}

export function apiSaveUserProfileRequest() {
  return { type: API_USERPROFILE + FETCH_REQUEST };
}
