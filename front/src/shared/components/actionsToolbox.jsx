/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "zoapp-ui";
import { Icon, Menu, MenuItem, Button } from "zrmc";

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

  handleFocusIn = (type) => {
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
  };

  onTextSelected() {
    this.textSelect();
    this.props.onChange("text");
  }

  onAnySelected() {
    this.anySelect();
    this.props.onChange("any");
  }

  onConditionSelected() {
    this.props.onChange("condition");
  }

  onVariableSelected() {
    this.variableSelect();
    this.props.onChange("output_var");
  }

  onCodeSelected() {
    this.codeSelect();
    this.props.onChange("variable");
  }

  onLineBreakSelected() {
    this.lineBreakSelect();
    this.props.onChange("br");
  }

  onButtonSelected() {
    this.buttonSelect();
    this.props.onChange("button");
  }

  onTrashSelected() {
    this.props.onChange("trash");
  }

  handleFocus = (e) => {
    // e.stopPropagation();
    const element = e.target;
    const type = element.id.substring(3);
    // console.log("focus toolbox", type, element);
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
      marginLeft: "0px",

      width: "100%",
    };
    const styleToolbar = {
      borderRight: "1px solid #eeeeee",
      display: "flex",
      padding: "8px 8px 4px 8px",
      float: "left",
      height: "22px",
    };
    const styleToolbarRight = {
      ...styleToolbar,
      borderRight: "none",
      float: "right",
      padding: "0px",
    };

    const { toolbox } = this.state;
    const extras = [];
    if (this.props.isInput) {
      extras.push(
        <Tooltip key="action_iba" label="Insert block any">
          <Icon
            className="actionstoolbox-icon"
            onClick={(e) => {
              // e.stopPropagation();
              this.onAnySelected(e);
            }}
            id="atb_any"
            name="all_out"
          />
        </Tooltip>,
      );
      extras.push(
        <Tooltip key="action_emo" label="TODO Insert emoticon">
          <Icon
            className="actionstoolbox-icon"
            onClick={(e) => {
              e.stopPropagation();
              // this.onButtonSelected(e);
              // TODO insert emoji
            }}
            id="ati_emoticon"
            name="insert_emoticon"
          />
        </Tooltip>,
      );
      extras.push(
        <Tooltip key="action_att" label="TODO Insert Attachment">
          <Icon
            className="actionstoolbox-icon"
            onClick={(e) => {
              e.stopPropagation();
              // this.onButtonSelected(e);
              // TODO insert attachment
            }}
            id="ati_attachment"
            name="attachment"
          />
        </Tooltip>,
      );
    } else {
      extras.push(
        <Tooltip key="action_ico" label="Insert code">
          <Icon
            className="actionstoolbox-icon"
            onClick={(e) => {
              // e.stopPropagation();
              this.onCodeSelected(e);
            }}
            id="atb_variable"
            name="code"
          />
        </Tooltip>,
      );
      extras.push(
        <Tooltip key="action_ilb" label="Insert Linebreak">
          <Icon
            className="actionstoolbox-icon"
            onClick={(e) => {
              // e.stopPropagation();
              this.onLineBreakSelected(e);
            }}
            id="atb_br"
            name="keyboard_return"
          />
        </Tooltip>,
      );
      extras.push(
        <Tooltip key="action_il" label="TODO Insert link">
          <Icon
            className="actionstoolbox-icon"
            onClick={(e) => {
              e.stopPropagation();
              // this.onButtonSelected(e);
              // TODO insert link
            }}
            id="atb_link"
            name="insert_link"
          />
        </Tooltip>,
      );
      extras.push(
        <Tooltip key="action_emo" label="TODO Insert emoticon">
          <Icon
            className="actionstoolbox-icon"
            onClick={(e) => {
              e.stopPropagation();
              // this.onButtonSelected(e);
              // TODO insert emoji
            }}
            id="atb_emo"
            name="insert_emoticon"
          />
        </Tooltip>,
      );
      const menu = (
        <Menu target="atb_gui" align="left">
          <MenuItem
            onSelected={() => {
              this.onButtonSelected();
            }}
          >
            Button
          </MenuItem>
          <MenuItem disabled>Image</MenuItem>
          <MenuItem disabled>Poll</MenuItem>
          <MenuItem disabled>Map</MenuItem>
          <MenuItem disabled>Menu</MenuItem>
        </Menu>
      );
      extras.push(
        <Icon
          key="action_gu"
          className="actionstoolbox-icon"
          id="atb_gui"
          name="category"
          menu={menu}
        />,
      );
      if (this.props.condition) {
        extras.push(
          <Tooltip key="action_ic" label="Insert condition">
            <Icon
              className="actionstoolbox-icon"
              onClick={(e) => {
                // e.stopPropagation();
                this.onConditionSelected(e);
              }}
              id="atb_condition"
              name="device_hub"
            />
          </Tooltip>,
        );
      }
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
              className="actionstoolbox-icon"
              onClick={(e) => {
                // e.stopPropagation();
                this.onTextSelected(e);
              }}
              id="atb_text"
              name="text_fields"
            />
          </Tooltip>
          <Tooltip label="Insert variable assignment">
            <Icon
              className="actionstoolbox-icon"
              onClick={(e) => {
                // e.stopPropagation();
                this.onVariableSelected(e);
              }}
              id="atb_output_var"
              name="assignment"
            />
          </Tooltip>
          {extras.map((e) => e)}
        </div>
        <div style={styleToolbar}>
          <Tooltip label="Delete selected block">
            <Icon
              className="actionstoolbox-icon"
              disabled={toolbox.trash}
              onClick={(e) => {
                // e.stopPropagation();
                this.onTrashSelected(e);
              }}
              id="atb_trash"
              name="delete"
            />
          </Tooltip>
        </div>
        <div style={styleToolbarRight}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              this.props.onChange("unfocus");
            }}
          >
            cancel
          </Button>
        </div>
      </div>
    );
  }
}

ActionsToolbox.defaultProps = {
  onChange: () => {},
  type: null,
  isInput: false,
  condition: false,
  disable: false,
};

ActionsToolbox.propTypes = {
  onChange: PropTypes.func,
  type: PropTypes.string,
  isInput: PropTypes.bool,
  condition: PropTypes.bool,
  disable: PropTypes.bool,
};

export default ActionsToolbox;
