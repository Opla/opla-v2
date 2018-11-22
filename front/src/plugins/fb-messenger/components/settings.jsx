/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField, Icon } from "zrmc";

class FBSettings extends Component {
  constructor(props) {
    super(props);
    const settings = props.plugin.middleware;
    // const { name, title, icon, color, url, type, origin } = props.plugin;
    const defaultSettings = {
      botName: "facebookbot",
      accessToken: "accessToken",
      url: "url://",
      verifyToken: Math.random()
        .toString(36)
        .substring(2),
      classes: ["messenger", "bot", "sandbox"],
    };
    const mergedSettings = {
      ...defaultSettings,
      ...settings,
    };

    this.state = {
      botName: mergedSettings.botName,
      accessToken: mergedSettings.accessToken,
      url: mergedSettings.url,
      verifyToken: mergedSettings.verifyToken,
      classes: mergedSettings.classes,
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
      const middlewareSettings = {
        ...this.props.plugin.middleware,
        origin: this.props.botId,
        // status: "plugin2",
        ...this.state,
      };
      const newPlugin = {
        ...this.props.plugin,
        middleware: middlewareSettings,
      };
      this.props.handleSavePlugin(newPlugin);
    }
  };

  render() {
    const style = {
      width: "502px",
      position: "relative",
    };
    // TODO set better patterns
    return (
      <div style={style}>
        <div>
          <TextField
            name="botName"
            label="Bot name"
            pattern="[a-zA-Z0-9\.-]+"
            value={this.state.botName}
            defaultValue={this.state.botName}
            onChange={this.handleInputChange}
            spellCheck={false}
            style={{ width: "320px" }}
            required
            ref={(input) => {
              this.tfBotName = input;
            }}
          />
          <TextField
            name="accessToken"
            label="Page Access Token"
            pattern="[a-zA-Z0-9\.-]+"
            defaultValue={this.state.accessToken}
            value={this.state.accessToken}
            onChange={this.handleInputChange}
            spellCheck={false}
            style={{ width: "320px" }}
            required
            ref={(input) => {
              this.tfAccessToken = input;
            }}
          />
          <TextField
            name="verifyToken"
            label="Verify Token"
            pattern="[a-zA-Z0-9\.-]+"
            defaultValue={this.state.verifyToken}
            value={this.state.verifyToken}
            onChange={this.handleInputChange}
            spellCheck={false}
            style={{ width: "320px" }}
            required
            ref={(input) => {
              this.tfVerifyToken = input;
            }}
          />
          <div style={{ width: "360px" }}>
            <TextField
              label="Callback url"
              spellCheck={false}
              defaultValue={this.state.url}
              value={this.state.url}
              error="You need an https public url !"
              style={{ width: "320px" }}
              disabled
              ref={(input) => {
                this.tfCallback = input;
              }}
            />
            <Icon name="mode_edit" />
          </div>
        </div>
        <div
          style={{
            backgroundColor: "rgba(252, 234, 32, 0.4)",
            width: "478px",
            marginTop: "24px",
            padding: "12px",
          }}
        >
          <i
            className="material-icons"
            style={{ float: "right", color: "gray", marginTop: "-2px" }}
          >
            help_outline
          </i>
          <a
            style={{ color: "gray" }}
            href="https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup"
            target="_blank"
            rel="noopener noreferrer"
          >
            How to setup Facebook messenger
          </a>
        </div>
      </div>
    );
  }
}

FBSettings.propTypes = {
  plugin: PropTypes.shape({ middleware: PropTypes.shape({}) }),
  botId: PropTypes.string,
  handleSavePlugin: PropTypes.func.isRequired,
};

export default FBSettings;
