import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Cell, Button, IconButton, Content, Textfield, Tooltip } from "react-mdl";
import { connect } from "react-redux";
import { Selectfield } from "../components/mdl";
import { appSetTitle } from "../actions/app";
import { apiSetAdminParametersRequest } from "../actions/api";
import TableComponent from "../components/tableComponent";
import Loading from "../components/loading";
import SignInForm from "./signInForm";
import ServicesContainer from "./servicesContainer";
import PluginsManager from "../utils/pluginsManager";
import TunnelBox from "../components/tunnelBox";
import DialogManager from "../utils/dialogManager";

const infoStyleD = {
  fontSize: "16px",
  fontWeight: "400",
  color: "#666",
  padding: "24px",
  lineHeight: "1.1",
};

class AdminManager extends Component {
  static onActionTunnel(dialog, action) {
    console.log("onActionTunnel", dialog, action);
    DialogManager.close();
  }

  constructor(props) {
    super(props);
    const pluginsManager = new PluginsManager();
    this.state = {
      pluginsManager,
      botParams: null,
      tunnelParams: null,
      backendParams: null,
      emailServerParams: null,
    };
  }

  componentWillMount() {
    this.updateParams();
  }

  componentWillUpdate() {
    this.updateParams();
  }

  onChangeTunnel = (tunnelParams) => {
    this.setState({ tunnelParams });
  }

  onSaveBackend() {
    if (this.state.tunnelParams) {
      // WIP save tunnel parameters
      const tunnel = this.state.tunnelParams.active || "None";
      this.setState({ tunnelParams: null });
      this.props.apiSetAdminParametersRequest({ tunnel });
    }
  }

  updateParams() {
    this.props.appSetTitle("Admin");
  }

  displayTunnelDialog() {
    const { params } = this.props.admin;
    const backend = this.state.backendParams || params.backend || { };
    const tunnelParams = this.state.tunnelParams || backend.tunnel || { };
    const content = <TunnelBox onChange={this.onChangeTunnel} params={tunnelParams} />;
    DialogManager.open({
      title: "Tunnel settings", content, width: "520px", onAction: AdminManager.onActionTunnel,
    });
  }

