/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { List, ListItem, ListItemMeta } from "zrmc";
import { ExpansionPanel } from "zoapp-ui";
import ActionsEditable from "./actionsEditable";

class ActionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: null,
      newContent: null,
    };
    this.editableComponent = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.intentId !== this.props.intentId) {
      this.editableComponent = null;
      console.log("componentWillReceiveProps reset");
      this.setState({ selection: null, newContent: null });
    }
  }

  handleChangeNew = (newContent) => {
    this.setState({ newContent });
  };

  handleSelectedEditable = (type, key, editableComponent) => {
    console.log("handleSelectedEditable", editableComponent);
    this.editableComponent = editableComponent;
  };

  handleFocusEditable = (focus, editableComponent) => {
    console.log("handleFocusEditable", focus);
    if (!focus) {
      this.setState({ selection: null });
      this.props.onEdit(focus);
      this.editableComponent = null;
    } else {
      this.editableComponent = editableComponent;
    }
  };

  handleAction = (text, index = undefined) => {
    if (text) {
      const { name } = this.props;
      // TODO condition
      const type = null;
      const state = "add";
      const p = { name, type, state, index, action: { text } };
      this.props.onAction(p);
      console.log("handleAction");
      this.setState({ selection: null, newContent: null });
    }
  };

  handleFocusEditable = (focus) => {
    if (!focus) {
      this.setState({ selection: null });
      this.props.onEdit(focus);
    } else {
      // this.editable = editable;
    }
  };

  handleAction = (text, index = undefined) => {
    if (text) {
      const { name } = this.props;
      // TODO condition
      const type = null;
      const state = "add";
      const p = { name, type, state, index, action: { text } };
      this.props.onAction(p);
      console.log("handleAction");
      this.setState({ selection: null, newContent: null });
    }
  };

  handleSelect = (e, state, selection) => {
    e.preventDefault();
    let editing = false;
    if (state === "add") {
      console.log("handleSelect add", selection);
      this.setState({ selection });
      editing = true;
    } else if (this.props.onSelect) {
      console.log("handleSelect onSelect", selection);
      this.props.onSelect(selection);
    }
    this.props.onEdit(editing, this);
  };

  appendAction(action) {
    const { editableComponent } = this;
    if (!editableComponent) {
      return;
    }
    if (action === "text") {
      editableComponent.insertItem({
        type: "text",
        text: "text",
      });
    } else if (action === "any") {
      editableComponent.insertItem({
        type: "any",
        text: "",
      });
    } else if (action === "output_var") {
      editableComponent.insertItem({
        type: "output_var",
        text: "variablename",
      });
    } else if (action === "variable") {
      editableComponent.insertItem({
        type: "variable",
        text: "variablename=value",
      });
    } else if (action === "br") {
      editableComponent.insertItem({
        type: "br",
        text: "",
      });
    } else if (action === "button") {
      editableComponent.insertItem({
        type: "button",
        text: "value",
      });
    } else if (action === "trash") {
      editableComponent.deleteItem();
    }
  }

  render() {
    const { name, actions, onDrop } = this.props;
    let content;
    let type;
    if (
      name === "output" &&
      (!actions || actions.length === 0 || actions[0].type === "condition")
    ) {
      type = "condition";
    }
    const icon = name === "input" ? "format_quote" : "chat_bubble_outline";
    const addText =
      name === "input" ? "Add an input sentence" : "Add an output response";
    let color =
      !actions || actions.length === 0
        ? "rgb(213, 0, 0)"
        : "rgb(221, 221, 221)";
    let editable = false;
    if (
      this.editableComponent ||
      (this.state.selection && this.state.selection.state === "add")
    ) {
      editable = true;
      color = "rgb(0, 0, 0)";
    }
    console.log("selection=", name, editable, this.state.selection);
    const addContent = (
      <ListItem
        className="selectableListItem onFocusAction mdl-list_action"
        icon={icon}
        style={{ color, padding: "0px 16px" }}
        onClick={(e) => {
          this.handleSelect(e, "add", { name, type, state: "add" });
        }}
      >
        <ActionsEditable
          content={this.state.newContent}
          placeholder={addText}
          editable={editable}
          onFocus={this.handleFocusEditable}
          onAction={this.handleAction}
          onChange={this.handleChangeNew}
          onSelected={this.handleSelectedEditable}
        />
      </ListItem>
    );
    if (actions && actions.length > 0) {
      const style = {}; /* padding: "16px" */
      if (type === "condition") {
        const { children } = actions[0];
        // type = "condition";
        // WIP display condition list
        content = (
          <List style={{ overflow: "auto", maxHeight: "26vh" }}>
            {children.map((action, index) => {
              const text = <ActionsEditable content={action.text} />;
              let condition =
                action.name && action.name.length > 0
                  ? `${action.name} = `
                  : "";
              if (condition.length > 0) {
                condition += `${
                  action.value && action.value.length > 0
                    ? action.value
                    : "undefined"
                } ?`;
              }
              if (condition.length === 0) {
                condition = "default";
              }
              const key = `cd_${index}`;
              return (
                <ListItem
                  style={style}
                  key={key}
                  className="selectableListItem onFocusAction mdl-list_action"
                  icon={icon}
                  secondaryText={text}
                  onDrop={onDrop}
                  onClick={(e) => {
                    this.handleSelect(e, "select", {
                      name,
                      type: "condition",
                      state: "select",
                      index,
                    });
                  }}
                >
                  {condition}
                  <ListItemMeta
                    icon="delete"
                    onClick={(e) => {
                      this.handleSelect(e, "delete", {
                        name,
                        type: "condition",
                        state: "delete",
                        index,
                      });
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        );
      } else {
        content = (
          <List style={{ overflow: "auto", maxHeight: "26vh" }}>
            {actions.map((action, index) => {
              const text = <ActionsEditable content={action} />;
              const key = `cd_${index}`;
              return (
                <ListItem
                  style={{ height: "100%", minHeight: "40px", ...style }}
                  key={key}
                  icon={icon}
                  className="selectableListItem onFocusAction mdl-list_action"
                  onDrop={onDrop}
                  onClick={(e) => {
                    this.handleSelect(e, "select", {
                      name,
                      state: "select",
                      index,
                    });
                  }}
                >
                  {text}
                  <ListItemMeta
                    icon="delete"
                    onClick={(e) => {
                      this.handleSelect(e, "delete", {
                        name,
                        state: "delete",
                        index,
                      });
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        );
      }
    } else {
      content = <List />;
    }
    return (
      <ExpansionPanel label={name}>
        {content}
        {addContent}
      </ExpansionPanel>
    );
  }
}

ActionsList.defaultProps = {
  actions: [],
  onSelect: null,
  onDrop: null,
  onEdit: () => {},
  onAction: () => {},
  intentId: null,
};

ActionsList.propTypes = {
  name: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  ),
  onSelect: PropTypes.func,
  onDrop: PropTypes.func,
  onEdit: PropTypes.func,
  onAction: PropTypes.func,
  intentId: PropTypes.string,
};

export default ActionsList;
