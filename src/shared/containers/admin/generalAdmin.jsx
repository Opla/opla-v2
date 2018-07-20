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
import { infoStyleD, FORM_WIDTH } from "./styles";

class GeneralAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bot: props.bot,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bot !== this.props.bot) {
      this.setState({
        bot: nextProps.bot,
      });
    }
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

    return (
      <Grid>
        <Inner>
          <Cell
            className="mdl-color--white"
            span={12}
            style={{ display: "table" }}
          >
            <div style={{ width: "200px", display: "table-cell" }}>
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
            <div style={{ display: "table-cell" }}>
              <form style={infoStyleD}>
                <div>
                  <TextField
                    defaultValue={this.props.bot.name}
                    label="Assistant name"
                    onChange={this.handleBotNameChange}
                    style={{ width: FORM_WIDTH }}
                  />
                </div>
                <div>
                  <TextField
                    defaultValue={this.props.bot.description}
                    isTextarea
                    label="Description"
                    onChange={this.handleBotDescriptionChange}
                    style={{ width: FORM_WIDTH }}
                  />
                </div>
                <div>
                  <Select
                    label="Language"
                    onSelected={this.handleLanguageChange}
                    style={{ width: FORM_WIDTH }}
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
                    onSelected={this.handleTimezoneChange}
                    style={{ width: FORM_WIDTH }}
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
            <div>
              <Button
                disabled={
                  !this.state.bot ||
                  (this.state.bot && this.state.bot.name.length < 1)
                }
                raised
                style={{ float: "right", margin: "24px" }}
                onClick={this.onSaveBotDetails}
              >
                SAVE
              </Button>
            </div>
          </Cell>
        </Inner>
      </Grid>
    );
  }
}

GeneralAdmin.defaultProps = {
  bot: null,
  timezones,
};

GeneralAdmin.propTypes = {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GeneralAdmin);
