/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Panel from "zoapp-front/dist/components/panel";
import { Grid, Inner } from "zrmc";
import AssistantCard from "../components/assistantCard";

import { apiGetBotsRequest, apiSelectBot } from "../actions/bot";

export class AssistantsBase extends Component {
  componentDidMount() {
    this.props.apiGetBotsRequest();
  }

  onSelect = (index) => {
    if (index > -1) {
      this.props.apiSelectBot(index);
      this.props.history.push("/factory");
    } else {
      this.props.history.push("/create");
    }
  };

  render() {
    const { bots, multiBots, selectedBotIndex } = this.props;

    let create;
    if (multiBots || bots.length < 1) {
      create = (
        <AssistantCard
          item={{
            name: "Create a new assistant",
            icon: (
              <svg viewBox="0 0 24 24">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
            ),
          }}
          onSelect={this.onSelect}
        />
      );
    }
    return (
      <div className="opla-assistants zui-layout__content zui-color--white">
        <Panel title="Assistants">
          <Grid>
            <Inner>
              {bots.map((bot, index) => (
                <AssistantCard
                  key={bot.id}
                  item={bot}
                  index={index}
                  selectedIndex={selectedBotIndex}
                  onSelect={this.onSelect}
                />
              ))}
              {create}
            </Inner>
          </Grid>
        </Panel>
      </div>
    );
  }
}

AssistantsBase.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  bots: PropTypes.arrayOf(PropTypes.shape({})),
  multiBots: PropTypes.bool,
  selectedBotIndex: PropTypes.number,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  apiGetBotsRequest: PropTypes.func.isRequired,
  apiSelectBot: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { bots } = state.app;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const selectedBotIndex = selectedBotId
    ? state.app.project.selectedIndex
    : null;
  // Needed ?
  // const multiBots = admin ? admin.params.multiProjects : false;
  const multiBots = false;
  return { isSignedIn, bots, multiBots, selectedBotIndex };
};

const mapDispatchToProps = (dispatch) => ({
  apiGetBotsRequest: () => {
    dispatch(apiGetBotsRequest());
  },
  apiSelectBot: (index) => {
    dispatch(apiSelectBot(index));
  },
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AssistantsBase),
);
