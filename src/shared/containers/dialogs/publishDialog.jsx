/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Zrmc, {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  List,
  ListItem,
} from "zrmc";
import { connect } from "react-redux";
import PluginsManager from "../../utils/pluginsManager";
import MessagingsList from "../../components/messagingsList";
import ServiceDialog from "./serviceDialog";
import {
  apiGetMiddlewaresRequest,
  apiSetMiddlewareRequest,
  /* apiDeleteMiddlewareRequest, */
  apiPublishRequest,
} from "../../actions/api";
import { appUpdatePublisher } from "../../actions/app";

class PublishDialog extends Component {
  constructor(props) {
    super(props);
    const openDialog = props.open;
    this.state = { openDialog, isLoading: true };
  }

  componentDidMount() {
    this.updateMiddlewares(true);
  }

  componentDidUpdate() {
    this.updateMiddlewares();
  }

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

  onAction = (/* action */) => {
    // console.log("WIP onAction=", action);
    // TODO check if services are available
    const { publishers, middlewares } = this.props;
    const keys = Object.keys(publishers);

    if (keys.length === 0) {
      setTimeout(() => {
        Zrmc.showDialog({
          header: "Error",
          body: "You need at least one service started !",
          onAction: this.handleCloseDialog,
        });
      }, 100);
    }

    /* const unpublish = {};
    if (keys && keys.length > 0) {
      keys.forEach((k) => {
        const pub = publishers[k];
        if (pub.status !== "start") {
          unpublish[k] = pub;
          delete publishers[k];
          const index = middlewares.findIndex(
            (middleware) => middleware.name === k,
          );

          if (index > -1) {
            delete middlewares[index];
          }
        }
      });
    } */
    console.log("publisher", publishers);
    if (Object.keys(publishers).length > 0) {
      this.props.apiPublishRequest(this.props.selectedBotId, publishers);
    }

    const updateMiddleware = (plugins) => {
      const pluginsManager = PluginsManager();
      const pluginsKey = Object.keys(plugins);
      pluginsKey.forEach((key) => {
        // console.log("plugin=", plugins[key]);
        const index = middlewares.findIndex(
          (middleware) => middleware.name === key,
        );
        let instance = null;
        if (index > -1) {
          instance = middlewares[index];
          // console.log("middleware=", middlewares[index]);
        } else {
          instance = pluginsManager.instanciate(
            plugins[key].name,
            this.props.selectedBotId,
          );
        }

        if (plugins[key].status) {
          instance.status = plugins[key].status;
        }
        this.props.apiSetMiddlewareRequest(this.props.selectedBotId, instance);
      });
    };

    updateMiddleware(publishers);
    // updateMiddleware(unpublish);
    this.updateMiddlewares(true);

    // TODO display published dialog with links to service's messenger
    setTimeout(() => {
      Zrmc.closeDialog();
      const pluginsManager = PluginsManager();
      const items = this.getActives(pluginsManager, true);
      Zrmc.showDialog({
        header: "Published to platforms",
        body: (
          <List twoLine>
            {items.map((item) => {
              let url = "";
              if (item.instance) {
                ({ url } = item.instance);
                const regex = /^(http|https).*$/;
                if (regex.test(url) === false) {
                  url = `${window.location.origin}${url}`;
                }
              }

              return (
                <ListItem
                  key={item.name}
                  secondaryText={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {item.name}
                </ListItem>
              );
            })}
          </List>
        ),
        onAction: this.handleCloseDialog,
      });
    }, 100);
  };

  handleCloseDialog = () => {
    setTimeout(() => {
      Zrmc.closeDialog();
    }, 100);
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
        if (enabled || !startedOnly) {
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

  renderDialog() {
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
        <div style={{ marginBottom: "48px" }}>
          <MessagingsList
            items={items}
            name="Choose messaging platform(s) to publish to"
            onSelect={this.onSelect}
          />
        </div>
      );
    }

    return content;
  }

  render() {
    const title = "Publish";
    const style = { width: "550px" };

    return (
      <Dialog
        open={this.state.openDialog}
        style={style}
        onClose={this.handleCloseDialog}
      >
        <DialogHeader>{title}</DialogHeader>
        <DialogBody>{this.renderDialog()}</DialogBody>
        <DialogFooter>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              this.handleCloseDialog();
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              this.onAction("publish");
            }}
          >
            Validate
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }
}

PublishDialog.defaultProps = {
  open: true,
  middlewares: null,
  selectedBotId: null,
  isLoading: false,
  publishers: null,
  store: null,
};

PublishDialog.propTypes = {
  open: PropTypes.bool,
  middlewares: PropTypes.arrayOf(PropTypes.shape({})),
  selectedBotId: PropTypes.string,
  isLoading: PropTypes.bool,
  publishers: PropTypes.objectOf(PropTypes.shape({})),
  store: PropTypes.shape({}),
  appUpdatePublisher: PropTypes.func.isRequired,
  apiGetMiddlewaresRequest: PropTypes.func.isRequired,
  apiPublishRequest: PropTypes.func.isRequired,
  apiSetMiddlewareRequest: PropTypes.func.isRequired,
  // apiDeleteMiddlewareRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const middlewares = state.app ? state.app.middlewares : null;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  // const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.app.loading;
  const publishers = state.app.publishers || {};
  return {
    middlewares,
    selectedBotId,
    isLoading,
    publishers,
  };
};

const mapDispatchToProps = (dispatch) => ({
  appUpdatePublisher: (botId, publisher) => {
    dispatch(appUpdatePublisher(botId, publisher));
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
  /* apiDeleteMiddlewareRequest: (botId, middleware) => {
    dispatch(apiDeleteMiddlewareRequest(botId, middleware));
  }, */
});

export default connect(mapStateToProps, mapDispatchToProps)(PublishDialog);
