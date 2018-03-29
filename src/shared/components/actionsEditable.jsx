/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon } from "zrmc";
import ActionsTools from "../utils/actionsTools";

class ActionsEditable extends Component {
  static build(items, fromHtml) {
    // WIP convert back html to action syntax
    let actionText = "";
    // TODO append empty text span if first element is not a text
    items.forEach((child, index) => {
      const text = fromHtml ? child.textContent : child.text;
      const type = fromHtml ? child.getAttribute("data") : child.type;
      const t = text; // .trim();
      if (type === "any") {
        actionText += "*";
      } else if (type === "output_var") {
        // TODO check if t is empty and delete child
        actionText += `{{${encodeURIComponent(t)}}}`;
      } else if (type === "variable") {
        // TODO check if t is empty and delete child
        actionText += `<<${encodeURIComponent(t)}>>`;
      } else if (type === "br") {
        actionText += "<br/>";
      } else if (type === "button") {
        actionText += `<button>${t}</button>`;
      } else if (type === "text") {
        if (index > 0 || t.length > 0) {
          actionText += text;
        }
      }
    });
    return actionText; // .trim();
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
    if (this.props.editable) {
      const type = element.getAttribute("data");
      const key = element.getAttribute("key");
      this.props.onSelected(key, type);
      const selectedItem = parseInt(key, 10);
      if (this.state.selectedItem !== selectedItem) {
        this.setState(() => ({ selectedItem }));
      }
    }
  };

  handleChange = (text, element) => {
    if (this.props.editable) {
      const content = ActionsEditable.buildFromHtml([...element.children]);
      this.props.onChange(content);
      const items = ActionsTools.parse(content);
      this.setState(() => ({ content, items }));
    }
  };

  render() {
    const actions = this.state.items;
    const styleText = {
      display: "inline-block",
      padding: "0 4px",
    };
    const styleVar = {
      color: "white",
      backgroundColor: "#552682",
    };
    const styleOut = {
      color: "white",
      backgroundColor: "#23b4bb",
    };
    const styleAny = {
      color: "black",
      backgroundColor: "#fcea20",
    };
    const styleHtml = {
      color: "white",
      backgroundColor: "#aaa",
    };
    return (
      <span>
        {actions.map((actionItem, index) => {
          const id = `al_${index}`;
          if (actionItem.type === "any") {
            return (
              <span className="mdl-chip" key={id} style={styleAny}>
                <span className="mdl-chip__text_ex">any</span>
              </span>
            );
          } else if (actionItem.type === "output_var") {
            return (
              <span className="mdl-chip" key={id} style={styleOut}>
                <span className="mdl-chip__text_ex">
                  {decodeURIComponent(actionItem.text)}
                </span>
              </span>
            );
          } else if (actionItem.type === "variable") {
            return (
              <span className="mdl-chip" key={id} style={styleVar}>
                <span className="mdl-chip__text_ex">
                  {decodeURIComponent(actionItem.text)}
                </span>
              </span>
            );
          } else if (actionItem.type === "br") {
            return (
              <span className="mdl-chip" key={id} style={styleHtml}>
                <span className="mdl-chip__text_ex">
                  <Icon name="keyboard_return" style={{ fontSize: "13px" }} />
                </span>
              </span>
            );
          } else if (actionItem.type === "button") {
            return (
              <span className="mdl-chip" key={id} style={styleHtml}>
                <span className="mdl-chip__text_ex">{actionItem.text}</span>
              </span>
            );
          }
          return (
            <span key={id} style={styleText}>
              {actionItem.text}
            </span>
          );
        })}
      </span>
    );
  }
}

ActionsEditable.defaultProps = {
  content: "",
  onChange: () => {},
  onSelected: () => {},
  editable: false,
};

ActionsEditable.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func,
  onSelected: PropTypes.func,
  editable: PropTypes.bool,
};

export default ActionsEditable;
