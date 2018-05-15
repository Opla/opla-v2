/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid, Inner, Cell } from "zrmc";
import Loading from "zoapp-front/components/loading";

import { appSetTitle } from "../actions/app";
import { apiGetMetricsRequest } from "../actions/api";

const metricStyle = {
  textAlign: "center",
  margin: "1em",
};

const valueStyle = {
  fontSize: "34px",
  fontWeight: "500",
  color: "#888",
  padding: "16px 0",
  lineHeight: "1.1",
};

const errorStyle = {
  fontSize: "34px",
  fontWeight: "500",
  color: "#F44336",
  padding: "16px 0",
  lineHeight: "1.1",
};

const legendStyle = {
  textAlign: "center",
  fontSize: "16px",
  fontWeight: "400",
  color: "#666",
  padding: "60px 0",
  lineHeight: "1.1",
};

export class DashboardBase extends Component {
  componentWillMount() {
    this.props.appSetTitle("Dashboard");
  }

  componentDidMount() {
    if (this.props.selectedBotId) {
      this.props.fetchMetrics(this.props.selectedBotId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedBotId &&
      this.props.selectedBotId !== nextProps.selectedBotId
    ) {
      this.props.fetchMetrics(nextProps.selectedBotId);
    }
  }

  /* eslint-disable class-methods-use-this */
  renderingValue(value, unit) {
    let res;
    if (Number.isNaN(Number(value)) || value === null) {
      res = <span style={errorStyle}>No data</span>;
    } else {
      res = (
        <span style={valueStyle}>
          {value}
          {unit}
        </span>
      );
    }
    return res;
  }

  render() {
    const { isLoading, isSignedIn, metrics } = this.props;

    if (!isSignedIn) {
      return <div>You need to sign in...</div>;
    }

    if (isLoading || !metrics) {
      return <Loading />;
    }

    return (
      <div className="mdl-layout__content mdl-color--grey-100">
        <Grid>
          <Inner>
            <Cell className="mdl-color--white" span={12}>
              <Grid>
                <Inner>
                  <Cell span={12}>
                    <h2>Key metrics</h2>
                  </Cell>
                </Inner>
                <Inner>
                  <Cell span={4}>
                    <div style={metricStyle}>
                      {this.renderingValue(metrics.users.count)}
                      <br />
                      <span style={legendStyle}>users</span>
                    </div>
                  </Cell>

                  <Cell span={4}>
                    <div style={metricStyle}>
                      {this.renderingValue(metrics.conversations.count)}
                      <br />
                      <span style={legendStyle}>conversations</span>
                    </div>
                  </Cell>

                  <Cell span={4}>
                    <div style={metricStyle}>
                      {this.renderingValue(
                        metrics.conversations.messages_per_conversation,
                      )}
                      <br />
                      <span style={legendStyle}>messages/conversations</span>
                    </div>
                  </Cell>
                </Inner>
              </Grid>
            </Cell>
          </Inner>
          <Inner>
            <Cell className="mdl-color--white" span={12}>
              <Grid>
                <Inner>
                  <Cell span={12}>
                    <h2>Platform metrics</h2>
                  </Cell>
                </Inner>

                <Inner>
                  <Cell span={4}>
                    <div style={metricStyle}>
                      {this.renderingValue(metrics.sessions.duration, "ms")}
                      <br />
                      <span style={legendStyle}>session duration</span>
                    </div>
                  </Cell>

                  <Cell span={4}>
                    <div style={metricStyle}>
                      {this.renderingValue(
                        (metrics.errors.rate * 100).toFixed(2),
                        "%",
                      )}
                      <br />
                      <span style={legendStyle}>errors rate</span>
                    </div>
                  </Cell>

                  <Cell span={4}>
                    <div style={metricStyle}>
                      {this.renderingValue(
                        metrics.responses.speed.toFixed(2),
                        "ms",
                      )}
                      <br />
                      <span style={legendStyle}>response time</span>
                    </div>
                  </Cell>
                </Inner>
              </Grid>
            </Cell>
          </Inner>
        </Grid>
      </div>
    );
  }
}

DashboardBase.defaultProps = {
  isLoading: false,
  isSignedIn: false,
  metrics: null,
};

DashboardBase.propTypes = {
  isLoading: PropTypes.bool,
  isSignedIn: PropTypes.bool,
  metrics: PropTypes.shape({}),
  selectedBotId: PropTypes.string,
  appSetTitle: PropTypes.func.isRequired,
  fetchMetrics: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { metrics, user } = state;

  const isSignedIn = user ? user.isSignedIn : false;

  return {
    metrics: metrics.metrics,
    isLoading: metrics.loading,
    selectedBotId: state.app.selectedBotId,
    isSignedIn,
  };
};

const mapDispatchToProps = (dispatch) => ({
  appSetTitle: (titleName) => {
    dispatch(appSetTitle(titleName));
  },
  fetchMetrics: (botId) => dispatch(apiGetMetricsRequest(botId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardBase);
