/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import { Icon } from "zrmc";

const infoStyle = {
  fontSize: "14px",
  fontWeight: "400",
  color: "#666",
  padding: "20px 16px",
  lineHeight: "1.1",
};

const helpdoc = [
  { title: "How to create your first intent ?", text: "" },
  {
    title: "Input is a list of sentences, events or attachments",
    text:
      "One of these items if it match with user's input, will trigger this intent.",
  },
  {
    title: "Output is a list of sentences and actions",
    text:
      "One of below items is send to the user if this intent was activated from its input.",
  },
  { title: "Advanced", text: "" },
  { title: "Input block", text: "" },
  { title: "Output block", text: "" },
];

const HelpPanel = ({ index, onHelp }) => (
  <div className="help_panel mdc-elevation--z1">
    <div className="help_panel_header">
      <div>
        <Icon
          name="cancel"
          onClick={() => {
            onHelp("close");
          }}
        />
      </div>
      <div className="help_panel_title">
        <div className="help_panel_bubble">{index + 1}</div>
        <div>{helpdoc[index].title}</div>
      </div>
    </div>
    <div style={infoStyle}>{helpdoc[index].text}</div>
  </div>
);

HelpPanel.propTypes = {
  index: PropTypes.number.isRequired,
  onHelp: PropTypes.func.isRequired,
};

export default HelpPanel;
