import React from "react";

export default class DummyPlugin {
  constructor(connector, params) {
    this.connector = connector;
    this.params = params;
  }

  getName() {
    return this.params.name;
  }

  getTitle() {
    return this.params.title;
  }

  getIcon() {
    return this.params.icon || "images/robot.svg";
  }

  getColor() {
    return this.params.color || "gray";
  }

  isActive() {
    // TODO
    return this.params.isActive;
  }

  isType(type) {
    return type === this.params.type;
  }

  renderSettings(instance, onAction = null, publicUrl = null) {
    this.params.onAction = onAction;
    this.params.publicUrl = publicUrl;
    return (<div>TODO</div>);
  }
}
