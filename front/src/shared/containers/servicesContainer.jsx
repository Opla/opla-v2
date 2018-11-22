/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Zrmc, { Cell } from "zrmc";
import { ListComponent } from "zoapp-ui";
import ServicesList from "zoapp-front/dist/components/servicesList";
import {
  apiGetPluginsRequest,
  apiSetPluginRequest,
  apiDeletePluginRequest,
} from "zoapp-front/dist/actions/api";

import { getInstalledPlugins } from "../selectors/pluginsSelector";
import ServiceDialog from "./dialogs/serviceDialog";

const divCellStyle = {
  width: "100%",
};

class ServicesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { needUpdate: true };
    this.handlePluginSelect = this.displayPluginSettings.bind(this);
    this.displayPluginSettings = this.displayPluginSettings.bind(this);
    this.displayPluginsList = this.displayPluginsList.bind(this);
    this.handlePluginDelete = this.handlePluginDelete.bind(this);
  }

  componentDidMount() {
    this.updateServices();
  }

  componentDidUpdate() {
    this.updateServices();
  }

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

  displayPluginSettings(plugin) {
    const sdialog = (
      <ServiceDialog
        open
        plugin={plugin}
        botId={this.props.selectedBotId}
        onClosed={this.handleCloseDialog}
        apiSetPluginRequest={(newPlugin) => {
          this.props.apiSetPluginRequest(newPlugin, this.props.selectedBotId);
        }}
      />
    );
    setTimeout(() => Zrmc.showDialog(sdialog), 100);
  }

  displayPluginsList(plugins) {
    const className = "zui-dialog-list";
    const title = "Add a messaging platform";
    // ids will by used as ListItem keys
    const indexedPlugins = plugins.map((plugin, index) => ({
      ...plugin,
      id: index,
    }));
    // indexedPlugins.push({
    //   id: indexedPlugins.length + 1,
    //   name: "Add plugin",
    //   icon: "add",
    //   color: "gray",
    // });
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
  }

  handleSelect = (selected) => {
    this.currentSelected = { ...selected }; // legacy
    const { name, state, item } = selected;
    const plugin = item;
    // add buttton selected.
    if (state === "add") {
      // display list available;
      let items;
      switch (name) {
        case "Messaging platforms":
          items = this.getPluginsByType("MessengerConnector");
          this.displayPluginsList(items);
          break;
        case "Web services":
          items = this.getPluginsByType("WebService");
          this.displayPluginsList(items);
          break;
        case "AI/NLU providers":
          // // Uncomment to enable ADD AIConnector
          // items = this.getPluginsByType("AIConnector");
          // this.displayPluginsList(items);
          break;
        default:
          break;
      }
    }
    if (state === "select" || state === "create") {
      switch (name) {
        // // Uncomment to enable AIConnector settings
        // case "AI/NLU providers":
        case "Messaging platforms":
        case "Web services":
          this.displayPluginSettings(plugin);
          break;
        default:
          break;
      }
    }
    if (state === "delete") {
      this.handlePluginDelete(plugin);
    }
  };

  getPluginsByType(type) {
    return this.props.plugins.filter(
      (plugin) => plugin && plugin.type === type,
    );
  }

  updateServices() {
    if (!this.props.isSignedIn) {
      if (!this.state.needUpdate) {
        this.setState({ needUpdate: true });
      }
      return;
    }
    if (this.props.selectedBotId && this.state.needUpdate) {
      this.setState({ needUpdate: false });
      this.props.apiGetPluginsRequest(this.props.selectedBotId);
    }
  }

  render() {
    // WIP : need to get from backend which provider is activated/running
    return (
      <div style={divCellStyle}>
        <Cell className="zui-color--white" span={12}>
          <ServicesList
            name="Messaging platforms"
            icon={
              <svg viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  d="M13.5,10A1.5,1.5 0 0,1 12,11.5C11.16,11.5 10.5,10.83 10.5,10A1.5,1.5 0 0,1 12,8.5A1.5,1.5 0 0,1 13.5,10M22,4V16A2,2 0 0,1 20,18H6L2,22V4A2,2 0 0,1 4,2H20A2,2 0 0,1 22,4M16.77,11.32L15.7,10.5C15.71,10.33 15.71,10.16 15.7,10C15.72,9.84 15.72,9.67 15.7,9.5L16.76,8.68C16.85,8.6 16.88,8.47 16.82,8.36L15.82,6.63C15.76,6.5 15.63,6.47 15.5,6.5L14.27,7C14,6.8 13.73,6.63 13.42,6.5L13.23,5.19C13.21,5.08 13.11,5 13,5H11C10.88,5 10.77,5.09 10.75,5.21L10.56,6.53C10.26,6.65 9.97,6.81 9.7,7L8.46,6.5C8.34,6.46 8.21,6.5 8.15,6.61L7.15,8.34C7.09,8.45 7.11,8.58 7.21,8.66L8.27,9.5C8.23,9.82 8.23,10.16 8.27,10.5L7.21,11.32C7.12,11.4 7.09,11.53 7.15,11.64L8.15,13.37C8.21,13.5 8.34,13.53 8.46,13.5L9.7,13C9.96,13.2 10.24,13.37 10.55,13.5L10.74,14.81C10.77,14.93 10.88,15 11,15H13C13.12,15 13.23,14.91 13.25,14.79L13.44,13.47C13.74,13.34 14,13.18 14.28,13L15.53,13.5C15.65,13.5 15.78,13.5 15.84,13.37L16.84,11.64C16.9,11.53 16.87,11.4 16.77,11.32Z"
                />
              </svg>
            }
            description={
              "Connect any third party messaging solution to an assistant."
            }
            items={this.props.messagings}
            defaultIcon="message"
            onSelect={this.handleSelect}
          />
        </Cell>
        <Cell className="zui-color--white" span={12}>
          <ServicesList
            name="AI/NLU providers"
            icon={
              <svg viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  d="M21.33,12.91C21.42,14.46 20.71,15.95 19.44,16.86L20.21,18.35C20.44,18.8 20.47,19.33 20.27,19.8C20.08,20.27 19.69,20.64 19.21,20.8L18.42,21.05C18.25,21.11 18.06,21.14 17.88,21.14C17.37,21.14 16.89,20.91 16.56,20.5L14.44,18C13.55,17.85 12.71,17.47 12,16.9C11.5,17.05 11,17.13 10.5,17.13C9.62,17.13 8.74,16.86 8,16.34C7.47,16.5 6.93,16.57 6.38,16.56C5.59,16.57 4.81,16.41 4.08,16.11C2.65,15.47 1.7,14.07 1.65,12.5C1.57,11.78 1.69,11.05 2,10.39C1.71,9.64 1.68,8.82 1.93,8.06C2.3,7.11 3,6.32 3.87,5.82C4.45,4.13 6.08,3 7.87,3.12C9.47,1.62 11.92,1.46 13.7,2.75C14.12,2.64 14.56,2.58 15,2.58C16.36,2.55 17.65,3.15 18.5,4.22C20.54,4.75 22,6.57 22.08,8.69C22.13,9.8 21.83,10.89 21.22,11.82C21.29,12.18 21.33,12.54 21.33,12.91M16.33,11.5C16.9,11.57 17.35,12 17.35,12.57A1,1 0 0,1 16.35,13.57H15.72C15.4,14.47 14.84,15.26 14.1,15.86C14.35,15.95 14.61,16 14.87,16.07C20,16 19.4,12.87 19.4,12.82C19.34,11.39 18.14,10.27 16.71,10.33A1,1 0 0,1 15.71,9.33A1,1 0 0,1 16.71,8.33C17.94,8.36 19.12,8.82 20.04,9.63C20.09,9.34 20.12,9.04 20.12,8.74C20.06,7.5 19.5,6.42 17.25,6.21C16,3.25 12.85,4.89 12.85,5.81V5.81C12.82,6.04 13.06,6.53 13.1,6.56A1,1 0 0,1 14.1,7.56C14.1,8.11 13.65,8.56 13.1,8.56V8.56C12.57,8.54 12.07,8.34 11.67,8C11.19,8.31 10.64,8.5 10.07,8.56V8.56C9.5,8.61 9.03,8.21 9,7.66C8.92,7.1 9.33,6.61 9.88,6.56C10.04,6.54 10.82,6.42 10.82,5.79V5.79C10.82,5.13 11.07,4.5 11.5,4C10.58,3.75 9.59,4.08 8.59,5.29C6.75,5 6,5.25 5.45,7.2C4.5,7.67 4,8 3.78,9C4.86,8.78 5.97,8.87 7,9.25C7.5,9.44 7.78,10 7.59,10.54C7.4,11.06 6.82,11.32 6.3,11.13C5.57,10.81 4.75,10.79 4,11.07C3.68,11.34 3.68,11.9 3.68,12.34C3.68,13.08 4.05,13.77 4.68,14.17C5.21,14.44 5.8,14.58 6.39,14.57C6.24,14.31 6.11,14.04 6,13.76C5.81,13.22 6.1,12.63 6.64,12.44C7.18,12.25 7.77,12.54 7.96,13.08C8.36,14.22 9.38,15 10.58,15.13C11.95,15.06 13.17,14.25 13.77,13C14,11.62 15.11,11.5 16.33,11.5M18.33,18.97L17.71,17.67L17,17.83L18,19.08L18.33,18.97M13.68,10.36C13.7,9.83 13.3,9.38 12.77,9.33C12.06,9.29 11.37,9.53 10.84,10C10.27,10.58 9.97,11.38 10,12.19A1,1 0 0,0 11,13.19C11.57,13.19 12,12.74 12,12.19C12,11.92 12.07,11.65 12.23,11.43C12.35,11.33 12.5,11.28 12.66,11.28C13.21,11.31 13.68,10.9 13.68,10.36Z"
                />
              </svg>
            }
            description={
              "Switch the brain of an assistant, to choose the best match."
            }
            items={this.props.AIConnector}
            defaultIcon="images/robot.svg"
            onSelect={this.handleSelect}
          />
        </Cell>
        <Cell className="zui-color--white" span={12}>
          <ServicesList
            name="Web services"
            icon={
              <svg viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L6.04,7.5L12,10.85L17.96,7.5L12,4.15Z"
                />
              </svg>
            }
            items={this.props.webservices}
            defaultIcon="images/webhook.svg"
            description={"Plug any data or api to interact with an assistant."}
            onSelect={this.handleSelect}
          />
        </Cell>
      </div>
    );
  }
}

