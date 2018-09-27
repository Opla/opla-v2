/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import { Grid } from "zrmc";
import ServicesContainer from "../servicesContainer";
import PluginsManager from "../../utils/pluginsManager";

export default class Extensions extends Component {
  constructor(props) {
    super(props);
    const pluginsManager = PluginsManager();

    this.state = {
      pluginsManager,
    };
  }

  render() {
    return (
      <Grid>
        <div className="zap-panel zui-color--white">
          <ServicesContainer pluginsManager={this.state.pluginsManager} />
        </div>
      </Grid>
    );
  }
}
