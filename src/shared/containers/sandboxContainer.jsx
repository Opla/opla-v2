import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DialogManager } from "zoapp-ui";
import MessengerBox from "../components/messengerBox";
import SubToolbar from "../components/subToolbar";
import {
  apiGetSandboxMessagesRequest, apiSubscribeSandboxMessages,
  apiUnsubscribeSandboxMessages, apiSendSandboxMessageRequest,
  apiGetSandboxContextRequest, apiSandboxResetRequest,
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
    console.log("UnsubscribeSandboxMessages");
    this.props.apiUnsubscribeSandboxMessages(this.props.selectedBotId);
  }

  onReset = (dialog, action) => {
    if (action === "Reset") {
      console.log("WIP", "SandboxContainer.onReset");
      this.props.apiSandboxResetRequest(this.props.selectedBotId);
    }
    return true;
  }

  subscribeSandboxMessages() {
    if (this.props.selectedBot && this.state.needToSubscribe) {
      this.setState({ needToSubscribe: false });
      console.log("SubscribeSandboxMessages");
      this.props.apiSubscribeSandboxMessages(this.props.selectedBotId);
    }
  }

  handleMenu = (action) => {
    console.log("sandboxContainer.handleMenu", action);
    DialogManager.open({ title: "TODO", content: "SandboxContainer.handleMenu" });
  }

  handleReset = () => {
    DialogManager.open({
      title: "Sandbox",
      content: "Do you want to reset conversation and context ?",
      actions: ["Reset", "Cancel"],
      onAction: this.onReset,
    });
  }

  handleSend = (messageBody) => {
    console.log("WIP", "SandboxContainer.handleSend");
    // DialogManager.open({ title:"TODO", content:"SandboxContainer.handleSend" + message});
    const body = messageBody.trim();
    if (this.props.conversation && body.length > 0) {
      const message = { message: body, timestamp: Date.now() };
      this.props.apiSendSandboxMessageRequest(
        this.props.selectedBotId,
        this.props.conversation.id, message,
      );
      return true;
    }
    console.log("Error", "SandboxContainer.handleSend", this.props.conversation, body.length);
    return false;
  }

  handleDemo = () => {

  }

  handleShare = () => {

  }

  handleSettings = () => {

  }

  handleAction = (action, defaultValue, data) => {
    console.log("sandboxContainer.handleAction", action);
    this.props.onAction(action, defaultValue, data);
  }

  renderMessenger(messages, users) {
    // TODO get welcome from bot
    const welcome = this.props.selectedBot.welcome || "Welcome fellow user! Here you could test your assistant, before you publish it.";
    return (<MessengerBox
      messages={messages}
      users={users}
      onSendMessage={this.handleSend}
      onAction={this.handleAction}
      welcome={welcome}
      isSelectedIntent={this.props.isSelectedIntent}
    />);
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
      const userName = (this.props.userProfile.username).toLowerCase();
      users[userName] = {
        id: this.props.selectedBot.id, name: userName, dest: "you", icon: this.props.userProfile.avatar,
      };
    } else {
      users.anonymous = {
        id: "1", name: "anonymous", dest: "you", icon: "default",
      };
    }
    if (this.props.selectedBot) {
      const bot = this.props.selectedBot;
      const botName = (`bot_${bot.name}_${bot.id}`).toLowerCase();
      users[botName] = {
        id: this.props.selectedBot.id, name: botName, dest: "from", icon: botName,
      };
      if (botName !== "opla") {
        users.opla = users[botName];
      }
    } else {
      users.bot = {
        id: "2", name: "bot", dest: "from", icon: "bot",
      };
    }
    return (
      <div>
        <SubToolbar
          titleIcon="chat"
          titleName={name}
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
        />
        {this.renderMessenger(messages, users)}
      </div>);
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
  selectedBot: PropTypes.shape({ id: PropTypes.string, welcome: PropTypes.string }),
  userProfile: PropTypes.shape({ username: PropTypes.string, avatar: PropTypes.string }),
  isSelectedIntent: PropTypes.bool,
  onAction: PropTypes.func.isRequired,
  apiSubscribeSandboxMessages: PropTypes.func.isRequired,
  apiUnsubscribeSandboxMessages: PropTypes.func.isRequired,
  apiSendSandboxMessageRequest: PropTypes.func.isRequired,
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
  const isSelectedIntent = !!(state.app.intents &&
    state.app.intents.length > 0 && Number.isInteger(state.app.selectedIntentIndex));

  if (sandbox && sandbox.conversations) {
    conversation = sandbox.conversations.length > 0 ? sandbox.conversations[0] : { messages: [] };
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

const mapDispatchToProps = dispatch => ({
  apiGetSandboxMessagesRequest: (botId) => {
    dispatch(apiGetSandboxMessagesRequest(botId));
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
