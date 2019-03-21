/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Zrmc, {
  Grid,
  Icon,
  Inner,
  Cell,
  TextField,
  Select,
  MenuItem,
  Button,
} from "zrmc";
import { ExpansionPanel, ListComponent } from "zoapp-ui";
import Panel from "zoapp-front/dist/components/panel";
import { connect } from "react-redux";
import {
  apiGetPluginsRequest,
  apiSetPluginRequest,
} from "zoapp-front/dist/actions/api";
import ServicesList from "zoapp-front/dist/components/servicesList";
import { getInstalledPlugins } from "../selectors/pluginsSelector";
import DashboardActionBar from "../components/dashboardActionbar";
import { apiSaveBotRequest } from "../actions/bot";
import { apiImportRequest, apiGetIntentsRequest } from "../actions/api";
import timezones from "../utils/timezones";
import PluginsManager from "../utils/pluginsManager";
import ServiceDialog from "./dialogs/serviceDialog";
import DashboardMessagings from "../components/dashboard/dashboardMessagings";

class DashboardExpansionPanel extends Component {
  render() {
    return (
      <ExpansionPanel
        label={
          <div style={{ display: "flex", fontWeight: "900" }}>
            <Icon
              name={this.props.dashboardIcon}
              style={{
                paddingTop: "12px",
                margin: "0 8px 0 -8px",
              }}
            />
            {this.props.dashboardTitle}
          </div>
        }
        className={classnames(
          this.props.className,
          "opla-dashboard_expansion-panel",
        )}
        elevation={0}
      >
        {this.props.children}
        {this.props.actionsFooter &&
          <div className="opla-dashboard_expansion-panel_footer">
            {this.props.actionsFooter}
          </div>
        }
      </ExpansionPanel>
    );
  }
}

export class DashboardBase extends Component {
  constructor(props) {
    super(props);
    const pluginsManager = PluginsManager();

    this.state = {
      bot: props.bot,
      pluginsManager,
    };
  }

  componentDidMount() {
    if (this.state.bot) {
      DashboardBase.loadIntents(this.props);
      DashboardBase.loadPlugins(this.props);
    }
  }

  static loadIntents(props) {
    props.apiGetIntentsRequest(props.selectedBotId);
  }

  static loadPlugins = (props) => {
    props.apiGetPluginsRequest(props.selectedBotId);
  };

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

  handleAddService = (type) => () => {
    const items = this.getPluginsByType(type);
    this.displayPluginsList(items, type);
  };

