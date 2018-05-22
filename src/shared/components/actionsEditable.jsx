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
  static build(items, fromHtml = false) {
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
      startSpan: null,
      endSpan: null,
      itemToFocus: null,
    };
    this.focusElement = null;
    this.itemsElementRefs = [];
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
    if (content !== this.state.content) {
      const items = ActionsTools.parse(content);
      this.setState({
        content,
        items,
        selectedItem,
        caretPosition,
        noUpdate: false,
      });
    }
  }

  handleFocus = (e) => {
    const element = e.target;
    // console.log("handlefocus", element.id, this.props.editable);
    if (element.id && element.id.indexOf("ae_") === 0 && this.props.editable) {
      e.preventDefault();
      this.focusElement = this.focus(element);
      // console.log("focus", this.focusElement.id);
    }
  };

  handleBlur = () => {
    // console.log("onBlur");
    // forceUpdate to sync state and actions span rendered
    this.forceUpdate();
    this.unfocus();
  };

  handleKeyDown = (e) => {
    if (e.which === 27) {
      // esc key
      e.preventDefault();
      this.unfocus();
    }
  };

  handleKeyPress = (e) => {
    if (!this.props.editable) {
      return;
    }
    if (e.which === 13) {
      // WIP handle save event
      const text = this.state.content;
      this.props.onAction(text);
      e.preventDefault();
      this.unfocus();
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

  handleMouseUp = (e) => {
    const element = e.target;
    if (element.tabIndex !== 0 && this.props.editable) {
      this.updateCaretPosition();
    }
  };

  handleInput = () => {
    if (this.props.editable) {
      const element = this.node;
      // console.log("handleChange");
      this.handleChange(element);
    }
  };

  handleChange = (element) => {
    if (this.props.editable) {
      let { selectedItem } = this.state;
      const span = element.children[0];
      const content = ActionsEditable.build([...span.children], true);
      // console.log("handleChange=", content);
      const items = ActionsTools.parse(content);
      const noUpdate = true;
      if (this.state.selectedItem < 0 && items.length > 0) {
        selectedItem += 1;
      }
      this.setState({ noUpdate, content, items, selectedItem }, () => {
        this.props.onChange(content);
      });
    }
    return false;
  };

  focus(element) {
    let el = null;
    if (this.props.editable) {
      el = element;
      if (element.id === "ae_content") {
        el = element.children[0].lastChild;
        // console.log("ae_content", el.id);
      }
      const type = el.getAttribute("data");
      const key = el.id;
      this.props.onSelected(type, key, this);
      const i = key.substring(3);
      let selectedItem = -1;
      let caretPosition;
      if (el.contentEditable) {
        caretPosition = this.updateCaretPosition();
      }
      if (i !== "start" && i !== "end" && i !== "content") {
        selectedItem = parseInt(i, 10);
      }
      // console.log("focus", key, type, caretPosition);
      if (this.state.selectedItem !== selectedItem) {
        const noUpdate = false;
        this.setState(() => ({ noUpdate, selectedItem, caretPosition }));
      }
    }
    return el;
  }

  unfocus = () => {
    // console.log("unfocus=");
    /* this.focusElement = null;
    const noUpdate = false;
    const selectedItem = -1;
    const caretPosition = 0;
    this.setState(() => ({ noUpdate, selectedItem, caretPosition }));
    this.props.onFocus(false, this); */
  };

  setCE = (e, editable = true, itemIndex = null) => {
    if (!e) return;
    // save items refs
    if (itemIndex !== null) {
      this.itemsElementRefs[itemIndex] = e;
    }
    if (editable) {
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
    const { items } = this.state;
    // console.log("insert item: ", item, position, this.focusElement);

    let p = position;
    if (this.focusElement && this.focusElement.id === "ae_end") {
      p = items.length;
    }
    if (p < items.length) {
      items.splice(p, 0, item);
    } else {
      items.push(item);
    }

    const selectedItem = p;
    const content = ActionsEditable.build(items);
    const noUpdate = false;
    this.setState(
      { noUpdate, content, items, selectedItem, itemToFocus: p },
      () => {
        this.props.onChange(content);
      },
    );
  }

  deleteItem(position = this.state.selectedItem) {
    const { items } = this.state;
    let deletePosition = position;
    // if focus on ae_end and last action is a text, remove text
    if (
      this.focusElement &&
      this.focusElement.id === "ae_end" &&
      items[items.length - 1].type === "text"
    ) {
      deletePosition = items.length - 1;
    }
    // console.log("delete item ", deletePosition);
    if (deletePosition > -1 && deletePosition < items.length) {
      items.splice(deletePosition, 1);
      const selectedItem = deletePosition - 1;
      const content = ActionsEditable.build(items);
      const noUpdate = false;
      this.setState({ noUpdate, content, items, selectedItem }, () => {
        this.props.onChange(content);
      });
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
    if (this.props.editable) {
      // console.log("render", this.state.selectedItem, len);
      if (len < 1 || (actions[0] && actions[0].type !== "text")) {
        id = "ae_start";
        if (len < 1) {
          styleText.width = "100vw";
        }
        start = (
          <span
            id={id}
            key={id}
            tabIndex={i}
            data="text"
            style={styleText}
            ref={(e) => {
              this.setCE(e, true);
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
        end = (
          <span
            id={id}
            key={id}
            tabIndex={l}
            data="text"
            style={styleText}
            ref={(e) => {
              this.setCE(e, true);
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
            const { type } = actionItem;
            if (type === "any") {
              return (
                <span
                  className="mdl-chip"
                  key={id + type}
                  id={id}
                  style={styleAny}
                  ref={(e) => {
                    this.setCE(e, false, index);
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
                  key={id + type}
                  id={id}
                  style={styleOut}
                  ref={(e) => {
                    this.setCE(e, true, index);
                  }}
                  data="output_var"
                  tabIndex={p}
                >
                  <span className="mdl-chip__text_ex">
                    {decodeURIComponent(actionItem.text)}
                  </span>
                </span>
              );
            } else if (type === "variable") {
              return (
                <span
                  className="mdl-chip"
                  key={id + type}
                  id={id}
                  style={styleVar}
                  ref={(e) => {
                    this.setCE(e, true, index);
                  }}
                  data="variable"
                  tabIndex={p}
                >
                  <span className="mdl-chip__text_ex">
                    {decodeURIComponent(actionItem.text)}
                  </span>
                </span>
              );
            } else if (type === "br") {
              return (
                <span
                  className="mdl-chip"
                  key={id + type}
                  id={id}
                  style={styleHtml}
                  ref={(e) => {
                    this.setCE(e, false, index);
                  }}
                  data="br"
                  tabIndex={p}
                >
                  <span className="mdl-chip__text_ex">
                    <Icon name="keyboard_return" style={{ fontSize: "13px" }} />
                  </span>
                </span>
              );
            } else if (type === "button") {
              return (
                <span
                  className="mdl-chip"
                  key={id + type}
                  id={id}
                  style={styleHtml}
                  ref={(e) => {
                    this.setCE(e, true, index);
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
                key={id + type}
                id={id}
                style={styleText}
                data="text"
                ref={(e) => {
                  this.setCE(e, true, index);
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
        id="ae_content"
        tabIndex={0}
        key="0"
        className="contenteditable"
        aria-label={this.props.placeholder}
        spellCheck={false}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onMouseUp={this.handleMouseUp}
        onTouchEnd={this.handleMouseUp}
        onKeyPress={this.handleKeyPress}
        onKeyDown={this.handleKeyDown}
        onInput={this.handleInput}
        ref={(node) => {
          this.node = node;
        }}
      >
        {list}
      </div>
    );
  }

  componentDidUpdate() {
    const { itemToFocus } = this.state;
    if (itemToFocus !== null) {
      // call focus on item reference
      const element = this.itemsElementRefs[itemToFocus];
      element.focus();
      this.setState({ itemToFocus: null });
    }
  }
}

ActionsEditable.defaultProps = {
  content: "",
  placeholder: null,
  onChange: () => {},
  onSelected: () => {},
  onFocus: () => {},
  onAction: () => {},
  editable: false,
  selectedItem: -1,
  caretPosition: 0,
  style: null,
};

ActionsEditable.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onSelected: PropTypes.func,
  onFocus: PropTypes.func,
  onAction: PropTypes.func,
  editable: PropTypes.bool,
  selectedItem: PropTypes.number,
  caretPosition: PropTypes.number,
  style: PropTypes.objectOf(PropTypes.string),
};

export default ActionsEditable;
