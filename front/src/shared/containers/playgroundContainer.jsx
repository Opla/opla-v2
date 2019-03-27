/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Zrmc from "zrmc";
import { SubToolbar } from "zoapp-ui";

import MessengerBox from "../components/messengerBox";
import {
  apiGetSandboxMessagesRequest,
  apiUpdateSandboxMessagesRequest,
  apiSubscribeSandboxMessages,
  apiUnsubscribeSandboxMessages,
  apiSendSandboxMessageRequest,
  apiGetSandboxContextRequest,
  apiSandboxResetRequest,
  appSandboxSetSandboxConversation,
} from "../actions/api";

import FileManager from "../utils/fileManager";

class PlaygroundContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { needToSubscribe: true, isRunningDemo: false };
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
    if (this.props.selectedBot.id && this.state.needToSubscribe) {
      this.setState({ needToSubscribe: false });
      this.props.apiSubscribeSandboxMessages(this.props.selectedBotId);
    }
  }

  handleMenu = (/* action */) => {
    Zrmc.showDialog({ header: "TODO", body: "PlaygroundContainer.handleMenu" });
  };

  handleLoad = () => {
    Zrmc.showDialog({
      header: "Playground import conversation",
      body: (
        <div>
          <input
            type="file"
            onChange={({ target }) => {
              FileManager.upload(
                target.files,
                (fileConversationDataAsJSON, filetype) => {
                  const fileConversationData = JSON.parse(
                    fileConversationDataAsJSON,
                  );
                  this.setState({ fileConversationData, filetype });
                },
              );
            }}
            accept="application/json"
          />
        </div>
      ),
      actions: [{ name: "Cancel" }, { name: "Reset" }],
      onAction: () => {
        if (this.state.fileConversationData) {
          const conversation = this.state.fileConversationData;
          this.props.appSandboxSetSandboxConversation({
            conversation,
          });
        }
        return this.state.fileConversationData;
      },
    });
  };

  handleSave = () => {
    const name = "conversation";
    const data = this.props.conversation;
    const json = JSON.stringify(data, null, 2);
    FileManager.download(json, `${name}.json`, "application/json");
  };

  handleReset = () => {
    Zrmc.showDialog({
      header: "Playground",
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
    return false;
  };

  handleRefresh = () => {
    if (this.props.conversation) {
      this.props.apiUpdateSandboxMessagesRequest(
        this.props.selectedBotId,
        this.props.conversation.id,
      );
    }
  };

  handleDebug = () => {};

  handleDemo = () => {
    const conversationToDemo = this.props.conversation;
    let { messages } = conversationToDemo;

    messages = messages.sort((msg1, msg2) => {
      if (msg1.created_time < msg2.created_time) {
        return -1;
      }
      if (msg1.created_time === msg2.created_time) {
        return 0;
      }
      return 1;
    });
    conversationToDemo.messages = messages;

    const update = (msgs, time) => {
      setTimeout(() => {
        conversationToDemo.messages = msgs;
        this.props.appSandboxSetSandboxConversation({
          conversation: conversationToDemo,
        });
      }, time);
    };

    messages.forEach((message, i) => {
      const arr = messages.slice(0, i + 1);
      const numberOfChars = arr.reduce((acc, m) => acc + m.body.length, 0);
      update(arr, numberOfChars * 3.11 + i * 2000); // Total char * average typing speed + 2s per messages
    });
  };

  handleAction = (action, defaultValue, data) => {
    this.props.onAction(action, defaultValue, data);
  };

  renderMessenger(messages, users, intents) {
    const welcome =
      this.props.selectedBot.welcome ||
      "Welcome fellow user! Here you could test your assistant, before you publish it.";
    return (
      <MessengerBox
        messages={messages}
        intents={intents}
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
    if (this.props.userProfile && this.props.userProfile.username) {
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
          titleName={
            <div style={{ display: "flex" }}>
              <div>{name}</div>
            </div>
          }
          icons={[
            { name: "bug_report", onClick: this.handleDebug },
            { name: "replay", onClick: this.handleReset },
          ]}
          menu={{
            items: [
              { name: "Context", onSelect: this.handleMenu },
              { name: "Load", onSelect: this.handleLoad },
              { name: "Save", onSelect: this.handleSave },
              { name: "Reset", onSelect: this.handleReset },
              { name: "Refresh", onSelect: this.handleRefresh },
              { name: "Demo", onSelect: this.handleDemo },
              { name: "Share", disabled: true },
              { name: "Settings", disabled: true },
            ],
            align: "right",
          }}
          className="zui-panel-header-dark"
        />
        {this.renderMessenger(messages, users, this.props.intents)}
      </div>
    );
  }
}

PlaygroundContainer.propTypes = {
  conversation: PropTypes.shape({ id: PropTypes.string }),
  intents: PropTypes.arrayOf(PropTypes.shape({})),
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
  appSandboxSetSandboxConversation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { bots } = state.app;
  const sandbox = state.app ? state.app.sandbox : null;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const selectedBot = selectedBotId
    ? bots[state.app.project.selectedIndex]
    : {};
  const userProfile = state.user ? state.user.profile : {};
  let conversation = null;
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
  appSandboxSetSandboxConversation: ({ conversation }) => {
    dispatch(appSandboxSetSandboxConversation(conversation));
  },
});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlaygroundContainer);
