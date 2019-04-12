import { put } from "redux-saga/effects";
import { getWebService } from "zoapp-front/dist/services";

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
  API_BOT_GET_VARIABLES,
  API_BOT_SET_VARIABLES,
  API_BOT_GET_LOCAL_VARIABLES,
  API_BOT_SET_LOCAL_VARIABLES,
  API_BOT_GET_ENTITIES,
  API_BOT_SET_ENTITIES,
} from "../actions/constants";

import {
  apiGetBotsFaillure,
  apiGetBotsSuccess,
  apiGetBotParametersSucess,
  apiGetBotParametersFailure,
  apiGetBotVariablesSuccess,
  apiGetBotVariablesFailure,
  apiSetBotVariablesSuccess,
  apiSetBotVariablesFailure,
  apiGetLocalBotVariablesSuccess,
  apiGetLocalBotVariablesFailure,
  apiSetLocalBotVariablesSuccess,
  apiSetLocalBotVariablesFailure,
  apiGetBotEntitiesSuccess,
  apiGetBotEntitiesFailure,
  apiSetBotEntitiesSuccess,
  apiSetBotEntitiesFailure,
} from "../actions/bot";

const bot = [
  /* Create bot */
  [
    API_GETBOTS + FETCH_REQUEST,
    function* f() {
      try {
        const response = yield getWebService().get("bots");
        yield put(apiGetBotsSuccess({ bots: response }));
      } catch (error) {
        yield put(apiGetBotsFaillure({ error }));
      }
    },
  ],
  [
    API_CREATEBOT + FETCH_REQUEST,
    function* f(action) {
      const { botParams } = action;
      try {
        const response = yield getWebService().post("bots", botParams);
        yield put({
          type: `${API_CREATEBOT}${FETCH_SUCCESS}`,
          loading: false,
          bot: response,
        });
      } catch (error) {
        yield put({ type: `${API_CREATEBOT}${FETCH_FAILURE}`, error });
      }
    },
  ],
  [
    API_SAVEBOT + FETCH_REQUEST,
    function* f(action) {
      const { botParams } = action;
      const botId = botParams.id;
      try {
        const response = yield getWebService().put(
          `bots/${botId}`,
          botParams,
          false,
        );
        yield put({
          type: `${API_SAVEBOT}${FETCH_SUCCESS}`,
          loading: false,
          bot: response,
        });
      } catch (error) {
        yield put({ type: `${API_SAVEBOT}${FETCH_FAILURE}`, error });
      }
    },
  ],
  [
    API_BOTS_PARAMETERS + FETCH_REQUEST,
    function* f({ name }) {
      try {
        const response = yield getWebService().get(
          `bots/params/${name}`,
          false,
        );
        yield put(apiGetBotParametersSucess(response));
      } catch (error) {
        yield put(apiGetBotParametersFailure(error));
      }
    },
  ],
  [
    API_BOT_GET_VARIABLES + FETCH_REQUEST,
    function* f({ botId }) {
      try {
        const response = yield getWebService().get(`bots/variables/${botId}`);
        yield put(apiGetBotVariablesSuccess(response));
      } catch (error) {
        yield put(apiGetBotVariablesFailure(error));
      }
    },
  ],
  [
    API_BOT_SET_VARIABLES + FETCH_REQUEST,
    function* f({ botId, variables }) {
      try {
        const response = yield getWebService().post(`bots/variables/${botId}`, {
          variables,
        });
        yield put(apiSetBotVariablesSuccess(response));
      } catch (error) {
        yield put(apiSetBotVariablesFailure(error));
      }
    },
  ],
  [
    API_BOT_GET_LOCAL_VARIABLES + FETCH_REQUEST,
    function* f({ botId }) {
      try {
        const response = yield getWebService().get(
          `bots/sandbox/variables/${botId}`,
        );
        yield put(apiGetLocalBotVariablesSuccess(response));
      } catch (error) {
        yield put(apiGetLocalBotVariablesFailure(error));
      }
    },
  ],
  [
    API_BOT_SET_LOCAL_VARIABLES + FETCH_REQUEST,
    function* f({ botId, variables }) {
      try {
        const response = yield getWebService().post(
          `bots/sandbox/variables/${botId}`,
          { variables },
        );
        yield put(apiSetLocalBotVariablesSuccess(response));
      } catch (error) {
        yield put(apiSetLocalBotVariablesFailure(error));
      }
    },
  ],
  [
    API_BOT_GET_ENTITIES + FETCH_REQUEST,
    function* f({ botId }) {
      try {
        const response = yield getWebService().get(`bots/entities/${botId}`);
        yield put(apiGetBotEntitiesSuccess(response));
      } catch (error) {
        yield put(apiGetBotEntitiesFailure(error));
      }
    },
  ],
  [
    API_BOT_SET_ENTITIES + FETCH_REQUEST,
    function* f({ botId, entities }) {
      try {
        const response = yield getWebService().post(`bots/entities/${botId}`, {
          entities,
        });
        yield put(apiSetBotEntitiesSuccess(response));
      } catch (error) {
        yield put(apiSetBotEntitiesFailure(error));
      }
    },
  ],
];

export default bot;
