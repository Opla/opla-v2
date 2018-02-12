import { AUTH_INIT_SETTINGS } from "./constants";

export function initAuthSettings(config) {
  return { type: AUTH_INIT_SETTINGS, config };
}

export function resetSettings(config) {
  // TODO
  return { type: AUTH_INIT_SETTINGS, config };
}
