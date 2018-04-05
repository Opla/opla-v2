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
      noUpdate: false,
    };
    this.focusElement = null;
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

  componentWillReceiveProps(nextProps) {
    const { content, selectedItem, caretPosition } = nextProps;
    const items = ActionsTools.parse(content);
    this.setState({
      content,
      items,
      selectedItem,
      caretPosition,
      noUpdate: false,
    });
  }

  onFocus = (e) => {
    const element = e.target;
    if (element.id && element.id.indexOf("ae_") === 0 && this.props.editable) {
      this.handleFocusIn(element);
      this.focusElement = element;
    }
  };

  onBlur = () => {
    // console.log("onBlur");
    this.unfocus();
  };

  onKeyDown = (e) => {
    if (e.which === 27) {
      // esc key
      e.preventDefault();
      this.unfocus();
    }
  };

  onKeyPress = (e) => {
    if (!this.props.editable) {
      return;
    }
    if (e.which === 13) {
      // TODO handle save event
      // console.log("enter key");
      e.preventDefault();
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
    // console.log("handleChange");
    this.handleChange(element);
  };

  handleFocusIn = (element) => {
    if (this.props.editable) {
      const type = element.getAttribute("data");
      const key = element.id;
      this.props.onSelected(type, key);
      const i = key.substring(3);
      let selectedItem = -1;
      let caretPosition;
      if (element.contentEditable) {
        caretPosition = this.updateCaretPosition();
      }
      if (i !== "start" && i !== "end") {
        selectedItem = parseInt(i, 10);
      }
      // console.log("handleFocusIn", key, type, caretPosition);
      if (
        this.state.selectedItem !== selectedItem ||
        this.state.caretPosition !== caretPosition
      ) {
        const noUpdate = false;
        this.setState(() => ({ noUpdate, selectedItem, caretPosition }));
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

  unfocus() {
    this.focusElement = null;
    this.props.onFocus(false);
    const noUpdate = false;
    const selectedItem = -1;
    const caretPosition = 0;
    this.setState(() => ({ noUpdate, selectedItem, caretPosition }));
  }

  setCE = (e, editable = true, focus = false /* , type = "text" */) => {
    if (!e) return;
    // console.log("setCE editable=", editable, focus, type);
    if (editable) {
      e.contentEditable = this.props.editable;
    }
    if (focus) {
      this.focusElement = e;
      e.focus();
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

    let p = position;
    if (this.focusItem) {
      if (this.focusItem === "ae_start") {
        p = 0;
      } else if (this.focusItem === "ae_end") {
        p = items.length;
      }
    }
    if (p < items.length) {
      items.splice(p, 0, item);
    } else {
      items.push(item);
    }
    const selectedItem = p;
    const content = ActionsEditable.build(items);
    const noUpdate = false;
    this.setState(() => ({ noUpdate, content, items, selectedItem }));
  }

  deleteItem(position = this.state.selectedItem) {
    const { items } = this.state;
    if (this.focusItem) {
      if (this.focusItem === "ae_start" || this.focusItem === "ae_end") {
        this.focusItem.innerHtml = "";
      }
    }
    // console.log("delete item ", position);
    if (position > -1 && position < items.length) {
      items.splice(position, 1);
      const selectedItem = position - 1;
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
    let focus = false;
    if (this.props.editable) {
      if (len < 1 || (actions[0] && actions[0].type !== "text")) {
        id = "ae_start";
        if (len < 1) {
          styleText.width = "100wv";
          focus = true;
        }
        start = (
          <span
            id={id}
            tabIndex={i}
            data="text"
            style={styleText}
            ref={(e) => {
              this.setCE(e, true, focus);
            }}
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
        focus = this.state.selectedItem === -1;
        end = (
          <span
            id={id}
            tabIndex={l}
            data="text"
            style={styleText}
            ref={(e) => {
              this.setCE(e, true, focus);
            }}
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
            focus = index === this.state.selectedItem || false;
            const { type } = actionItem;
            if (type === "any") {
              return (
                <span
                  className="mdl-chip"
                  key={id}
                  id={id}
                  style={styleAny}
                  ref={(e) => {
                    this.setCE(e, false, focus, type);
                  }}
                  data="any"
                  tabIndex={p}
                >
                  <span className="mdl-chip__text_ex">any</span>
                </span>
              );
            } else if (type === "output_var") {
              return (
                <span
                  className="mdl-chip"
                  key={id}
                  id={id}
                  style={styleOut}
                  ref={(e) => {
                    this.setCE(e, true, focus, type);
                  }}
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
                  ref={(e) => {
                    this.setCE(e, true, focus, type);
                  }}
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
                  ref={(e) => {
                    this.setCE(e, false, focus, type);
                  }}
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
                  ref={(e) => {
                    this.setCE(e, true, focus, type);
                  }}
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
                ref={(e) => {
                  this.setCE(e, true, focus);
                }}
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
        onBlur={this.onBlur}
        onMouseUp={this.onMouseUp}
        onTouchEnd={this.onMouseUp}
        onKeyPress={this.onKeyPress}
        onKeyDown={this.onKeyDown}
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
  onFocus: () => {},
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
  onFocus: PropTypes.func,
  editable: PropTypes.bool,
  selectedItem: PropTypes.number,
  caretPosition: PropTypes.number,
  style: PropTypes.objectOf(PropTypes.string),
};

export default ActionsEditable;
