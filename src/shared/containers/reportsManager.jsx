import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Content, Grid, Cell, Button } from "zoapp-materialcomponents";
import Loading from "zoapp-front/components/loading";
import UsersChart from "../components/usersChart";
import DonutChart from "../components/donutChart";
import { appSetTitle } from "../actions/app";

class ReportsManager extends Component {
  componentWillMount() {
    this.props.appSetTitle("Reports");
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
      <Content className="mdl-color--grey-100">
        <Grid>
          <Cell className="mdl-color--white mdl-shadow--2dp" col={12}>
            <div style={infoStyleD}> Last 7 days |  Filter: All  <Button raised>Edit</Button></div>
          </Cell>
          <Cell className="mdl-color--white mdl-shadow--2dp" col={12}>
            <UsersChart />
          </Cell>
          <Cell className="mdl-color--white mdl-shadow--2dp" col={12}>
            <Grid>
              <Cell col={4}>
                <div style={infoStyle}>
                  <span style={infoStyle}>{usersCount}</span><br />
                  <span style={infoStyleB}>users / <span style={infoStyleC}>+4%</span></span>
                </div>
              </Cell>
              <Cell col={4}>
                <div style={infoStyle}>
                  <span style={infoStyle}>{conversationsCount}</span><br />
                  <span style={infoStyleB}>websites / <span style={infoStyleC}>+8%</span></span>
                </div>
              </Cell>
              <Cell col={4}>
                <div style={infoStyle}>
                  <span style={infoStyle}>{messagesCount}</span><br />
                  <span style={infoStyleB}>messages / <span style={infoStyleC}>+11%</span></span>
                </div>
              </Cell>
            </Grid>
          </Cell>
          <Cell className="mdl-color--white mdl-shadow--2dp" col={12}>
            <Grid>
              <Cell col={3}>
                <DonutChart title="Platform" />
              </Cell>
              <Cell col={3}>
                <DonutChart title="Country" />
              </Cell>
              <Cell col={3}>
                <DonutChart title="Language" />
              </Cell>
              <Cell col={3}>
                <DonutChart title="Age" />
              </Cell>
            </Grid>
          </Cell>
        </Grid>
      </Content>
    );
  }
}

ReportsManager.defaultProps = {
  admin: null,
  isLoading: false,
  isSignedIn: false,
};

ReportsManager.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportsManager);
