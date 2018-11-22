/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 *
 * @param {array} plugins
 * @returns {object} installedPlugins
 * Extract plugins with multiple middlewares into
 * plugins with only one middleware
 */
// eslint-disable-next-line
export function getInstalledPlugins(plugins) {
  const installedPlugins = {
    // WebService: [],
    // MessengerConnector: [],
    // ...
  };

  plugins.forEach((plugin) => {
    if (plugin.middlewares) {
      plugin.middlewares.forEach((middleware) => {
        if (!installedPlugins[plugin.type]) {
          installedPlugins[plugin.type] = [];
        }
        installedPlugins[plugin.type].push({
          ...plugin,
          middleware,
          middlewares: undefined,
        });
      });
    }
  });
  return installedPlugins;
}
