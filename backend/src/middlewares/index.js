/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
// TODO remove import and use dynamic loading
import OpenNLXMiddleware from "./openNLX";
import PublishConnectorMiddleware from "./publishConnector";
import EventsMiddleware from "./events";

import SystemFunctions from "../systemFunction";

const initMiddlewares = async (middlewaresController, extensionsController) => {
  // TODO dynamic loading
  logger.info("initMiddlewares");
  const systemFunctions = new SystemFunctions(extensionsController);
  const middleware = new OpenNLXMiddleware(
    extensionsController,
    systemFunctions,
  );
  const m = await middlewaresController.attach(middleware.getProperties());
  await middleware.init(m);

  const connectorMiddleware = new PublishConnectorMiddleware(
    extensionsController,
  );
  await middlewaresController.attach(connectorMiddleware.getProperties());
  const eventsMiddleware = new EventsMiddleware(extensionsController);
  await middlewaresController.attach(eventsMiddleware.getProperties());
};
export default initMiddlewares;
