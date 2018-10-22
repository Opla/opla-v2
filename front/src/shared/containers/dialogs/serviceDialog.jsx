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
  DialogHeader,
  DialogBody,
  DialogFooter,
  Dialog,
} from "zrmc";
import { importSettingsComponent } from "../../../plugins";

export class ServiceDialogBase extends Component {
  constructor(props) {
    super(props);
    const { open } = props;
    this.state = { openDialog: open, error: false };
    this.settingsRef = React.createRef();
  }

  componentDidMount() {
    this.loadSettingsComponent();
  }

  static getDerivedStateFromProps(props, state) {
    if (state.openDialog !== props.open) {
      return { openDialog: props.open };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.lastMiddleware &&
      prevProps.lastMiddleware !== this.props.lastMiddleware
    ) {
      const instance = prevProps.lastMiddleware;
      this.setState({ instance });
    }
  }

  loadSettingsComponent() {
    const { plugin } = this.props;
    const { name } = plugin;
    importSettingsComponent(name)
      .then((component) => {
        this.setState({ SettingsComponent: component.default });
      })
      .catch(() => {
        // eslint-disable-next-line
        console.error(
          `cant find plugins ${name}/settings.js component`,
        );
        this.setState({ error: true });
      });
  }

  onAction = (action) => {
    if (this.settingsRef) {
      this.settingsRef.current.onAction(action);
    }
  };

  handleOpenDialog = () => {
    this.setState({
      openDialog: true,
    });
  };

  handleCloseDialog = () => {
    this.setState({
      openDialog: false,
    });
    if (this.props.onClosed instanceof Function) {
      this.props.onClosed();
    } else {
      setTimeout(() => {
        Zrmc.closeDialog();
      }, 300);
    }
  };

  handleSavePlugin = (plugin) => {
    this.props.apiSetPluginRequest(plugin);
    Zrmc.closeDialog();
  };

  render() {
    const { plugin } = this.props;
    const title = plugin.title || plugin.name;
    const { SettingsComponent } = this.state;
    const style = { width: "550px" };
    return (
      <Dialog
        open={this.state.openDialog}
        style={style}
        onClose={this.handleCloseDialog}
      >
        <DialogHeader>{title} - settings</DialogHeader>
        <DialogBody>
          {SettingsComponent && (
            <SettingsComponent
              ref={this.settingsRef}
              plugin={plugin}
              botId={this.props.botId}
              onAction={this.onAction}
              handleSavePlugin={this.handleSavePlugin}
              publicUrl={this.props.publicUrl}
              appId={plugin.config}
            />
          )}
          {!SettingsComponent &&
            this.state.error && (
              <div>
                This plugin does not have a configuration page available
              </div>
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
            Cancel
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              this.onAction("save");
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }
}

ServiceDialogBase.defaultProps = {
  open: true,
  instance: null,
  plugin: null,
  publicUrl: null,
  onClosed: null,
  onAction: null,
};

ServiceDialogBase.propTypes = {
  open: PropTypes.bool,
  plugin: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
  }),
  botId: PropTypes.string,
  publicUrl: PropTypes.string,
  onClosed: PropTypes.func,
  onAction: PropTypes.func,
  apiSetPluginRequest: PropTypes.func.isRequired,
};

export default ServiceDialogBase;
