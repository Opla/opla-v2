/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Zrmc, { Grid, Inner, Cell, Button, Icon, TextField } from "zrmc";
import { connect } from "react-redux";
import { apiSetAdminParametersRequest } from "zoapp-front/actions/api";
import TunnelBox from "../../components/tunnelBox";
import { infoStyleD, FORM_WIDTH } from "./styles";

class Advanced extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tunnelParams: null,
      backendParams: null,
      emailServerParams: null,
    };
  }

  static onActionTunnel(/* dialog, action */) {
    Zrmc.closeDialog();
  }

  onChangeTunnel = (tunnelParams) => {
    this.setState({ tunnelParams });
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
      onAction: Advanced.onActionTunnel,
    });
  }

  render() {
    const { params } = this.props.admin;

    const emailServer = this.state.emailParams || params.emailServer || {};
    const backend = this.state.backendParams || params.backend || {};
    // const tunnelParams = this.state.tunnelParams || backend.tunnel || {};
    /* const hasTunnelParams = !!this.state.tunnelParams; */
    const saveBackendDisabled = !(
      this.state.backendParams || this.state.tunnelParams
    );
    const saveEmailDisabled = !this.state.emailServerParams;
    return (
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
        {this.props.children}
      </Grid>
    );
  }
}

Advanced.defaultProps = {
  admin: null,
};

Advanced.propTypes = {
  admin: PropTypes.shape({ params: PropTypes.shape({}).isRequired }),
  apiSetAdminParametersRequest: PropTypes.func.isRequired,
  children: PropTypes.element,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;

  return {
    admin,
  };
};

const mapDispatchToProps = (dispatch) => ({
  apiSetAdminParametersRequest: (params) => {
    dispatch(apiSetAdminParametersRequest(params));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Advanced);
