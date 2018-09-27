/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from "react";
import { TextField, Icon } from "zrmc";
import PropTypes from "prop-types";

class MessengerBoxInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: props.message,
    };
    this.textFieldRef = React.createRef();
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  handleSendMessage() {
    this.props.onSendMessage(this.textFieldRef.current.inputRef.value);
    this.textFieldRef.current.inputRef.value = "";
    // this.setState({ message: undefined });
  }

  render() {
    return (
      <div className="messenger-box__actions">
        <Icon
          className="zui-button-left"
          onClick={(e) => {
            e.preventDefault();
          }}
          name="add"
        />
        <TextField
          name="message"
          type="text"
          id="chat-input-field"
          label="Your message"
          style={{ width: "30vw", height: "18px", margin: "8px" }}
          noFloatingLabel
          ref={this.textFieldRef}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              this.handleSendMessage();
              e.preventDefault();
            }
          }}
        />
        <Icon
          className="zui-button-right"
          /* colored */
          onClick={(e) => {
            e.preventDefault();
            this.handleSendMessage();
          }}
          name="send"
        />
      </div>
    );
  }
}

MessengerBoxInput.defaultProps = {
  message: "",
};

MessengerBoxInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  message: PropTypes.string,
};

export default MessengerBoxInput;
