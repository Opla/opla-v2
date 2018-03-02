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
    this.props.fetchMetrics();
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
                      <span style={valueStyle}>{metrics.users.count}</span>
                      <br />
                      <span style={legendStyle}>users</span>
                    </div>
                  </Cell>

                  <Cell span={4}>
                    <div style={metricStyle}>
                      <span style={valueStyle}>
                        {metrics.conversations.count}
                      </span>
                      <br />
                      <span style={legendStyle}>conversations</span>
                    </div>
                  </Cell>

                  <Cell span={4}>
                    <div style={metricStyle}>
                      <span style={valueStyle}>
                        {metrics.conversations.messages_per_conversation}
                      </span>
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
                      <span style={valueStyle}>
                        {metrics.sessions.duration}ms
                      </span>
                      <br />
                      <span style={legendStyle}>session duration</span>
                    </div>
                  </Cell>

                  <Cell span={4}>
                    <div style={metricStyle}>
                      <span style={valueStyle}>
                        {metrics.errors.rate * 100}%
                      </span>
                      <br />
                      <span style={legendStyle}>errors rate</span>
                    </div>
                  </Cell>

                  <Cell span={4}>
                    <div style={metricStyle}>
                      <span style={valueStyle}>
                        {metrics.responses.speed}ms
                      </span>
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
  appSetTitle: PropTypes.func.isRequired,
  fetchMetrics: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { metrics, user } = state;

  const isSignedIn = user ? user.isSignedIn : false;

  return {
    metrics: metrics.metrics,
    isLoading: metrics.loading,
    isSignedIn,
  };
};

const mapDispatchToProps = (dispatch) => ({
  appSetTitle: (titleName) => {
    dispatch(appSetTitle(titleName));
  },
  fetchMetrics: () => dispatch(apiGetMetricsRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardBase);
