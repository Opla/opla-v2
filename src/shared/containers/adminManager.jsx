/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Zrmc, {
  Grid,
  Inner,
  Cell,
  Button,
  Icon,
  TextField,
  Select,
  MenuItem,
} from "zrmc";
import { TableComponent } from "zoapp-ui";
import { connect } from "react-redux";
import Loading from "zoapp-front/components/loading";
import SignInForm from "zoapp-front/containers/signInForm";
import { apiSetAdminParametersRequest } from "zoapp-front/actions/api";

import { appSetTitle } from "../actions/app";
import { apiSaveBotRequest } from "../actions/api";
import ServicesContainer from "./servicesContainer";
import PluginsManager from "../utils/pluginsManager";
import TunnelBox from "../components/tunnelBox";
import timezones from "../utils/timezones";

const infoStyleD = {
  fontSize: "16px",
  fontWeight: "400",
  color: "#666",
  padding: "24px",
  lineHeight: "1.1",
};

const FORM_WIDTH = "100%";

class AdminManager extends Component {
  static onActionTunnel(/* dialog, action */) {
    Zrmc.closeDialog();
  }

  constructor(props) {
    super(props);
    const pluginsManager = new PluginsManager();

    this.state = {
      pluginsManager,
      bot: props.bot,
      tunnelParams: null,
      backendParams: null,
      emailServerParams: null,
    };
  }

