/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import { Button } from "zrmc";
import { connect } from "react-redux";

const Home = () => (
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
          <Button raised link="/create">
            Create my first assistant
          </Button>
        </div>
      </div>
    </section>
  </div>
);

Home.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.loading;
  return { admin, isLoading, isSignedIn };
};

export default connect(mapStateToProps)(Home);
