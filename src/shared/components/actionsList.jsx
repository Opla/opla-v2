/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { List } from "zrmc";
import { ExpansionPanel } from "zoapp-ui";
import ActionsItem from "./actionsItem";

class ActionsList extends Component {
  constructor(props) {
    super(props);
    this.actionsEditableRefs = [];
    this.newActionsEditableRefs = undefined;
  }

  handleAddNewAction = (content, isCondition = false) => {
    let newContent = content;
    if (isCondition && (content.name || content.value)) {
      this.handleAddActionCondition(newContent);
      // clear new
      this.props.onNewActionsChange(this.props.name, {
        name: "",
        value: "",
        text: "",
      });
    } else {
      if (isCondition) {
        newContent = content.text;
      }
      this.handleAddAction(newContent);
      this.props.onNewActionsChange(this.props.name, "");
    }
  };

  handleAddAction = (text) => {
    this.handleAction("add", { text });
  };

  handleAddActionCondition = (actionCondition) => {
    this.handleAction("add", actionCondition, "condition");
  };

  handleActionChange = (text, index) => {
    this.handleAction("change", { text }, null, index);
  };

  handleActionConditionChange = (actionCondition, index) => {
    this.handleAction("change", actionCondition, "condition", index);
  };

  // private methode
  handleAction = (state, content, type = null, index = undefined) => {
    if (state && content) {
      const { name } = this.props;
      const p = { name, type, state, index, action: content };
      this.props.onAction(p);
    }
  };

  handleDeleteClick = (index) => {
    this.props.onDeleteActionClick(this.props.name, index);
  };

  render() {
    const {
      name,
      actions,
      newAction,
      onDrop,
      onSelectActionsComponent,
    } = this.props;
    let contentList;
    const isCondition =
      name === "output" &&
      (!actions || actions.length === 0 || actions[0].type === "condition");
    const editable = true;
    const addContent = (
      <ActionsItem
        containerName={name}
        action={newAction}
        editable={editable}
        onAddAction={(content) => {
          this.handleAddNewAction(content, isCondition);
        }}
        onActionChange={(newContent) => {
          this.props.onNewActionsChange(this.props.name, newContent);
        }}
        onSelectActionsComponent={onSelectActionsComponent}
        isNew
        isCondition={isCondition}
      />
    );
    if (actions && actions.length > 0) {
      const actionsDisplayed = isCondition ? actions[0].children : actions;
      contentList = (
        <List style={{ overflow: "auto", maxHeight: "26vh" }}>
          {actionsDisplayed.map((action, index) => (
            <ActionsItem
              containerName={name}
              action={action}
              index={index}
              onDrop={onDrop}
              key={index}
              itemKey={`cd_${index}`}
              onActionChange={(newContent) => {
                if (isCondition) {
                  this.handleActionConditionChange(newContent, index);
                } else {
                  this.handleActionChange(newContent, index);
                }
              }}
              onSelectActionsComponent={onSelectActionsComponent}
              onDeleteActionClick={() => {
                this.handleDeleteClick(index);
              }}
              isCondition={isCondition}
            />
          ))}
        </List>
      );
    } else {
      contentList = <List />;
    }
    return (
      <ExpansionPanel label={name}>
        {contentList}
        {addContent}
      </ExpansionPanel>
    );
  }
}

ActionsList.defaultProps = {
  actions: [],
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
  newAction: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  onSelectActionsComponent: PropTypes.func.isRequired,
  onNewActionsChange: PropTypes.func.isRequired,
  onDeleteActionClick: PropTypes.func.isRequired,
};

export default ActionsList;
