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
    const { content, selectedItem, caretPosition } = this.props;
    const items = ActionsTools.parse(content);
    this.state = {
      content,
      items,
      selectedItem,
      caretPosition,
    };
  }

  /*
  shouldComponentUpdate(nextProps) {
    const { content, selectedItem, caretPosition } = nextProps;
    const items = ActionsTools.parse(content);
    this.setState({
      content,
      items,
      selectedItem,
      caretPosition,
    });
    return true;
  } */

  onFocus = (e) => {
    const element = e.target;
    if (element.tabIndex !== 0 && this.props.editable) {
      const caretPosition = this.updateCaretPosition(element);
      this.handleFocusIn(element, caretPosition);
    }
  };

  onKeyPress = (e) => {
    if (!this.props.editable) {
      return;
    }
    switch (e.which) {
      case 38:
        this.navigate(e, "ArrowUp");
        break;
      case 40:
        this.navigate(e, "ArrowDown");
        break;
      case 37:
        this.navigate(e, "ArrowLeft");
        break;
      case 39:
        this.navigate(e, "ArrowRight");
        break;
      default:
        break;
    }
  };

  onMouseUp = (e) => {
    const element = e.target;
    if (element.tabIndex !== 0 && this.props.editable) {
      this.updateCaretPosition(element);
    }
  };

  onInput = (event) => {
    if (!this.props.editable) {
      return;
    }
    const element = this.node;
    const text = element.textContent.trim();
    const e = event.target;
    const caretPosition = this.updateCaretPosition(e);
    this.handleChange(text, element, { element: e, caretPosition });
  };

  handleFocusIn = (element) => {
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
      const content = ActionsEditable.build([...element.children], true);
      this.props.onChange(content);
      const items = ActionsTools.parse(content);
      this.setState(() => ({ content, items }));
    }
  };

  setCE = (e) => {
    if (e) {
      e.contentEditable = this.props.editable;
    }
  };

  getCaretPosition() {
    const range = window.getSelection().getRangeAt(0);
    this.range = range;
    return range.startOffset;
  }

  updateCaretPosition(element) {
    const caretPosition = this.getCaretPosition(element);
    if (this.state.caretPosition !== caretPosition) {
      this.setState(() => ({ caretPosition }));
    }
    return caretPosition;
  }

  navigate(e) {
    const element = e.target;
    if (element.tabIndex !== 0) {
      this.updateCaretPosition(element);
    }
  }

  insertItem(item, position = this.state.selectedItem + 1) {
    const { items } = this.state;
    if (position < items.length) {
      items.splice(position, 0, item);
    } else {
      items.push(item);
    }
    const selectedItem = position;
    const content = ActionsEditable.build(items);
    this.setState(() => ({ content, items, selectedItem }));
  }

  deleteItem(position = this.state.selectedItem) {
    const { items } = this.state;
    if (position < items.length) {
      delete items[position];
      let selectedItem = position - 1;
      if (selectedItem < 0) {
        selectedItem = 0;
      }
      const content = ActionsEditable.build(items);
      this.setState(() => ({ content, items, selectedItem }));
    }
  }

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
    let lastIsText = false;
    let i = 1;
    let list;
    let end;
    if (this.props.editable) {
      if (actions.length < 1 || (actions[0] && actions[0].type !== "text")) {
        list = (
          <span tabIndex={i} data="text" style={styleText} ref={this.setCE} />
        );
        lastIsText = true;
        i += 1;
      }
    }
    if (actions.length > 0) {
      list = (
        <span>
          {actions.map((actionItem, index) => {
            lastIsText = false;
            const id = `al_${index}`;
            const p = i;
            i += 1;
            if (actionItem.type === "any") {
              return (
                <span className="mdl-chip" key={id} style={styleAny}>
                  <span className="mdl-chip__text_ex">any</span>
                </span>
              );
            } else if (actionItem.type === "output_var") {
              return (
                <span
                  className="mdl-chip"
                  key={id}
                  style={styleOut}
                  ref={this.setCE}
                  tabIndex={p}
                >
                  <span className="mdl-chip__text_ex">
                    {decodeURIComponent(actionItem.text)}
                  </span>
                </span>
              );
            } else if (actionItem.type === "variable") {
              return (
                <span
                  className="mdl-chip"
                  key={id}
                  style={styleVar}
                  ref={this.setCE}
                  tabIndex={p}
                >
                  <span className="mdl-chip__text_ex">
                    {decodeURIComponent(actionItem.text)}
                  </span>
                </span>
              );
            } else if (actionItem.type === "br") {
              return (
                <span
                  className="mdl-chip"
                  key={id}
                  style={styleHtml}
                  tabIndex={p}
                >
                  <span className="mdl-chip__text_ex">
                    <Icon name="keyboard_return" style={{ fontSize: "13px" }} />
                  </span>
                </span>
              );
            } else if (actionItem.type === "button") {
              return (
                <span
                  className="mdl-chip"
                  key={id}
                  style={styleHtml}
                  ref={this.setCE}
                  tabIndex={p}
                >
                  <span className="mdl-chip__text_ex">{actionItem.text}</span>
                </span>
              );
            }
            lastIsText = true;
            return (
              <span key={id} style={styleText} ref={this.setCE} tabIndex={p}>
                {actionItem.text}
              </span>
            );
          })}
        </span>
      );
    }
    if (!lastIsText && this.props.editable) {
      end = (
        <span tabIndex={i} data="text" style={styleText} ref={this.setCE} />
      );
    }
    return (
      <div
        tabIndex={0}
        key="0"
        className="ContentEditable"
        aria-label={this.props.placeholder}
        spellCheck={false}
        onFocus={this.onFocus}
        onMouseUp={this.onMouseUp}
        onTouchEnd={this.onMouseUp}
        onKeyUp={this.onKeyPress}
        onInput={this.onInput}
        ref={(node) => {
          this.node = node;
        }}
      >
        {list}
        {end}
      </div>
    );
  }
}

ActionsEditable.defaultProps = {
  content: "",
  placeholder: null,
  onChange: () => {},
  onSelected: () => {},
  editable: false,
  selectedItem: -1,
  caretPosition: 0,
  style: null,
};

ActionsEditable.propTypes = {
  content: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onSelected: PropTypes.func,
  editable: PropTypes.bool,
  selectedItem: PropTypes.number,
  caretPosition: PropTypes.number,
  style: PropTypes.objectOf(PropTypes.string),
};

export default ActionsEditable;
