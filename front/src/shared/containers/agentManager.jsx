/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid, Inner, Cell } from "zrmc";
import Loading from "zoapp-front/components/loading";
import SignInForm from "zoapp-front/containers/signInForm";

import ExplorerContainer from "./explorerContainer";
import IntentContainer from "./builder/intentContainer";
import EntityContainer from "./builder/entityContainer";
import FunctionContainer from "./builder/functionContainer";

class AgentManager extends Component {
  render() {
    let { isLoading } = this.props;
    if (!isLoading && !this.props.intents && this.props.isSignedIn) {
      isLoading = true;
    }
    if (!this.props.isSignedIn) {
      return <SignInForm />;
    } else if (this.props.intents == null) {
      return <Loading />;
    }
    let panel1 = null;
    let panel2 = null;

    panel1 = (
      <Cell
        style={{ margin: "0px", backgroundColor: "#f2f2f2" }}
        className="zui-color--white zui-panel"
        span={3}
      >
        <ExplorerContainer
          onRename={this.props.onRenameIntent}
          onAdd={this.props.onAddIntent}
          onDelete={this.props.onDeleteIntent}
        />
      </Cell>
    );
    if (this.props.selectedType === "function") {
      panel2 = (
        <Cell
          style={{ margin: "0px", backgroundColor: "#f2f2f2" }}
          className="zui-color--white zui-panel"
          span={9}
        >
          <FunctionContainer />
        </Cell>
      );
    } else if (this.props.selectedType === "entity") {
      panel2 = (
        <Cell
          style={{ margin: "0px", backgroundColor: "#f2f2f2" }}
          className="zui-color--white zui-panel"
          span={9}
        >
          <EntityContainer />
        </Cell>
      );
    } else {
      panel2 = (
        <Cell
          style={{ margin: "0px", backgroundColor: "#f2f2f2" }}
          className="zui-color--white zui-panel"
          span={9}
        >
          <IntentContainer handleRename={this.handleRenameIntent} />
        </Cell>
      );
    }
    return (
      <Grid
        gutter={{ desktop: "0px", tablet: "0px", phone: "0px" }}
        style={{ margin: "0px", padding: "0px" }}
      >
        <Inner style={{ gridGap: "0px" }}>
          {panel1}
          {panel2}
        </Inner>
      </Grid>
    );
  }
}

AgentManager.defaultProps = {
  bot: null,
  intents: null,
  selectedIntent: null,
  selectedBotId: null,
  store: null,
  activeTab: 0,
};

AgentManager.propTypes = {
  activeTab: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  selectedBotId: PropTypes.string,
  selectedType: PropTypes.string.isRequired,
  bot: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    language: PropTypes.string,
  }),
  intents: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string })),
  selectedIntentIndex: PropTypes.number.isRequired,
  selectedIntent: PropTypes.shape({ id: PropTypes.string }),
  store: PropTypes.shape({}),
  titleName: PropTypes.string.isRequired,

  onRenameIntent: PropTypes.func.isRequired,
  onAddIntent: PropTypes.func.isRequired,
  onDeleteIntent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  let { selectedIntent } = state.app;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  // TODO get selectedBot from selectBotId
  const bot = selectedBotId ? admin.bots[0] : null;
  const intents = state.app.intents ? state.app.intents : null;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.loading || false;
  const selectedIntentIndex = state.app ? state.app.selectedIntentIndex : 0;
  const selectedType = state.app ? state.app.selectedType : "intent";
  if (!selectedIntent) {
    selectedIntent = state.app.intents
      ? state.app.intents[selectedIntentIndex]
      : null;
  }
  const titleName = state.app.activeScreen.name
    ? state.app.activeScreen.name
    : "";
  return {
    selectedBotId,
    bot,
    intents,
    isLoading,
    isSignedIn,
    selectedIntent,
    selectedIntentIndex,
    selectedType,
    titleName,
  };
};

const mapDispatchToProps = () => ({});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AgentManager);