  componentWillMount() {
    this.props.appSetTitle("Admin");
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bot !== this.props.bot) {
      this.setState({
        bot: nextProps.bot,
      });
    }
  }

  onChangeTunnel = (tunnelParams) => {
    this.setState({ tunnelParams });
  };

  onSaveBotDetails = () => {
    this.props.apiSaveBotRequest(this.state.bot);
  };

  onSaveBackend() {
    if (this.state.tunnelParams) {
      // WIP save tunnel parameters
      const tunnel = this.state.tunnelParams.active || "None";
      this.setState({ tunnelParams: null });
      this.props.apiSetAdminParametersRequest({ tunnel });
    }
  }

  displayTunnelDialog() {
    const { params } = this.props.admin;
    const backend = this.state.backendParams || params.backend || {};
    const tunnelParams = this.state.tunnelParams || backend.tunnel || {};
    const body = (
      <TunnelBox onChange={this.onChangeTunnel} params={tunnelParams} />
    );
    Zrmc.showDialog({
      header: "Tunnel settings",
      body,
      syle: { width: "520px" },
      onAction: AdminManager.onActionTunnel,
    });
  }

  handleBotNameChange = (e) => {
    const name = e.target.value;

    this.setState({
      bot: {
        ...this.state.bot,
        name,
      },
    });
  };

  handleBotDescriptionChange = (e) => {
    const description = e.target.value;

    this.setState({
      bot: {
        ...this.state.bot,
        description,
      },
    });
  };

  handleLanguageChange = (language) => {
    this.setState({
      bot: {
        ...this.state.bot,
        language,
      },
    });
  };

  handleTimezoneChange = (timezone) => {
    this.setState({
      bot: {
        ...this.state.bot,
        timezone,
      },
    });
  };

  render() {
    let { isLoading } = this.props;
    if (!isLoading && !this.props.admin && this.props.isSignedIn) {
      isLoading = true;
    }
    if (!this.props.isSignedIn) {
      return <SignInForm />;
    } else if (isLoading || this.props.admin == null) {
      return <Loading />;
    }
    const active = this.props.activeTab;
    let content = "";
    if (active === 0) {
      content = (
        <Grid>
          <Inner>
            <Cell
              className="mdl-color--white"
              span={12}
              style={{ display: "table" }}
            >
              <div style={{ width: "200px", display: "table-cell" }}>
                <div
                  style={{
                    position: "absolute",
                    width: "180px",
                    height: "180px",
                    margin: "24px",
                    backgroundColor: "#ddd",
                  }}
                />
              </div>
              <div style={{ display: "table-cell" }}>
                <form style={infoStyleD}>
                  <div>
                    <TextField
                      defaultValue={this.props.bot.name}
                      label="Assistant name"
                      onChange={this.handleBotNameChange}
                      style={{ width: FORM_WIDTH }}
                    />
                  </div>
                  <div>
                    <TextField
                      defaultValue={this.props.bot.description}
                      isTextarea
                      label="Description"
                      onChange={this.handleBotDescriptionChange}
                      style={{ width: FORM_WIDTH }}
                    />
                  </div>
                  <div>
                    <Select
                      label="Language"
                      onSelected={this.handleLanguageChange}
                      style={{ width: FORM_WIDTH }}
                      selectedIndex={["en", "fr"].findIndex(
                        (language) =>
                          language === (this.props.bot.language || null),
                      )}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                    </Select>
                  </div>
                  <div>
                    <Select
                      label="Timezone"
                      onSelected={this.handleTimezoneChange}
                      style={{ width: FORM_WIDTH }}
                      selectedIndex={this.props.timezones.findIndex(
                        (tz) => tz === (this.props.bot.timezone || null),
                      )}
                    >
                      {this.props.timezones.map((timezone) => (
                        <MenuItem key={timezone} value={timezone}>
                          {timezone}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </form>
              </div>
              <div>
                <Button
                  disabled={
                    !this.state.bot ||
                    (this.state.bot && this.state.bot.name.length < 1)
                  }
                  raised
                  style={{ float: "right", margin: "24px" }}
                  onClick={this.onSaveBotDetails}
                >
                  SAVE
                </Button>
              </div>
            </Cell>
          </Inner>
        </Grid>
      );
    } else if (active === 1) {
      content = (
        <Grid>
          <ServicesContainer pluginsManager={this.state.pluginsManager} />
        </Grid>
      );
    } else if (active === 2) {
      const items = [];
      const status = "you";
      const { user, profile } = this.props;

      const values = [];
      values.push(profile.username);
      values.push(profile.email);
      values.push(user.attributes.scope);
      values.push(status);

      items.push({ id: 1, values, icon: `../images/${profile.avatar}.png` });

      const headers = ["", "username", "email", "role", "status"];
      const title = (
        <div style={infoStyleD}>
          You could give an access to your collaborators here.
          <Button raised style={{ float: "right", marginBottom: "24px" }}>
            ADD
          </Button>
        </div>
      );

      content = (
        <Grid>
          <Inner>
            <Cell className="mdl-color--white" span={12}>
              <div>
                <TableComponent
                  title={title}
                  headers={headers}
                  items={items}
                  selectedItem={-1}
                  onSelect={() => {}}
                />
              </div>
            </Cell>
          </Inner>
        </Grid>
      );
    } else if (active === 3) {
      const { params } = this.props.admin;

      const emailServer = this.state.emailParams || params.emailServer || {};
      const backend = this.state.backendParams || params.backend || {};
      // const tunnelParams = this.state.tunnelParams || backend.tunnel || {};
      /* const hasTunnelParams = !!this.state.tunnelParams; */
      const saveBackendDisabled = !(
        this.state.backendParams || this.state.tunnelParams
      );
      const saveEmailDisabled = !this.state.emailServerParams;
      content = (
        <Grid>
          <Inner>
            <Cell className="mdl-color--white" span={12}>
              <div style={infoStyleD}>
                Backend configuration
                <Button
                  raised
                  disabled={saveBackendDisabled}
                  style={{ float: "right" }}
                  onClick={(e) => {
                    e.preventDefault();
                    this.onSaveBackend();
                  }}
                >
                  SAVE
                </Button>
              </div>
              <form style={infoStyleD}>
                <div style={{ width: "520px" }}>
                  <TextField
                    onChange={() => {}}
                    label="Public Api url"
                    style={{ width: FORM_WIDTH }}
                    value={backend.publicUrl}
                  />
                  <Icon
                    /* colored={hasTunnelParams} */
                    style={{ float: "right", marginTop: "8px" }}
                    name="link"
                    onClick={(e) => {
                      e.preventDefault();
                      this.displayTunnelDialog();
                    }}
                  />
                </div>
                <div>
                  <TextField
                    onChange={() => {}}
                    label="Api url"
                    disabled
                    style={{ width: FORM_WIDTH }}
                    value={backend.apiUrl}
                  />
                </div>
                <div>
                  <TextField
                    onChange={() => {}}
                    label="Auth url"
                    disabled
                    style={{ width: FORM_WIDTH }}
                    value={backend.authUrl}
                  />
                </div>
                <div>
                  <TextField
                    onChange={() => {}}
                    label="AppId"
                    disabled
                    style={{ width: FORM_WIDTH }}
                    value={backend.clientId}
                  />
                </div>
                <div>
                  <TextField
                    onChange={() => {}}
                    label="Secret"
                    disabled
                    style={{ width: FORM_WIDTH }}
                    value={backend.clientSecret}
                  />
                </div>
              </form>
              <div />
            </Cell>
          </Inner>
          <Inner>
            <Cell className="mdl-color--white" span={12}>
              <div style={infoStyleD}>
                Email server configuration
                <Button
                  raised
                  disabled={saveEmailDisabled}
                  style={{ float: "right" }}
                >
                  SAVE
                </Button>
              </div>
              <form style={infoStyleD} autoComplete="nope">
                <div>
                  <TextField
                    onChange={() => {}}
                    label="Server address"
                    style={{ width: FORM_WIDTH }}
                    value={emailServer.url}
                  />
                </div>
                <div>
                  <TextField
                    onChange={() => {}}
                    label="Username"
                    autoComplete="new-password"
                    style={{ width: FORM_WIDTH }}
                    value={emailServer.username}
                  />
                </div>
                <div>
                  <TextField
                    onChange={() => {}}
                    label="Password"
                    autoComplete="new-password"
                    type="password"
                    style={{ width: FORM_WIDTH }}
                    value={emailServer.password}
                  />
                </div>
              </form>
              <div />
            </Cell>
          </Inner>
          <Inner>
            <Cell className="mdl-color--white" span={12}>
              <div style={infoStyleD}>
                <span style={{ color: "#d50000" }}>Delete this assistant</span>
                <Button
                  raised
                  style={{
                    float: "right",
                    marginBottom: "24px",
                    backgroundColor: "#d50000",
                  }}
                >
                  DELETE
                </Button>
              </div>
              <div />
            </Cell>
          </Inner>
        </Grid>
      );
    }
    return (
      <div className="mdl-layout__content mdl-color--grey-100">
        <section>{content}</section>
      </div>
    );
  }
}

AdminManager.defaultProps = {
  activeTab: 0,
  admin: null,
  bot: null,
  isLoading: false,
  isSignedIn: false,
  profile: {},
  timezones,
  user: null,
};

AdminManager.propTypes = {
  activeTab: PropTypes.number,
  admin: PropTypes.shape({ params: PropTypes.shape({}).isRequired }),
  apiSaveBotRequest: PropTypes.func.isRequired,
  apiSetAdminParametersRequest: PropTypes.func.isRequired,
  appSetTitle: PropTypes.func.isRequired,
  bot: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    language: PropTypes.string,
    timezone: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  isSignedIn: PropTypes.bool,
  profile: PropTypes.shape({}),
  timezones: PropTypes.arrayOf(PropTypes.string).isRequired,
  user: PropTypes.shape({}),
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
    admin,
    isLoading,
    isSignedIn,
    selectedBotId,
    bot,
    user,
    profile,
  };
};

const mapDispatchToProps = (dispatch) => ({
  appSetTitle: (titleName) => {
    dispatch(appSetTitle(titleName));
  },
  apiSaveBotRequest: (params) => {
    dispatch(apiSaveBotRequest(params));
  },
  apiSetAdminParametersRequest: (params) => {
    dispatch(apiSetAdminParametersRequest(params));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminManager);
