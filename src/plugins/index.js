/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
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
