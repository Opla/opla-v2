/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Grid, Inner, Cell } from "zrmc";
import {
  apiGetPluginsRequest,
  apiSetPluginRequest,
  apiDeletePluginRequest,
} from "zoapp-front/dist/actions/api";
import { getInstalledPlugins } from "../selectors/pluginsSelector";
import { apiSaveBotRequest } from "../actions/bot";
import { apiImportRequest, apiGetIntentsRequest } from "../actions/api";
import DashboardDescription from "../components/dashboard/dashboardDescription";
import DashboardServiceList from "../components/dashboard/dashboardServiceList";

export class DashboardBase extends Component {
  componentDidMount() {
    if (this.props.bot) {
      const { selectedBotId } = this.props;
      this.props.apiGetIntentsRequest(selectedBotId);
      this.props.apiGetPluginsRequest(selectedBotId);
    }
  }

  render() {
    if (this.props.bot === null) {
      return null;
    }

    return (
      <Grid style={{ maxHeight: "calc(100vh - 68px)", height: "100%", overflow: "auto" }}>
        <Inner>
          <Cell span={12}>
            <DashboardDescription
              bot={this.props.bot}
              intents={this.props.intents}
              selectedBotId={this.props.selectedBotId}
              apiImportRequest={this.props.apiImportRequest}
              onSaveBotDetails={this.props.apiSaveBotRequest}
            />
            <DashboardServiceList
              services={this.props.messagingPlugins}
              plugins={this.props.plugins}
              serviceType="MessengerConnector"
              selectedBotId={this.props.selectedBotId}
              title="publish to"
              icon="publish"
              description="Connect any third party messaging solution to an assistant."
              defaultIcon="message"
              apiSetPluginRequest={this.props.apiSetPluginRequest}
              apiDeletePluginRequest={this.props.apiDeletePluginRequest}
            />
            <DashboardServiceList
              services={this.props.webservicesPlugins}
              plugins={this.props.plugins}
              serviceType="WebService"
              selectedBotId={this.props.selectedBotId}
              title="Web Services"
              icon="extension"
              description="Plug any data or api to interact with an assistant."
              defaultIcon="images/webhook.svg"
              apiSetPluginRequest={this.props.apiSetPluginRequest}
              apiDeletePluginRequest={this.props.apiDeletePluginRequest}
            />
          </Cell>
        </Inner>
      </Grid>
    );
  }
}

DashboardBase.defaultProps = {
  bot: null,
};

DashboardBase.propTypes = {
  bot: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    language: PropTypes.string,
    timezone: PropTypes.string,
  }),
  messagingPlugins: PropTypes.array,
  webservicesPlugins: PropTypes.array,
  plugins: PropTypes.array.isRequired,
  selectedBotId: PropTypes.string.isRequired,
  intents: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string })),

  apiGetPluginsRequest: PropTypes.func.isRequired,
  apiSaveBotRequest: PropTypes.func.isRequired,
  apiGetIntentsRequest: PropTypes.func.isRequired,
  apiImportRequest: PropTypes.func.isRequired,
  apiSetPluginRequest: PropTypes.func.isRequired,
  apiDeletePluginRequest: PropTypes.func.isRequired,
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
    messagingPlugins: installedPlugins.MessengerConnector || [],
    webservicesPlugins: installedPlugins.WebService || [],
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
  apiDeletePluginRequest: (plugin, botId) => {
    dispatch(apiDeletePluginRequest(plugin, botId));
  },
});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardBase);
