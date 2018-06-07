/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import createReducer from "zoapp-front/reducers/createReducer";

import {
  initialState as zoappInitialState,
  handlers as zoappHandlers,
} from "zoapp-front/reducers/app";

import {
  API_ADMIN,
  AUTH_SIGNOUT,
  FETCH_FAILURE,
  FETCH_REQUEST,
  FETCH_SUCCESS,
} from "zoapp-front/actions/constants";

import {
  API_CREATEBOT,
  API_DELETEMIDDLEWARE,
  API_GETMIDDLEWARES,
  API_IMPORT,
  API_PUBLISH,
  API_SAVEBOT,
  API_SB_GETCONTEXT,
  API_SB_GETMESSAGES,
  API_SB_RESET,
  API_SB_SENDMESSAGE,
  API_SETMIDDLEWARE,
  APP_UPDATEPUBLISHER,
  API_GETTEMPLATES,
  API_GETLANGUAGES,
  API_BOTS_PARAMETERS,
} from "../../actions/constants";

import {
  initialState as intentInitialState,
  handlers as intentHandlers,
} from "./intents";

export const defaultTemplates = [
  { id: "eb05e2a4-251a-4e11-a907-b1f3bcc20283", name: "Empty" },
  { id: "571a2354-ec80-4423-8edb-94d0a934fbb6", name: "Import" },
];
export const defaultLanguages = [{ id: "en", name: "English", default: true }];

export const initialState = {
  ...zoappInitialState,
  ...intentInitialState,
  selectedBotId: null,
  sandbox: null,
  loadingMessages: false,
  templates: defaultTemplates,
  languages: defaultLanguages,
  botParameters: null,
};

