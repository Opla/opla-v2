// TODO remove import and use dynamic loading
import AppMessengerPlugin from "./web-app";

const plugins = (pluginsManager) => {
  const list = [];
  // TODO dynamic loading
  const plugin = AppMessengerPlugin(pluginsManager);
  list.push(plugin);
  return list;
};
export default plugins;
