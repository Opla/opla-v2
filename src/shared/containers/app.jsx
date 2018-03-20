/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import {
  Layout,
  Header,
  Drawer,
  Navigation,
  IconButton,
  Menu,
  MenuItem,
  HeaderTabs,
  Tab,
} from "zrmc";
import PropTypes from "prop-types";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { initAuthSettings } from "zoapp-front/actions/initialize";
import UserBox from "zoapp-front/containers/userBox";

import Home from "OplaContainers/home";
import BotManager from "OplaContainers/botManager";
import AdminManager from "OplaContainers/adminManager";
import CreateAssistant from "OplaContainers/createAssistant";
import BuilderBox from "OplaContainers/builderBox";

import { apiAdminRequest } from "../actions/api";

class App extends React.Component {
  static closeDrawer() {
    const d = document.querySelector(".mdl-layout");
    d.MaterialLayout.toggleDrawer();
  }

  constructor(props) {
    super(props);
    this.state = { needUpdate: true, activeTab: 0 };
  }

  componentDidMount() {
    this.props.initAuthSettings();
    this.updateAdmin();
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUpdate() {
    const items = document.getElementsByClassName("mdl_closedrawer");
    for (let i = 0; i < items.length; i += 1) {
      items[i].removeEventListener("click", App.closeDrawer);
    }
  }

  componentDidUpdate() {
    this.updateAdmin();
    const items = document.getElementsByClassName("mdl_closedrawer");
    for (let i = 0; i < items.length; i += 1) {
      items[i].addEventListener("click", App.closeDrawer);
    }
  }

  handleTimeoutError() {
    this.todo = {};
  }

  updateAdmin() {
    if (!this.props.isSignedIn) {
      if (!this.state.needUpdate) {
        this.setState({ needUpdate: true });
      }
      return;
    }
    if (this.state.needUpdate) {
      this.setState({ needUpdate: false });
      this.props.apiAdminRequest();
    }
  }

  /**
   * WIP : toggleDrawer : https://codepen.io/surma/pen/EKjNON?editors=1010
   */
  render() {
    let { isLoading } = this.props;
    if (!isLoading && !this.props.admin && this.props.isSignedIn) {
      isLoading = true;
    }
    let botName = "opla.ai";
    if (this.props.bot && this.props.isSignedIn) {
      botName = this.props.bot.name;
    }
    let titleName = " / Your open chatbot builder";
    const avatarClass = "opla-icon";
    let style = {};
    const items = [];
    let toolbox = "";
    let navbox = "";
    if (this.props.isSignedIn) {
      if (this.props.titleName === "Builder") {
        style = { padding: "32px 80px 0px 0px" };
        navbox = (
          <HeaderTabs
            style={style}
            ripple
            activeTab={this.state.activeTab}
            onChange={(tabId) => this.setState({ activeTab: tabId })}
          >
            <Tab>Intents</Tab>
            <Tab>Entities</Tab>
            <Tab>Flows</Tab>
          </HeaderTabs>
        );
        style = { paddingRight: "20%" };
        toolbox = <BuilderBox store={this.props.store} />;
        style = { width: "30%", textAlign: "right" };
      } else if (this.props.titleName === "Admin") {
        style = { padding: "32px 80px 0px 0px", width: "620px" };
        navbox = (
          <HeaderTabs
            style={style}
            ripple
            activeTab={this.state.activeTab}
            onChange={(tabId) => this.setState({ activeTab: tabId })}
          >
            <Tab>General</Tab>
            <Tab>Extensions</Tab>
            <Tab>Users</Tab>
            <Tab>Advanced</Tab>
          </HeaderTabs>
        );
        style = { width: "30%", textAlign: "right" };
      }
      titleName = ` / ${this.props.titleName}`;
      let className = "mdl_closedrawer";
      className +=
        this.props.titleName === "Dashboard"
          ? " mdl-navigation__selectedlink"
          : "";
      items.push({
        id: "1",
        to: "/",
        icon: "dashboard",
        name: "Dashboard",
        className,
      });
      className = "mdl_closedrawer";
      className +=
        this.props.titleName === "Builder"
          ? " mdl-navigation__selectedlink"
          : "";
      items.push({
        id: "2",
        to: "/builder",
        icon: "build",
        name: "Builder",
        className,
      });
      className = "mdl_closedrawer";
      className +=
        this.props.titleName === "Admin" ? " mdl-navigation__selectedlink" : "";
      items.push({
        id: "3",
        to: "/admin",
        icon: "settings",
        name: "Admin",
        className,
      });
    } else {
      items.push({
        id: "4",
        to: "/",
        name: "Home",
        icon: "home",
        className: "mdl_closedrawer",
      });
    }
    items.push({
      id: "5",
      to: "/",
      name: "Help",
      icon: "help",
      className: "mdl_closedrawer",
    });

    return (
      <div>
        <Layout fixedHeader>
          <Header
            title={
              <span>
                <span style={{ fontWeight: "900" }}>{botName}</span>
                <span style={{ color: "#ddd" }}>{titleName}</span>
              </span>
            }
          >
            <Navigation>
              {navbox}
              {toolbox}
              <UserBox store={this.props.store} style={style} />
            </Navigation>
          </Header>
          <Drawer
            title={
              <span>
                {botName}
                <IconButton
                  name=""
                  colored
                  style={{ marginLeft: "124px" }}
                  id="bot-menu"
                  className={avatarClass}
                />
              </span>
            }
          >
            <Menu target="bot-menu" align="right">
              <MenuItem disabled>Properties</MenuItem>
              <MenuItem className="mdl_closedrawer">Change Assistant</MenuItem>
            </Menu>
            <Navigation>
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.name}`}
                  to={item.to}
                  className={item.className}
                >
                  <i className="material-icons">{item.icon}</i>
                  {item.name}
                </Link>
              ))}
            </Navigation>
          </Drawer>
          <Switch>
            <Route
              path="/builder"
              render={(props) => (
                <BotManager {...props} activeTab={this.state.activeTab} />
              )}
            />
            <Route
              path="/admin"
              render={(props) => (
                <AdminManager {...props} activeTab={this.state.activeTab} />
              )}
            />
            <Route path="/create" component={CreateAssistant} />
            <Route path="*" component={Home} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

App.defaultProps = {
  admin: null,
  bot: null,
};

App.propTypes = {
  store: PropTypes.shape({}).isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  titleName: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  admin: PropTypes.shape({}),
  bot: PropTypes.shape({ name: PropTypes.string }),
  initAuthSettings: PropTypes.func.isRequired,
  apiAdminRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  const bot = admin ? admin.bots[0] : null;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading =
    (state.app && state.app.loading) ||
    (state.auth && state.auth.loading) ||
    (state.user && state.user.loading);
  const titleName = state.app ? state.app.titleName : "";
  return {
    admin,
    bot,
    isLoading,
    isSignedIn,
    titleName,
  };
};

const mapDispatchToProps = (dispatch) => ({
  initAuthSettings: () => {
    dispatch(initAuthSettings());
  },
  apiAdminRequest: () => {
    dispatch(apiAdminRequest());
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
