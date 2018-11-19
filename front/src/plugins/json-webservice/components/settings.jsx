/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "zrmc";

class JSONWebserviceSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const settings = props.plugin.middleware;
    const defaultSettings = {
      title: "test",
      url: "",
    };

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
      // create middleware with settings
      const middlewareSettings = {
        ...this.props.plugin.middleware,
        origin: this.props.botId,
        ...this.state,
      };
      // set this middleware to new plugin
      const newPlugin = {
        ...this.props.plugin,
        middleware: middlewareSettings,
      };
      this.props.handleSavePlugin(newPlugin);
    }
  };

  render() {
    return (
      <div>
        <TextField
          name="title"
          value={this.state.title}
          defaultValue={this.state.title}
          onChange={this.handleInputChange}
          pattern=".+"
          label="Title"
          error="Wrong value"
          style={{ width: "100%" }}
        />
        <TextField
          name="url"
          value={this.state.url}
          defaultValue={this.state.url}
          onChange={this.handleInputChange}
          pattern=".+"
          label="Url"
          error="Wrong value"
          style={{ width: "100%" }}
        />
      </div>
    );
  }
}
JSONWebserviceSettings.propTypes = {
  plugin: PropTypes.shape({ middleware: PropTypes.shape({}) }),
  handleSavePlugin: PropTypes.func.isRequired,
  botId: PropTypes.string,
};

export default JSONWebserviceSettings;
