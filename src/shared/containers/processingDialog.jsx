import React, { Component } from "react";
import PropTypes from "prop-types";
import { DialogTitle, DialogContent, DialogActions } from "react-mdl";
import DialogPolyFill from "../components/dialogPolyFill";

export default class ProcessingDialog extends Component {
  constructor(props) {
    super(props);
    const { open } = props;
    this.state = { openDialog: open, id: props.id };
  }

  componentWillReceiveProps(props) {
    if (this.props.open !== props.open) {
      this.setState({ openDialog: props.open });
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
    }
  }

  render() {
    return (
      <DialogPolyFill
        open={this.state.openDialog}
        id={this.state.id}
        onClose={this.handleCloseDialog}
      >
        <DialogTitle>Processing</DialogTitle>
        <DialogContent>
                  Please wait ...
        </DialogContent>
        <DialogActions />
      </DialogPolyFill>
    );
  }
}

ProcessingDialog.defaultProps = {
  open: true,
  id: null,
  onClosed: null,
};

ProcessingDialog.propTypes = {
  open: PropTypes.bool,
  id: PropTypes.string,
  onClosed: PropTypes.func,
};
