/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import createApp from "./app";

const fs = require("fs");

// load config/default.json configuration if present.
function loadConfig(path) {
  let config = {};
  try {
    config = JSON.parse(fs.readFileSync(path));
  } catch (error) {
    logger.error(
      `config/default.json file not found
      Please run "bin/opla init" to generate it.`,
    );
    throw error;
  }
  return config;
}

const configPath = `${__dirname}/config/default.json`;
logger.info("loading configuration file: ", configPath);
const config = loadConfig(configPath);
createApp(config).start();