ServicesContainer.defaultProps = {
  isSignedIn: true,
  selectedBotId: null,
};

ServicesContainer.propTypes = {
  isSignedIn: PropTypes.bool,
  selectedBotId: PropTypes.string,
  plugins: PropTypes.arrayOf(PropTypes.shape({})),
  messagings: PropTypes.arrayOf(PropTypes.shape({})),
  webservices: PropTypes.arrayOf(PropTypes.shape({})),
  AIConnector: PropTypes.arrayOf(PropTypes.shape({})),
  apiGetPluginsRequest: PropTypes.func.isRequired,
  apiSetPluginRequest: PropTypes.func.isRequired,
  apiDeletePluginRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const isSignedIn = state.user ? state.user.isSignedIn : false;

  const plugins = state.app ? state.app.plugins : [];

  const installedPlugins = getInstalledPlugins(plugins);

  return {
    plugins,
    messagings: installedPlugins.MessengerConnector || [],
    webservices: installedPlugins.WebService || [],
    AIConnector: installedPlugins.AIConnector || [],
    selectedBotId,
    isSignedIn,
  };
};

const mapDispatchToProps = (dispatch) => ({
  apiGetPluginsRequest: (botId) => {
    dispatch(apiGetPluginsRequest(botId));
  },
  apiDeletePluginRequest: (plugin, botId) => {
    dispatch(apiDeletePluginRequest(plugin, botId));
  },
  apiSetPluginRequest: (plugin, botId) => {
    dispatch(apiSetPluginRequest(plugin, botId));
  },
});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServicesContainer);
