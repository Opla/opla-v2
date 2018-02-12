import React, { Component } from "react";
import PropTypes from "prop-types";
import { Textfield, IconButton } from "react-mdl";

export default class FBSettings extends Component {
  onAction = (action) => {
    if (action === "Manual") {
      // TODO
    }
    this.props.onAction(action);
  }

  render() {
    const instance = this.props.instance || {};
    const style = {
      width: "502px",
      position: "relative",
    };
    // TODO set better patterns
    return (
      <div style={style}>
        <div>
          <Textfield
            label="Bot name"
            pattern="[a-zA-Z0-9\.-]+"
            value={instance.botName}
            floatingLabel
            onChange={() => { }}
            spellCheck={false}
            style={{ width: "320px" }}
            required
            ref={(input) => { this.tfBotName = input; }}
          />
          <Textfield
            label="Page Access Token"
            pattern="[a-zA-Z0-9\.-]+"
            floatingLabel
            value={instance.accessToken}
            onChange={() => { }}
            spellCheck={false}
            style={{ width: "320px" }}
            required
            ref={(input) => { this.tfAccessToken = input; }}
          />
          <Textfield
            label="Verify Token"
            pattern="[a-zA-Z0-9\.-]+"
            floatingLabel
            value={instance.verifyToken}
            onChange={() => { }}
            spellCheck={false}
            style={{ width: "320px" }}
            required
            ref={(input) => { this.tfVerifyToken = input; }}
          />
          <div style={{ width: "360px" }}><Textfield
            label="Callback url"
            floatingLabel
            spellCheck={false}
            error="You need an https public url !"
            style={{ width: "320px" }}
            disabled
            ref={(input) => { this.tfCallback = input; }}
          /><IconButton name="mode_edit" />
          </div>
        </div>
        <div style={{
          backgroundColor: "rgba(252, 234, 32, 0.4)", width: "478px", marginTop: "24px", padding: "12px",
        }}
        >
          <i
            className="material-icons"
            style={{ float: "right", color: "gray", marginTop: "-2px" }}
          >help_outline
          </i>
          <a
            style={{ color: "gray" }}
            href="https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup"
            target="_blank"
            rel="noopener noreferrer"
          >How to setup Facebook messenger
          </a>
        </div>
      </div>);
  }
}

FBSettings.defaultProps = {
  instance: null,
  onAction: () => { },
};

FBSettings.propTypes = {
  instance: PropTypes.shape({}),
  onAction: PropTypes.func,
};
