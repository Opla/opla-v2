/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from "react";
import { Icon, Menu, MenuItem } from "zrmc";
import { Tooltip } from "zoapp-ui";
import PropTypes from "prop-types";
import MessengerBoxFooter from "./messengerBoxFooter";
import MessengerBoxInput from "./messengerBoxInput";
import MessengerBoxMessageContent from "./messengerBoxMessageContent";

class MessengerBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      sorted: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.messages !== nextProps.messages) {
      const { messages } = nextProps;
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

      if (nextProps.welcome) {
        sorted.splice(0, 0, {
          id: "welcome",
          body: nextProps.welcome,
          welcome: true,
        });
      }
      return {
        ...prevState,
        messages: nextProps.messages,
        sorted,
      };
    }
    return null;
  }

  componentDidUpdate() {
    const node = this.messengerContent;
    this.shouldScrollBottom =
      node.scrollTop + node.offsetHeight === node.scrollHeight;
    if (this.shouldScrollBottom) {
      node.scrollTop = node.scrollHeight;
    }
  }

  /**
   *
   * @param {array} array1
   * @param {array} array2
   * @param {function} isEqualCondition - This function should test if two items are equals
   */
  static areArraysEquals(array1, array2, isEqualCondition) {
    if (!array1 && !array2) {
      return true;
    }
    if (!array1) {
      return false;
    }
    if (!array2) {
      return false;
    }
    if (array1.length !== array2.length) {
      return false;
    }

    // warning: doesnt go into nested array
    for (let index = 0; index < array1.length; index += 1) {
      const item1 = array1[index];
      const item2 = array2[index];
      if (!isEqualCondition(item1, item2)) {
        return false;
      }
    }
    return true;
  }

  static areMessagesEquals(messages1, messages2) {
    return MessengerBox.areArraysEquals(
      messages1,
      messages2,
      (message1, message2) =>
        message1.id === message2.id && message1.body === message2.body,
    );
  }

  static areUsersEquals(users1, users2) {
    return MessengerBox.areArraysEquals(
      users1,
      users2,
      (user1, user2) => user1.id === user2.id,
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.intents !== this.props.intents ||
      !MessengerBox.areMessagesEquals(
        nextProps.messages,
        this.props.messages,
      ) ||
      !MessengerBox.areUsersEquals(nextProps.users, this.props.users) ||
      !MessengerBox.areMessagesEquals(nextState.sorted, this.state.sorted) ||
      !MessengerBox.areUsersEquals(nextState.users, this.state.users) ||
      nextProps.welcome !== this.props.welcome ||
      nextProps.isSelectedIntent !== this.props.isSelectedIntent
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { users } = this.props;
    const { sorted } = this.state;
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
                        <Tooltip
                          key={`cor${message.id}`}
                          label="Create output response"
                        >
                          <Icon
                            name="edit"
                            className="message-edit-icon-right"
                          />
                        </Tooltip>
                      </div>
                      <div className="message-error-container">
                        <Tooltip
                          key={`cai${message.id}`}
                          label="create an intent"
                        >
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
                        name="remove"
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
                      name={notError ? "reorder" : "add_circle"}
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
                        name={notError ? "reorder" : "add_circle"}
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
                        <MessengerBoxMessageContent
                          message={message}
                          onSendMessage={this.props.onSendMessage}
                        />
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
        <MessengerBoxFooter />
        <MessengerBoxInput onSendMessage={this.props.onSendMessage} />
      </div>
    );
  }
}

MessengerBox.defaultProps = {
  onAction: null,
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
  welcome: PropTypes.string,
  isSelectedIntent: PropTypes.bool,
};

export default MessengerBox;
