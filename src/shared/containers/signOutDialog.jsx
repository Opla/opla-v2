import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, DialogTitle, DialogContent, DialogActions } from "react-mdl";
import { connect } from "react-redux";
import { DialogBox } from "zoapp-ui";
import { signOut } from "zoapp-front/actions/auth";

class SignOutDialog extends Component {
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

  handleSignOut = () => {
    const { provider, dispatch } = this.props;
    dispatch(signOut({ provider }));
    this.handleCloseDialog();
  }

  render() {
    return (
      <DialogBox
        open={this.state.openDialog}
        id={this.state.id}
        onClose={this.handleCloseDialog}
      >
        <DialogTitle>Sign out</DialogTitle>
        <DialogContent>
          <div>Are you ok ? </div>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={(e) => { e.preventDefault(); this.handleSignOut(); }}>Yes</Button>
          <Button type="button" onClick={(e) => { e.preventDefault(); this.handleCloseDialog(); }}>Cancel</Button>
        </DialogActions>
      </DialogBox>
    );
  }
}

SignOutDialog.defaultProps = {
  open: true,
  id: null,
  onClosed: null,
  provider: null,
};

SignOutDialog.propTypes = {
  open: PropTypes.bool,
  id: PropTypes.string,
  onClosed: PropTypes.func,
  provider: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(SignOutDialog);
