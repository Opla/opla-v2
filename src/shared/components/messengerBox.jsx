/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import { TextField, Icon, Button } from "zrmc";
import PropTypes from "prop-types";

class MessengerBox extends Component {
  static createMessage(message) {
    return { __html: message.body };
  }

  componentWillUpdate() {
    const node = this.messengerContent;
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      const node = this.messengerContent;
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    const {
      messages, users, onSendMessage, welcome, inputValue = "",
    } = this.props;
    let sorted = null;
    if (messages && Array.isArray(messages)) {
      sorted = [...messages];
      sorted = sorted.sort((msg1, msg2) => {
        if (msg1.timestamp < msg2.timestamp) {
          return -1;
        }
        if (msg1.timestamp === msg2.timestamp) {
          return 0;
        }
        return 1;
      });
    } else {
      sorted = [];
    }
    if (welcome) {
      sorted.splice(0, 0, { id: "welcome", body: welcome, welcome: true });
    }
    let chatInput = inputValue;
    return (
      <div className="mdl-cell mdl-cell--4-col messenger-box-test">
        <div className="messenger-box">
          <div
            ref={(div) => { this.messengerContent = div; }}
            className="messenger-content messenger-content-test bounceOutRight bounceInRight"
          >
            {sorted.map((message, index) => {
              if (message.error) {
                const inputText = message.input.text;
                let buttons = (
                  <div>
                    <Button
                      raised
                      onClick={(e) => { e.preventDefault(); this.props.onAction("createIntent", inputText, message); }}
                    >create intent
                    </Button>
                  </div>);
                if (this.props.isSelectedIntent) {
                  buttons = (
                    <div>
                      <Button
                        raised
                        onClick={(e) => { e.preventDefault(); this.props.onAction("createIntent", inputText, message); }}
                      >create intent
                      </Button>
                      <Button
                        raised
                        onClick={(e) => { e.preventDefault(); this.props.onAction("addInput", inputText); }}
                      >add input
                      </Button>
                    </div>);
                }
                return (
                  <div key={message.id} className="message_error">
                    <div className="message_error_header">
                      <strong>Oh snap ! </strong>
                      I can&quot;t associate an intent with previous input.
                    </div>
                    {buttons}
                  </div>);
              } else if (message.welcome) {
                const key = `wl_${index}`;
                return (
                  <div
                    key={key}
                    role="presentation"
                    className="message_welcome"
                    onKeyUp={() => { }}
                    onClick={(e) => { e.preventDefault(); this.props.onAction("welcomeMessage", message.body); }}
                  >{message.body}
                  </div>);
              }
              const from = message.from.toLowerCase();
              const user = users[from];
              // // console.log("from=", from, user);
              let dest = "you";
              let icon = "default";
              if (user) {
                ({ dest, icon } = user);
              }
              // previous = message;
              /* eslint-disable react/no-danger */
              return (
                <div key={message.id} className={`message ${dest} ${icon}`}>
                  <div className="circle-wrapper animated bounceIn" />
                  <div
                    className="text-wrapper animated fadeIn"
                    dangerouslySetInnerHTML={MessengerBox.createMessage(message)}
                  />
                </div>
              );
              /* eslint-enable react/no-danger */
            })}
          </div>
        </div>
        <div className="messenger-box__actions">
          <Icon className="mdl-button-left" onClick={(e) => { e.preventDefault(); }} name="add" />
          <Icon className="mdl-button-left" onClick={(e) => { e.preventDefault(); }} name="mic" />
          <TextField
            type="text"
            id="chat-input-field"
            label="Your message"
            style={{ width: "440px", height: "24px", margin: "6px 8px" }}
            noFloatingLabel
            ref={(input) => { chatInput = input; }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                if (onSendMessage && onSendMessage(chatInput.inputRef.value)) {
                  chatInput.inputRef.value = "";
                }
                e.preventDefault();
              }
            }}
          />
          <Icon
            className="mdl-button-right"
            /* colored */
            onClick={(e) => {
              e.preventDefault();
              if (onSendMessage && onSendMessage(chatInput.inputRef.value)) {
                chatInput.inputRef.value = "";
              }
            }}
            name="send"
          />
        </div>
      </div>
    );
  }
}

MessengerBox.defaultProps = {
  onAction: null,
  inputValue: null,
  welcome: "",
  isSelectedIntent: false,
};

MessengerBox.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  onAction: PropTypes.func,
  users: PropTypes.shape({}).isRequired,
  inputValue: PropTypes.string,
  welcome: PropTypes.string,
  isSelectedIntent: PropTypes.bool,
};

export default MessengerBox;
