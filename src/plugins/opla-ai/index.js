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
