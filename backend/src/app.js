/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import createZoapp from "zoapp-backend";

import createExtensionsController from "./controllers";
import buildRoutes from "./routes";
import plugins from "./plugins";

class App {
  constructor(config = {}) {
    // We force zoapp not to build the SQL schema by default.
    const buildSchema =
      config.buildSchema === undefined ? false : config.buildSchema;

    this.zoapp = createZoapp({
      ...config,
      buildSchema,
    });
    logger.info("add Plugins");
    this.zoapp.addPlugins(plugins(this.zoapp.pluginsManager));
    logger.info("add Controller extensions");
    this.zoapp.addControllerExtensions(
      createExtensionsController(this.zoapp, config),
    );
    buildRoutes(this.zoapp);
  }

  async start() {
    logger.info("start");
    await this.zoapp.start();
  }

  async close() {
    await this.zoapp.close();
  }

  getDatabase() {
    return this.zoapp.database;
  }

  getAuthServer() {
    return this.zoapp.authServer;
  }
}

const createApp = (config = {}) => new App(config);

export default createApp;
