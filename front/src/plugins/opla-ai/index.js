/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Settings from "./settings";

export default class OplaAIPlugin {
  constructor(connector) {
    this.connector = connector;
    this.name = "opla-ai";
    this.title = "Opla NLU";
    this.icon = "images/opla-bubble.svg";
    this.color = "dark";
    this.active = true;
    this.type = "AIProvider";
  }

  getName() {
    return this.name;
  }

  getTitle() {
    return this.title;
  }

  getIcon() {
    return this.title;
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

  renderSettings() {
    this.todo = {};
    return Settings();
  }
}
