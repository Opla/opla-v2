/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
// TODO remove import and use dynamic loading
import OpenNLXMiddleware from "./openNLX";
import AppConnectorMiddleware from "./appConnector";

const initMiddlewares = (middlewaresManager, controllers) => {
  // TODO dynamic loading
  logger.info("initMiddlewares");
  const middleware = new OpenNLXMiddleware(controllers);
  middlewaresManager
    .attach(middleware.getProperties())
    .then((m) => middleware.init(m));

  const appConnectorMiddleware = new AppConnectorMiddleware(controllers);
  middlewaresManager.attach(appConnectorMiddleware.getProperties());
};
export default initMiddlewares;
