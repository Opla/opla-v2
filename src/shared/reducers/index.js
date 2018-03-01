/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
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
