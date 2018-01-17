import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, DialogTitle, DialogContent, DialogActions, Textfield } from "react-mdl";
import { connect } from "react-redux";
import DialogPolyFill from "../components/dialogPolyFill";
import { signIn } from "../actions/signIn";

class SignInDialog extends Component {
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

  handleSignIn = () => {
    const username = this.usernameField.inputRef.value;
    const password = this.passwordField.inputRef.value;
    if (username !== "" && password !== "") {
      const { provider, dispatch } = this.props;
      dispatch(signIn({ provider, username, password }));
      this.handleCloseDialog();
    }
  }

  render() {
    return (
      <DialogPolyFill
        open={this.state.openDialog}
        id={this.state.id}
        onClose={this.handleCloseDialog}
      >
        <DialogTitle>Your credentials</DialogTitle>
        <DialogContent>
          <form>
            <Textfield
              onChange={this.handleUsernameChange}
              label="Username | Email"
              floatingLabel
              style={{ width: "200px" }}
              autoComplete="username email"
              ref={(input) => { this.usernameField = input; }}
            />
            <Textfield
              onChange={this.handlePasswordChange}
              label="Password"
              floatingLabel
              type="password"
              style={{ width: "200px" }}
              autoComplete="password"
              ref={(input) => { this.passwordField = input; }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={(e) => { e.preventDefault(); this.handleSignIn(); }}>Sign in</Button>
          <Button type="button" onClick={(e) => { e.preventDefault(); this.handleCloseDialog(); }}>Cancel</Button>
        </DialogActions>
      </DialogPolyFill>
    );
  }
}

SignInDialog.defaultProps = {
  open: true,
  id: null,
  onClosed: null,
  provider: null,
};

SignInDialog.propTypes = {
  open: PropTypes.bool,
  id: PropTypes.string,
  onClosed: PropTypes.func,
  provider: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(SignInDialog);
