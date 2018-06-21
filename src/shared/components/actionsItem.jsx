/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemMeta } from "zrmc";
import ActionsEditable from "./actionsEditable";
import ConditionsActionsEditable from "./conditionsActionsEditable";

class ActionsItem extends Component {
  constructor(props) {
    super(props);
    this.actionsEditableRef = null;
  }

  handleActionsEditableSelected = (ref) => {
    this.props.onSelectActionsComponent(ref);
  };

  render() {
    const {
      isNew,
      isCondition,
      itemKey,
      containerName,
      action,
      onDrop,
      style,
    } = this.props;
    const color = "rgb(0, 0, 0)";
    // const color =
    //   (!actions || actions.length === 0) && !newAction
    //     ? "rgb(213, 0, 0)"
    //     : "rgb(0, 0, 0)";
    // const style = {}; /* padding: "16px" */
    let s = { ...style, color, height: "100%", padding: "0px 16px" };
    if (isNew) {
      s = { ...style, minHeight: "40px" };
    }
    if (isCondition) {
      s = { ...style, height: "auto", padding: "16px" };
    }

    const icon =
      containerName === "input" ? "format_quote" : "chat_bubble_outline";
    const addText =
      containerName === "input"
        ? "Add an input sentence"
        : "Add an output response";
    const editable = true;
    return (
      <ListItem
        className="selectableListItem onFocusAction mdl-list_action"
        icon={icon}
        style={s}
        key={itemKey}
        onClick={() => {
          this.handleActionsEditableSelected(this.actionsEditableRef);
        }}
      >
        {isCondition ? (
          <ConditionsActionsEditable
            containerName={this.props.containerName}
            content={action}
            editable={editable}
            onAddAction={(content) => {
              this.props.onAddAction(content, true);
            }}
            placeholder={addText}
            onChange={this.props.onActionChange}
            onActionsEditableRefchange={(e) => {
              if (e) {
                this.actionsEditableRef = e;
              }
            }}
            isNew={isNew}
            onDrop={onDrop}
          />
        ) : (
          <ActionsEditable
            containerName={this.props.containerName}
            content={action}
            editable={editable}
            onAddAction={this.props.onAddAction}
            placeholder={addText}
            onChange={this.props.onActionChange}
            ref={(e) => {
              if (e) {
                this.actionsEditableRef = e;
              }
            }}
            isNew={isNew}
            onDrop={onDrop}
          />
        )}
        {isNew ? (
          <div />
        ) : (
          <ListItemMeta
            icon="delete"
            onClick={this.props.onDeleteActionClick}
          />
        )}
      </ListItem>
    );
  }
}

ActionsItem.defaultProps = {
  onAddAction: () => {},
};

ActionsItem.propTypes = {
  containerName: PropTypes.string,
  onActionChange: PropTypes.func,
  onAddAction: PropTypes.func,
  onSelectActionsComponent: PropTypes.func,
  isNew: PropTypes.bool,
  isCondition: PropTypes.bool,
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  itemKey: PropTypes.string,
  onDrop: PropTypes.func,
  onDeleteActionClick: PropTypes.func,
  style: PropTypes.shape({}),
};

export default ActionsItem;
