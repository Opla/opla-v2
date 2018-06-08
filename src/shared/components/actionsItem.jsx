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
    } = this.props;
    const color = "rgb(0, 0, 0)";
    // const color =
    //   (!actions || actions.length === 0) && !newAction
    //     ? "rgb(213, 0, 0)"
    //     : "rgb(0, 0, 0)";
    // const style = {}; /* padding: "16px" */
    let style = { color, padding: "0px 16px" };
    if (isNew) {
      style = { height: "100%", minHeight: "40px", ...style };
    }
    if (isCondition) {
      style = { padding: "0px", minHeight: "100px", ...style };
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
        style={style}
        key={itemKey}
        onClick={() => {
          this.handleActionsEditableSelected(this.actionsEditableRef);
        }}
      >
        {isCondition && containerName === "output" ? (
          <ConditionsActionsEditable
            containerName={this.props.containerName}
            content={action}
            editable={editable}
            onAddAction={this.props.onAddAction}
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
};

export default ActionsItem;
