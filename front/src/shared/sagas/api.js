/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { delay, eventChannel } from "redux-saga";
import { put, race, call, take, fork } from "redux-saga/effects";
import {
  FETCH_FAILURE,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "zoapp-front/dist/actions/constants";
import zoappApi from "zoapp-front/dist/sagas/api";
import { getWebService, createSocketService } from "zoapp-front/dist/services";
import {
  API_DELETEINTENT,
  API_DELETEMIDDLEWARE,
  API_GETINTENTS,
  API_GETLANGUAGES,
  API_GETMETRICS,
  API_GETMIDDLEWARES,
  API_GETTEMPLATES,
  API_IMPORT,
  API_MOVEINTENT,
  API_PUBLISH,
  API_SB_GETCONTEXT,
  API_SB_GETMESSAGES,
  API_SB_RESET,
  API_SB_SENDMESSAGE,
  API_SB_UPDATEMESSAGES,
  API_SENDINTENT,
  API_SETMIDDLEWARE,
  API_GET_VARIABLES,
  API_SET_VARIABLES,
} from "../actions/constants";
import {
  apiGetIntentsFailure,
  apiGetIntentsSuccess,
  apiGetMetricsFailure,
  apiGetMetricsSuccess,
  apiMoveIntentFailure,
  apiMoveIntentSuccess,
  apiGetTemplatesSuccess,
  apiGetTemplatesFailure,
  apiGetLanguagesSuccess,
  apiGetLanguagesFailure,
  apiGetVariablesSuccess,
  apiGetVariablesFailure,
  apiSetVariablesSuccess,
  apiSetVariablesFailure,
} from "../actions/api";

let sandboxSocketClient = null;

function* getSandboxMessages(action) {
  const { botId } = action;
  try {
    const response = yield getWebService().get(
      `bots/${botId}/sandbox/messages`,
    );
    yield put({
      type: `${API_SB_GETMESSAGES}${FETCH_SUCCESS}`,
      loading: false,
      conversations: response,
    });
  } catch (error) {
    yield put({ type: `${API_SB_GETMESSAGES}${FETCH_FAILURE}`, error });
  }
}

let subscribedSandboxMessages = false;

function* pollSandboxMessages(action) {
  if (subscribedSandboxMessages) return;
  subscribedSandboxMessages = true;
  while (subscribedSandboxMessages) {
    try {
      yield call(getSandboxMessages, action);
      // TODO put the delay value in a constant
      yield call(delay, 10000);
    } catch (error) {
      return;
    }
  }
}

function subscribe(socketClient, action) {
  return eventChannel((emitter) => {
    socketClient.on("connected", () => {
      const { botId } = action;
      // console.log(`WebSocket connected: ${botId}`);
      const payload = JSON.stringify({ event: "subscribe", channelId: botId });
      socketClient.send(payload);
    });
    socketClient.on("newMessages", (data) => {
      // console.log(`WebSocket newMessages: ${data}`);
      emitter({
        type: `${API_SB_GETMESSAGES}${FETCH_SUCCESS}`,
        loading: false,
        conversations: data,
      });
    });
    socketClient.on("error", (/* error */) => {
      // TODO: handle error
      // console.log(`WebSocket error: ${error}`);
    });
    socketClient.on("close", () => {
      // TODO: handle close
      // console.log("WebSocket close");
    });
    return () => {
      // console.log("WebSocket off");
    };
  });
}

function* subscribeSandboxMessages(action) {
  if (sandboxSocketClient) {
    subscribedSandboxMessages = false;
    yield sandboxSocketClient.send("unsubscribe");
    yield sandboxSocketClient.close();
    sandboxSocketClient = null;
  }
  sandboxSocketClient = createSocketService("bots/sandbox/messages");
  if (sandboxSocketClient) {
    yield sandboxSocketClient.start();
    const channel = yield call(subscribe, sandboxSocketClient, action);
    if (subscribedSandboxMessages) return;
    subscribedSandboxMessages = true;
    while (subscribedSandboxMessages) {
      const a = yield take(channel);
      yield put(a);
    }
    yield sandboxSocketClient.send("unsubscribe");
    yield sandboxSocketClient.close();
    sandboxSocketClient = null;
    return;
  }
  pollSandboxMessages(action);
}

const api = [
  ...zoappApi,
  [
    API_IMPORT + FETCH_REQUEST,
    function* f(action) {
      const { botId } = action;
      const params = { data: action.data, options: action.options };
      try {
        const response = yield getWebService().post(
          `bots/${botId}/import`,
          params,
          false,
        );
        yield put({
          type: `${API_IMPORT}${FETCH_SUCCESS}`,
          loading: false,
          result: response,
        });
      } catch (error) {
        yield put({ type: `${API_IMPORT}${FETCH_FAILURE}`, error });
      }
    },
  ],
  [
    API_PUBLISH + FETCH_REQUEST,
    function* f(action) {
      const { botId } = action;
      const params = {
        from: action.from,
        to: action.to,
        channels: action.channels,
      };
      try {
        const response = yield getWebService().post(
          `bots/${botId}/publish`,
          params,
          false,
        );
        yield put({
          type: `${API_PUBLISH}${FETCH_SUCCESS}`,
          loading: false,
          result: response,
        });
      } catch (error) {
        yield put({ type: `${API_PUBLISH}${FETCH_FAILURE}`, error });
      }
    },
  ],
  /* Intents */
  [
    API_GETINTENTS + FETCH_REQUEST,
    function* f(action) {
      const { botId } = action;
      try {
        const response = yield getWebService().get(`bots/${botId}/intents`);

        yield put(apiGetIntentsSuccess(response.intents));
      } catch (error) {
        yield put(apiGetIntentsFailure(error));
      }
    },
  ],

  [
    API_SENDINTENT + FETCH_REQUEST,
    function* f(action) {
      const { botId } = action;
      const { intent } = action;

      try {
        let response;
        if (intent.id) {
          response = yield getWebService().put(`bots/${botId}/intents`, intent);
        } else {
          response = yield getWebService().post(
            `bots/${botId}/intents`,
            intent,
          );
        }
        yield put({
          type: `${API_SENDINTENT}${FETCH_SUCCESS}`,
          data: response,
        });
      } catch (error) {
        yield put({ type: `${API_SENDINTENT}${FETCH_FAILURE}`, error });
      }
    },
  ],

  [
    API_MOVEINTENT + FETCH_REQUEST,
    function* f(action) {
      const { botId, intentId, from, to } = action;

      try {
        yield put(apiMoveIntentSuccess(from, to));

        yield getWebService().put(`bots/${botId}/intents/${intentId}/move`, {
          botId,
          intentId,
          // the API is 1-based index
          from: from + 1,
          to: to + 1,
        });
      } catch (error) {
        yield put(apiMoveIntentFailure(error));
      }
    },
  ],

  [
    API_DELETEINTENT + FETCH_REQUEST,
    function* f(action) {
      const { botId, intent } = action;
      try {
        const response = yield getWebService().delete(
          `bots/${botId}/intents/${intent.id}`,
        );
        yield put({
          type: `${API_DELETEINTENT}${FETCH_SUCCESS}`,
          loading: false,
          intent: response,
        });
      } catch (error) {
        yield put({ type: `${API_DELETEINTENT}${FETCH_FAILURE}`, error });
      }
    },
  ],

  /* Sandbox */
  [
    API_SB_GETMESSAGES + SUBSCRIBE,
    function* f(action) {
      yield race([
        fork(subscribeSandboxMessages, action),
        take(API_SB_GETMESSAGES + UNSUBSCRIBE),
      ]);
    },
  ],
  [
    API_SB_GETMESSAGES + UNSUBSCRIBE,
    function* f() {
      yield (subscribedSandboxMessages = false);
      if (sandboxSocketClient) {
        yield sandboxSocketClient.send("unsubscribe");
        yield sandboxSocketClient.close();
        sandboxSocketClient = null;
      }
    },
  ],
  [API_SB_GETMESSAGES + FETCH_REQUEST, getSandboxMessages],

  [
    API_SB_SENDMESSAGE + FETCH_REQUEST,
    function* f(action) {
      const { botId, conversationId, message } = action;
      try {
        const response = yield getWebService().post(
          `bots/${botId}/sandbox/messages/${conversationId}`,
          message,
        );
        yield put({
          type: `${API_SB_SENDMESSAGE}${FETCH_SUCCESS}`,
          loading: false,
          conversationId,
          message: response,
        });
      } catch (error) {
        yield put({ type: `${API_SB_SENDMESSAGE}${FETCH_FAILURE}`, error });
      }
    },
  ],

  [
    API_SB_UPDATEMESSAGES + FETCH_REQUEST,
    function* f(action) {
      const { botId, conversationId } = action;
      try {
        const response = yield getWebService().put(
          `bots/${botId}/sandbox/messages/${conversationId}`,
          [],
        );
        yield put({
          type: `${API_SB_UPDATEMESSAGES}${FETCH_SUCCESS}`,
          loading: false,
          conversationId,
          message: response,
        });
      } catch (error) {
        yield put({ type: `${API_SB_UPDATEMESSAGES}${FETCH_FAILURE}`, error });
      }
    },
  ],

  [
    API_SB_GETCONTEXT + FETCH_REQUEST,
    function* f(action) {
      const { botId } = action;
      try {
        const response = yield getWebService().get(
          `bots/${botId}/sandbox/context`,
        );
        yield put({
          type: `${API_SB_GETCONTEXT}${FETCH_SUCCESS}`,
          loading: false,
          context: response,
        });
      } catch (error) {
        yield put({ type: `${API_SB_GETCONTEXT}${FETCH_FAILURE}`, error });
      }
    },
  ],

  [
    API_SB_RESET + FETCH_REQUEST,
    function* f(action) {
      const { botId } = action;
      try {
        const response = yield getWebService().delete(`bots/${botId}/sandbox`);
        yield put({
          type: `${API_SB_RESET}${FETCH_SUCCESS}`,
          loading: false,
          conversations: response,
        });
      } catch (error) {
        yield put({ type: `${API_SB_RESET}${FETCH_FAILURE}`, error });
      }
    },
  ],
  /* Get middlewares */
  [
    API_GETMIDDLEWARES + FETCH_REQUEST,
    function* f(action) {
      const { botId } = action;
      let url = `middlewares/${botId}`;
      if (action.middlewareType) {
        url += `?type=${action.middlewareType}`;
      }
      try {
        const middlewares = yield getWebService().get(url);
        yield put({
          type: `${API_GETMIDDLEWARES}${FETCH_SUCCESS}`,
          loading: false,
          middlewares,
        });
      } catch (error) {
        yield put({ type: `${API_GETMIDDLEWARES}${FETCH_FAILURE}`, error });
      }
    },
  ],
  /* Set middleware */
  [
    API_SETMIDDLEWARE + FETCH_REQUEST,
    function* f(action) {
      const { botId, middleware } = action;
      try {
        let response;
        if (middleware.id) {
          response = yield getWebService().put(
            `middlewares/${botId}`,
            middleware,
          );
        } else {
          response = yield getWebService().post(
            `middlewares/${botId}`,
            middleware,
          );
        }
        yield put({
          type: `${API_SETMIDDLEWARE}${FETCH_SUCCESS}`,
          loading: false,
          middleware: response,
        });
      } catch (error) {
        yield put({ type: `${API_SETMIDDLEWARE}${FETCH_FAILURE}`, error });
      }
    },
  ],
  /* Delete middleware */
  [
    API_DELETEMIDDLEWARE + FETCH_REQUEST,
    function* f(action) {
      const { botId, middlewareId } = action;
      try {
        const response = yield getWebService().delete(
          `middlewares/${botId}/${middlewareId}`,
        );
        yield put({
          type: `${API_DELETEMIDDLEWARE}${FETCH_SUCCESS}`,
          loading: false,
          middlewareId: response.id,
        });
      } catch (error) {
        yield put({ type: `${API_DELETEMIDDLEWARE}${FETCH_FAILURE}`, error });
      }
    },
  ],

  // Metrics
  [
    API_GETMETRICS + FETCH_REQUEST,
    function* f(action) {
      const { botId } = action;
      try {
        const response = yield getWebService().get(`metrics/${botId}`);
        yield put(apiGetMetricsSuccess(response));
      } catch (error) {
        yield put(apiGetMetricsFailure(error));
      }
    },
  ],
  // Admin
  [
    API_GETTEMPLATES + FETCH_REQUEST,
    function* f() {
      try {
        const response = yield getWebService().get("admin/templates", false);
        yield put(apiGetTemplatesSuccess(response));
      } catch (error) {
        yield put(apiGetTemplatesFailure(error));
      }
    },
  ],
  [
    API_GETLANGUAGES + FETCH_REQUEST,
    function* f() {
      try {
        const response = yield getWebService().get("admin/languages", false);
        yield put(apiGetLanguagesSuccess(response));
      } catch (error) {
        yield put(apiGetLanguagesFailure(error));
      }
    },
  ],
  [
    API_GET_VARIABLES + FETCH_REQUEST,
    function* f() {
      try {
        const response = yield getWebService().get("admin/variables");
        yield put(apiGetVariablesSuccess(response));
      } catch (error) {
        yield put(apiGetVariablesFailure(error));
      }
    },
  ],
  [
    API_SET_VARIABLES + FETCH_REQUEST,
    function* f({ variables }) {
      try {
        const response = yield getWebService().post("admin/variables", {
          variables,
        });
        yield put(apiSetVariablesSuccess(response));
      } catch (error) {
        yield put(apiSetVariablesFailure(error));
      }
    },
  ],
];

export default api;
