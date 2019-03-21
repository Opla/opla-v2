/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Grid, Icon, Inner, Cell, TextField, Select, MenuItem } from "zrmc";
import { ExpansionPanel } from "zoapp-ui";
import Panel from "zoapp-front/dist/components/panel";
import { connect } from "react-redux";
import {
  apiGetPluginsRequest,
  apiSetPluginRequest,
} from "zoapp-front/dist/actions/api";
import { getInstalledPlugins } from "../selectors/pluginsSelector";
import DashboardActionBar from "../components/dashboardActionbar";
import { apiSaveBotRequest } from "../actions/bot";
import { apiImportRequest, apiGetIntentsRequest } from "../actions/api";
import timezones from "../utils/timezones";
import ServicesContainer from "../containers/servicesContainer";
import PluginsManager from "../utils/pluginsManager";
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
        <div className="opla-dashboard_expansion-panel_footer">BLBLBLB</div>
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
            >
              <DashboardMessagings
                apiSetPluginRequest={this.props.apiSetPluginRequest}
                plugins={this.props.messagingPlugins}
                selectedBotId={this.props.selectedBotId}
              />
            </DashboardExpansionPanel>
            <DashboardExpansionPanel
              dashboardTitle="Web Services"
              dashboardIcon="extension"
            >
              <ServicesContainer pluginsManager={this.state.pluginsManager} />
            </DashboardExpansionPanel>
            <DashboardExpansionPanel
              dashboardTitle="Properties"
              dashboardIcon="format_list_bulleted"
            >
              <form className="opla-dashboard zap-panel_form">
                <Panel
                  title="Update Properties"
                  action="Save"
                  actionDisabled={
                    !this.state.bot ||
                    (this.state.bot && this.state.bot.name.length < 1)
                  }
                  onAction={this.onSaveBotDetails}
                >
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
    messagingPlugins: installedPlugins.MessengerConnector || [],
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
