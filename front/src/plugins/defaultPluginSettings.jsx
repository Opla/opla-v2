/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";

class DefaultPluginSettings extends Component {
  onAction = (action) => {
    if (action === "save") {
      const middleware = {
        ...this.props.plugin.middleware,
        origin: this.props.botId,
      };
      const newPlugin = {
        ...this.props.plugin,
        middleware,
      };
      this.props.handleSavePlugin(newPlugin);
    }
  };
  // eslint-disable-next-line
  render() {
    return <div>This plugin doesnt require settings</div>;
  }
}
DefaultPluginSettings.propTypes = {
  plugin: PropTypes.shape({ middleware: PropTypes.shape({}) }).isRequired,
  botId: PropTypes.string,
  handleSavePlugin: PropTypes.func.isRequired,
};

export default DefaultPluginSettings;
