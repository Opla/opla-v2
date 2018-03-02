/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Zrmc, { Button } from "zrmc";
import { connect } from "react-redux";
import PublishDialog from "./dialogs/publishDialog";

class BuilderBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onAction = (action) => {
    // console.log("TODO Publish");
    if (action === "Publish") {
      return false;
    }
    return true;
  };

  handleOpenPublishDialog = () => {
    const dialog = (
      <PublishDialog open onAction={this.onAction} store={this.props.store} />
    );
    Zrmc.showDialog(dialog);
  };

  render() {
    if (this.props.isSignedIn) {
      const style = { paddingRight: "20%" };
      return (
        <div style={style}>
          <Button
            raised
            onClick={(e) => {
              e.preventDefault();
              this.handleOpenPublishDialog();
            }}
          >
            Publish
          </Button>
        </div>
      );
    }
    return <div />;
  }
}

BuilderBox.defaultProps = {
  isSignedIn: false,
  store: null,
};

BuilderBox.propTypes = {
  isSignedIn: PropTypes.bool,
  store: PropTypes.shape({}),
};

const mapStateToProps = (state) => {
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.app.loading;
  return { selectedBotId, isSignedIn, isLoading };
};

export default connect(mapStateToProps)(BuilderBox);
