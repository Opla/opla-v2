import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, DialogTitle, DialogContent, DialogActions } from "react-mdl";
import { connect } from "react-redux";
import { DialogManager, DialogBox } from "zoapp-ui";
import { apiSetMiddlewareRequest } from "../actions/api";
import PluginsManager from "../utils/pluginsManager";
/* eslint-enable no-unused-vars */

class ServiceDialog extends Component {
  constructor(props) {
    super(props);
    const { open, instance } = props;
    this.state = { openDialog: open, instance };
  }

  componentDidMount() {
    this.updateMiddleware();
  }

  componentWillReceiveProps(props) {
    if (this.props.open !== props.open) {
      this.setState({ openDialog: props.open });
    }
    if (this.props.lastMiddleware) {
      const instance = this.props.lastMiddleware;
      this.setState({ instance });
    }
  }

  onAction = (action) => {
    const { service } = this.props;
    const { instance } = this.state;
    const title = service.name;
    if (action === "save" && this.props.onAction) {
      this.props.onAction(title, service, instance);
    }
  }

  handleOpenDialog = () => {
    this.setState({
      openDialog: true,
    });
  }

  handleCloseDialog = () => {
    this.setState({
      openDialog: false,
    });
    if (this.props.onClosed instanceof Function) {
      this.props.onClosed();
    } else {
      setTimeout(() => { DialogManager.close(); }, 300);
    }
  }

  updateMiddleware() {
    const origin = this.props.selectedBotId;
    const { service } = this.props;
    if (origin && service) {
      const name = service.getName();
      const pluginsManager = new PluginsManager();
      const instance = pluginsManager.instanciate(name, origin);
      this.props.apiSetMiddlewareRequest(origin, instance);
    }
  }

  render() {
    const { service } = this.props;
    const { instance } = this.state;
    const title = service.getTitle();
    let content = null;
    if (instance) {
      content = service.renderSettings(instance, this.onAction, this.props.publicUrl);
    } else {
      content = <div>Loading</div>;
    }
    const style = { width: "550px" };
    return (
      <DialogBox open={this.state.openDialog} style={style} onClose={this.handleCloseDialog}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={(e) => { e.preventDefault(); this.onAction("save"); }}
          >Save
          </Button>
          <Button
            type="button"
            onClick={(e) => { e.preventDefault(); this.handleCloseDialog(); }}
          >Cancel
          </Button>
        </DialogActions>
      </DialogBox>
    );
  }
}

ServiceDialog.defaultProps = {
  open: true,
  instance: null,
  service: null,
  selectedBotId: null,
  lastMiddleware: null,
  publicUrl: null,
  onClosed: null,
  onAction: null,
};

ServiceDialog.propTypes = {
  open: PropTypes.bool,
  instance: PropTypes.shape({}),
  service: PropTypes.shape({}),
  selectedBotId: PropTypes.string,
  lastMiddleware: PropTypes.shape({}),
  publicUrl: PropTypes.string,
  onClosed: PropTypes.func,
  onAction: PropTypes.func,
  apiSetMiddlewareRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const lastMiddleware = state.app ? state.app.lastMiddleware : null;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const publicUrl = state.app ? state.app.admin.publicUrl : null;
  return {
    lastMiddleware, selectedBotId, publicUrl,
  };
};

const mapDispatchToProps = dispatch => ({
  apiSetMiddlewareRequest: (botId, middleware) => {
    dispatch(apiSetMiddlewareRequest(botId, middleware));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDialog);
