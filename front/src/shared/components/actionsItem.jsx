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

  componentDidUpdate(prevProps) {
    if (
      this.props.isSelected &&
      (this.props.isSelected !== prevProps.isSelected ||
        this.props.action !== prevProps.action)
    ) {
      // Test if ActionsEditable finish by a button
      // If yes the last item is endRef not the last ref item
      if (this.actionsEditableRef.endRef) {
        this.actionsEditableRef.moveFocus(-2);
      } else {
        this.actionsEditableRef.changeFocus(
          this.actionsEditableRef.state.items.length - 1,
        );
      }
    }
  }

  handleActionsEditableSelected = (ref, index) => {
    this.props.onSelectActionsComponent(ref, index);
  };

  render() {
    const {
      isNew,
      isCondition,
      index,
      containerName,
      action,
      onDrop,
      style,
      className,
    } = this.props;
    const itemKey = index > -1 ? `cd_${index}` : null;
    const s = {
      ...style,
    };
    /* let icon = null;
    if (isNew) {
      icon = containerName === "input" ? "format_quote" : "chat_bubble_outline";
    } */
    const addText =
      containerName === "input"
        ? "Add an input sentence"
        : "Add an output response";
    const editable = true;

    let meta = <div />;

    if (isNew) {
      if (action && action !== "") {
        meta = (
          <ListItemMeta
            icon="add"
            className="actionItemIcon"
            onClick={() => {
              this.props.onAddAction(action, isCondition);
            }}
          />
        );
      }
    } else {
      meta = (
        <ListItemMeta
          icon="remove"
          className="actionItemIcon"
          onClick={this.props.onDeleteActionClick}
        />
      );
    }
    let cl = " onFocusAction actionItem";
    if (isCondition) {
      cl = ` actionConditional ${cl}`;
    }
    if (className) {
      cl = className + cl;
    }
    return (
      <ListItem
        className={cl}
        style={s}
        key={itemKey}
        onClick={() => {
          this.handleActionsEditableSelected(this.actionsEditableRef, index);
        }}
      >
        <React.Fragment>{this.props.toolbox}</React.Fragment>
        <div
          style={{ width: "calc(100% - 28px)" }}
          ref={(r) => {
            this.ref = r;
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
        </div>
        {meta}
      </ListItem>
    );
  }
}

ActionsItem.defaultProps = {
  onAddAction: () => {},
  index: -1,
};

ActionsItem.propTypes = {
  containerName: PropTypes.string,
  onActionChange: PropTypes.func,
  onAddAction: PropTypes.func,
  onSelectActionsComponent: PropTypes.func,
  isNew: PropTypes.bool,
  isCondition: PropTypes.bool,
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  index: PropTypes.number,
  onDrop: PropTypes.func,
  onDeleteActionClick: PropTypes.func,
  style: PropTypes.shape({}),
  className: PropTypes.string,
  toolbox: PropTypes.node,
  isSelected: PropTypes.bool,
};

export default ActionsItem;
