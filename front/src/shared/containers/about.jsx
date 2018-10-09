/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { appSetTitleName } from "zoapp-front/dist/actions/app";

const aboutStyle = {
  margin: "5% 40% 10% 10%",
};

class About extends Component {
  constructor(props) {
    super();
    props.appSetTitleName("About");
  }

  render() {
    const { isLoading } = this.props;

    return (
      <div style={aboutStyle}>
        {isLoading ? "" : null}
        <h1>Essential</h1>
        <h4>Your own virtual assistant</h4>
        <p>
          We are Opla, the mighty volcanic team! Since 2015 we started
          developing this deeptech chatbot solution. Nowadays we are truly
          commited to OpenSource and fully involved in creating the most
          complete and user oriented conversational interface tool.
        </p>
        <h1>Version</h1>
        <h4>V0.1 - Amazing Alou </h4>
        <p>
          (Le Puy Alou : a french volcano) July 2018<br />
          <a
            href="https://github.com/Opla/"
            target="_blank"
            rel="noreferrer noopener"
          >
            See more on Github
          </a>
        </p>
        <h1>Contributors</h1>
        <h4>Thanks to the team and contributors</h4>
        <p>
          Elodie, Julie, Maali, Marie, Nicolle, Adil, Dorian, Florian, Loic,
          Manu, Mik, Thomas, Will, Will<br />
          <a
            href="https://github.com/Opla/joinUs"
            target="_blank"
            rel="noreferrer noopener"
          >
            And we are hiring !
          </a>
        </p>
        <p>
          Follow us on Twitter
          <a
            href="https://twitter.com/opla_ai/"
            target="_blank"
            rel="noreferrer noopener"
          >
            @opla_ai
          </a>
          <br />
          Or contact us hello@opla.ai
        </p>
      </div>
    );
  }
}

About.propTypes = {
  isLoading: PropTypes.bool,
  appSetTitleName: PropTypes.func.isRequired,
};
const mapDispatchToProps = (dispatch) => ({
  appSetTitleName: (titleName) => {
    dispatch(appSetTitleName(titleName));
  },
});

// prettier-ignore
export default connect(
  null,
  mapDispatchToProps,
)(About);
