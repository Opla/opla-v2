/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon } from "zrmc";

const types = {
  text: {
    style: {
      display: "inline-block",
      padding: "0 4px",
    },
    className: undefined,
  },
  any: {
    style: {
      color: "black",
      backgroundColor: "#ffb300",
    },
    className: "mdl-chip",
    editable: false,
  },
  output_var: {
    style: {
      color: "white",
      backgroundColor: "#4b830d",
    },
    className: "mdl-chip",
    editable: true,
  },
  variable: {
    style: {
      color: "white",
      backgroundColor: "#007c91",
    },
    className: "mdl-chip",
    editable: true,
  },
  br: {
    style: {
      color: "white",
      backgroundColor: "#00227b",
    },
    className: "mdl-chip",
    editable: false,
  },
  button: {
    style: {
      color: "white",
      backgroundColor: "#ab000d",
    },
    className: "mdl-chip",
    editable: true,
  },
};

class ActionEditable extends Component {
  constructor(props) {
    super(props);
    this.ref = null;
  }

  static sanitizeType(typesList, type) {
    if (!typesList.includes(type)) {
      return "text";
    }
    return type;
  }

  // avoid caret reset position when editing
  shouldComponentUpdate(nextProps) {
    return nextProps.text !== this.ref.innerText;
  }

  setCE = (e, editable = true) => {
    if (!e) return;
    if (editable) {
      e.contentEditable = this.props.editable;
    }
  };

  focus() {
    if (this.ref !== null) {
      this.ref.focus();
      // move caret to last position it entity have text
      if (this.props.text) {
        const index = this.ref.innerText ? this.ref.innerText.length : 0;
        this.moveCaretPosition(this.ref, index);
      }
      this.props.onSelect();
    }
  }

  moveCaretPosition(refs, index) {
    if (refs.childNodes[0] && refs.childNodes[0].nodeName === "SPAN") {
      this.moveCaretPosition(refs.childNodes[0], index);
    } else {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      range.setStart(refs.childNodes[0], index);
    }
  }

  handleChange = (e) => {
    // TODO check if type is editable
    const { actionId } = this.props;
    if (this.props.editable) {
      this.props.onChange(actionId, e.target.innerText);
    }
  };

  render() {
    const { actionId, tabIndex, text } = this.props;
    const type = ActionEditable.sanitizeType(
      Object.keys(types),
      this.props.type,
    );
    const { className, editable } = types[type];
    // compose style with type style and props style
    const style = {
      ...types[type].style,
      ...this.props.style,
    };
    return (
      <span
        className={className}
        id={actionId}
        key={actionId + type}
        tabIndex={tabIndex}
        data={type}
        style={style}
        ref={(e) => {
          this.setCE(e, editable);
          this.ref = e;
        }}
        // onInput={(e)=>{this.handleChange(this.props.actionId, e);}}
        onInput={this.handleChange}
        // onClick={(e)=>{this.props.onSelect();}}
        onClick={this.props.onSelect}
      >
        {type === "any" && <span className="mdl-chip__text_ex">@any</span>}
        {(type === "output_var" || type === "variable") && (
          <span className="mdl-chip__text_ex">{decodeURIComponent(text)}</span>
        )}
        {type === "br" && (
          <span className="mdl-chip__text_ex">
            <Icon name="keyboard_return" style={{ fontSize: "13px" }} />
          </span>
        )}
        {type === "button" && <span className="mdl-chip__text_ex">{text}</span>}
        {type === "text" && <React.Fragment>{text}</React.Fragment>}
      </span>
    );
  }
}

ActionEditable.defaultProps = {
  editable: false,
  style: {},
};

ActionEditable.propTypes = {
  actionId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  text: PropTypes.string,
  editable: PropTypes.bool,
  style: PropTypes.object,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
};

export default ActionEditable;
