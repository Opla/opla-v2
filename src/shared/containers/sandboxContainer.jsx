/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Zrmc, { Icon } from "zrmc";
import { SubToolbar, Tooltip } from "zoapp-ui";

import MessengerBox from "../components/messengerBox";
import {
  apiGetSandboxMessagesRequest,
  apiUpdateSandboxMessagesRequest,
  apiSubscribeSandboxMessages,
  apiUnsubscribeSandboxMessages,
  apiSendSandboxMessageRequest,
  apiGetSandboxContextRequest,
  apiSandboxResetRequest,
} from "../actions/api";

class SandboxContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { needToSubscribe: true };
  }

  componentDidMount() {
    this.subscribeSandboxMessages();
  }

  componentDidUpdate() {
    this.subscribeSandboxMessages();
  }

  componentWillUnmount() {
    this.props.apiUnsubscribeSandboxMessages(this.props.selectedBotId);
  }

  onReset = (dialog, action) => {
    if (action === "Reset") {
      this.props.apiSandboxResetRequest(this.props.selectedBotId);
    }
    return true;
  };

  subscribeSandboxMessages() {
    if (this.props.selectedBot && this.state.needToSubscribe) {
      this.setState({ needToSubscribe: false });
      this.props.apiSubscribeSandboxMessages(this.props.selectedBotId);
    }
  }

  handleMenu = (/* action */) => {
    Zrmc.showDialog({ header: "TODO", body: "SandboxContainer.handleMenu" });
  };

  handleReset = () => {
    Zrmc.showDialog({
      header: "Sandbox",
      body: "Do you want to reset conversation and context ?",
      actions: [{ name: "Cancel" }, { name: "Reset" }],
      onAction: this.onReset,
    });
  };

  handleSend = (messageBody) => {
    const body = messageBody.trim();
    if (this.props.conversation && body.length > 0) {
      const message = { message: body, timestamp: Date.now() };
      this.props.apiSendSandboxMessageRequest(
        this.props.selectedBotId,
        this.props.conversation.id,
        message,
      );
      return true;
    }
    // console.log("Error", "SandboxContainer.handleSend", this.props.conversation, body.length);
    return false;
  };

  handleRefresh = (e) => {
    e.preventDefault();
    if (this.props.conversation) {
      this.props.apiUpdateSandboxMessagesRequest(
        this.props.selectedBotId,
        this.props.conversation.id,
      );
    }
  };

  handleDemo = () => {};

  handleShare = () => {};

  handleSettings = () => {};

  handleAction = (action, defaultValue, data) => {
    this.props.onAction(action, defaultValue, data);
  };

  renderMessenger(messages, users) {
    const welcome =
      this.props.selectedBot.welcome ||
      "Welcome fellow user! Here you could test your assistant, before you publish it.";
    return (
      <MessengerBox
        messages={messages}
        users={users}
        onSendMessage={this.handleSend}
        onAction={this.handleAction}
        welcome={welcome}
        isSelectedIntent={this.props.isSelectedIntent}
      />
    );
  }

  render() {
    const name = "Playground";
    let messages = null;
    if (this.props.conversation) {
      ({ messages } = this.props.conversation);
    } else {
      messages = [];
    }
    const users = {};
    if (this.props.userProfile) {
      const userName = this.props.userProfile.username.toLowerCase();
      users[userName] = {
        id: this.props.selectedBot.id,
        name: userName,
        dest: "you",
        icon: this.props.userProfile.avatar,
      };
    } else {
      users.anonymous = {
        id: "1",
        name: "anonymous",
        dest: "you",
        icon: "default",
      };
    }
    if (this.props.selectedBot) {
      const bot = this.props.selectedBot;
      const botName = `bot_${bot.name}_${bot.id}`.toLowerCase();
      users[botName] = {
        id: this.props.selectedBot.id,
        name: botName,
        dest: "from",
        icon: botName,
      };
      if (botName !== "opla") {
        users.opla = users[botName];
      }
    } else {
      users.bot = {
        id: "2",
        name: "bot",
        dest: "from",
        icon: "bot",
      };
    }
    return (
      <div>
        <SubToolbar
          titleIcon="chat"
          titleName={
            <div style={{ display: "flex" }}>
              <div
                style={{ borderRight: "1px solid #ddd", paddingRight: "24px" }}
              >
                {name}
              </div>
              <div
                style={{
                  padding: "6px 16px",
                  height: "24px",
                  cursor: "pointer",
                }}
              >
                <Tooltip label="refresh">
                  <Icon name="refresh" onClick={this.handleRefresh} />
                </Tooltip>
              </div>
            </div>
          }
          menu={{
            items: [
              { name: "Context", onSelect: this.handleMenu },
              { name: "Load", disabled: true },
              { name: "Save", disabled: true },
              { name: "Reset", onSelect: this.handleReset },
              { name: "Demo", onSelect: this.handleDemo },
              { name: "Share", onSelect: this.handleShare },
              { name: "Settings", onSelect: this.handleSettings },
            ],
            align: "right",
          }}
          className="mdc-elevation--z1"
          style={{ margin: "8px 8px 0" }}
        />
        {this.renderMessenger(messages, users)}
      </div>
    );
  }
}

