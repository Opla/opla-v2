import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-mdl";
import { DialogManager } from "zoapp-ui";
import { connect } from "react-redux";
import PublishDialog from "./publishDialog";

class BuilderBox extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  onAction = (action) => {
    console.log("TODO Publish");
    if (action === "Publish") {
      return false;
    }
    return true;
  }

  handleOpenPublishDialog = () => {
    const dialog = <PublishDialog open onAction={this.onAction} store={this.props.store} />;
    DialogManager.open({ dialog });
  }

  render() {
    if (this.props.isSignedIn) {
      const style = { paddingRight: "20%" };
      return (
        <div style={style}>
          <Button
            raised
            colored
            onClick={(e) => { e.preventDefault(); this.handleOpenPublishDialog(); }}
          >
          Publish
          </Button>
        </div>);
    }
    return (<div />);
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
