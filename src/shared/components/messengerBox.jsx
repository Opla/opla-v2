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
  createMessage(message) {
    let html = null;
    if (message.body && message.body.indexOf("<b") >= 0) {
      /* eslint-disable no-restricted-syntax */
      const elements = [];
      let tag = false;
      let end = false;
      let buf = "";
      let element = {};
      for (const ch of message.body) {
        if (ch === "<") {
          if (tag) {
            element.value = buf;
            buf = "";
          } else {
            if (buf.length > 0) {
              elements.push({ value: buf, type: "text" });
            }
            buf = "";
            tag = true;
            end = false;
            element = {};
          }
        } else if (ch === "/" && tag) {
          end = true;
        } else if (end && ch === ">") {
          // <tag /> or </tag>
          element.type = buf.trim();
          elements.push(element);
          element = {};
          tag = false;
          buf = "";
        } else if (tag && ch === ">") {
          element.type = buf.trim();
          buf = "";
        } else {
          buf += ch;
        }
      }
      if (buf.length > 0) {
        elements.push({ value: buf, type: "text" });
      }
      html = (
        <span>
          {elements.map((el, i) => {
            // button and br
            // TODO link / img
            if (el.type === "button") {
              return (
                <Button
                  key={i}
                  style={{ margin: " 0 8px" }}
                  dense
                  raised
                  onClick={(e) => {
                    e.preventDefault();
                    if (el.value) {
                      this.props.onSendMessage(el.value);
                    }
                  }}
                >
                  {el.value}
                </Button>
              );
            } else if (el.type === "br") {
              return <br key={i} />;
            }
            return el.value;
          })}
        </span>
      );
      /* eslint-enable no-restricted-syntax */
    } else {
      html = <span>{message.body}</span>;
    }
    return html;
  }

  componentWillUpdate() {
    const node = this.messengerContent;
    this.shouldScrollBottom =
      node.scrollTop + node.offsetHeight === node.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      const node = this.messengerContent;
      node.scrollTop = node.scrollHeight;
    }
  }

  render() {
    const {
      messages,
      users,
      onSendMessage,
      welcome,
      inputValue = "",
    } = this.props;
    let sorted = null;
    if (messages && Array.isArray(messages)) {
      sorted = [...messages];
      sorted = sorted.sort((msg1, msg2) => {
        if (msg1.created_time < msg2.created_time) {
          return -1;
        }
        if (msg1.created_time === msg2.created_time) {
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
      <div
        className="mdl-cell mdl-cell--4-col mdc-elevation--z1"
        style={{ margin: "0 8px" }}
      >
        <div className="messenger-box">
          <div
            ref={(div) => {
              this.messengerContent = div;
            }}
            className="messenger-content messenger-content-test bounceOutRight bounceInRight"
          >
            {sorted.map((message, index) => {
              if (message.error || message.body.indexOf("[Error]") !== -1) {
                /* const inputText = message.input ? message.input.text : "";
                let buttons = (
                  <div>
                    <Button
                      raised
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.onAction("createIntent", inputText, message);
                      }}
                    >
                      create intent
                    </Button>
                  </div>
                );
                if (this.props.isSelectedIntent) {
                  buttons = (
                    <div>
                      <Button
                        raised
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onAction(
                            "createIntent",
                            inputText,
                            message,
                          );
                        }}
                      >
                        create intent
                      </Button>
                      <Button
                        raised
                        onClick={(e) => {
                          e.preventDefault();
                          this.props.onAction("addInput", inputText);
                        }}
                      >
                        add input
                      </Button>
                    </div>
                  );
                } */
                const from = message.from.toLowerCase();
                const user = users[from];
                let dest = "you";
                let icon = "default";
                if (user) {
                  ({ dest, icon } = user);
                }
                return (
                  <div key={message.id} className={`message ${dest} ${icon}`}>
                    <div className="circle-wrapper animated bounceIn" />
                    <div className="text-wrapper animated fadeIn">
                      <div className="message-body-error">
                        I don&apos;t understand. You need to write a response
                        here, and I will create an intent with previous message.
                      </div>
                      <span>
                        <Icon name="edit" className="message-edit-icon-right" />
                      </span>
                      <div className="message-error-container">
                        <a href="#" className="message-intent-link-error">
                          #UnknownIntent.output
                        </a>
                      </div>
                    </div>
                  </div>
                );
              } else if (message.welcome) {
                const key = `wl_${index}`;
                return (
                  <div
                    key={key}
                    role="presentation"
                    className="message_welcome"
                    onKeyUp={() => {}}
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.onAction("welcomeMessage", message.body);
                    }}
                  >
                    {message.body}
                  </div>
                );
              }
              const from = message.from.toLowerCase();
              const user = users[from];
              let dest = "you";
              let icon = "default";
              if (user) {
                ({ dest, icon } = user);
              }
              const { debug } = message;
              const notError = debug && debug.intent && debug.intent.name;
              let intentLinkClassName = "message-intent-link-error";
              let intentIconClassName = "message-intent-icon-link";
              let intentLink = "#NotFoundIntent.";
              let intentHint = "";
              let messageActions = "";
              if (notError) {
                intentLink = `#${debug.intent.name}.`;
                intentLinkClassName = "message-intent-link";
              } else {
                intentHint = (
                  <span className="message-intent-hint">
                    &lt;- Link to an intent
                  </span>
                );
                intentIconClassName = "message-intent-icon-link-error";
              }
              intentLink += dest === "you" ? "input" : ".output";
              if (notError) {
                intentLink += ".";
                intentLink +=
                  dest === "you" ? debug.input.index : debug.output.index;
              }
              if (dest === "you") {
                messageActions = (
                  <span>
                    <Icon name="clear" className="message-delete-icon" />
                    <Icon name="edit" className="message-edit-icon" />
                  </span>
                );
              } else {
                messageActions = (
                  <span>
                    <Icon name="edit" className="message-edit-icon-right" />
                  </span>
                );
              }
              const intentLinkButton =
                dest === "you" ? (
                  <span>
                    <Icon name="link" className={intentIconClassName} />
                    {intentHint}
                  </span>
                ) : (
                  ""
                );
              return (
                <div key={message.id} className={`message ${dest} ${icon}`}>
                  <div className="circle-wrapper animated bounceIn" />
                  <div className="text-wrapper animated fadeIn">
                    <div className="message-body">
                      {this.createMessage(message)}
                    </div>
                    {messageActions}
                    <div className="message-debug-container">
                      <a href="#" className={intentLinkClassName}>
                        {intentLink}
                      </a>
                      {intentLinkButton}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="messenger-box__actions">
          <Icon
            className="mdl-button-left"
            onClick={(e) => {
              e.preventDefault();
            }}
            name="add"
          />
          <TextField
            type="text"
            id="chat-input-field"
            label="Your message"
            style={{ width: "30vw", height: "18px", margin: "8px" }}
            noFloatingLabel
            ref={(input) => {
              chatInput = input;
            }}
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
