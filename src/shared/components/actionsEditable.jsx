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

  /* eslint-disable class-methods-use-this */
  shouldComponentUpdate(nextProps, nextState) {
    /*
    noUpdate is a fix for React ContentEditable caret position bug
    see:
    https://github.com/facebook/react/issues/2047
    https://github.com/Automattic/simplenote-electron/pull/549
    */
    if (nextState.noUpdate === true) {
      return false;
    }
    return true;
  }
  /* eslint-enable class-methods-use-this */

  onFocus = (e) => {
    const element = e.target;
    if (element.tabIndex !== 0 && this.props.editable) {
      const caretPosition = this.updateCaretPosition();
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
      this.updateCaretPosition();
    }
  };

  onInput = () => {
    if (!this.props.editable) {
      return;
    }
    const element = this.node;
    this.handleChange(element);
  };

  handleFocusIn = (element) => {
    if (this.props.editable) {
      const type = element.getAttribute("data");
      const key = element.id;
      // console.log("handleFocusIn", key, type);
      this.props.onSelected(type, key);
      const i = key.substring(3);
      let selectedItem = -1;
      if (i !== "start" && i !== "end") {
        selectedItem = parseInt(i, 10);
      }
      if (this.state.selectedItem !== selectedItem) {
        const noUpdate = false;
        this.setState(() => ({ noUpdate, selectedItem }));
      }
    }
  };

  handleChange = (element) => {
    if (this.props.editable) {
      const span = element.children[0];
      const content = ActionsEditable.build([...span.children], true);
      // console.log("handleChange=", content);
      this.props.onChange(content);
      const items = ActionsTools.parse(content);
      const noUpdate = true;
      this.setState(() => ({ noUpdate, content, items }));
    }
    return false;
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

  updateCaretPosition() {
    const caretPosition = this.getCaretPosition();
    if (this.state.caretPosition !== caretPosition) {
      this.setState(() => ({ caretPosition }));
    }
    return caretPosition;
  }

  navigate(e) {
    const element = e.target;
    if (element.tabIndex !== 0) {
      this.updateCaretPosition();
    }
  }

  insertItem(item, position = this.state.selectedItem + 1) {
    /* const span = this.node.children[0];
    const content = ActionsEditable.build([...span.children], true);
    const items = ActionsTools.parse(content); */
    const { items } = this.state;
    // console.log("insert item ", position, item);
    if (position < items.length) {
      items.splice(position, 0, item);
    } else {
      items.push(item);
    }
    const selectedItem = position;
    const content = ActionsEditable.build(items);
    const noUpdate = false;
    this.setState(() => ({ noUpdate, content, items, selectedItem }));
  }

  deleteItem(position = this.state.selectedItem) {
    const { items } = this.state;
    // console.log("delete item ", position);
    if (position < items.length) {
      if (position > -1) {
        items.splice(position, 1);
      }
      let selectedItem = position - 1;
      if (selectedItem < 0) {
        selectedItem = 0;
      }
      const content = ActionsEditable.build(items);
      const noUpdate = false;
      this.setState(() => ({ noUpdate, content, items, selectedItem }));
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
    let i = 1;
    let list;
    let start;
    let id;
    const len = actions.length;
    // console.log("length=", len);
    if (this.props.editable) {
      if (len < 1 || (actions[0] && actions[0].type !== "text")) {
        id = "ae_start";
        start = (
          <span
            id={id}
            tabIndex={i}
            data="text"
            style={styleText}
            ref={this.setCE}
          />
        );
        i += 1;
      }
    }

    if (len > 0) {
      let end;
      let l = len - 1;
      if (actions[l] && actions[l].type !== "text" && this.props.editable) {
        id = "ae_end";
        l = len + i;
        end = (
          <span
            id={id}
            tabIndex={l}
            data="text"
            style={styleText}
            ref={this.setCE}
          />
        );
      }
      list = (
        <span>
          {start}
          {actions.map((actionItem, index) => {
            id = `ae_${index}`;
            const p = i;
            i += 1;
            if (actionItem.type === "any") {
              return (
                <span
                  className="mdl-chip"
                  key={id}
                  id={id}
                  style={styleAny}
                  data="any"
                  tabIndex={p}
                >
                  <span className="mdl-chip__text_ex">any</span>
                </span>
              );
            } else if (actionItem.type === "output_var") {
              return (
                <span
                  className="mdl-chip"
                  key={id}
                  id={id}
                  style={styleOut}
                  ref={this.setCE}
                  data="output_var"
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
                  id={id}
                  style={styleVar}
                  ref={this.setCE}
                  data="variable"
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
                  id={id}
                  style={styleHtml}
                  data="br"
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
                  id={id}
                  style={styleHtml}
                  ref={this.setCE}
                  data="button"
                  tabIndex={p}
                >
                  <span className="mdl-chip__text_ex">{actionItem.text}</span>
                </span>
              );
            }
            return (
              <span
                key={id}
                id={id}
                style={styleText}
                data="text"
                ref={this.setCE}
                tabIndex={p}
              >
                {actionItem.text}
              </span>
            );
          })}
          {end}
        </span>
      );
    } else {
      list = <span>{start}</span>;
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
