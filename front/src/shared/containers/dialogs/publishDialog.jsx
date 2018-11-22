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
import { apiGetPluginsRequest } from "zoapp-front/dist/actions/api";
import { getInstalledPlugins } from "../../selectors/pluginsSelector";
import { apiPublishRequest } from "../../actions/api";
import { appUpdatePublisher } from "../../actions/app";

class PublishDialogBase extends Component {
  constructor(props) {
    super(props);
    const openDialog = props.open;
    this.state = {
      selectedBotId: props.selectedBotId,
      openDialog,
    };
    // Publish bot
    PublishDialogBase.publishBot(props);
    PublishDialogBase.loadPlugins(props);
  }

  static getDerivedStateFromProps(props, state) {
    // on bot change
    if (props.selectedBotId !== state.selectedBotId) {
      // load plugins used by this bot
      PublishDialogBase.loadPlugins(props);
      return {
        selectedBotId: props.selectedBotId,
      };
    }
    return null;
  }

  static loadPlugins = (props) => {
    props.apiGetPluginsRequest(props.selectedBotId);
  };

  static publishBot = (props) => {
    props.apiPublishRequest(props.selectedBotId);
  };

  handleCloseDialog = () => {
    setTimeout(() => {
      Zrmc.closeDialog();
    }, 100);
  };

  PublishDialogList = (props) => (
    <List twoLine>
      {props.items.map((item) => {
        let url = "";
        if (item.middleware) {
          ({ url } = item.middleware);
          const regex = /^(http|https).*$/;
          if (regex.test(url) === false) {
            url = `${window.location.origin}${url}`;
          }
        }

        return (
          <ListItem
            key={item.title}
            secondaryText={url}
            href={url}
            target="_blank"
            rel="noreferrer noopener"
          >
            {item.title}
          </ListItem>
        );
      })}
    </List>
  );

  render() {
    const style = { width: "550px" };
    const items = this.props.pluginsToPublish;

    return (
      <Dialog
        open={this.state.openDialog}
        style={style}
        onClose={this.handleCloseDialog}
      >
        <DialogHeader>Published to platforms</DialogHeader>
        <DialogBody>
          {items.length > 0 ? (
            <this.PublishDialogList items={items} />
          ) : (
            <div>Nothing published</div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              this.handleCloseDialog();
            }}
          >
            Ok
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }
}

PublishDialogBase.defaultProps = {
  open: true,
  selectedBotId: null,
  store: null,
};

PublishDialogBase.propTypes = {
  open: PropTypes.bool,
  selectedBotId: PropTypes.string,
  publishers: PropTypes.objectOf(PropTypes.shape({})),
  pluginsToPublish: PropTypes.array,
  store: PropTypes.shape({}),
  apiGetPluginsRequest: PropTypes.func.isRequired,
  apiPublishRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  // const isSignedIn = state.user ? state.user.isSignedIn : false;
  const plugins = state.app.plugins || [];

  const installedPlugins = getInstalledPlugins(plugins);

  const messengerConnector = installedPlugins.MessengerConnector;
  const pluginsToPublish = messengerConnector.filter(
    (plugin) =>
      plugin.type === "MessengerConnector" &&
      plugin.middleware &&
      plugin.middleware.status === "start",
  );
  return {
    selectedBotId,
    pluginsToPublish,
  };
};

const mapDispatchToProps = (dispatch) => ({
  appUpdatePublisher: (botId, publisher) => {
    dispatch(appUpdatePublisher(botId, publisher));
  },
  apiPublishRequest: (botId) => {
    dispatch(apiPublishRequest(botId));
  },
  apiGetPluginsRequest: (botId) => {
    dispatch(apiGetPluginsRequest(botId));
  },
});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublishDialogBase);