SandboxContainer.defaultProps = {
  conversation: null,
  selectedBotId: PropTypes.string,
  selectedBot: PropTypes.shape({}),
  userProfile: PropTypes.shape({}),
  isSelectedIntent: PropTypes.bool,
};

SandboxContainer.propTypes = {
  conversation: PropTypes.shape({ id: PropTypes.string }),
  selectedBotId: PropTypes.string,
  selectedBot: PropTypes.shape({
    id: PropTypes.string,
    welcome: PropTypes.string,
  }),
  userProfile: PropTypes.shape({
    username: PropTypes.string,
    avatar: PropTypes.string,
  }),
  isSelectedIntent: PropTypes.bool,
  onAction: PropTypes.func.isRequired,
  apiSubscribeSandboxMessages: PropTypes.func.isRequired,
  apiUnsubscribeSandboxMessages: PropTypes.func.isRequired,
  apiSendSandboxMessageRequest: PropTypes.func.isRequired,
  apiUpdateSandboxMessagesRequest: PropTypes.func.isRequired,
  apiSandboxResetRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const sandbox = state.app ? state.app.sandbox : null;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  // TODO get Bot associated with selectedBotId
  const selectedBot = selectedBotId ? state.app.admin.bots[0] : null;
  const userProfile = state.user ? state.user.profile : null;
  let conversation = null;
  /* const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.loading; */
  const isSelectedIntent = !!(
    state.app.intents &&
    state.app.intents.length > 0 &&
    Number.isInteger(state.app.selectedIntentIndex)
  );

  if (sandbox && sandbox.conversations) {
    conversation =
      sandbox.conversations.length > 0
        ? sandbox.conversations[0]
        : { messages: [] };
  }
  return {
    sandbox,
    conversation,
    selectedBotId,
    selectedBot,
    userProfile,
    isSelectedIntent,
  };
};

const mapDispatchToProps = (dispatch) => ({
  apiGetSandboxMessagesRequest: (botId) => {
    dispatch(apiGetSandboxMessagesRequest(botId));
  },
  apiUpdateSandboxMessagesRequest: (botId) => {
    dispatch(apiUpdateSandboxMessagesRequest(botId));
  },
  apiSubscribeSandboxMessages: (botId) => {
    dispatch(apiSubscribeSandboxMessages(botId));
  },
  apiUnsubscribeSandboxMessages: (botId) => {
    dispatch(apiUnsubscribeSandboxMessages(botId));
  },
  apiSendSandboxMessageRequest: (botId, conversationId, message) => {
    dispatch(apiSendSandboxMessageRequest(botId, conversationId, message));
  },
  apiGetSandboxContextRequest: (botId) => {
    dispatch(apiGetSandboxContextRequest(botId));
  },
  apiSandboxResetRequest: (botId) => {
    dispatch(apiSandboxResetRequest(botId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SandboxContainer);
