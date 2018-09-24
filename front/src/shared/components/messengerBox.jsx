/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import { TextField, Icon, Button, Menu, MenuItem } from "zrmc";
import { Tooltip } from "zoapp-ui";
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
                  outlined
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

  componentDidUpdate() {
    const node = this.messengerContent;
    this.shouldScrollBottom =
      node.scrollTop + node.offsetHeight === node.scrollHeight;
    if (this.shouldScrollBottom) {
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
      <div className="zui-cell zui-cell--4-col" style={{ margin: "0" }}>
        <div className="messenger-box">
          <div
            ref={(div) => {
              this.messengerContent = div;
            }}
            className="messenger-content messenger-content-test bounceOutRight bounceInRight"
          >
            {sorted.map((message, index) => {
              const inputText =
                message.debug &&
                message.debug.input &&
                message.debug.input.sentence
                  ? message.debug.input.sentence.text
                  : "";
              const intentCreateAction = (e) => {
                e.preventDefault();
                this.props.onAction("createIntent", inputText, message);
              };
              const intentAddInputAction = (e) => {
                e.preventDefault();
                this.props.onAction("addInput", inputText, message);
              };
              let intentActionGoto = (e) => {
                e.preventDefault();
                // TODO Goto intent
              };
              let intentActionLink = (e) => {
                e.preventDefault();
                // TODO display link
              };
              const messageEditAction = (e) => {
                e.preventDefault();
                // TODO edit message
              };
              const messageDeleteAction = (e) => {
                e.preventDefault();
                // TODO delete message
              };
              const errorResponse =
                "No matching intent. Edit this text or create one using previous message as input.";
              if (message.error || message.body.indexOf("[Error]") !== -1) {
                const from = message.from.toLowerCase();
                const user = users[from];
                let dest = "you";
                let icon = "default";
                if (user) {
                  ({ dest, icon } = user);
                }
                if (dest === "from") {
                  dest = "error";
                }
                return (
                  <div key={message.id} className={`message ${dest} ${icon}`}>
                    <div className="circle-wrapper animated bounceIn">?</div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "90%",
                      }}
                    >
                      <div className="text-wrapper animated fadeIn">
                        <div className="message-body-error">
                          {errorResponse}
                        </div>
                        <Tooltip label="Create output response">
                          <Icon
                            name="edit"
                            className="message-edit-icon-right"
                          />
                        </Tooltip>
                      </div>
                      <div className="message-error-container">
                        <Tooltip label="create an intent">
                          <a
                            href="#"
                            className="message-intent-link-error"
                            onClick={intentCreateAction}
                          >
                            Create an intent
                          </a>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                );
              } else if (message.welcome) {
                const key = `wl_${index}`;
                const editWelcomeAction = (e) => {
                  e.preventDefault();
                  this.props.onAction("welcomeMessage", message.body);
                };
                return (
                  <div
                    key={key}
                    role="presentation"
                    className="message_welcome"
                    onKeyUp={() => {}}
                    onClick={editWelcomeAction}
                  >
                    {message.body}
                    <Tooltip label="Edit welcome message">
                      <Icon
                        onClick={editWelcomeAction}
                        name="edit"
                        className="message-welcome-icon"
                      />
                    </Tooltip>
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
              let intentTooltip = "Goto intent's item";
              const notError = debug && debug.intent && debug.intent.name;
              let intentLinkClassName = "message-intent-link-error";
              let intentIconClassName = "message-intent-icon-link";
              let intentLink = "#NotFoundIntent.";
              let messageActions = "";
              if (notError) {
                intentLink = `#${debug.intent.name}.`;
                intentLinkClassName = "message-intent-link";
              } else {
                intentIconClassName = "message-intent-icon-link-error";
                intentActionLink = intentAddInputAction;
                intentActionGoto = intentCreateAction;
                intentTooltip = "Create an intent";
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
                    <Tooltip label="Delete message">
                      <Icon
                        onClick={messageDeleteAction}
                        name="clear"
                        className="message-delete-icon"
                      />
                    </Tooltip>
                    <Tooltip label="Edit message">
                      <Icon
                        onClick={messageEditAction}
                        name="edit"
                        className="message-edit-icon"
                      />
                    </Tooltip>
                  </span>
                );
              } else {
                messageActions = (
                  <Tooltip label="Edit message">
                    <Icon
                      onClick={messageEditAction}
                      name="edit"
                      className="message-edit-icon-right"
                    />
                  </Tooltip>
                );
              }

              let intentLinkButton = "";
              let intentLinkMenu;
              const intentLinkId = `intent_link_${message.id}`;

              const list = this.props.intents.map((intent) => {
                const intentName = `#${intent.name}`;
                return (
                  <MenuItem
                    disabled={notError && intent.id === debug.intent.id}
                    key={`i_${message.id}_${intent.id}`}
                  >
                    {intentName}
                  </MenuItem>
                );
              });
              list.unshift(
                <MenuItem
                  key={`i_${message.id}_new`}
                  onSelected={() => {
                    this.onButtonSelected();
                  }}
                >
                  Resolve as new intent
                </MenuItem>,
              );
              if (dest === "you" && this.props.isSelectedIntent) {
                if (notError) {
                  intentLinkMenu = (
                    <Menu target={intentLinkId} align="left">
                      {list}
                    </Menu>
                  );
                  intentLinkButton = (
                    <Icon
                      onClick={intentActionLink}
                      id={intentLinkId}
                      name={notError ? "reorder" : "add_circle_outline"}
                      className={intentIconClassName}
                      menu={intentLinkMenu}
                    />
                  );
                } else {
                  const intentLinkTooltip = "Add to current intent's inputs";
                  intentLinkButton = (
                    <Tooltip label={intentLinkTooltip}>
                      <Icon
                        onClick={intentActionLink}
                        id={intentLinkId}
                        name={notError ? "reorder" : "add_circle_outline"}
                        className={intentIconClassName}
                        menu={intentLinkMenu}
                      />
                    </Tooltip>
                  );
                }
              }
              return (
                <div key={message.id} className={`message ${dest} ${icon}`}>
                  <div className="circle-wrapper animated bounceIn" />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "90%",
                    }}
                  >
                    <div className="text-wrapper animated fadeIn">
                      <div className="message-body">
                        {this.createMessage(message)}
                      </div>
                      {messageActions}
                    </div>
                    <div className="message-debug-container">
                      <Tooltip label={intentTooltip}>
                        <a
                          href="#"
                          onClick={intentActionGoto}
                          className={intentLinkClassName}
                        >
                          {intentLink}
                        </a>
                      </Tooltip>
                      {intentLinkButton}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            height: "18px",
            textAlign: "right",
            paddingTop: "6px",
            paddingRight: "16px",
            fontSize: "10px",
            background: "white",
          }}
        >
          <a
            href="https://opla.ai"
            style={{ color: "#aaa" }}
            target="_blank"
            rel="noreferrer noopener"
          >
            Powered by Opla.ai
          </a>
        </div>
        <div className="messenger-box__actions">
          <Icon
            className="zui-button-left"
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
            className="zui-button-right"
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
  intents: [],
};

MessengerBox.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  intents: PropTypes.arrayOf(PropTypes.shape({})),
  onSendMessage: PropTypes.func.isRequired,
  onAction: PropTypes.func,
  users: PropTypes.shape({}).isRequired,
  inputValue: PropTypes.string,
  welcome: PropTypes.string,
  isSelectedIntent: PropTypes.bool,
};

export default MessengerBox;
