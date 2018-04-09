/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "zoapp-ui";
import { Icon } from "zrmc";

class ActionsToolbox extends Component {
  constructor(props) {
    super(props);
    const toolbox = {
      text: true,
      any: false,
      variable: false,
      code: false,
      linebreak: false,
      button: false,
      trash: true,
    };
    this.state = {
      toolbox,
    };
  }

  handleFocusIn = (type /* , caretPosition */) => {
    /* const type = element.getAttribute("data");
    const key = element.getAttribute("key"); */
    // console.log("onFocusIn", element.tabIndex, key, type, caretPosition);
    if (type === "any") {
      this.anySelect();
    } else if (type === "variable") {
      this.codeSelect();
    } else if (type === "output_var") {
      this.variableSelect();
    } else if (type === "br") {
      this.lineBreakSelect();
    } else if (type === "button") {
      this.buttonSelect();
    } else {
      this.textSelect();
    }
    /* const selectedItem = parseInt(key, 10);
    if (this.state.selectedItem !== selectedItem) {
      this.setState(() => ({ selectedItem }));
    } */
  };

  onTextSelected() {
    this.textSelect();
    this.props.onChange("text");
    /* this.insertItem(this.state.selectedItem + 1, {
      type: "text",
      text: "text",
    }); */
  }

  onAnySelected() {
    this.anySelect();
    this.props.onChange("any");
    /* this.insertItem(this.state.selectedItem + 1, { type: "any", text: "" }); */
  }

  onVariableSelected() {
    this.variableSelect();
    this.props.onChange("variable");
    /* this.insertItem(this.state.selectedItem + 1, {
      type: "output_var",
      text: "variablename",
    }); */
  }

  onCodeSelected() {
    this.codeSelect();
    this.props.onChange("code");
    /* this.insertItem(this.state.selectedItem + 1, {
      type: "variable",
      text: "variablename=value",
    }); */
  }

  onLineBreakSelected() {
    this.lineBreakSelect();
    this.props.onChange("linebreak");
    /* this.insertItem(this.state.selectedItem + 1, { type: "br", text: "" }); */
  }

  onButtonSelected() {
    this.buttonSelect();
    this.props.onChange("button");
    /* this.insertItem(this.state.selectedItem + 1, {
      type: "button",
      text: "value",
    }); */
  }

  onTrashSelected() {
    this.props.onChange("trash");
    /* this.deleteItem(this.state.selectedItem); */
  }

  handleFocus = (e) => {
    const element = e.target;
    const type = element.getAttribute("data");
    // console.log("focus toolbox", type);
    if (type) {
      this.handleFocusIn(type);
    }
    this.props.onChange("focus");
  };

  handleBlur = () => {
    // console.log("unfocus toolbox");
    this.props.onChange("unfocus");
  };

  textSelect() {
    const toolbox = {
      text: true,
      any: false,
      variable: false,
      code: false,
      linebreak: false,
      button: false,
      trash: true,
    };
    this.setState(() => ({ toolbox }));
  }

  anySelect() {
    const toolbox = {
      text: false,
      any: true,
      variable: false,
      code: false,
      linebreak: false,
      button: false,
      trash: false,
    };
    this.setState(() => ({ toolbox }));
  }

  variableSelect() {
    const toolbox = {
      text: false,
      any: false,
      variable: true,
      code: false,
      linebreak: false,
      button: false,
      trash: false,
    };
    this.setState(() => ({ toolbox }));
  }

  codeSelect() {
    const toolbox = {
      text: false,
      any: false,
      variable: false,
      code: true,
      linebreak: false,
      button: false,
      trash: false,
    };
    this.setState(() => ({ toolbox }));
  }

  lineBreakSelect() {
    const toolbox = {
      text: false,
      any: false,
      variable: false,
      code: false,
      linebreak: true,
      button: false,
      trash: false,
    };
    this.setState(() => ({ toolbox }));
  }

  buttonSelect() {
    const toolbox = {
      text: false,
      any: false,
      variable: false,
      code: false,
      linebreak: false,
      button: true,
      trash: false,
    };
    this.setState(() => ({ toolbox }));
  }

  render() {
    if (this.props.disable) {
      return <div />;
    }
    const styleToolbox = {
      /* width: "100%",
      backgroundColor: "#eee",
      marginBottom: "16px",
      display: "table", */
      marginLeft: "0px",
      height: "24px",
      float: "right",
    };
    const styleToolbar = {
      borderRight: "1px solid #ddd",
      /* display: "table-cell", */
      padding: "8px",
      float: "left",
      height: "22px",
    };
    const styleButton = {
      margin: "0 4px",
    };
    const { toolbox } = this.state;
    let extra = "";
    if (!this.props.isInput) {
      extra = (
        <span>
          <Tooltip label="Insert code">
            <Icon
              style={styleButton}
              /* colored={toolbox.code} */ onClick={(e) => {
                this.onCodeSelected(e);
              }}
              name="code"
            />
          </Tooltip>
          <Tooltip label="Insert Linebreak">
            <Icon
              style={styleButton}
              /* colored={toolbox.linebreak} */ onClick={(e) => {
                this.onLineBreakSelected(e);
              }}
              name="keyboard_return"
            />
          </Tooltip>
          <Tooltip label="Insert Button">
            <Icon
              style={styleButton}
              /* colored={toolbox.button} */ onClick={(e) => {
                this.onButtonSelected(e);
              }}
              name="insert_link"
            />
          </Tooltip>
        </span>
      );
    }
    return (
      <div
        style={styleToolbox}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        <div style={styleToolbar}>
          <Tooltip label="Insert text">
            <Icon
              style={styleButton}
              /* colored={toolbox.text} */ onClick={(e) => {
                this.onTextSelected(e);
              }}
              name="text_fields"
            />
          </Tooltip>
          <Tooltip label="Insert block any">
            <Icon
              style={styleButton}
              /* colored={toolbox.any} */ onClick={(e) => {
                this.onAnySelected(e);
              }}
              name="all_out"
            />
          </Tooltip>
          <Tooltip label="Insert variable assignment">
            <Icon
              style={styleButton}
              /* colored={toolbox.variable} */ onClick={(e) => {
                this.onVariableSelected(e);
              }}
              name="assignment"
            />
          </Tooltip>
          {extra}
        </div>
        <div style={styleToolbar}>
          <Tooltip label="Delete selected item">
            <Icon
              style={styleButton}
              disabled={toolbox.trash}
              onClick={(e) => {
                this.onTrashSelected(e);
              }}
              name="delete"
            />
          </Tooltip>
        </div>
      </div>
    );
  }
}

ActionsToolbox.defaultProps = {
  onChange: () => {},
  type: null,
  isInput: false,
  disable: false,
};

ActionsToolbox.propTypes = {
  onChange: PropTypes.func,
  type: PropTypes.string,
  isInput: PropTypes.bool,
  disable: PropTypes.bool,
};

export default ActionsToolbox;
