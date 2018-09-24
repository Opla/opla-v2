/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "zrmc";
import ActionsEditable from "./actionsEditable";

class ConditionsActionsEditable extends Component {
  updateContent = (key, content) => {
    const newContent = content === "" ? undefined : content;
    this.props.onChange({
      ...this.props.content,
      [key]: newContent,
    });
  };

  handleKeyPress = (e) => {
    if (!this.props.editable) {
      return;
    }
    if (e.which === 13) {
      // WIP handle save event
      e.preventDefault();
      if (this.props.isNew) {
        this.handleAddAction();
      }
    }
  };

  handleAddAction = () => {
    this.props.onAddAction(this.props.content);
  };

  render() {
    const style = {
      marginTop: "0px",
      marginBottom: "0px",
      height: "24px",
    };
    return (
      <div>
        <div onKeyPress={this.handleKeyPress} className="opla-conditional">
          <TextField
            id="conditionName"
            onChange={(e) => {
              this.updateContent("name", e.target.value);
            }}
            value={this.props.content.name || ""}
            style={style}
            size="6"
            className="opla-conditional-field opla-conditional-name"
          />
          <div className="opla-conditional-op">=</div>
          <TextField
            id="conditionValue"
            onChange={(e) => {
              this.updateContent("value", e.target.value);
            }}
            value={this.props.content.value || ""}
            style={style}
            size="6"
            className="opla-conditional-field opla-conditional-value"
          />
        </div>
        <ActionsEditable
          {...this.props}
          content={this.props.content.text}
          onAddAction={this.handleAddAction}
          onChange={(text) => {
            this.updateContent("text", text);
          }}
          ref={this.props.onActionsEditableRefchange}
          style={{ minHeight: "32px" }}
        />
      </div>
    );
  }
}

ConditionsActionsEditable.defaultProps = {
  content: {},
  placeholder: null,
  onChange: () => {},
  onSelected: () => {},
  onFocus: () => {},
  onAddAction: () => {},
  editable: false,
  selectedItem: -1,
  caretPosition: 0,
  style: null,
  isNew: false,
  onActionsEditableRefchange: () => {},
};

ConditionsActionsEditable.propTypes = {
  content: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onSelected: PropTypes.func,
  onFocus: PropTypes.func,
  onAddAction: PropTypes.func,
  editable: PropTypes.bool,
  selectedItem: PropTypes.number,
  caretPosition: PropTypes.number,
  style: PropTypes.objectOf(PropTypes.string),
  isNew: PropTypes.bool,
  containerName: PropTypes.string,
  onActionsEditableRefchange: PropTypes.func.isRequired,
};

export default ConditionsActionsEditable;
