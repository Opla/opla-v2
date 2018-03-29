/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon } from "zrmc";
import { Tooltip } from "zoapp-ui";
import ActionsEditable from "./actionsEditable";

class ActionEditor extends Component {
  constructor(props) {
    super(props);
    const toolbox = {
      text: true,
      any: false,
      entity: false,
      code: false,
      linebreak: false,
      button: false,
      trash: true,
    };
    this.state = {
      toolbox,
    };
    this.editable = null;
  }

  onTextSelected() {
    this.textSelect();
    this.editable.insertItem({
      type: "text",
      text: "text",
    });
  }

  onAnySelected() {
    this.anySelect();
    this.editable.insertItem({ type: "any", text: "" });
  }

  onEntitySelected() {
    this.entitySelect();
    this.editable.insertItem({
      type: "output_var",
      text: "entityname",
    });
  }

  onCodeSelected() {
    this.codeSelect();
    this.editable.insertItem({
      type: "variable",
      text: "entityname=value",
    });
  }

  onLineBreakSelected() {
    this.lineBreakSelect();
    this.editable.insertItem({ type: "br", text: "" });
  }

  onButtonSelected() {
    this.buttonSelect();
    this.editable.insertItem({
      type: "button",
      text: "value",
    });
  }

  onTrashSelected() {
    this.editable.deleteItem();
  }

  getContent() {
<<<<<<< 00df45019c5781824b1e89f8e2f5e9d8dded4bb4
    if (!this.editable) {
      return "";
    }
    return this.editable.state.content;
=======
    return this.state.content;
>>>>>>> actionEditor use actionsEditable
  }

  onChange = (content) => {
    this.props.onChange(content);
  };

  textSelect() {
    const toolbox = {
      text: true,
      any: false,
      entity: false,
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
      entity: false,
      code: false,
      linebreak: false,
      button: false,
      trash: false,
    };
    this.setState(() => ({ toolbox }));
  }

  entitySelect() {
    const toolbox = {
      text: false,
      any: false,
      entity: true,
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
      entity: false,
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
      entity: false,
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
      entity: false,
      code: false,
      linebreak: false,
      button: true,
      trash: false,
    };
    this.setState(() => ({ toolbox }));
  }

  handleSelected = (type) => {
    if (type === "any") {
      this.anySelect();
    } else if (type === "variable") {
      this.codeSelect();
    } else if (type === "output_var") {
      this.entitySelect();
    } else if (type === "br") {
      this.lineBreakSelect();
    } else if (type === "button") {
      this.buttonSelect();
    } else {
      this.textSelect();
    }
  };

  handleChange = (content) => {
    this.props.onChange(content);
  };

  render() {
    const style = {
      overflow: "hidden",
      fontSize: "16px",
      letterSpacing: "0.04em",
      lineHeight: "1",
      color: "#757575",
      margin: "16px",
    };
    const styleToolbox = {
      width: "100%",
      backgroundColor: "#eee",
      marginBottom: "16px",
      display: "table",
    };
    const styleToolbar = {
      borderRight: "1px solid #ddd",
      display: "table-cell",
    };
    const { toolbox } = this.state;
    let extra = "";
    if (!this.props.isInput) {
      extra = (
        <span>
          <Tooltip label="Insert code">
            <Icon
              /* colored={toolbox.code} */ onClick={(e) => {
                this.onCodeSelected(e);
              }}
              name="code"
            />
          </Tooltip>
          <Tooltip label="Insert Linebreak">
            <Icon
              /* colored={toolbox.linebreak} */ onClick={(e) => {
                this.onLineBreakSelected(e);
              }}
              name="keyboard_return"
            />
          </Tooltip>
          <Tooltip label="Insert Button">
            <Icon
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
      <div style={{ backgroundColor: "#f5f5f5" }}>
        <div style={styleToolbox}>
          <div style={styleToolbar}>
            <Tooltip label="Insert text">
              <Icon
                /* colored={toolbox.text} */ onClick={(e) => {
                  this.onTextSelected(e);
                }}
                name="text_fields"
              />
            </Tooltip>
            <Tooltip label="Insert block any">
              <Icon
                /* colored={toolbox.any} */ onClick={(e) => {
                  this.onAnySelected(e);
                }}
                name="all_out"
              />
            </Tooltip>
            <Tooltip label="Insert entity assignment">
              <Icon
                /* colored={toolbox.entity} */ onClick={(e) => {
                  this.onEntitySelected(e);
                }}
                name="assignment"
              />
            </Tooltip>
            {extra}
          </div>
          <div style={styleToolbar}>
            <Tooltip label="Delete selected item">
              <Icon
                disabled={toolbox.trash}
                onClick={(e) => {
                  this.onTrashSelected(e);
                }}
                name="delete"
              />
            </Tooltip>
          </div>
        </div>
        <ActionsEditable
          id="action-editor-content"
          editable={true}
          content={this.props.content}
          onChange={this.handleChange}
          onSelected={this.handleSelected}
          style={style}
          selectedItem={this.props.selectedItem}
          ref={(e) => {
            this.editable = e;
          }}
        />
      </div>
    );
  }
}

ActionEditor.defaultProps = {
  content: "",
  onChange: () => {},
  isInput: false,
  selectedItem: -1,
  caretPosition: 0,
};

ActionEditor.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func,
  isInput: PropTypes.bool,
  selectedItem: PropTypes.number,
  caretPosition: PropTypes.number,
};

export default ActionEditor;
