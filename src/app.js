import Zoapp from "zoapp-backend";
import Controllers from "./controllers";
import BuildRoutes from "./routes";
import plugins from "./plugins";

class App {
  constructor(config = {}) {
    this.zoapp = Zoapp(config);
    this.zoapp.addControllerExtensions(Controllers(this.zoapp, config));
    this.zoapp.addPlugins(plugins(this.zoapp.pluginsManager));
    BuildRoutes(this.zoapp);
  }

  start() {
    this.zoapp.start();
  }
}

export default (config = {}) => new App(config);
