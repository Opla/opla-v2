/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Panel from "zoapp-front/dist/components/panel";
import { Grid, Inner, Cell, Button, Card, CardActions, Icon } from "zrmc";

export class AssistantsBase extends Component {
  render() {
    const { bots, multiBots, selectedBotIndex } = this.props;

    let create;
    if (multiBots || bots.length < 1) {
      create = (
        <Cell span={2}>
          <Card horizontalBlock>
            <div className="opla-dashboard_icon">
              <Icon>
                <svg viewBox="0 0 24 24">
                  <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
              </Icon>
            </div>
            <CardActions>
              <Button>Create new assistant</Button>
            </CardActions>
          </Card>
        </Cell>
      );
    }
    return (
      <div className="opla-assistants zui-layout__content zui-color--white">
        <Panel title="Assistants">
          <Grid>
            <Inner>
              {bots.map((bot, index) => (
                <Cell key={bot.id} span={2}>
                  <Card
                    horizontalBlock
                    className={
                      selectedBotIndex === index
                        ? "opla_assistants-selected"
                        : undefined
                    }
                  >
                    <div className="opla-dashboard_icon">
                      <Icon>
                        <svg viewBox="0 0 24 24">
                          <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
                        </svg>
                      </Icon>
                    </div>
                    <CardActions>
                      <Button>{bot.name}</Button>
                    </CardActions>
                  </Card>
                </Cell>
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
  selectedBotIndex: PropTypes.string,
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

export default connect(mapStateToProps)(AssistantsBase);