  getPluginsByType = (type) => {
    return this.props.plugins.filter(
      (plugin) => plugin && plugin.type === type,
    );
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

  displayPluginSettings = (plugin) => {
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
  };

  render() {
    if (this.props.bot === null) {
      return null;
    }

    return (
      <Grid style={{ maxHeight: "calc(100vh - 68px)", overflow: "auto" }}>
        <Inner>
          <Cell span={12}>
            <div className="opla-dashboard_panel">
              <Panel
                title={
                  <div className="opla-dashboard_panel-header">
                    <div className="opla-dashboard_title">
                      <div className="opla-dashboard_icon">
                        <Icon>
                          <svg viewBox="0 0 24 24">
                            <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
                          </svg>
                        </Icon>
                      </div>
                      {!this.props.isLoading && (
                        <div style={{ display: "flex" }}>
                          <div className="opla-dashboard_title_edit">
                            <Icon name="edit" />
                          </div>
                          <TextField
                            defaultValue={this.props.bot.name}
                            onChange={this.handleBotNameChange}
                          />
                        </div>
                      )}
                    </div>
                    <div className="opla-dashboard_actionbar">
                      <DashboardActionBar
                        selectedBotId={this.props.selectedBotId}
                        bot={this.props.bot}
                        intents={this.props.intents}
                        apiImportRequest={this.props.apiImportRequest}
                      />
                    </div>
                  </div>
                }
                action="Save"
                actionDisabled={
                  !this.state.bot ||
                  (this.state.bot && this.state.bot.name.length < 1)
                }
                onAction={this.onSaveBotDetails}
              />
            </div>
            <DashboardExpansionPanel
              dashboardTitle="publish to"
              dashboardIcon="publish"
              actionsFooter={
                <Button onClick={this.handleAddService("MessengerConnector")}>
                  Add
                </Button>
              }
            >
              <ServicesList
                addDisabled
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
              {/* <DashboardMessagings
                apiSetPluginRequest={this.props.apiSetPluginRequest}
                plugins={this.props.messagingPlugins}
                selectedBotId={this.props.selectedBotId}
              /> */}
            </DashboardExpansionPanel>
            <DashboardExpansionPanel
              dashboardTitle="Web Services"
              dashboardIcon="extension"
              actionsFooter={
                <Button onClick={this.handleAddService("WebService")}>
                  Add
                </Button>
              }
            >
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
                description={
                  "Plug any data or api to interact with an assistant."
                }
                onSelect={this.handleSelect}
              />
            </DashboardExpansionPanel>
            <DashboardExpansionPanel
              dashboardTitle="Properties"
              dashboardIcon="format_list_bulleted"
              actionsFooter={
                <Button
                  disabled={
                    !this.state.bot ||
                    (this.state.bot && this.state.bot.name.length < 1)
                  }
                  onClick={this.onSaveBotDetails}
                >
<<<<<<< HEAD
                  <div style={{ display: "flex" }}>
                    {!this.props.isLoading && (
                      <div>
                        <TextField
                          defaultValue={this.props.bot.description}
                          isTextarea
                          label="Description"
                          onChange={this.handleBotDescriptionChange}
                        />
                      </div>
                    )}
                    {!this.props.isLoading && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Select
                          label="Language"
                          style={{ width: "47%" }}
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
                    )}
                    {!this.props.isLoading && (
                      <Select
                        className="selectTimeZone"
                        label="Timezone"
                        style={{ width: "47%" }}
                        onSelected={this.handleTimezoneChange}
                        selectedIndex={this.props.timezones.findIndex(
                          (tz) => tz === (this.props.bot.timezone || null),
                        )}
                      >
                        {this.props.timezones.map((timezone, i) => (
                          <MenuItem key={i} value={timezone}>
                            {timezone}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </div>
                </Panel>
              </form>
=======
                  Save
                </Button>
              }
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
                  defaultValue={this.props.bot.description}
                  isTextarea
                  label="Description"
                  onChange={this.handleBotDescriptionChange}
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
                    onSelected={this.handleLanguageChange}
                    selectedIndex={["en", "fr"].findIndex(
                      (language) =>
                        language === (this.props.bot.language || null),
                    )}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                  <Select
                    className="selectTimeZone"
                    label="Timezone"
                    style={{ width: "47%" }}
                    onSelected={this.handleTimezoneChange}
                    selectedIndex={this.props.timezones.findIndex(
                      (tz) => tz === (this.props.bot.timezone || null),
                    )}
                  >
                    {this.props.timezones.map((timezone, i) => (
                      <MenuItem key={i} value={timezone}>
                        {timezone}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
>>>>>>> Move listServices in settings panel
            </DashboardExpansionPanel>
          </Cell>
        </Inner>
      </Grid>
    );
  }
}

DashboardBase.defaultProps = {
  bot: null,
  timezones,
};

DashboardBase.propTypes = {
  admin: PropTypes.shape({ params: PropTypes.shape({}).isRequired }),
  apiSaveBotRequest: PropTypes.func.isRequired,
  bot: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    language: PropTypes.string,
    timezone: PropTypes.string,
  }),
  children: PropTypes.object.isRequired,
  dashboardIcon: PropTypes.string.isRequired,
  dashboardTitle: PropTypes.string.isRequired,
  actionsFooter: PropTypes.element,
  isLoading: PropTypes.bool,
  isSignedIn: PropTypes.bool,
  timezones: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedBotId: PropTypes.string,
  intents: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string })),
  apiGetIntentsRequest: PropTypes.func.isRequired,
  apiImportRequest: PropTypes.func.isRequired,
  apiSetPluginRequest: PropTypes.func.isRequired,
  messagingPlugins: PropTypes.array,
};

const mapStateToProps = (state) => {
  const { bots, project, loading } = state.app;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  // TODO get selectedBot from selectBotId
  const bot = selectedBotId ? bots[project.selectedIndex] : null;
  const intents = state.app.intents ? state.app.intents : null;
  const plugins = state.app.plugins || [];

  const installedPlugins = getInstalledPlugins(plugins);

  return {
    isLoading: loading,
    bot,
    selectedBotId,
    intents,
    plugins,
    messagings: installedPlugins.MessengerConnector || [],
    webservices: installedPlugins.WebService || [],
  };
};

const mapDispatchToProps = (dispatch) => ({
  apiSaveBotRequest: (params) => {
    dispatch(apiSaveBotRequest(params));
  },
  apiGetPluginsRequest: (botId) => {
    dispatch(apiGetPluginsRequest(botId));
  },
  apiSetPluginRequest: (plugin, botId) => {
    dispatch(apiSetPluginRequest(plugin, botId));
  },
  apiImportRequest: (botId, data, options) => {
    dispatch(apiImportRequest(botId, data, options));
  },
  apiGetIntentsRequest: (botId) => {
    dispatch(apiGetIntentsRequest(botId));
  },
});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardBase);
