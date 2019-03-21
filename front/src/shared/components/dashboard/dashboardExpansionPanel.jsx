/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { ExpansionPanel } from "zoapp-ui";

import { Icon } from "zrmc";

class DashboardExpansionPanel extends React.Component {
  render() {
    return (
      <ExpansionPanel
        label={
          <div style={{ display: "flex", fontWeight: "900" }}>
            <Icon
              name={this.props.icon}
              style={{
                paddingTop: "12px",
                margin: "0 8px 0 -8px",
              }}
            />
            {this.props.title}
          </div>
        }
        className={classnames(
          this.props.className,
          "opla-dashboard_expansion-panel",
        )}
        elevation={0}
      >
        {this.props.children}
        {this.props.actionsFooter && (
          <div className="opla-dashboard_expansion-panel_footer">
            {this.props.actionsFooter}
          </div>
        )}
      </ExpansionPanel>
    );
  }
}

DashboardExpansionPanel.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  actionsFooter: PropTypes.element,

  className: PropTypes.string,
  children: PropTypes.element.isRequired,
};

export default DashboardExpansionPanel;
