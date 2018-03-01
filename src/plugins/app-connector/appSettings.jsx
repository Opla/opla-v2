/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";

export default class AppSettings extends Component {
  onAction = (action) => {
    if (action === "Build") {
      // console.log("onAction Build TODO");
    }
    this.props.onAction(action);
  }

  renderCreateApp() {
    const { instance } = this.props;
    // console.log("instance=", instance);
    const app = instance.application;
    let appId = "";
    let appSecret = "";
    if (app) {
      appId = app.id;
      appSecret = app.secret;
    }
    let botUrl = "";
    if (instance.url) {
      botUrl = (
        <a
          style={{
            width: "100%",
            marginBottom: "24px",
          }}
          href={instance.url}
          target="_blank"
        >{instance.url}
        </a>);
    }
    const botId = instance.origin;

    return (
      <div style={{
        width: "420px",
        height: "200px",
        margin: "auto",
        position: "absolute",
        left: "0px",
        right: "0px",
        bottom: "0px",
        top: "0px",
      }}
      >
        <div style={{ marginTop: "8px", textAlign: "center" }}>Link to webapp :</div>
        <div style={{
          width: "390px",
          paddingTop: "8px",
          margin: "auto",
        }}
        >{botUrl}
        </div>

        <div style={{ marginTop: "12px", textAlign: "center" }}>Or install SDK and set these parameters :</div>
        <div style={{
          marginTop: "0px", marginBottom: "0px", fontSize: "10px", color: "black",
        }}
        >botId : {botId}
        </div>
        <div style={{
          marginTop: "0px", marginBottom: "0px", fontSize: "10px", color: "black",
        }}
        >appId : {appId}
        </div>
        <div style={{
          marginTop: "0px", marginBottom: "12px", fontSize: "10px", color: "black",
        }}
        >appSecret : {appSecret}
        </div>

      </div>);
  }

  render() {
    const style = {
      height: "200px",
      width: "502px",
      position: "relative",
    };
    let container = <div>Loading...</div>;
    if (this.props.instance && this.props.instance.application) {
      container = this.renderCreateApp();
    }
    return (
      <div>
        <div className="mdl-color--grey-100" style={style}>
          {container}
        </div>
      </div>);
  }
}

AppSettings.propTypes = {
  onAction: PropTypes.func.isRequired,
  instance: PropTypes.shape({ application: PropTypes.shape({}) }).isRequired,
};
