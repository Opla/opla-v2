import {
  FETCH_FAILURE,
  FETCH_REQUEST,
  FETCH_SUCCESS,
} from "zoapp-front/dist/actions/constants";

import {
  API_GETBOTS,
  API_BOTS_PARAMETERS,
  API_CREATEBOT,
  API_SAVEBOT,
  API_SELECT_BOT,
} from "./constants";

export function apiGetBotsRequest() {
  return { type: API_GETBOTS + FETCH_REQUEST };
}
export function apiGetBotsSuccess({ bots }) {
  return { type: API_GETBOTS + FETCH_SUCCESS, bots };
}
export function apiGetBotsFaillure({ error }) {
  return { type: API_GETBOTS + FETCH_FAILURE, error };
}

export function apiCreateBot(botParams) {
  return { type: API_CREATEBOT + FETCH_REQUEST, botParams };
}

export function apiSaveBotRequest(botParams) {
  return { type: API_SAVEBOT + FETCH_REQUEST, botParams };
}

export function apiGetBotParametersRequest(name) {
  return { type: API_BOTS_PARAMETERS + FETCH_REQUEST, name };
}
export function apiGetBotParametersSucess(params) {
  return { type: API_BOTS_PARAMETERS + FETCH_SUCCESS, params };
}
export function apiGetBotParametersFailure(error) {
  return { type: API_BOTS_PARAMETERS + FETCH_FAILURE, error };
}

export function apiSelectBot(index) {
  return { type: API_SELECT_BOT, index };
}
