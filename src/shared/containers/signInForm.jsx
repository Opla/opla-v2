import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Card, CardTitle, CardText, CardActions, Textfield } from "react-mdl";
import { connect } from "react-redux";
import { signIn } from "../actions/signIn";

class SignInForm extends Component {
  handleCloseDialog = () => {
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
      <Card shadow={0} style={{ width: "512px", margin: "auto" }}>
        <CardTitle>Your credentials</CardTitle>
        <CardText>
          <form>
            <Textfield
              autoComplete="username email"
              onChange={this.handleUsernameChange}
              label="Username | Email"
              floatingLabel
              style={{ width: "100%" }}
              ref={(input) => { this.usernameField = input; }}
            /><br />
            <Textfield
              autoComplete="password"
              onChange={this.handlePasswordChange}
              label="Password"
              type="password"
              floatingLabel
              style={{ width: "100%" }}
              ref={(input) => { this.passwordField = input; }}
            />
          </form>
        </CardText>
        <CardActions>
          <Button type="button" onClick={(e) => { e.preventDefault(); this.handleSignIn(); }}>Sign in</Button>
        </CardActions>
      </Card>
    );
  }
}

SignInForm.propTypes = {
  onClosed: PropTypes.func,
  provider: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

SignInForm.defaultProps = {
  onClosed: null,
  provider: null,
};

export default connect()(SignInForm);
