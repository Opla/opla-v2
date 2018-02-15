import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, IconButton, Menu, MenuItem } from "react-mdl";
import { connect } from "react-redux";
import { DialogManager } from "zoapp-ui";
import { apiUserProfileRequest } from "zoapp-front/actions/user";

import SignInDialog from "./signInDialog";
import SignOutDialog from "./signOutDialog";

class UserBox extends Component {
  componentDidUpdate() {
    if ((!this.props.profile) && this.props.isSignedIn) {
      this.props.apiUserProfileRequest();
    }
  }

  handleOpenSignInDialog = () => {
    const dialog = <SignInDialog open onClosed={this.handleCloseDialog} store={this.props.store} />;
    setTimeout(() => { DialogManager.open({ dialog }); }, 100);
  }

  handleOpenSignOutDialog = () => {
    const dialog = (<SignOutDialog
      open
      onClosed={this.handleCloseDialog}
      store={this.props.store}
    />);
    setTimeout(() => { DialogManager.open({ dialog }); }, 100);
  }

  handleCloseDialog = () => {
    setTimeout(() => { DialogManager.close(); }, 100);
  }

  render() {
    if (this.props.isSignedIn) {
      const username = this.props.profile ? this.props.profile.username : "";
      const avatarClass = this.props.profile ? `${this.props.profile.avatar}-icon` : "";
      let avatar = this.props.profile ? this.props.profile.avatar : null;
      if ((!avatar) || avatar === "default") {
        avatar = "account_circle";
      }
      return (
        <div style={this.props.style} >{username}
          <IconButton name={avatar} id="profile-menu" className={avatarClass} />
          <Menu target="profile-menu" align="right">
            <MenuItem disabled>Profile</MenuItem>
            <MenuItem disabled>Settings</MenuItem>
            <MenuItem onClick={(e) => { e.preventDefault(); this.handleOpenSignOutDialog(); }}>
              Sign out
            </MenuItem>
          </Menu>
        </div>);
    }
    return (
      <div>
        <Button onClick={(e) => { e.preventDefault(); this.handleOpenSignInDialog(); }}>
          SignIn
        </Button>
        <IconButton name="account_circle" id="profile-menu" />
        <Menu target="profile-menu" align="right">
          <MenuItem disabled>Recover password</MenuItem>
          <MenuItem disabled>Sign up</MenuItem>
          <MenuItem disabled>Help</MenuItem>
        </Menu>
      </div>);
  }
}

UserBox.propTypes = {
  store: PropTypes.shape({}).isRequired,
  profile: PropTypes.shape({ username: PropTypes.string, avatar: PropTypes.string }),
  isSignedIn: PropTypes.bool,
  apiUserProfileRequest: PropTypes.func.isRequired,
  style: PropTypes.objectOf(PropTypes.string),
};

UserBox.defaultProps = { profile: null, isSignedIn: false, style: null };

const mapStateToProps = (state) => {
  const profile = state.user ? state.user.profile : null;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  return { profile, isSignedIn };
};

const mapDispatchToProps = dispatch => ({
  apiUserProfileRequest: () => {
    dispatch(apiUserProfileRequest());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserBox);
