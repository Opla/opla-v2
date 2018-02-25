import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid, Inner, Cell, Button } from "zrmc";
import Loading from "zoapp-front/components/loading";

import DonutChart from "../components/donutChart";
import { appSetTitle } from "../actions/app";

class Dashboard extends Component {
  componentWillMount() {
    this.props.appSetTitle("Dashboard");
  }

  render() {
    const infoStyle = {
      textAlign: "center",
      fontSize: "28px",
      fontWeight: "400",
      color: "#888",
      padding: "16px 0",
      lineHeight: "1.1",
    };
    const infoStyleB = {
      textAlign: "center",
      fontSize: "16px",
      fontWeight: "400",
      color: "#666",
      padding: "60px 0",
      lineHeight: "1.1",
    };
    const infoStyleC = {
      fontSize: "16px",
      fontWeight: "400",
      color: "green",
      padding: "60px 0",
      lineHeight: "1.1",
    };
    const infoStyleD = {
      fontSize: "16px",
      fontWeight: "400",
      color: "#666",
      padding: "16px",
      lineHeight: "1.1",
    };

    const { isLoading } = this.props;
    if (!this.props.isSignedIn) {
      return (<div>You need to sign in...</div>);
    } else if (isLoading || this.props.admin == null) {
      return (<Loading />);
    }
    const { admin } = this.props;
    const usersCount = admin.users != null ? admin.users.count : 0;
    const conversationsCount = admin.conversations != null ? admin.conversations.count : 0;
    const messagesCount = admin.messages != null ? admin.messages.count : 0;
    return (
      <div className="mdl-layout__content mdl-color--grey-100">
        <Grid>
          <Inner>
            <Cell className="mdl-color--white" span={12}>
              <div style={infoStyleD}>
                Last 7 days |  Filter: All

                <Button
                  raised
                  style={{ float: "right", marginBottom: "16px" }}
                >
                  Export
                </Button>
                <Button
                  raised
                  style={{ float: "right", marginBottom: "16px", marginRight: "16px" }}
                >
                  Edit
                </Button>
              </div>

            </Cell>
          </Inner>
          <Inner>
            <Cell className="mdl-color--white" span={12}>
              <Grid>
                <Inner>
                  <Cell span={4}>
                    <div style={infoStyle}>
                      <span style={infoStyle}>{usersCount}</span><br />
                      <span style={infoStyleB}>users / <span style={infoStyleC}>+4%</span></span>
                    </div>
                  </Cell>
                  <Cell span={4}>
                    <div style={infoStyle}>
                      <span style={infoStyle}>{conversationsCount}</span><br />
                      <span style={infoStyleB}>errors / <span style={infoStyleC}>+8%</span></span>
                    </div>
                  </Cell>
                  <Cell span={4}>
                    <div style={infoStyle}>
                      <span style={infoStyle}>{messagesCount}</span><br />
                      <span style={infoStyleB}>
                      messages /
                        <span style={infoStyleC}>+11%</span>
                      </span>
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
                  <Cell span={3}>
                    <DonutChart title="Platform" dataset={0} />
                  </Cell>
                  <Cell span={3}>
                    <DonutChart title="Country" dataset={1} />
                  </Cell>
                  <Cell span={3}>
                    <DonutChart title="Language" dataset={2} />
                  </Cell>
                  <Cell span={3}>
                    <DonutChart title="Age" dataset={3} />
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

Dashboard.defaultProps = {
  admin: null,
  isLoading: false,
  isSignedIn: false,
};

Dashboard.propTypes = {
  admin: PropTypes.shape({ params: PropTypes.shape({}).isRequired }),
  isLoading: PropTypes.bool,
  isSignedIn: PropTypes.bool,
  appSetTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.loading;
  return { admin, isLoading, isSignedIn };
};

const mapDispatchToProps = dispatch => ({
  appSetTitle: (titleName) => {
    dispatch(appSetTitle(titleName));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
