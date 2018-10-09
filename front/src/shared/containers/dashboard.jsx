/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Zrmc, {
  Grid,
  Icon,
  Inner,
  Cell,
  Button,
  TextField,
  Select,
  MenuItem,
} from "zrmc";
import Panel from "zoapp-front/dist/components/panel";
import { connect } from "react-redux";
import PluginsManager from "../utils/pluginsManager";
import MessagingsList from "../components/messagingsList";
import ServiceDialog from "./dialogs/serviceDialog";
import {
  apiGetMiddlewaresRequest,
  apiSetMiddlewareRequest,
  /* apiDeleteMiddlewareRequest, */
  apiPublishRequest,
  apiSaveBotRequest,
} from "../actions/api";
import { appUpdatePublisher } from "../actions/app";
import timezones from "../utils/timezones";

export class DashboardBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bot: props.bot,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.bot !== state.bot) {
      return {
        bot: props.bot,
      };
    }
    return null;
  }

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

  onSelect = ({ /* name, */ state, /* index, */ item }) => {
    const { service, instance } = item;
    if (state === "enable") {
      const serviceName = service.getName();
      let publisher = this.props.publishers[serviceName];

      let status;
      if (publisher) {
        ({ status } = publisher);
      } else {
        publisher = { name: serviceName };
        ({ status } = service);
      }

      publisher.status = status === "start" ? null : "start";
      // console.log("status ", publisher.status, status);
      // this.setState({ servicesEnabled });
      if (publisher.status === "start" && instance === undefined) {
        const name = service.getName();
        const pluginsManager = PluginsManager();
        const newInstance = pluginsManager.instanciate(
          name,
          this.props.selectedBotId,
        );
        this.props.apiSetMiddlewareRequest(
          this.props.selectedBotId,
          newInstance,
        );
      }
      this.props.appUpdatePublisher(this.props.selectedBotId, publisher);
    } else {
      const sdialog = (
        <ServiceDialog
          open
          service={service}
          instance={instance}
          onClosed={this.handleCloseDialog}
          store={this.props.store}
        />
      );
      setTimeout(() => Zrmc.showDialog(sdialog), 100);
    }
  };

  updateMiddlewares(needUpdate = false) {
    if (needUpdate) {
      this.setState({ isLoading: true });
      // Call getMiddlewares
      this.props.apiGetMiddlewaresRequest(
        this.props.selectedBotId,
        "MessengerConnector",
      );
    } else if (this.state.isLoading && !this.props.isLoading) {
      this.setState({ isLoading: false });
    }
  }

  getActives(pluginsManager, startedOnly = false) {
    const servicesEnabled = this.props.publishers;
    const actives = [];
    if (this.props.middlewares && this.props.middlewares.length > 0) {
      const { middlewares } = this.props;
      middlewares.forEach((instance) => {
        const service = pluginsManager.getPlugin(instance.name);
        let status;
        if (servicesEnabled[instance.name]) {
          ({ status } = servicesEnabled[instance.name]);
        } else {
          ({ status } = instance);
        }
        const enabled = status === "start";
        if (service && (enabled || !startedOnly)) {
          actives.push({
            name: service.getTitle(),
            icon: service.getIcon(),
            color: service.getColor(),
            service,
            instance,
            enabled,
            status: instance.status,
          });
        }
      });
    }
    return actives;
  }

  getItemsServices(pluginsManager, actives = []) {
    const services = pluginsManager.getPlugins({
      type: "MessengerConnector",
      activated: true,
    });
    const servicesEnabled = this.props.publishers;
    const items = [];
    services.forEach((service) => {
      // TODO check if the item is already pushed
      let active = null;
      let i = 0;
      for (; i < actives.length; i += 1) {
        if (actives[i].service.getName() === service.getName()) {
          active = actives[i];
          break;
        }
      }
      if (active) {
        items.push(active);
        actives.splice(i, 1);
      } else {
        let status;
        if (servicesEnabled[service.getName()]) {
          ({ status } = servicesEnabled[service.getName()]);
        } else {
          status = "closed";
        }
        const enabled = status === "start";
        items.push({
          name: service.getTitle(),
          icon: service.getIcon(),
          color: service.getColor(),
          service,
          enabled,
          status,
        });
      }
    });
    return items;
  }

  renderMessagingPlatforms() {
    let content = null;
    if (this.state.isLoading) {
      content = <div>Loading</div>;
    } else {
      const pluginsManager = PluginsManager();
      const actives = this.getActives(pluginsManager);
      const items = this.getItemsServices(pluginsManager, actives);
      actives.forEach((active) => {
        items.push(active);
      });

      content = (
        <Panel
          title="Publish to"
          description="You could choose to connect this assistant on one or more of these platforms."
        >
          <MessagingsList items={items} onSelect={this.onSelect} />
        </Panel>
      );
    }

    return content;
  }

  render() {
    if (this.props.bot === null) {
      return null;
    }
    return (
      <Grid>
        <Inner>
          <Cell className="zap-panel zui-color--white" span={12}>
            <form className="opla-dashboard zap-panel_form">
              <Panel
                title={
                  <div className="opla-dashboard_title">
                    <div className="opla-dashboard_icon">
                      <Icon>
                        <svg viewBox="0 0 24 24">
                          <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
                        </svg>
                      </Icon>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div className="opla-dashboard_title_edit">
                        <Icon name="edit" />
                      </div>
                      <TextField
                        defaultValue={this.props.bot.name}
                        onChange={this.handleBotNameChange}
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
              >
                <div style={{ display: "flex" }}>
                  <div>
                    <div>
                      <TextField
                        defaultValue={this.props.bot.description}
                        isTextarea
                        label="Description"
                        onChange={this.handleBotDescriptionChange}
                      />
                    </div>
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
                        label="Timezone"
                        style={{ width: "47%" }}
                        onSelected={this.handleTimezoneChange}
                        selectedIndex={this.props.timezones.findIndex(
                          (tz) => tz === (this.props.bot.timezone || null),
                        )}
                      >
                        {this.props.timezones.map((timezone) => (
                          <MenuItem key={timezone} value={timezone}>
                            {timezone}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div />
                </div>
              </Panel>
            </form>
            {this.renderMessagingPlatforms()}
            <div className="opla-dashboard_actionbar">
              <Button dense outlined>
                Import/Export data
              </Button>
              <Button dense outlined>
                Duplicate
              </Button>
              <Button dense outlined className="warning">
                Delete
              </Button>
            </div>
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
  appUpdatePublisher: PropTypes.func.isRequired,
  apiGetMiddlewaresRequest: PropTypes.func.isRequired,
  apiPublishRequest: PropTypes.func.isRequired,
  apiSetMiddlewareRequest: PropTypes.func.isRequired,
  bot: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    language: PropTypes.string,
    timezone: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  isSignedIn: PropTypes.bool,
  timezones: PropTypes.arrayOf(PropTypes.string).isRequired,
  middlewares: PropTypes.arrayOf(PropTypes.shape({})),
  selectedBotId: PropTypes.string,
  publishers: PropTypes.objectOf(PropTypes.shape({})),
  store: PropTypes.shape({}),
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const middlewares = state.app ? state.app.middlewares : null;
  const publishers = state.app.publishers || {};
  // TODO get selectedBot from selectBotId
  const bot = selectedBotId ? admin.bots[0] : null;

  return {
    bot,
    middlewares,
    publishers,
    selectedBotId,
  };
};

const mapDispatchToProps = (dispatch) => ({
  appUpdatePublisher: (selectedBotId, publisher) => {
    dispatch(appUpdatePublisher(selectedBotId, publisher));
  },
  apiSaveBotRequest: (params) => {
    dispatch(apiSaveBotRequest(params));
  },
  apiPublishRequest: (botId, publishers) => {
    dispatch(apiPublishRequest(botId, publishers));
  },
  apiGetMiddlewaresRequest: (botId, type) => {
    dispatch(apiGetMiddlewaresRequest(botId, type));
  },
  apiSetMiddlewareRequest: (botId, middleware) => {
    dispatch(apiSetMiddlewareRequest(botId, middleware));
  },
});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardBase);
