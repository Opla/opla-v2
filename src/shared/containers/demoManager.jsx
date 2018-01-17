import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Content } from "react-mdl";
import { apiGetIntentsRequest, apiSendIntentRequest } from "../actions/api";
import SignInForm from "./signInForm";
import SandboxContainer from "./sandboxContainer";
import { appSetTitle } from "../actions/app";


class DemoManager extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentWillMount() {
    this.props.appSetTitle("Demo");
  }

  componentDidUpdate() {
  }

  render() {
    let { isLoading } = this.props;
    if ((!isLoading) && (!this.props.intents) && this.props.isSignedIn) {
      isLoading = true;
    }
    if (!this.props.isSignedIn) {
      return (<SignInForm />);
    }
    return (
      <Content className="mdl-color--grey-100">
        <SandboxContainer />
      </Content>
    );
  }
}

DemoManager.defaultProps = {
  intents: null,
};

DemoManager.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  intents: PropTypes.arrayOf(PropTypes.shape({})),
  appSetTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const bot = selectedBotId ? admin.bots[selectedBotId] : null;
  const intents = state.app.intents ? state.app.intents : null;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.app ? state.app.loading : false;
  return {
    selectedBotId, bot, intents, isLoading, isSignedIn,
  };
};

const mapDispatchToProps = dispatch => ({
  apiGetIntentsRequest: (botId) => {
    dispatch(apiGetIntentsRequest(botId));
  },
  appSetTitle: (titleName) => {
    dispatch(appSetTitle(titleName));
  },
  apiSendIntentRequest: (botId, intent) => {
    dispatch(apiSendIntentRequest(botId, intent));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DemoManager);