export default createReducer(initialState, {
  ...zoappHandlers,
  ...intentHandlers,

  [API_ADMIN + FETCH_SUCCESS]: (state, { admin }) => {
    let { selectedBotId } = state;
    let project = state.project ? state.project : {};
    let { selectedIndex } = project;
    if (admin && admin.bots) {
      if (!selectedIndex || admin.bots.length > selectedIndex) {
        selectedIndex = 0;
      }
      if (selectedBotId == null && admin.bots.length > selectedIndex) {
        selectedBotId = admin.bots[selectedIndex].id;
      }
      let bot = {};
      if (admin.bots.length > selectedIndex) {
        bot = admin.bots[selectedIndex];
      }
      project = {
        name: bot.name,
        selectedIndex,
        icon: bot.icon ? bot.icon : "./images/opla-avatar.png",
      };
    }
    return {
      ...state,
      loading: false,
      error: null,
      admin,
      selectedBotId,
      project,
    };
  },

  [API_GETMIDDLEWARES + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
    lastMiddleware: null,
  }),
  [API_GETMIDDLEWARES + FETCH_SUCCESS]: (state, { middlewares }) => ({
    ...state,
    loading: false,
    error: null,
    middlewares: [...middlewares],
  }),
  [API_GETMIDDLEWARES + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_SETMIDDLEWARE + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
    lastMiddleware: null,
  }),
  [API_SETMIDDLEWARE + FETCH_SUCCESS]: (state, { middleware }) => {
    const middlewares = [];
    let v = true;
    state.middlewares.forEach((m) => {
      if (m.id === middleware.id) {
        middlewares.push({ ...middleware });
        v = false;
      } else {
        middlewares.push(m);
      }
    });
    if (v) {
      middlewares.push({ ...middleware });
    }
    return {
      ...state,
      loading: false,
      error: null,
      middlewares,
      lastMiddleware: { ...middleware },
    };
  },
  [API_SETMIDDLEWARE + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_DELETEMIDDLEWARE + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
    lastMiddleware: null,
  }),
  [API_DELETEMIDDLEWARE + FETCH_SUCCESS]: (state, { middlewareId }) => {
    const middlewares = [];
    state.middlewares.forEach((m) => {
      if (m.id !== middlewareId) {
        middlewares.push(m);
      }
    });
    return {
      ...state,
      loading: false,
      error: null,
      middlewares,
    };
  },
  [API_DELETEMIDDLEWARE + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),
  [API_CREATEBOT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_CREATEBOT + FETCH_SUCCESS]: (state, { bot }) => {
    const { error } = bot;
    let { selectedBotId } = state;
    let admin = null;
    if (state.admin != null) {
      admin = { ...state.admin };
    }
    if (error) {
      // error = bot.error;
    } else if (admin != null) {
      selectedBotId = bot.id;
      const bots = [];
      if (admin.bots) {
        admin.bots.forEach((b) => {
          if (b.id === selectedBotId) {
            bots.push({ ...bot });
          } else {
            bots.push(b);
          }
        });
      } else {
        bots.push({ ...bot });
      }
      bots.push({ ...bot });
      admin.bots = bots;
    }
    // TODO selectedIndex
    const selectedIndex = 0;
    const project = {
      name: bot.name,
      selectedIndex,
      icon: bot.icon ? bot.icon : "./images/opla-avatar.png",
    };
    return {
      ...state,
      loading: false,
      error,
      admin,
      selectedBotId,
      project,
    };
  },
  [API_CREATEBOT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_SAVEBOT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_SAVEBOT + FETCH_SUCCESS]: (state, { bot }) => {
    const { error } = bot;
    let admin = null;
    if (state.admin != null) {
      admin = { ...state.admin };
    }
    if (error) {
      // error = bot.error;
    } else if (admin != null) {
      const botId = bot.id;
      const bots = [];
      if (admin.bots) {
        admin.bots.forEach((b) => {
          if (b.id === botId) {
            bots.push({ ...bot });
          } else {
            bots.push({ ...b });
          }
        });
      } else {
        bots.push({ ...bot });
      }
      admin.bots = bots;
    }
    // TODO selectedIndex
    const selectedIndex = 0;
    const project = {
      name: bot.name,
      selectedIndex,
      icon: bot.icon ? bot.icon : "./images/opla-avatar.png",
    };
    return {
      ...state,
      loading: false,
      error,
      admin,
      project,
    };
  },
  [API_SAVEBOT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_IMPORT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_IMPORT + FETCH_SUCCESS]: (state, { result }) => {
    let { intents, selectedIntentIndex, selectedIntent } = state;
    if (result.intents) {
      intents = [...result.intents];
      if (selectedIntentIndex >= intents.length) {
        selectedIntentIndex = 0;
      }
      if (intents && (!selectedIntent || !selectedIntent.notSaved)) {
        selectedIntent = { ...intents[selectedIntentIndex] };
      } else if (!selectedIntent && !selectedIntent.notSaved) {
        selectedIntent = null;
      } else {
        // TODO handle conflicts
      }
    }
    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntentIndex,
      selectedIntent,
    };
  },
  [API_IMPORT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_PUBLISH + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_PUBLISH + FETCH_SUCCESS]: (state, { result }) => {
    let { intents, selectedIntentIndex, selectedIntent } = state;
    if (result.intents) {
      intents = [...result.intents];
      if (selectedIntentIndex >= intents.length) {
        selectedIntentIndex = 0;
      }
      if (intents && (!selectedIntent || !selectedIntent.notSaved)) {
        selectedIntent = { ...intents[selectedIntentIndex] };
      } else if (!selectedIntent && !selectedIntent.notSaved) {
        selectedIntent = null;
      } else {
        // TODO handle conflicts
      }
    }
    return {
      ...state,
      loading: false,
      error: null,
      intents,
      selectedIntentIndex,
      selectedIntent,
    };
  },
  [API_PUBLISH + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  /* API Sandbox section */
  [API_SB_GETMESSAGES + FETCH_REQUEST]: (state) => ({
    ...state,
    loadingMessages: true,
    error: null,
  }),
  [API_SB_GETMESSAGES + FETCH_SUCCESS]: (state, { conversations }) => {
    // WIP, TODO check if BotId is ok
    let { sandbox } = state;
    if (!sandbox) {
      sandbox = {};
    }
    if (conversations) {
      sandbox.conversations = [...conversations];
    } else {
      sandbox.conversations = [];
    }
    return {
      ...state,
      loadingMessages: false,
      error: null,
      sandbox,
    };
  },
  [API_SB_GETMESSAGES + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loadingMessages: false,
    error,
  }),

  [API_SB_SENDMESSAGE + FETCH_REQUEST]: (state) => ({
    ...state,
    loadingMessages: true,
    error: null,
  }),
  [API_SB_SENDMESSAGE + FETCH_SUCCESS]: (state) => {
    // TODO , { conversationId, message }
    const { sandbox } = state;
    // sandbox.conversations = [...conversations];
    return {
      ...state,
      loadingMessages: false,
      error: null,
      sandbox,
    };
  },
  [API_SB_SENDMESSAGE + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loadingMessages: false,
    error,
  }),

  [API_SB_GETCONTEXT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_SB_GETCONTEXT + FETCH_SUCCESS]: (state, { context }) => {
    // TODO check if BotId is ok
    const { sandbox } = state;
    sandbox.context = [...context];
    return {
      ...state,
      loading: false,
      error: null,
      sandbox,
    };
  },
  [API_SB_GETCONTEXT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  [API_SB_RESET + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_SB_RESET + FETCH_SUCCESS]: (state) => {
    // TODO check if BotId is ok
    const sandbox = { conversations: [] };
    return {
      ...state,
      loading: false,
      error: null,
      sandbox,
    };
  },
  [API_SB_RESET + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),

  /* APP Section */
  [APP_UPDATEPUBLISHER]: (state, { selectedBotId, publisher }) => {
    const publishers = { ...state.publishers };
    if (state.selectedBotId === selectedBotId) {
      const { name } = publisher;
      publishers[name] = { ...publisher };
    }
    return { ...state, publishers };
  },

  /* Auth section */
  [AUTH_SIGNOUT + FETCH_SUCCESS]: (state) => ({
    ...state,
    ...initialState,
  }),

  /* Api admin section */
  [API_GETTEMPLATES + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_GETTEMPLATES + FETCH_SUCCESS]: (state, { templates }) => ({
    ...state,
    loading: false,
    error: null,
    templates: templates.concat(defaultTemplates),
  }),
  [API_GETTEMPLATES + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message,
    templates: defaultTemplates,
  }),

  [API_GETLANGUAGES + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_GETLANGUAGES + FETCH_SUCCESS]: (state, { languages }) => ({
    ...state,
    loading: false,
    error: null,
    languages,
  }),
  [API_GETLANGUAGES + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message,
    languages: defaultLanguages,
  }),
  [API_BOTS_PARAMETERS + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_BOTS_PARAMETERS + FETCH_SUCCESS]: (state, { params }) => ({
    ...state,
    loading: false,
    error: null,
    botParameters: params,
  }),
  [API_BOTS_PARAMETERS + FETCH_FAILURE]: (state, error) => ({
    ...state,
    loading: false,
    error,
    botParameters: null,
  }),
});
