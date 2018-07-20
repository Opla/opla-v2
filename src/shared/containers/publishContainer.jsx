/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { apiGetBotParametersRequest } from "OplaLibs/actions/api";
import { appSetTitle } from "zoapp-front/actions/app";
// eslint-disable-next-line import/no-unresolved
import config from "../../../config/default.json";

class PublishContainer extends Component {
  constructor(props) {
    super(props);

    this.props.appSetTitle("Webchat");
  }

  componentDidMount() {
    this.props.apiGetBotParametersRequest(this.props.match.params.name);
  }

  render() {
    const { botParameters } = this.props;

    if (botParameters === null || botParameters === undefined) {
      return null;
    } else if (
      !botParameters.application ||
      !botParameters.application.id ||
      !botParameters.application.secret ||
      !botParameters.application.policies
    ) {
      return (
        <div
          style={{
            padding: "8px",
            position: "fixed",
            top: "50%",
            left: "50%",
            color: "red",
            background: "lightgray",
          }}
        >
          {" "}
          Publication failed !<br />You need to republish it in Opla
        </div>
      );
    }

    const parameters = {
      botId: botParameters.botId,
      appId: botParameters.application.id,
      appSecret: botParameters.application.secret,
      host: config.backend.api.host,
      port: config.backend.api.port,
      secure: config.backend.secure,
      anonymous_secret: botParameters.application.policies.anonymous_secret,
      path: "/",
      language: "fr",
    };

    const params = encodeURI(JSON.stringify(parameters));

    return (
      <iframe frameBorder="0" src={`/bot.html?config=${params}`} width="100%" />
    );
  }
}

PublishContainer.propTypes = {
  match: PropTypes.object.isRequired,
  apiGetBotParametersRequest: PropTypes.func.isRequired,
  botParameters: PropTypes.object,
  appSetTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { botParameters } = state.app;

  return { botParameters };
};

const mapDispatchToProps = (dispatch) => ({
  appSetTitle: (titleName) => {
    dispatch(appSetTitle(titleName));
  },
  apiGetBotParametersRequest: (name) =>
    dispatch(apiGetBotParametersRequest(name)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublishContainer);
