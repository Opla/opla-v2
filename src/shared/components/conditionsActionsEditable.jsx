/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ActionsEditable from "./actionsEditable";

class ConditionsActionsEditable extends Component {
  render() {
    return (
      <div>
        <div>
          {this.props.content.name}
          =
          {this.props.content.value}
        </div>
        <ActionsEditable {...this.props} content={this.props.content.text} />
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
};

ConditionsActionsEditable.propTypes = {
  content: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    text: PropTypes.string,
  }),
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
};

export default ConditionsActionsEditable;
