import Zoapp from "zoapp-backend";

import createExtensionsController from "./controllers";
import buildRoutes from "./routes";
import plugins from "./plugins";

class App {
  constructor(config = {}) {
    this.zoapp = Zoapp(config);
    this.zoapp.addControllerExtensions(createExtensionsController(
      this.zoapp,
      config,
    ));
    this.zoapp.addPlugins(plugins(this.zoapp.pluginsManager));

    buildRoutes(this.zoapp);
  }

  start() {
    this.zoapp.start();
  }
}

export default (config = {}) => new App(config);
