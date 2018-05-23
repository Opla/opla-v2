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
// eslint-disable-next-line import/no-unresolved
import config from "../../../config/default.json";

class PublishContainer extends Component {
  componentDidMount() {
    this.props.apiGetBotParametersRequest(this.props.match.params.name);
  }

  render() {
    const { botParameters } = this.props;

    if (botParameters === null || botParameters === undefined) {
      return null;
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

    return <iframe src={`/bot.html?config=${params}`} width="100%" />;
  }
}

PublishContainer.propTypes = {
  match: PropTypes.object.isRequired,
  apiGetBotParametersRequest: PropTypes.func.isRequired,
  botParameters: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { botParameters } = state.app;

  return { botParameters };
};

const mapDispatchToProps = (dispatch) => ({
  apiGetBotParametersRequest: (name) =>
    dispatch(apiGetBotParametersRequest(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PublishContainer);
