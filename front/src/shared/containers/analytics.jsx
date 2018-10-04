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
import Panel from "zoapp-front/components/panel";
import { apiGetMetricsRequest } from "../actions/api";

export class AnalyticsBase extends Component {
  componentDidMount() {
    if (this.props.selectedBotId) {
      this.props.fetchMetrics(this.props.selectedBotId);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.selectedBotId &&
      this.props.selectedBotId !== prevProps.selectedBotId
    ) {
      this.props.fetchMetrics(this.props.selectedBotId);
    }
  }

  /* eslint-disable class-methods-use-this */
  renderingValue(value, unit) {
    let res;
    if (Number.isNaN(Number(value)) || value === null) {
      res = <span className="opla-analytics_error">No data</span>;
    } else {
      res = (
        <span className="opla-analytics_value">
          {value}
          <span className="opla-analytics_unit">{unit}</span>
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
      <div className="opla-analytics zui-layout__content zui-color--grey-100">
        <Grid>
          <Inner>
            <Cell className="zui-color--white" span={12}>
              <Panel title="Key metrics">
                <div className="opla-analytics_subpanel">
                  <div className="opla-analytics_metric">
                    <div>
                      {this.renderingValue(metrics.users.count)}
                      <div className="opla-analytics_legend">Users</div>
                    </div>
                  </div>
                  <div className="opla-analytics_metric">
                    <div>
                      {this.renderingValue(metrics.conversations.count)}
                      <div className="opla-analytics_legend">Conversations</div>
                    </div>
                  </div>
                  <div className="opla-analytics_metric">
                    <div>
                      {this.renderingValue(
                        metrics.conversations.messages_per_conversation,
                      )}
                      <div className="opla-analytics_legend">Messages</div>
                    </div>
                  </div>
                </div>
              </Panel>
            </Cell>
          </Inner>
          <Inner>
            <Cell
              className="zui-color--white"
              style={{ paddingTop: "96px" }}
              span={12}
            >
              <Panel title="Platform metrics">
                <div className="opla-analytics_subpanel">
                  <div className="opla-analytics_metric">
                    <div>
                      {this.renderingValue(metrics.sessions.duration, "ms")}
                      <div className="opla-analytics_legend">
                        Session duration
                      </div>
                    </div>
                  </div>
                  <div className="opla-analytics_metric">
                    <div>
                      {this.renderingValue(
                        (metrics.errors.rate * 100).toFixed(2),
                        "%",
                      )}
                      <div className="opla-analytics_legend">Errors rate</div>
                    </div>
                  </div>
                  <div className="opla-analytics_metric">
                    <div>
                      {this.renderingValue(
                        metrics.responses.speed.toFixed(2),
                        "ms",
                      )}
                      <div className="opla-analytics_legend">Response time</div>
                    </div>
                  </div>
                </div>
              </Panel>
            </Cell>
          </Inner>
        </Grid>
      </div>
    );
  }
}

AnalyticsBase.defaultProps = {
  isLoading: false,
  isSignedIn: false,
  metrics: null,
};

AnalyticsBase.propTypes = {
  isLoading: PropTypes.bool,
  isSignedIn: PropTypes.bool,
  metrics: PropTypes.shape({}),
  selectedBotId: PropTypes.string,
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
  fetchMetrics: (botId) => dispatch(apiGetMetricsRequest(botId)),
});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnalyticsBase);
