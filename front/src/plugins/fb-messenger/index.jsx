/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import FBSettings from "./components/settings";
import FBTemplate from "./fbTemplate";

export default class FBMessengerPlugin {
  constructor(connector, config = {}) {
    this.connector = connector;
    this.config = config;
    this.name = "fb-messenger";
    this.title = "Facebook Messenger";
    // from https://simpleicons.org/
    this.icon = "images/messenger.svg";
    this.color = "#0084FF";
    this.active = true;
    this.type = "MessengerConnector";
  }

  getName() {
    return this.name;
  }

  getTitle() {
    return this.title;
  }

  getIcon() {
    return this.icon;
  }

  getColor() {
    return this.color;
  }

  isActive() {
    // TODO
    return this.active;
  }

  getType() {
    return this.type;
  }

  isType(type) {
    return type === this.getType();
  }

  onAction(action) {
    this.action = action;
    // console.log("onAction=", action, this.active);
  }

  renderTemplate() {
    return <FBTemplate appId={this.config.appId} onAction={this.onAction} />;
  }

  renderSettings(instance, onAction, publicUrl = null) {
    return (
      <FBSettings
        instance={instance}
        onAction={onAction}
        publicUrl={publicUrl}
        appId={this.config}
      />
    );
  }
}

export const Config = { appId: "1908982232707706" };
