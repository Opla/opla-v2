/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { appSetTitle } from "zoapp-front/actions/app";

const aboutStyle = {
  fontSize: "18px",
  fontWeight: "300",
  color: "#666",
  margin: "36px",
};
const infoStyle = {
  fontSize: "24px",
  fontWeight: "300",
  color: "#666",
  paddingBottom: "20px",
};

export class About extends Component {
  componentWillMount() {
    this.props.appSetTitle("About");
  }

  render() {
    const { isLoading } = this.props;

    return (
      <div style={aboutStyle}>
        <div style={infoStyle}>{isLoading ? "" : null} </div>
        <p>
          We are Opla, the mightly volcanic team ! Since 2015 we started
          developing this deeptech chatbot solution. We are truly commited to
          OpenSource. And we are fully involved in creating the best and
          complete tool for conversational interface, user oriented.
        </p>
        <p>
          Version<br />0.1 : Amazing Alou (Le Puy Alou : a french volcano) June
          2018<br />
          <a
            href="https://github.com/Opla/"
            target="_blank"
            rel="noreferrer noopener"
          >
            See more on Github
          </a>
        </p>
        <p>
          Thanks to the team and contributors<br />
          Julie, Maali, Marie, Nicolle, Dorian, Loic, Manu, Mik, Thomas, Will,
          Will
        </p>
        <p>
          Follow us on Twitter @opla_ai<br />
          Or contact us hello@opla.ai
        </p>
      </div>
    );
  }
}

About.propTypes = {
  isLoading: PropTypes.bool,
  appSetTitle: PropTypes.func.isRequired,
};
const mapDispatchToProps = (dispatch) => ({
  appSetTitle: (titleName) => {
    dispatch(appSetTitle(titleName));
  },
});

export default connect(null, mapDispatchToProps)(About);
