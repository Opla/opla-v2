/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from "fs";
import { promisify } from "util";

const plugins = async (zoapp) => {
  const readDir = promisify(fs.readdir);
  let pluginFolderList = await readDir(__dirname);
  pluginFolderList = pluginFolderList.filter((p) => p !== "index.js");
  const loadedPlugins = await Promise.all(
    pluginFolderList.map(async (pluginURI) => {
      const loadedPlugin = await import(`${__dirname}/${pluginURI}`);
      return loadedPlugin.default(zoapp);
    }),
  );

  return loadedPlugins;
};
export default plugins;
