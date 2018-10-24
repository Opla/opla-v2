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

export class AssistantsBase extends Component {
  onSelect = (index) => {
    if (index > -1) {
      // TODO select new bot
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
  history: PropTypes.shape({ length: PropTypes.number, push: PropTypes.func })
    .isRequired,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const selectedBotIndex = selectedBotId
    ? state.app.project.selectedIndex
    : null;
  const bots = admin ? admin.bots : [];
  const multiBots = admin ? admin.params.multiProjects : false;
  return { isSignedIn, bots, multiBots, selectedBotIndex };
};

export default withRouter(connect(mapStateToProps)(AssistantsBase));
