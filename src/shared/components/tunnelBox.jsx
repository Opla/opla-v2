/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField, Button, Select, MenuItem } from "zrmc";

class TunnelBox extends Component {
  constructor(props) {
    super(props);
    this.state = { params: null, advanced: false };
    this.fields = {};
  }

  onChange = (name, value) => {
    const params = this.state.params || { ...this.props.params };
    // console.log("onChangeTunnel", name, value);
    let { advanced } = this.state;
    if (name === "provider") {
      advanced = false;
      if (value === "None") {
        params.active = null;
      } else {
        params.active = { provider: value };
      }
    } else if (params.active) {
      params.active[name] = value;
    }
    // TODO check if params are the same than props
    this.setState({ params, advanced });
    this.props.onChange(params);
  };

  render() {
    const params = this.state.params || this.props.params;
    const none = "None";
    const items = [{ id: 0, name: none }];
    if (params.providers) {
      Object.values(params.providers).forEach((provider, index) => {
        items.push({ id: index + 1, name: provider });
      });
    }
    const active = params.active || {};
    const value = active.provider;
    let formDisplay = "none";
    let advanced = null;
    const b = active.localhost || active.subdomain || active.host;
    if (b || (value && this.state.advanced)) {
      formDisplay = "block";
    } else if (value) {
      advanced = (
        <Button
          onClick={(e) => {
            e.preventDefault();
            this.setState({ advanced: true });
          }}
        >
          Set parameters
        </Button>
      );
    }
    return (
      <div style={{ width: "512px", margin: "auto" }}>
        <div>
          <Select
            label="Tunnel provider"
            onChange={(e) => {
              this.onChange("provider", e.target.value);
            }}
            ref={(input) => {
              this.fields.provider = input;
            }}
            id="unique-component-id"
            value={value}
            style={{ width: "400px" }}
          >
            {items.map((item) => (
              <MenuItem key={item.id} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </div>
        {advanced}
        <form style={{ display: formDisplay }}>
          <div>
            <TextField
              onChange={(e) => {
                this.onChange("subdomain", e.target.value);
              }}
              id="unique-component-id"
              label="Subdomain"
              style={{ width: "400px" }}
              value={active.subdomain}
              ref={(input) => {
                this.fields.subdomain = input;
              }}
            />
          </div>
          <div>
            <TextField
              onChange={(e) => {
                this.onChange("host", e.target.value);
              }}
              id="unique-component-id"
              label="Host"
              style={{ width: "400px" }}
              value={active.host}
              ref={(input) => {
                this.fields.host = input;
              }}
            />
          </div>
          <div>
            <TextField
              onChange={(e) => {
                this.onChange("localhost", e.target.value);
              }}
              id="unique-component-id"
              label="Localhost"
              style={{ width: "400px" }}
              value={active.localhost}
              ref={(input) => {
                this.fields.localhost = input;
              }}
            />
          </div>
        </form>
      </div>
    );
  }
}

TunnelBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  params: PropTypes.objectOf(PropTypes.shape({})).isRequired,
};

export default TunnelBox;
