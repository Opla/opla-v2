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

    const extras = [];
    if (this.props.isInput) {
      extras.push(
        <Tooltip key="action_iba" label="Insert block any">
          <Icon
            className="actionstoolbox-icon"
            onClick={() => {
              this.props.onChange("any");
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
            onClick={() => {
              this.props.onChange("variable");
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
            onClick={() => {
              this.props.onChange("br");
            }}
            id="atb_br"
            name="keyboard_return"
          />
        </Tooltip>,
      );
      extras.push(
        <Tooltip key="action_il" label="TODO Insert intent ref">
          <Icon
            className="actionstoolbox-icon"
            onClick={(e) => {
              e.stopPropagation();
              // this.onButtonSelected(e);
              // TODO insert intent ref
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
              this.props.onChange("button");
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
              onClick={() => {
                this.props.onChange("condition");
              }}
              id="atb_condition"
              name="device_hub"
            />
          </Tooltip>,
        );
      }
    }
    return (
      <div style={styleToolbox}>
        <div style={styleToolbar}>
          <Tooltip label="Insert text">
            <Icon
              className="actionstoolbox-icon"
              onClick={() => {
                this.props.onChange("text");
              }}
              id="atb_text"
              name="text_fields"
            />
          </Tooltip>
          <Tooltip label="Insert output code">
            <Icon
              className="actionstoolbox-icon"
              onClick={() => {
                this.props.onChange("output_var");
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
              onClick={() => {
                this.props.onChange("trash");
              }}
              id="atb_trash"
              name="delete"
            />
          </Tooltip>
        </div>
        <div style={styleToolbarRight}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
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
