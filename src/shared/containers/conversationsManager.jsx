import React, { Component } from "react";
import PropTypes from "prop-types";
import { Content } from "react-mdl";
import { connect } from "react-redux";
import { appSetTitle } from "../actions/app";

class ConversationsManager extends Component {
  componentWillMount() {
    this.props.appSetTitle("Users");
  }

  render() {
    return (
      <Content className="mdl-color--grey-100">
        <section className="text-section" style={{ margin: "40px" }}>
          <div>Users : TODO</div>
        </section>
      </Content>
    );
  }
}

ConversationsManager.propTypes = {
  appSetTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.loading;
  return { admin, isLoading, isSignedIn };
};

const mapDispatchToProps = dispatch => ({
  appSetTitle: (titleName) => {
    dispatch(appSetTitle(titleName));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ConversationsManager);
