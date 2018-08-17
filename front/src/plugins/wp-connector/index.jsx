/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";

export default class WPPlugin {
  constructor(connector) {
    this.connector = connector;
    this.params = {
      name: "wp-connector",
      title: "Wordpress",
      // from https://simpleicons.org/
      icon: "images/wordpress.svg",
      color: "#21759B",
      type: "MessengerConnector",
      isActive: false,
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

  renderSettings(instance, onAction = null, publicUrl = null) {
    this.params.onAction = onAction;
    this.params.publicUrl = publicUrl;
    return <div>TODO</div>;
  }
}
