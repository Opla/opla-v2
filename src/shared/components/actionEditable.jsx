/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { ContentEditable } from "zoapp-ui";
import ActionsTools from "../utils/actionsTools";

class ActionEditable extends Component {
  static renderAction(items) {
    const styleAny = "color: black; background-color: #fcea20;";
    const styleOut = "color: white; background-color: #23b4bb;";
    const styleVar = "color: white; background-color: #552682;";
    const styleHtml = "color: white; background-color: #aaa;";
    const styleText =
      "height: 32px; display: inline-block; margin: 2px 0px; padding: 0px 4px;";
    let html = "";
    let lastIsText = false;
    let i = 1;
    if (items.length < 1 || (items[0] && items[0].type !== "text")) {
      html += `<span tabIndex="${i}" data="text" style="${styleText}" contentEditable=true> </span>`;
      lastIsText = true;
      i += 1;
    }
    items.forEach((item, index) => {
      html += `<span tabIndex="${i}" key="${index}"`;
      if (item.type === "any") {
        html += `data="${
          item.type
        }" class="mdl-chip" style="${styleAny}" contentEditable=false><span class="mdl-chip__text_ex">any</span></span>`;
        lastIsText = false;
      } else if (item.type === "output_var") {
        // TODO add button to delete chip
        html += `data="${
          item.type
        }" class="mdl-chip" style="${styleOut}" contentEditable=true><span class="mdl-chip__text_ex">${
          item.text
        }</span></span>`;
        lastIsText = false;
      } else if (item.type === "variable") {
        // TODO add button to delete chip
        html += `data="${
          item.type
        }" class="mdl-chip" style="${styleVar}" contentEditable=true><span class="mdl-chip__text_ex">${
          item.text
        }</span></span>`;
        lastIsText = false;
      } else if (item.type === "br") {
        // TODO add button to delete chip
        html += `data="${
          item.type
        }" class="mdl-chip" style="${styleHtml}" contentEditable=false><span class="mdl-chip__text_ex"><i class="material-icons" style="font-size: 13px;">keyboard_return</i></span></span><br/>`;
        lastIsText = false;
      } else if (item.type === "button") {
        // TODO add button to delete chip
        html += `data="${
          item.type
        }" class="mdl-chip" style="${styleHtml}" contentEditable=true><span class="mdl-chip__text_ex">${
          item.text
        }</span></span>`;
        lastIsText = false;
      } else {
        html += `data="text" style="${styleText}" contentEditable=true>${
          item.text
        }</span>`;
        lastIsText = true;
      }
      i += 1;
    });
    if (!lastIsText) {
      html += `<span tabIndex="${i}" data="text" style="${styleText}" contentEditable=true> </span>`;
    }
    return html;
  }

  constructor(props) {
    super(props);
    const { content } = this.props;
    const items = ActionsTools.parse(content);
    const selectedItem = items.length - 1;
    const caretPosition = 0;
    this.state = {
      content,
      items,
      selectedItem,
      caretPosition,
    };
  }

  onFocusIn = (element) => {
    const type = element.getAttribute("data");
    const key = element.getAttribute("key");
    this.props.onSelected(key, type);
    const selectedItem = parseInt(key, 10);
    if (this.state.selectedItem !== selectedItem) {
      this.setState(() => ({ selectedItem }));
    }
  };

  handleChange = (text, element) => {
    const content = ActionEditable.buildFromHtml([...element.children]);
    this.props.onChange(content);
    const items = ActionsTools.parse(content);
    this.setState(() => ({ content, items }));
  };

  render() {
    const content = ActionEditable.renderAction(
      this.state.items,
      this.state.selectedItem,
    );
    const style = {
      overflow: "hidden",
      fontSize: "16px",
      letterSpacing: "0.04em",
      lineHeight: "1",
      color: "#757575",
      margin: "16px",
    };
    return (
      <ContentEditable
        content={content}
        onChange={this.handleChange}
        onFocusIn={this.onFocusIn}
        style={style}
        selectedItem={this.state.selectedItem}
        caretPosition={this.state.caretPosition}
      />
    );
  }
}

ActionEditable.defaultProps = {
  content: "",
  onChange: () => {},
  onSelected: () => {},
  isInput: false,
};

ActionEditable.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func,
  onSelected: PropTypes.func,
  isInput: PropTypes.bool,
};

export default ActionEditable;
