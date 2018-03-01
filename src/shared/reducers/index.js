import { combineReducers } from "redux";
import auth from "zoapp-front/reducers/auth";
import initialize from "zoapp-front/reducers/initialize";
import user from "zoapp-front/reducers/user";

import app from "./app";
import metrics from "./metrics";

export default combineReducers({
  initialize,
  auth,
  user,
  metrics,
  app,
});
