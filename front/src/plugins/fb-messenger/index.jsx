/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import FBTemplate from "./fbTemplate";
import FBSettings from "./settings";

export default class FBMessengerPlugin {
  constructor(connector, config = {}) {
    this.connector = connector;
    this.params = {
      config,
      name: "fb-messenger",
      title: "Facebook Messenger",
      icon: "images/messenger.svg",
      color: "#0084FF",
      type: "MessengerConnector",
      active: true,
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

  isActive() {
    return this.params.active;
  }

  getType() {
    return this.params.type;
  }

  isType(type) {
    return type === this.getType();
  }

  onAction(action) {
    this.action = action;
  }

  renderTemplate() {
    return <FBTemplate appId={this.config.appId} onAction={this.onAction} />;
  }

  /**
   * Legacy static load function
   * @param {*} settingsRef - component ref to access onAction methode
   * @param {*} instance
   * @param {*} onAction
   * @param {*} handleSaveSettings
   * @param {*} publicUrl
   */
  renderSettings(
    settingsRef,
    instance,
    onAction,
    handleSaveSettings = () => {},
    publicUrl = null,
  ) {
    return (
      <FBSettings
        ref={settingsRef}
        instance={instance}
        onAction={onAction}
        publicUrl={publicUrl}
        appId={this.config}
        handleSaveSettings={handleSaveSettings}
      />
    );
  }
}
