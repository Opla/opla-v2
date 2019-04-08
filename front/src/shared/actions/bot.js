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
  API_BOT_GET_VARIABLES,
  API_BOT_SET_VARIABLES,
  API_BOT_GET_LOCAL_VARIABLES,
  API_BOT_SET_LOCAL_VARIABLES,
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

export function apiGetBotVariablesRequest(botId) {
  return { type: API_BOT_GET_VARIABLES + FETCH_REQUEST, botId };
}
export function apiGetBotVariablesSuccess(variables) {
  return { type: API_BOT_GET_VARIABLES + FETCH_SUCCESS, variables };
}
export function apiGetBotVariablesFailure(error) {
  return { type: API_BOT_GET_VARIABLES + FETCH_FAILURE, error };
}

export function apiSetBotVariablesRequest(botId, variables) {
  return { type: API_BOT_SET_VARIABLES + FETCH_REQUEST, botId, variables };
}
export function apiSetBotVariablesSuccess(variables) {
  return { type: API_BOT_SET_VARIABLES + FETCH_SUCCESS, variables };
}
export function apiSetBotVariablesFailure(error) {
  return { type: API_BOT_SET_VARIABLES + FETCH_FAILURE, error };
}

export function apiGetLocalBotVariablesRequest(botId) {
  return { type: API_BOT_GET_LOCAL_VARIABLES + FETCH_REQUEST, botId };
}
export function apiGetLocalBotVariablesSuccess(variables) {
  return { type: API_BOT_GET_LOCAL_VARIABLES + FETCH_SUCCESS, variables };
}
export function apiGetLocalBotVariablesFailure(error) {
  return { type: API_BOT_GET_LOCAL_VARIABLES + FETCH_FAILURE, error };
}

export function apiSetLocalBotVariablesRequest(botId, variables) {
  return {
    type: API_BOT_SET_LOCAL_VARIABLES + FETCH_REQUEST,
    botId,
    variables,
  };
}
export function apiSetLocalBotVariablesSuccess(variables) {
  return { type: API_BOT_SET_LOCAL_VARIABLES + FETCH_SUCCESS, variables };
}
export function apiSetLocalBotVariablesFailure(error) {
  return { type: API_BOT_SET_LOCAL_VARIABLES + FETCH_FAILURE, error };
}
