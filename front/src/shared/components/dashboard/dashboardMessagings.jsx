/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import Zrmc from "zrmc";
import MessagingsList from "../messagingsList";
import ServiceDialog from "../../containers/dialogs/serviceDialog";

class DashboardMessagings extends Component {
  displayPluginSettings(plugin) {
    const sdialog = (
      <ServiceDialog
        open
        plugin={plugin}
        botId={this.props.selectedBotId}
        apiSetPluginRequest={(newPlugin) => {
          this.props.apiSetPluginRequest(newPlugin, this.props.selectedBotId);
        }}
      />
    );
    setTimeout(() => Zrmc.showDialog(sdialog), 100);
  }

  onSelect = ({ state, item }) => {
    if (state === "enable") {
      const newItem = {
        ...item,
        middleware: {
          ...item.middleware,
          status: item.middleware.status === "start" ? "disabled" : "start",
        },
      };
      this.props.apiSetPluginRequest(newItem, this.props.selectedBotId);
    } else {
      this.displayPluginSettings(item);
    }
  };

  /**
   * private
   * @param {array} plugins
   */
  static buildItems(plugins) {
    return plugins.map((plugin) => {
      const enabled = plugin.middleware && plugin.middleware.status === "start";
      return { ...plugin, enabled };
    });
  }

  render() {
    const items = DashboardMessagings.buildItems(this.props.plugins);
    return (
      <div style={{ padding: "12px 24px 24px 24px" }}>
        {this.props.loading ? (
          <div>Loading</div>
        ) : (
          <div>
            <p style={{ marginBottom: "12px" }}>
              You could choose to connect this assistant on one or more of these
              platforms.
            </p>
            <MessagingsList items={items} onSelect={this.onSelect} />
          </div>
        )}
      </div>
    );
  }
}

DashboardMessagings.propTypes = {
  apiSetPluginRequest: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  plugins: PropTypes.array,
  selectedBotId: PropTypes.string,
};

export default DashboardMessagings;
