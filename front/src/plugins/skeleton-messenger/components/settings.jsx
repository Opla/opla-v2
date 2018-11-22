/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "zrmc";

class SkeletonMessengerSettings extends Component {
  constructor(props) {
    super(props);

    const defaultSettings = {
      url: "demoUrl",
    };
    const settings = props.plugin.middleware;

    this.state = {
      ...defaultSettings,
      ...settings,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [name]: value,
    });
  }

  onAction = (action) => {
    if (action === "save") {
      const middleware = {
        ...this.props.plugin.middleware,
        origin: this.props.botId,
        ...this.state,
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
    return (
      <div>
        <TextField
          name="url"
          label="Skeleton url"
          value={this.state.url}
          defaultValue={this.state.url}
          onChange={this.handleInputChange}
          spellCheck={false}
          style={{ width: "320px" }}
          required
        />
      </div>
    );
  }
}
SkeletonMessengerSettings.propTypes = {
  onAction: PropTypes.func.isRequired,
  plugin: PropTypes.shape({ middleware: PropTypes.shape({}) }).isRequired,
  botId: PropTypes.string,
  handleSavePlugin: PropTypes.func.isRequired,
};

export default SkeletonMessengerSettings;
