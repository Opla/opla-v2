/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "zrmc";

export default class WebchatSettings extends Component {
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

  static buildPublicUrl(url) {
    const regex = /^(http|https).*$/;
    if (regex.test(url) === false) {
      return `${window.location.origin}${url}`;
    }
    return url;
  }

  render() {
    this.test = "";
    const instance = this.props.plugin.middleware;
    let botUrl = "Need a first publishing";
    let token = "TOKEN";
    if (instance && instance.url) {
      const { url } = instance;
      botUrl = WebchatSettings.buildPublicUrl(url);
    }
    if (instance && instance.token) {
      ({ token } = instance);
    }
    const api = "API_URL";
    let script = "<script id='opla-webchat-script'>\r\n";
    script += ` opla = { config: { token: '${token}',url: '${api}', }};\r\n`;
    script +=
      "(function(o,p,l,a,i){a=p.createElement(l),i=p.getElementsByTagName(l)[0];";
    script += "a.async=1;a.src=o;i.parentNode.insertBefore(a,i)})";
    script +=
      "('https://opla.ai/bot/js/app.js',document,'script');\r\n</script>";
    // const container = WebchatSettings.renderCreateApp(this.props.plugin.middleware);
    /* if (this.props.instance && this.props.instance.application) {
      container = this.renderCreateApp();
    } */
    const styleContainer = {
      height: "200px",
      width: "502px",
      position: "relative",
    };
    return (
      <div>
        <div className="zui-color--white" style={styleContainer}>
          <div
            style={{
              width: "480px",
              height: "220px",
              margin: "auto",
              position: "absolute",
              left: "0px",
              right: "0px",
              bottom: "0px",
              top: "0px",
            }}
          >
            <div style={{ marginTop: "0px" }}>
              Published URL <br />
              <TextField
                onChange={() => {
                  // TODO
                }}
                style={{ width: "480px", marginTop: "0px", height: "36px" }}
                value={botUrl}
                disabled
                ref={(input) => {
                  this.fieldUrl = input;
                }}
              />
            </div>

            <div style={{ marginTop: "12px", marginBottom: "8px" }}>
              Or add this script to an html page with TOKEN and API_URL :
            </div>
            <div
              style={{
                marginTop: "0px",
                padding: "10px",
                fontSize: "10px",
                color: "black",
                background: "#eee",
              }}
            >
              <code>{script}</code>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WebchatSettings.propTypes = {
  onAction: PropTypes.func.isRequired,
  plugin: PropTypes.shape({ middleware: PropTypes.shape({}) }).isRequired,
  botId: PropTypes.string,
  handleSavePlugin: PropTypes.func.isRequired,
};