  render() {
    let { isLoading } = this.props;
    if ((!isLoading) && (!this.props.admin) && this.props.isSignedIn) {
      isLoading = true;
    }
    if (!this.props.isSignedIn) {
      return (<SignInForm />);
    } else if (isLoading || this.props.admin == null) {
      return (<Loading />);
    }
    const active = this.props.activeTab;
    let content = "";
    if (active === 0) {
      const saveDisabled = !this.state.botParams;
      content = (
        <Grid>
          <Cell className="mdl-color--white" col={12} style={{ display: "table" }}>
            <div style={{ width: "200px", display: "table-cell" }}>
              <div style={{
                position: "absolute", width: "180px", height: "180px", margin: "24px", backgroundColor: "#ddd",
              }}
              />
            </div>
            <div style={{ display: "table-cell" }}>
              <form style={infoStyleD}>
                <div>
                  <Textfield
                    onChange={() => {}}
                    label="Assistant name"
                    floatingLabel
                    style={{ width: "400px" }}
                    value={this.props.bot.name}
                  />
                </div>
                <div><Textfield
                  onChange={() => {}}
                  label="Describe how your assistant is wonderfull !"
                  rows={3}
                  value={this.props.bot.description}
                  style={{ width: "400px" }}
                />
                </div>
                <div>
                  <Selectfield
                    label="Language"
                    onChange={this.handleLanguageChange}
                    floatingLabel
                    ref={(input) => { this.selectFieldLanguage = input; }}
                    value={this.props.bot.language}
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                  </Selectfield>
                </div>
                <div>
                  <Selectfield
                    label="Timezone"
                    onChange={this.handleTimezoneChange}
                    floatingLabel
                    ref={(input) => { this.selectFieldTimezone = input; }}
                  >
                    <option value="gmt">GMT</option>
                    <option value="gmt+1">GMT+1</option>
                  </Selectfield>
                </div>
              </form>
            </div>
            <div><Button raised colored disabled={saveDisabled} style={{ float: "right", margin: "24px" }}>SAVE</Button></div>
          </Cell>
        </Grid>);
    } else if (active === 1) {
      content = (
        <Grid>
          <ServicesContainer pluginsManager={this.state.pluginsManager} />
        </Grid>);
    } else if (active === 2) {
      const items = [];
      const status = "you";
      const { user, profile } = this.props;
      // const spanStyle = { width: "160px" };
      const values = [];
      values.push(profile.username);
      values.push(profile.email);
      values.push(user.attributes.scope);
      values.push(status);
      items.push({ id: 1, values, icon: `../images/${profile.avatar}.png` });
      const headers = ["", "username", "email", "role", "status"];
      const title = (
        <div style={infoStyleD}>You could give an access to your collaborators here.
          <Button raised colored style={{ float: "right", marginBottom: "24px" }}>ADD</Button>
        </div>);
      content = (
        <Grid>
          <Cell className="mdl-color--white" col={12}>
            <div>
              <TableComponent
                title={title}
                headers={headers}
                items={items}
                selectedItem={-1}
                onSelect={() => { }}
              />
            </div>
          </Cell>
        </Grid>);
    } else if (active === 3) {
      const { params } = this.props.admin;
      const emailServer = this.state.emailParams || params.emailServer || { };
      const backend = this.state.backendParams || params.backend || { };
      // const tunnelParams = this.state.tunnelParams || backend.tunnel || {};
      const hasTunnelParams = !!this.state.tunnelParams;
      const saveBackendDisabled = !(this.state.backendParams || this.state.tunnelParams);
      const saveEmailDisabled = !this.state.emailServerParams;
      content = (
        <Grid>
          <Cell className="mdl-color--white" col={12}>
            <div style={infoStyleD}>Backend configuration
              <Button raised colored disabled={saveBackendDisabled} style={{ float: "right" }} onClick={(e) => { e.preventDefault(); this.onSaveBackend(); }}>SAVE</Button>
            </div>
            <form style={infoStyleD}>
              <div style={{ width: "520px" }}>
                <Textfield
                  onChange={() => {}}
                  label="Public Api url"
                  floatingLabel
                  style={{ width: "400px" }}
                  value={backend.publicUrl}
                />
                <Tooltip label="Setup tunnel">
                  <IconButton colored={hasTunnelParams} style={{ float: "right", marginTop: "8px" }} name="link" onClick={(e) => { e.preventDefault(); this.displayTunnelDialog(); }} />
                </Tooltip>
              </div>
              <div><Textfield
                onChange={() => {}}
                label="Api url"
                floatingLabel
                disabled
                style={{ width: "400px" }}
                value={backend.apiUrl}
              />
              </div>
              <div><Textfield
                onChange={() => {}}
                label="Auth url"
                floatingLabel
                disabled
                style={{ width: "400px" }}
                value={backend.authUrl}
              />
              </div>
              <div><Textfield
                onChange={() => {}}
                label="AppId"
                floatingLabel
                disabled
                style={{ width: "400px" }}
                value={backend.clientId}
              />
              </div>
              <div><Textfield
                onChange={() => {}}
                label="Secret"
                floatingLabel
                disabled
                style={{ width: "400px" }}
                value={backend.clientSecret}
              />
              </div>
            </form>
            <div />
          </Cell>
          <Cell className="mdl-color--white" col={12}>
            <div style={infoStyleD}>Email server configuration<Button raised colored disabled={saveEmailDisabled} style={{ float: "right" }}>SAVE</Button></div>
            <form style={infoStyleD} autoComplete="nope">
              <div><Textfield
                onChange={() => {}}
                label="Server address"
                floatingLabel
                style={{ width: "400px" }}
                value={emailServer.url}
              />
              </div>
              <div>
                <Textfield
                  onChange={() => {}}
                  label="Username"
                  floatingLabel
                  autoComplete="new-password"
                  style={{ width: "400px" }}
                  value={emailServer.username}
                />
              </div>
              <div>
                <Textfield
                  onChange={() => {}}
                  label="Password"
                  floatingLabel
                  autoComplete="new-password"
                  type="password"
                  style={{ width: "400px" }}
                  value={emailServer.password}
                />
              </div>
            </form>
            <div />
          </Cell>
          <Cell className="mdl-color--white" col={12}>
            <div style={infoStyleD}><span style={{ color: "#d50000" }}>Delete this assistant</span>
              <Button raised colored style={{ float: "right", marginBottom: "24px", backgroundColor: "#d50000" }}>DELETE</Button>
            </div>
            <div />
          </Cell>
        </Grid>);
    }
    return (
      <Content className="mdl-color--grey-100">
        <section>
          {content}
        </section>
      </Content>
    );
  }
}

AdminManager.defaultProps = {
  admin: null,
  isLoading: false,
  isSignedIn: false,
  bot: null,
  user: null,
  profile: {},
  activeTab: 0,
};

AdminManager.propTypes = {
  admin: PropTypes.shape({ params: PropTypes.shape({}).isRequired }),
  isLoading: PropTypes.bool,
  isSignedIn: PropTypes.bool,
  bot: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    language: PropTypes.string,
  }),
  user: PropTypes.shape({}),
  activeTab: PropTypes.number,
  appSetTitle: PropTypes.func.isRequired,
  apiSetAdminParametersRequest: PropTypes.func.isRequired,
  profile: PropTypes.shape({}),
};

AdminManager.contextTypes = {
  activeTab: PropTypes.number,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.loading;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const { user } = state;
  const profile = user ? user.profile : null;
  // TODO get selectedBot from selectBotId
  const bot = selectedBotId ? admin.bots[0] : null;
  return {
    admin, isLoading, isSignedIn, selectedBotId, bot, user, profile,
  };
};

const mapDispatchToProps = dispatch => ({
  appSetTitle: (titleName) => {
    dispatch(appSetTitle(titleName));
  },
  apiSetAdminParametersRequest: (params) => {
    dispatch(apiSetAdminParametersRequest(params));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminManager);
