/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";

import { TextField, Select, MenuItem, Icon, Button } from "zrmc";

import DashboardActionbar from "./dashboardActionbar";
import timezones from "../../utils/timezones";

class DashboardDescription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      description: props.bot.description,
      language: props.bot.language,
      timezone: props.bot.timezone,
      name: props.bot.name,
    };
  }

  onSaveBotDetails = () => {
    this.props.onSaveBotDetails({
      ...this.props.bot,
      ...this.state,
    });
  };

  render() {
    const { bot } = this.props;
    return (
      <div className="opla-dashboard_panel">
        <div className="opla-dashboard_panel-header">
          <div className="opla-dashboard_title">
            <div className="opla-dashboard_icon">
              <Icon>
                <svg viewBox="0 0 24 24">
                  <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
                </svg>
              </Icon>
            </div>
            <div style={{ display: "flex" }}>
              <div className="opla-dashboard_title_edit">
                <Icon name="edit" />
              </div>
              <TextField
                defaultValue={bot.name}
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="opla-dashboard_actionbar">
            <Button
              onClick={this.onSaveBotDetails}
              disabled={this.state.name.length < 1}
              style={{ backgroundColor: "#3F67E2" }}
              dense
              raised
            >
              Save
            </Button>
            <DashboardActionbar
              selectedBotId={this.props.selectedBotId}
              bot={this.props.bot}
              intents={this.props.intents}
              apiImportRequest={this.props.apiImportRequest}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "12px 24px 24px 24px",
          }}
        >
          <TextField
            style={{ width: "100%", marginBottom: "12px" }}
            defaultValue={bot.description}
            isTextarea
            label="Description"
            onChange={(e) => {
              this.setState({
                description: e.target.value,
              });
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Select
              label="Language"
              style={{ width: "47%" }}
              onSelected={(language) => {
                this.setState({
                  language,
                });
              }}
              selectedIndex={["en", "fr"].findIndex(
                (language) => language === (bot.language || null),
              )}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fr">French</MenuItem>
            </Select>
            <Select
              className="selectTimeZone"
              label="Timezone"
              style={{ width: "47%" }}
              onSelected={(timezone) => {
                this.setState({
                  timezone,
                });
              }}
              selectedIndex={timezones.findIndex(
                (tz) => tz === (bot.timezone || null),
              )}
            >
              {timezones.map((timezone, i) => (
                <MenuItem key={i} value={timezone}>
                  {timezone}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    );
  }
}

DashboardDescription.propTypes = {
  bot: PropTypes.shape({
    description: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,

  intents: PropTypes.array.isRequired,
  selectedBotId: PropTypes.string.isRequired,

  apiImportRequest: PropTypes.func.isRequired,
  onSaveBotDetails: PropTypes.func.isRequired,
};

export default DashboardDescription;
