/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "zrmc";

export default class AppSettings extends Component {
  onAction = (action) => {
    if (action === "Build") {
      // console.log("onAction Build TODO");
    }
    this.props.onAction(action);
  };

  static renderCreateApp(instance) {
    // console.log("instance=", instance);
    // const app = instance.application;
    let botUrl = "Need a first publishing";
    if (instance && instance.url) {
      let { url } = instance;
      const regex = /^(http|https).*$/;
      if (regex.test(url) === false) {
        url = `${window.location.origin}${url}`;
      }

      /* botUrl = (
        <a
          style={{
            width: "100%",
            marginBottom: "24px",
          }}
          href={url}
          target="_blank"
        >
          {url}
        </a>
      ); */
      botUrl = url;
    }
    const token = instance.token || "TOKEN";
    const api = "API_URL";
    let script = "<script>\r\n";
    script += ` opla = { config: { token: '${token}',url: '${api}', }};\r\n`;
    script +=
      "(function(o,p,l,a,i){a=p.createElement(l),i=p.getElementsByTagName(l)[0];";
    script += "a.async=1;a.src=o;i.parentNode.insertBefore(a,i)})";
    script +=
      "('https://bots.opla.ai/js/app.js',document,'script');\r\n</script>";
    return (
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
    );
  }

  render() {
    const style = {
      height: "200px",
      width: "502px",
      position: "relative",
    };
    const container = AppSettings.renderCreateApp(this.props.instance);
    /* if (this.props.instance && this.props.instance.application) {
      container = this.renderCreateApp();
    } */
    return (
      <div>
        <div className="mdl-color--grey-100" style={style}>
          {container}
        </div>
      </div>
    );
  }
}

AppSettings.propTypes = {
  onAction: PropTypes.func.isRequired,
  instance: PropTypes.shape({ application: PropTypes.shape({}) }).isRequired,
};
