/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Opla from "OplaLibs/opla";

import "animate.css/animate.min.css";
import "zoapp-front/compressed.css";
import "../stylesheets/main.scss";

const opla = new Opla();
opla.start();

/* global module */
if (module.hot) {
  module.hot.accept();
}
