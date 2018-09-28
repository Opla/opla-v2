/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import AppSettings from "./appSettings";
import AppTemplate from "./appTemplate";

export default class ExternalAppPlugin {
  constructor(connector) {
    this.connector = connector;
    this.params = {
      name: "webchat-connector",
      title: "Webchat",
      icon: "message",
      color: "gray",
      type: "MessengerConnector",
      isActive: true,
    };
  }

  getName() {
    return this.params.name;
  }

  getTitle() {
    return this.params.title;
  }

  getIcon() {
    return this.params.icon;
  }

  getColor() {
    return this.params.color;
  }

  getType() {
    return this.params.type;
  }

  isType(type) {
    return type === this.getType();
  }

  isActive() {
    // TODO
    return this.params.isActive;
  }

  onAction = (action) => {
    this.action = action;
    // console.log("onAction=", action);
  };

  renderSettings(instance, onAction = null, publicUrl = null) {
    let oa = onAction;
    if (!oa) {
      oa = this.onAction;
    }
    this.params.onAction = oa;
    this.params.publicUrl = publicUrl;
    return <AppSettings instance={instance} onAction={oa} />;
  }

  renderTemplate() {
    return <AppTemplate onAction={this.onAction} />;
  }
}
