/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
// TODO remove import and use dynamic loading
import createWebChatPlugin from "./webchat";
import createOpenNLXConnector from "./openNLX";
import FBMessengerPlugin from "./fb-messenger";

const plugins = (zoapp) => {
  const list = [];
  // TODO dynamic loading
  let plugin = createWebChatPlugin(zoapp);
  list.push(plugin);
  plugin = createOpenNLXConnector(zoapp);
  list.push(plugin);
  list.push(FBMessengerPlugin());
  return list;
};
export default plugins;
