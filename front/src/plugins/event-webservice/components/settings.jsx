/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "zrmc";

class EventsSettings extends Component {
  // TODO generate on server side and better securing it
  generateUDID = () => {
    let i = 0;
    let udid = "";
    while (i < 8) {
      udid += Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
      i += 1;
    }
    return udid;
  };
  constructor(props) {
    super(props);
    this.state = {};
    const settings = props.plugin.middleware;
    const defaultSettings = {
      title: "Events",
      url: "http://localhost/",
    };
    let appToken = settings ? settings.appToken : null;
    if (!appToken) {
      appToken = this.generateUDID();
    }
    let secret = settings ? settings.secret : null;
    if (!secret) {
      secret = Math.random()
        .toString(36)
        .substring(7);
    }
    this.state = {
      ...defaultSettings,
      ...settings,
      appToken,
      secret,
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
      const { title, url, secret, appToken } = this.state;

      const middlewareSettings = {
        ...this.props.plugin.middleware,
        origin: this.props.botId,
        title,
        url,
        appToken,
        classes: ["events"],
        secret,
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
          pattern="[a-zA-Z0-9\.-]+"
          label="Name"
          error="Wrong value"
          spellCheck={false}
          required
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
          spellCheck={false}
          required
          style={{ width: "100%" }}
        />
        <TextField
          name="application Token"
          value={this.state.appToken}
          defaultValue={this.state.appToken}
          onChange={this.handleInputChange}
          pattern=".+"
          label="AppToken"
          error="Wrong value"
          spellCheck={false}
          required
          style={{ width: "100%" }}
        />
        <TextField
          name="secret"
          value={this.state.secret}
          defaultValue={this.state.secret}
          onChange={this.handleInputChange}
          pattern="[a-zA-Z0-9\.-]+"
          label=" Secret phrase"
          error="Wrong value"
          spellCheck={false}
          required
          style={{ width: "100%" }}
        />
      </div>
    );
  }
}
EventsSettings.propTypes = {
  plugin: PropTypes.shape({ middleware: PropTypes.shape({}) }),
  handleSavePlugin: PropTypes.func.isRequired,
  botId: PropTypes.string,
};

export default EventsSettings;
