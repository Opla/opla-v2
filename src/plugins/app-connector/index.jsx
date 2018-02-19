import React from "react";
import AppSettings from "./appSettings";
import AppTemplate from "./appTemplate";

export default class ExternalAppPlugin {
  constructor(connector) {
    this.connector = connector;
    this.params = {
      name: "app-connector",
      title: "Native/Web App",
      icon: "devices",
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
  }

  renderSettings(instance, onAction = null, publicUrl = null) {
    let oa = onAction;
    if (!oa) {
      oa = this.onAction;
    }
    this.params.onAction = oa;
    this.params.publicUrl = publicUrl;
    return (<AppSettings instance={instance} onAction={oa} />);
  }

  renderTemplate() {
    return (<AppTemplate onAction={this.onAction} />);
  }
}
