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
    if (isCondition) {
      // add action condition
      if (content.text && (content.name || content.value)) {
        this.handleAddActionCondition(content);
        // clear new
        this.props.onNewActionsChange(this.props.name, {});
        // add condition as string action if actions list and condition values are empty
      } else if (
        this.props.actions.length === 0 &&
        content.text &&
        !content.name &&
        !content.value
      ) {
        this.handleAddNewAction(content.text, false);
      }
      // add string action
    } else {
      this.handleAddAction(content);
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
      displayCondition,
      onDrop,
      onSelectActionsComponent,
    } = this.props;
    let contentList;
    const isActionsEmpty = !actions || actions.length === 0;
    const isActionsCondition =
      !isActionsEmpty && actions[0].type === "condition";
    // const isActionsString = !isActionsEmpty && !isActionsCondition;
    const editable = true;
    const addContent = (
      <ActionsItem
        style={{ backgroundColor: "rgba(34, 34, 34, 0.05" }}
        containerName={name}
        action={newAction}
        editable={editable}
        onAddAction={(content, isCondition = false) => {
          this.handleAddNewAction(content, isCondition);
        }}
        onActionChange={(newContent) => {
          this.props.onNewActionsChange(this.props.name, newContent);
        }}
        onSelectActionsComponent={onSelectActionsComponent}
        isNew
        isCondition={
          name === "output" &&
          (isActionsCondition || (isActionsEmpty && displayCondition))
        }
      />
    );
    if (actions && actions.length > 0) {
      const actionsDisplayed = isActionsCondition
        ? actions[0].children
        : actions;
      contentList = (
        <List style={{ overflow: "auto", maxHeight: "18.07vh" }}>
          {actionsDisplayed.map((action, index) => (
            <ActionsItem
              containerName={name}
              action={action}
              index={index}
              onDrop={onDrop}
              key={index}
              itemKey={`cd_${index}`}
              onActionChange={(newContent) => {
                if (isActionsCondition) {
                  this.handleActionConditionChange(newContent, index);
                } else {
                  this.handleActionChange(newContent, index);
                }
              }}
              onSelectActionsComponent={onSelectActionsComponent}
              onDeleteActionClick={() => {
                this.handleDeleteClick(index);
              }}
              isCondition={isActionsCondition}
            />
          ))}
        </List>
      );
    } else {
      contentList = <List />;
    }
    return (
      <ExpansionPanel
        label={name}
        className="mdl-color--white"
        style={{ margin: "8px" }}
      >
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
  displayCondition: PropTypes.bool,
  intentId: PropTypes.string,
  newAction: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  onSelectActionsComponent: PropTypes.func.isRequired,
  onNewActionsChange: PropTypes.func.isRequired,
  onDeleteActionClick: PropTypes.func.isRequired,
};

export default ActionsList;
