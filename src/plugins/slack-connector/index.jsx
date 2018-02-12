import React from "react";

export default class SlackPlugin {
  constructor(connector) {
    this.connector = connector;
    this.params = {
      name: "slack-connector",
      title: "Slack",
      // from https://simpleicons.org/
      icon: "images/slack.svg",
      color: "#56B68B",
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

  renderSettings(instance, onAction = null, publicUrl = null) {
    this.params.onAction = onAction;
    this.params.publicUrl = publicUrl;
    return (<div>TODO</div>);
  }
}
