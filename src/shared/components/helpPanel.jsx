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
  textAlign: "center",
  fontSize: "16px",
  fontWeight: "400",
  color: "#666",
  padding: "20px 0",
  lineHeight: "1.1",
};

const HelpPanel = ({ index }) => (
  <div className="help_panel mdc-elevation--z1">
    <div className="help_panel_header">
      <div>
        <Icon name="cancel" />
      </div>
      <div className="help_panel_title">
        <Icon name="help" />
        <div>How to create your first intent ?</div>
      </div>
    </div>
    <div style={infoStyle}>{index}</div>
  </div>
);

HelpPanel.propTypes = {
  index: PropTypes.number.isRequired,
};

export default HelpPanel;
