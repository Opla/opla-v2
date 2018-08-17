/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Inner, Cell, Button, TextField, Select, MenuItem } from "zrmc";
import { connect } from "react-redux";

import { apiSaveBotRequest } from "../../actions/api";
import timezones from "../../utils/timezones";

export class GeneralAdminBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bot: props.bot,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.bot !== state.bot) {
      return {
        bot: props.bot,
      };
    }
    return null;
  }

  handleBotNameChange = (e) => {
    const name = e.target.value;

    this.setState({
      bot: {
        ...this.state.bot,
        name,
      },
    });
  };

  handleBotDescriptionChange = (e) => {
    const description = e.target.value;

    this.setState({
      bot: {
        ...this.state.bot,
        description,
      },
    });
  };

  handleLanguageChange = (language) => {
    this.setState({
      bot: {
        ...this.state.bot,
        language,
      },
    });
  };

  handleTimezoneChange = (timezone) => {
    this.setState({
      bot: {
        ...this.state.bot,
        timezone,
      },
    });
  };

  onSaveBotDetails = () => {
    this.props.apiSaveBotRequest(this.state.bot);
  };

  render() {
    if (this.props.bot === null) {
      return null;
    }
    const title = (
      <div className="zap-panel_title">
        Configure your assistant
        <Button
          disabled={
            !this.state.bot ||
            (this.state.bot && this.state.bot.name.length < 1)
          }
          onClick={this.onSaveBotDetails}
        >
          SAVE
        </Button>
      </div>
    );
    return (
      <Grid>
        <Inner>
          <Cell className="zap-panel zui-color--white" span={12}>
            {title}
            <div style={{ display: "flex" }}>
              <div style={{ width: "200px", marginLeft: "24px" }}>
                <div
                  style={{
                    position: "absolute",
                    width: "180px",
                    height: "180px",
                    margin: "24px",
                    backgroundColor: "#ddd",
                  }}
                />
              </div>
              <div style={{ width: "65%", marginLeft: "24px" }}>
                <form className="zap-panel_form">
                  <div>
                    <TextField
                      defaultValue={this.props.bot.name}
                      label="Assistant name"
                      onChange={this.handleBotNameChange}
                    />
                  </div>
                  <div>
                    <TextField
                      defaultValue={this.props.bot.description}
                      isTextarea
                      label="Description"
                      onChange={this.handleBotDescriptionChange}
                    />
                  </div>
                  <div>
                    <Select
                      label="Language"
                      style={{ width: "100%" }}
                      onSelected={this.handleLanguageChange}
                      selectedIndex={["en", "fr"].findIndex(
                        (language) =>
                          language === (this.props.bot.language || null),
                      )}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                    </Select>
                  </div>
                  <div>
                    <Select
                      label="Timezone"
                      style={{ width: "100%" }}
                      onSelected={this.handleTimezoneChange}
                      selectedIndex={this.props.timezones.findIndex(
                        (tz) => tz === (this.props.bot.timezone || null),
                      )}
                    >
                      {this.props.timezones.map((timezone) => (
                        <MenuItem key={timezone} value={timezone}>
                          {timezone}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </form>
              </div>
              <div />
            </div>
          </Cell>
        </Inner>
      </Grid>
    );
  }
}

GeneralAdminBase.defaultProps = {
  bot: null,
  timezones,
};

GeneralAdminBase.propTypes = {
  admin: PropTypes.shape({ params: PropTypes.shape({}).isRequired }),
  apiSaveBotRequest: PropTypes.func.isRequired,
  bot: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    language: PropTypes.string,
    timezone: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  isSignedIn: PropTypes.bool,
  timezones: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  const selectedBotId = state.app ? state.app.selectedBotId : null;

  // TODO get selectedBot from selectBotId
  const bot = selectedBotId ? admin.bots[0] : null;

  return {
    bot,
  };
};

const mapDispatchToProps = (dispatch) => ({
  apiSaveBotRequest: (params) => {
    dispatch(apiSaveBotRequest(params));
  },
});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GeneralAdminBase);
