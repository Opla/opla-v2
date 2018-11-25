/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import createApp from "./app";

const fs = require("fs");

// load config.json configuration if present.
function loadConfig(path) {
  let config = {};
  try {
    logger.info("loading configuration file: ", path);
    config = JSON.parse(fs.readFileSync(path));
  } catch (error) {
    logger.error(
      `config.json file not found
      Please run "bin/opla init" to generate it.`,
    );
    throw error;
  }
  return config;
}

// path for dev version
let configPath = `${__dirname}/../config.json`;
if (!fs.existsSync(configPath)) {
  // path for compiled version
  configPath = `${__dirname}/config.json`;
}

const config = loadConfig(configPath);
createApp(config).start();
