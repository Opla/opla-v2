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
  // Can't await in constructor for obvious reason
  // So now init is used to load dynamically all plugins from plugins folder
  async init(configuration = {}) {
    const config = {
      build_schema: false, // We force zoapp not to build the SQL schema by default.
      ...configuration,
    };
    this.zoapp = createZoapp(config);
    logger.info("add Plugins");
    // Plugins is now async
    this.zoapp.addPlugins(await plugins(this.zoapp));
    logger.info("add Controller extensions");
    this.zoapp.addControllerExtensions(
      createExtensionsController(this.zoapp, config),
    );
    buildRoutes(this.zoapp);
    return this;
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

const createApp = () => new App();

export default createApp;
