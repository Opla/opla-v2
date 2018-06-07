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
    this.actionsEditableRefs = [];
    this.newActionsEditableRefs = undefined;
  }

  handleAddAction = (text) => {
    this.handleAction("add", text);
  };

  handleChangeAction = (text, index) => {
    this.handleAction("change", text, index);
  };

  // private methode
  handleAction = (state, text, index = undefined) => {
    if (state && text) {
      const { name } = this.props;
      // TODO condition
      const type = null;
      const p = { name, type, state, index, action: { text } };
      this.props.onAction(p);
    }
  };

  handleDeleteClick = (index) => {
    this.props.onDeleteActionClick(this.props.name, index);
  };

  handleActionsEditableSelected = (ref) => {
    this.props.onSelectActionsComponent(ref);
  };

  render() {
    const { name, actions, newAction, onDrop } = this.props;
    let content;
    const icon = name === "input" ? "format_quote" : "chat_bubble_outline";
    const addText =
      name === "input" ? "Add an input sentence" : "Add an output response";
    const color =
      (!actions || actions.length === 0) && !newAction
        ? "rgb(213, 0, 0)"
        : "rgb(0, 0, 0)";
    const editable = true;
    const addContent = (
      <ListItem
        className="selectableListItem onFocusAction mdl-list_action"
        icon={icon}
        style={{ color, padding: "0px 16px" }}
        onClick={() => {
          this.handleActionsEditableSelected(this.newActionsEditableRefs);
        }}
      >
        <ActionsEditable
          containerName={this.props.name}
          content={newAction}
          editable={editable}
          onAddAction={this.handleAddAction}
          placeholder={addText}
          onChange={(newContent) => {
            this.props.onNewActionsChange(this.props.name, newContent);
          }}
          ref={(e) => {
            if (e) {
              this.newActionsEditableRefs = e;
            }
          }}
          isNew
        />
      </ListItem>
    );
    if (actions && actions.length > 0) {
      const style = {}; /* padding: "16px" */
      content = (
        <List style={{ overflow: "auto", maxHeight: "26vh" }}>
          {actions.map((action, index) => {
            const text = (
              <ActionsEditable
                containerName={this.props.name}
                content={action}
                editable={editable}
                onAddAction={this.handleAddAction}
                onChange={(newContent) => {
                  this.handleChangeAction(newContent, index);
                }}
                ref={(e) => {
                  if (e) {
                    this.actionsEditableRefs[index] = e;
                  }
                }}
              />
            );
            const key = `cd_${index}`;
            return (
              <ListItem
                style={{ height: "100%", minHeight: "40px", ...style }}
                key={key}
                icon={icon}
                className="selectableListItem onFocusAction mdl-list_action"
                onDrop={onDrop}
                onClick={() => {
                  this.handleActionsEditableSelected(
                    this.actionsEditableRefs[index],
                  );
                }}
              >
                {text}
                <ListItemMeta
                  icon="delete"
                  onClick={() => {
                    this.handleDeleteClick(index);
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      );
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
  newAction: "",
  onSelect: null,
  onDrop: null,
  onAction: () => {},
  intentId: null,
  onSelectActionsComponent: () => {},
  onNewActionsChange: () => {},
  onDeleteActionClick: () => {},
};

ActionsList.propTypes = {
  name: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  ),
  onSelect: PropTypes.func,
  onDrop: PropTypes.func,
  onAction: PropTypes.func,
  intentId: PropTypes.string,
  newAction: PropTypes.string,
  onSelectActionsComponent: PropTypes.func.isRequired,
  onNewActionsChange: PropTypes.func.isRequired,
  onDeleteActionClick: PropTypes.func.isRequired,
};

export default ActionsList;
