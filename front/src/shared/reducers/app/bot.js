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
} from "../../actions/constants";

export const initialState = {
  loading: false,
  error: null,
  botParameters: null,
  selectedBotId: null,
  bots: [],
  botVariables: [],
  botLocalVariables: [],
};

export const handlers = {
  [API_GETBOTS + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_GETBOTS + FETCH_SUCCESS]: (state, { bots }) => ({
    ...state,
    error: null,
    loading: false,
    bots,
  }),
  [API_GETBOTS + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    error,
    loading: false,
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
  [API_CREATEBOT + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_CREATEBOT + FETCH_SUCCESS]: (state, { bot }) => {
    const { bots } = state;
    bots.push(bot);
    const project = {
      name: bot.name,
      selectedIndex: bots.length - 1,
      icon: bot.icon ? bot.icon : "./images/opla-avatar.png",
    };
    return {
      ...state,
      loading: false,
      error: null,
      selectedBotId: bot.id,
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
    const { bots } = state;
    const savedBotIndex = bots.findIndex((b) => b.id === bot.id);
    if (savedBotIndex > -1) {
      bots[savedBotIndex] = bot;
    }

    return {
      ...state,
      loading: false,
      error: null,
      bots,
    };
  },
  [API_SAVEBOT + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),
  [API_SELECT_BOT]: (state, { index }) => {
    const bot = state.bots[index];
    const project = {
      name: bot.name,
      selectedIndex: index,
      icon: bot.icon ? bot.icon : "./images/opla-avatar.png",
    };
    return {
      ...state,
      selectedBotId: bot.id,
      project,
    };
  },
  [API_BOT_GET_VARIABLES + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_BOT_GET_VARIABLES + FETCH_SUCCESS]: (state, { variables }) => ({
    ...state,
    loading: false,
    error: null,
    botVariables: variables,
  }),
  [API_BOT_GET_VARIABLES + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),
  [API_BOT_SET_VARIABLES + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_BOT_SET_VARIABLES + FETCH_SUCCESS]: (state, { variables }) => ({
    ...state,
    loading: false,
    error: null,
    botVariables: variables,
  }),
  [API_BOT_SET_VARIABLES + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),
  [API_BOT_GET_LOCAL_VARIABLES + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_BOT_GET_LOCAL_VARIABLES + FETCH_SUCCESS]: (state, { variables }) => ({
    ...state,
    loading: false,
    error: null,
    botLocalVariables: variables,
  }),
  [API_BOT_GET_LOCAL_VARIABLES + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),
  [API_BOT_SET_LOCAL_VARIABLES + FETCH_REQUEST]: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  [API_BOT_SET_LOCAL_VARIABLES + FETCH_SUCCESS]: (state, { variables }) => ({
    ...state,
    loading: false,
    error: null,
    botLocalVariables: variables,
  }),
  [API_BOT_SET_LOCAL_VARIABLES + FETCH_FAILURE]: (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }),
};
