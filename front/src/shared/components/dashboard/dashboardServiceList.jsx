/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";

import Zrmc, { Button } from "zrmc";
import { ListComponent } from "zoapp-ui";

import ServicesList from "zoapp-front/dist/components/servicesList";

import DashboardExpansionPanel from "./dashboardExpansionPanel";
import ServiceDialog from "../../containers/dialogs/serviceDialog";

class DashboardServiceList extends React.Component {
  displayPluginSettings = (plugin) => {
    const sdialog = (
      <ServiceDialog
        open
        plugin={plugin}
        botId={this.props.selectedBotId}
        onClosed={this.handleCloseDialog}
        apiSetPluginRequest={(newPlugin) => {
          const newItem = {
            ...newPlugin,
            middleware: {
              ...newPlugin.middleware,
              status: "start",
            },
          };
          this.props.apiSetPluginRequest(newItem, this.props.selectedBotId);
        }}
      />
    );
    setTimeout(() => Zrmc.showDialog(sdialog), 100);
  };

  handlePluginDelete(plugin) {
    Zrmc.showDialog({
      header: plugin.title,
      body: "Do you want to delete it ?",
      actions: [{ name: "Cancel" }, { name: "Delete" }],
      onAction: (dialog, action) => {
        switch (action) {
          case "Delete":
            this.props.apiDeletePluginRequest(plugin, this.props.selectedBotId);
            Zrmc.closeDialog();
            break;

          default:
            // cancel
            Zrmc.closeDialog();
            break;
        }
      },
      className: plugin.className,
    });
  }

  handleSelect = (selected) => {
    const { state, item } = selected;
    const plugin = item;
    if (state === "select") {
      this.displayPluginSettings(plugin);
    }
    if (state === "delete") {
      this.handlePluginDelete(plugin);
    }
  };

  displayPluginsList = (plugins, name) => {
    const className = "zui-dialog-list";
    const title = `Add a ${name}`;
    // ids will by used as ListItem keys
    const indexedPlugins = plugins.map((plugin, index) => ({
      ...plugin,
      id: index,
    }));

    const content = (
      <div style={{ height: "280px" }}>
        <ListComponent
          className="list-content"
          style={{ padding: "0px", height: "100%" }}
          items={indexedPlugins}
          selectedItem={-1}
          onSelect={(i) => {
            Zrmc.closeDialog();
            this.displayPluginSettings(indexedPlugins[i]);
          }}
        />
      </div>
    );
    Zrmc.showDialog({
      header: title,
      body: content,
      actions: [{ name: "Cancel" }],
      className,
    });
  };

  handleAddService = () => {
    const { serviceType } = this.props;
    const items = this.props.plugins.filter(
      (plugin) => plugin && plugin.type === serviceType,
    );
    this.displayPluginsList(items, serviceType);
  };

  render() {
    return (
      <DashboardExpansionPanel
        title={this.props.title}
        icon={this.props.icon}
        actionsFooter={<Button onClick={this.handleAddService}>Add</Button>}
      >
        <ServicesList
          title=""
          name=""
          addDisabled
          description={this.props.description}
          items={this.props.services}
          defaultIcon={this.props.defaultIcon}
          onSelect={this.handleSelect}
        />
      </DashboardExpansionPanel>
    );
  }
}

DashboardServiceList.propTypes = {
  services: PropTypes.array.isRequired,
  plugins: PropTypes.array.isRequired,
  serviceType: PropTypes.string.isRequired,
  selectedBotId: PropTypes.string.isRequired,

  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  defaultIcon: PropTypes.string.isRequired,

  apiSetPluginRequest: PropTypes.func.isRequired,
  apiDeletePluginRequest: PropTypes.func.isRequired,
};

export default DashboardServiceList;
