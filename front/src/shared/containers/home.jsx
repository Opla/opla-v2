/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Button } from "zrmc";
import { connect } from "react-redux";
import { appSetTitleName } from "zoapp-front/dist/actions/app";
import Assistants from "./assistants";

export class HomeBase extends Component {
  constructor(props) {
    super();
    this.state = {
      name: "",
      email: "",
      username: "",
      password: "",
      language: null,
      loading: false,
      selectedTemplate: null,
      template: null,
    };
    props.appSetTitleName(
      <div className="opla-title">
        <img src="images/opla-bubble.svg" />
        <div>opla</div>
      </div>,
      "opla",
    );
  }

  render() {
    if (this.props.isSignedIn) {
      return (
        <div className="zui-layout__content zui-color--white">
          <Assistants />
        </div>
      );
    }
    return (
      <div className="zui-layout__content zui-color--white">
        <section className="text-section">
          <div className="opla-home">
            <h1>
              Welcome to the future, Opla will help you automate boring tasks |
            </h1>
            <div>
              Opla is an open source software you can use to create and bring up
              virtual assistant, chatbot, conversational interface to work on
              painfull routine.
            </div>
            <div>
              <Button
                raised
                onClick={() => {
                  this.props.history.push("/create");
                }}
              >
                Create my first assistant
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

HomeBase.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  appSetTitleName: PropTypes.func.isRequired,
  history: PropTypes.shape({ length: PropTypes.number, push: PropTypes.func })
    .isRequired,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.loading;
  return { admin, isLoading, isSignedIn };
};

const mapDispatchToProps = (dispatch) => ({
  appSetTitleName: (title, name) => {
    dispatch(appSetTitleName(title, name));
  },
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(HomeBase),
);
