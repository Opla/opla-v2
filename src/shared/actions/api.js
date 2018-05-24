/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
  FETCH_FAILURE,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "zoapp-front/actions/constants";

import {
  API_CREATEBOT,
  API_DELETEINTENT,
  API_DELETEMIDDLEWARE,
  API_GETINTENTS,
  API_GETMETRICS,
  API_GETMIDDLEWARES,
  API_IMPORT,
  API_MOVEINTENT,
  API_PUBLISH,
  API_SAVEBOT,
  API_SB_GETCONTEXT,
  API_SB_GETMESSAGES,
  API_SB_RESET,
  API_SB_SENDMESSAGE,
  API_SENDINTENT,
  API_SETMIDDLEWARE,
  API_GETTEMPLATES,
  API_GETLANGUAGES,
  API_BOTS_PARAMETERS,
} from "./constants";

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

export function apiImportRequest(botId, data, options) {
  return {
    type: API_IMPORT + FETCH_REQUEST,
    botId,
    data,
    options,
  };
}

export function apiPublishRequest(botId, channels, to = null, from = null) {
  return {
    type: API_PUBLISH + FETCH_REQUEST,
    botId,
    channels,
    to,
    from,
  };
}

export function apiGetIntentsRequest(botId) {
  return { type: API_GETINTENTS + FETCH_REQUEST, botId };
}

export function apiGetIntentsSuccess(intents) {
  return { type: API_GETINTENTS + FETCH_SUCCESS, intents };
}

export function apiGetIntentsFailure(error) {
  return { type: API_GETINTENTS + FETCH_FAILURE, error };
}

export function apiSendIntentRequest(botId, intent) {
  return { type: API_SENDINTENT + FETCH_REQUEST, botId, intent };
}

export function apiDeleteIntentRequest(botId, intent) {
  return { type: API_DELETEINTENT + FETCH_REQUEST, botId, intent };
}

export function apiMoveIntentRequest(botId, intentId, from, to) {
  return {
    type: API_MOVEINTENT + FETCH_REQUEST,
    botId,
    intentId,
    from,
    to,
  };
}

export function apiMoveIntentSuccess(from, to) {
  return {
    type: API_MOVEINTENT + FETCH_SUCCESS,
    from,
    to,
  };
}

export function apiMoveIntentFailure(error) {
  return { type: API_MOVEINTENT + FETCH_FAILURE, error };
}

export function apiGetSandboxMessagesRequest(botId) {
  return { type: API_SB_GETMESSAGES + FETCH_REQUEST, botId };
}

export function apiSubscribeSandboxMessages(botId) {
  return { type: API_SB_GETMESSAGES + SUBSCRIBE, botId };
}

export function apiUnsubscribeSandboxMessages(botId) {
  return { type: API_SB_GETMESSAGES + UNSUBSCRIBE, botId };
}

export function apiSendSandboxMessageRequest(botId, conversationId, message) {
  return {
    type: API_SB_SENDMESSAGE + FETCH_REQUEST,
    botId,
    conversationId,
    message,
  };
}

export function apiGetSandboxContextRequest(botId) {
  return { type: API_SB_GETCONTEXT + FETCH_REQUEST, botId };
}

export function apiSandboxResetRequest(botId) {
  return { type: API_SB_RESET + FETCH_REQUEST, botId };
}

export function apiGetMiddlewaresRequest(botId, middlewareType = null) {
  return { type: API_GETMIDDLEWARES + FETCH_REQUEST, botId, middlewareType };
}

export function apiSetMiddlewareRequest(botId, middleware) {
  return { type: API_SETMIDDLEWARE + FETCH_REQUEST, botId, middleware };
}

export function apiDeleteMiddlewareRequest(botId, middlewareId) {
  return { type: API_DELETEMIDDLEWARE + FETCH_REQUEST, botId, middlewareId };
}

export function apiGetMetricsRequest(botId) {
  return { type: API_GETMETRICS + FETCH_REQUEST, botId };
}

export function apiGetMetricsSuccess(metrics) {
  return { type: API_GETMETRICS + FETCH_SUCCESS, metrics };
}

export function apiGetMetricsFailure(error) {
  return { type: API_GETMETRICS + FETCH_FAILURE, error };
}

export function apiGetTemplatesRequest() {
  return { type: API_GETTEMPLATES + FETCH_REQUEST };
}

export function apiGetTemplatesSuccess(templates) {
  return { type: API_GETTEMPLATES + FETCH_SUCCESS, templates };
}

export function apiGetTemplatesFailure(error) {
  return { type: API_GETTEMPLATES + FETCH_FAILURE, error };
}

export function apiGetLanguagesRequest() {
  return { type: API_GETLANGUAGES + FETCH_REQUEST };
}

export function apiGetLanguagesSuccess(languages) {
  return { type: API_GETLANGUAGES + FETCH_SUCCESS, languages };
}

export function apiGetLanguagesFailure(error) {
  return { type: API_GETLANGUAGES + FETCH_FAILURE, error };
}
