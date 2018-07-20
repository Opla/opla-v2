/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid, Inner, Cell, Icon } from "zrmc";
import Loading from "zoapp-front/components/loading";

import { appSetTitle } from "zoapp-front/actions/app";
import { apiGetMetricsRequest } from "../actions/api";

const metricStyle = {
  textAlign: "right",
  padding: "24px",
  display: "flex",
  color: "white",
};

const valueStyle = {
  fontSize: "34px",
  fontWeight: "500",
  color: "white",
  lineHeight: "1.1",
};

const errorStyle = {
  fontWeight: "500",
  color: "#F44336",
  padding: "16px 0",
  lineHeight: "1.1",
};

const legendStyle = {
  fontSize: "16px",
  fontWeight: "400",
  color: "white",
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
            <Cell className="mdl-color--white mdc-elevation--z1" span={12}>
              <Grid>
                <Inner>
                  <Cell span={12}>
                    <h2>Key metrics</h2>
                  </Cell>
                </Inner>
                <Inner>
                  <Cell span={4}>
                    <div
                      style={{
                        ...metricStyle,
                        background: "#1a237e",
                      }}
                    >
                      <Icon
                        style={{
                          textAlign: "left",
                          width: "30%",
                          fontSize: "48px",
                        }}
                        name="perm_identity"
                      />
                      <span style={{ textAlign: "right", width: "70%" }}>
                        {this.renderingValue(metrics.users.count)}
                        <br />
                        <span style={legendStyle}>users</span>
                      </span>
                    </div>
                  </Cell>

                  <Cell span={4}>
                    <div style={{ ...metricStyle, background: "#f57f17" }}>
                      <Icon
                        style={{
                          textAlign: "left",
                          width: "30%",
                          fontSize: "48px",
                        }}
                        name="chat"
                      />
                      <span style={{ textAlign: "right", width: "70%" }}>
                        {this.renderingValue(metrics.conversations.count)}
                        <br />
                        <span style={legendStyle}>conversations</span>
                      </span>
                    </div>
                  </Cell>

                  <Cell span={4}>
                    <div style={{ ...metricStyle, background: "#827717" }}>
                      <Icon
                        style={{
                          textAlign: "left",
                          width: "30%",
                          fontSize: "48px",
                        }}
                        name="forum"
                      />
                      <span
                        style={{
                          textAlign: "right",
                          width: "70%",
                          overflow: "hidden",
                        }}
                      >
                        {this.renderingValue(
                          metrics.conversations.messages_per_conversation,
                        )}
                        <br />
                        <span style={legendStyle}>messages/conversations</span>
                      </span>
                    </div>
                  </Cell>
                </Inner>
              </Grid>
            </Cell>
          </Inner>
          <Inner>
            <Cell
              className="mdl-color--white mdc-elevation--z1"
              style={{ marginTop: "24px" }}
              span={12}
            >
              <Grid>
                <Inner>
                  <Cell span={12}>
                    <h2>Platform metrics</h2>
                  </Cell>
                </Inner>

                <Inner>
                  <Cell span={4}>
                    <div style={{ ...metricStyle, background: "#4a148c" }}>
                      <Icon
                        style={{
                          textAlign: "left",
                          width: "30%",
                          fontSize: "48px",
                        }}
                        name="hourglass_empty"
                      />
                      <span style={{ textAlign: "right", width: "70%" }}>
                        {this.renderingValue(metrics.sessions.duration, "ms")}
                        <br />
                        <span style={legendStyle}>session duration</span>
                      </span>
                    </div>
                  </Cell>

                  <Cell span={4}>
                    <div style={{ ...metricStyle, background: "#004d40" }}>
                      <Icon
                        style={{
                          textAlign: "left",
                          width: "30%",
                          fontSize: "48px",
                        }}
                        name="error"
                      />
                      <span style={{ textAlign: "right", width: "70%" }}>
                        {this.renderingValue(
                          (metrics.errors.rate * 100).toFixed(2),
                          "%",
                        )}
                        <br />
                        <span style={legendStyle}>errors rate</span>
                      </span>
                    </div>
                  </Cell>

                  <Cell span={4}>
                    <div style={{ ...metricStyle, background: "#bf360c" }}>
                      <Icon
                        style={{
                          textAlign: "left",
                          width: "30%",
                          fontSize: "48px",
                        }}
                        name="grade"
                      />
                      <span style={{ textAlign: "right", width: "70%" }}>
                        {this.renderingValue(
                          metrics.responses.speed.toFixed(2),
                          "ms",
                        )}
                        <br />
                        <span style={legendStyle}>response time</span>
                      </span>
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

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardBase);
