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
  render() {
    const { name, actions, onSelect, onDrop } = this.props;
    let content;
    // let addDisabled;
    let type = null;
    if (
      name === "output" &&
      (!actions || actions.length === 0 || actions[0].type === "condition")
    ) {
      type = "condition";
    }
    const icon = name === "input" ? "format_quote" : "chat_bubble_outline";
    const style = {}; /* padding: "16px" */
    const addText =
      name === "input" ? "Add an input sentence" : "Add an output response";
    const color =
      !actions || actions.length === 0
        ? "rgb(213, 0, 0)"
        : "rgb(221, 221, 221)";
    const addContent = (
      <ListItem
        className="selectableListItem onFocusAction mdl-list_action"
        icon={icon}
        style={{ color, padding: "0px 16px" }}
        onClick={(e) => {
          e.preventDefault();
          if (onSelect) {
            onSelect({ name, type, state: "add" });
          }
        }}
      >
        {addText}
      </ListItem>
    );
    if (actions && actions.length > 0) {
      if (actions[0].type === "condition") {
        const { children } = actions[0];
        type = "condition";
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
                    e.preventDefault();
                    if (onSelect) {
                      onSelect({
                        name,
                        type: "condition",
                        state: "select",
                        index,
                      });
                    }
                  }}
                >
                  {condition}
                  <ListItemMeta
                    icon="delete"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onSelect) {
                        onSelect({
                          name,
                          type: "condition",
                          state: "delete",
                          index,
                        });
                      }
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
                    e.preventDefault();
                    if (onSelect) {
                      onSelect({ name, state: "select", index });
                    }
                  }}
                >
                  {text}
                  <ListItemMeta
                    icon="delete"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onSelect) {
                        onSelect({ name, state: "delete", index });
                      }
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        );
      }
      // addDisabled = false;
    } else {
      content = <List />;
      // addDisabled = true;
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
};

ActionsList.propTypes = {
  name: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  ),
  onSelect: PropTypes.func,
  onDrop: PropTypes.func,
};

export default ActionsList;
