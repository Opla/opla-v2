/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Zrmc, { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "zrmc";
import { connect } from "react-redux";
import PluginsManager from "../../utils/pluginsManager";
import MessagingsList from "../../components/messagingsList";
import ServiceDialog from "./serviceDialog";
import {
  apiGetMiddlewaresRequest,
  /* apiSetMiddlewareRequest, apiDeleteMiddlewareRequest, */
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

  onSelect = ({
    /* name, */ state, /* index, */ item,
  }) => {
    // console.log("WIP onSelected", name, state, index);
    const { service, instance } = item;
    if (state === "enable") {
      let status;
      const n = service.getName();
      let publisher = this.props.publishers[n];
      if (publisher) {
        ({ status } = publisher);
      } else {
        publisher = { name: n };
        ({ status } = service);
      }
      publisher.status = status === "start" ? null : "start";
      // console.log("status ", publisher.status, status);
      // this.setState({ servicesEnabled });
      this.props.appUpdatePublisher(this.props.selectedBotId, publisher);
    } else {
      const sdialog = (
        <ServiceDialog
          open
          service={service}
          instance={instance}
          onClosed={this.handleCloseDialog}
          store={this.props.store}
        />);
      setTimeout(() => Zrmc.showDialog(sdialog), 100);
    }
  }

  onAction = (/* action */) => {
    // console.log("WIP onAction=", action);
    // TODO check if services are available
    let ready = false;
    const { publishers } = this.props;
    const keys = Object.keys(publishers);
    if (keys && keys.length > 0) {
      keys.forEach((k) => {
        const pub = publishers[k];
        if (pub.status === "start") {
          ready = true;
        }
      });
    }
    if (ready) {
      this.props.apiPublishRequest(this.props.selectedBotId, publishers);
      // TODO display published dialog with links to service's messenger
      setTimeout(() => {
        Zrmc.closeDialog();
        Zrmc.showDialog({
          header: "Published",
          body: "Published to:",
          onAction: this.handleCloseDialog,
        });
      }, 100);
    } else {
      setTimeout(() => {
        Zrmc.showDialog({
          header: "Error",
          body: "You need at least one service started !",
          onAction: this.handleCloseDialog,
        });
      }, 100);
    }
  }

  handleCloseDialog = () => {
    setTimeout(() => { Zrmc.closeDialog(); }, 100);
  }

  updateMiddlewares(needUpdate = false) {
    if (needUpdate) {
      this.setState({ isLoading: true });
      // Call getMiddlewares
      this.props.apiGetMiddlewaresRequest(
        this.props.selectedBotId,
        "MessengerConnector",
      );
    } else if (this.state.isLoading && (!this.props.isLoading)) {
      this.setState({ isLoading: false });
    }
  }

  renderDialog = () => {
    let content = null;
    if (this.state.isLoading) {
      content = <div>Loading</div>;
    } else {
      const actives = [];
      const pluginsManager = new PluginsManager();
      const services = pluginsManager.getPlugins({ type: "MessengerConnector", activated: true });
      const servicesEnabled = this.props.publishers;
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
          actives.push({
            name: service.getTitle(),
            icon: service.getIcon(),
            color: service.getColor(),
            service,
            instance,
            enabled,
            status: instance.status,
          });
        });
      }
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
        </div>);
    }

    return content;
  }

  render() {
    const title = "Publish";
    const content = this.renderDialog();
    const style = { width: "550px" };
    return (
      <Dialog open={this.state.openDialog} style={style} onClose={this.handleCloseDialog}>
        <DialogHeader>{title}</DialogHeader>
        <DialogBody>{content}</DialogBody>
        <DialogFooter>
          <Button
            type="button"
            onClick={(e) => { e.preventDefault(); this.onAction("publish"); }}
          >Publish
          </Button>
          <Button
            type="button"
            onClick={(e) => { e.preventDefault(); this.handleCloseDialog(); }}
          >Cancel
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
  /* apiSetMiddlewareRequest: PropTypes.func.isRequired,
  apiDeleteMiddlewareRequest: PropTypes.func.isRequired, */
};

const mapStateToProps = (state) => {
  const middlewares = state.app ? state.app.middlewares : null;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  // const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.app.loading;
  const publishers = state.app.publishers || { };
  return {
    middlewares, selectedBotId, isLoading, publishers,
  };
};

const mapDispatchToProps = dispatch => ({
  appUpdatePublisher: (botId, publisher) => {
    dispatch(appUpdatePublisher(botId, publisher));
  },
  apiPublishRequest: (botId, publishers) => {
    dispatch(apiPublishRequest(botId, publishers));
  },
  apiGetMiddlewaresRequest: (botId, type) => {
    dispatch(apiGetMiddlewaresRequest(botId, type));
  },
  /* apiSetMiddlewareRequest: (botId, middleware) => {
    dispatch(apiSetMiddlewareRequest(botId, middleware));
  },
  apiDeleteMiddlewareRequest: (botId, middleware) => {
    dispatch(apiDeleteMiddlewareRequest(botId, middleware));
  }, */
});

export default connect(mapStateToProps, mapDispatchToProps)(PublishDialog);
