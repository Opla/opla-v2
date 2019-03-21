/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";

import { TextField, Select, MenuItem, Button } from "zrmc";

import DashboardExpansionPanel from "./dashboardExpansionPanel";

import timezones from "../../utils/timezones";

class DashboardDescription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      description: props.bot.description,
      language: props.bot.language,
      timezone: props.bot.timezone,
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
      <DashboardExpansionPanel
        title="Properties"
        icon="format_list_bulleted"
        actionsFooter={<Button onClick={this.onSaveBotDetails}>Save</Button>}
      >
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
      </DashboardExpansionPanel>
    );
  }
}

DashboardDescription.propTypes = {
  bot: PropTypes.shape({
    description: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
  }).isRequired,

  onSaveBotDetails: PropTypes.func.isRequired,
};

export default DashboardDescription;
