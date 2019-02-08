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
} from "../actions/constants";

import {
  apiGetBotsFaillure,
  apiGetBotsSuccess,
  apiGetBotParametersSucess,
  apiGetBotParametersFailure,
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
        const response = yield getWebService().get(`bots/params/${name}`);
        yield put(apiGetBotParametersSucess(response));
      } catch (error) {
        yield put(apiGetBotParametersFailure(error));
      }
    },
  ],
];

export default bot;
