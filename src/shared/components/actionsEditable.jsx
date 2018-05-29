/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ActionsTools from "../utils/actionsTools";
import ActionEditable from "./actionEditable";

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
      itemFocused: -1,
      itemToFocus: null,
    };
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

  handleBlur = () => {
    // console.log("onBlur");
    // forceUpdate to sync state and actions span rendered
    this.forceUpdate();
  };

  handleKeyDown = (e) => {
    if (e.which === 27) {
      // esc key
      e.preventDefault();
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

  handleKeyPress = (e) => {
    if (!this.props.editable) {
      return;
    }
    if (e.which === 13) {
      // WIP handle save event
      const text = this.state.content;
      this.props.onAction(text);
      e.preventDefault();
      if (this.props.isNew) {
        this.clear();
      }
    }
  };

  handleMouseUp = (e) => {
    const element = e.target;
    if (element.tabIndex !== 0 && this.props.editable) {
      this.updateCaretPosition();
    }
  };

  handleEntityChange = (itemIndex, actionId, content) => {
    // add a text item when ae_start or ae_end are edited
    if (itemIndex < 0) {
      this.insertItem({ type: "text", text: content });
      return;
    }
    const newItems = [...this.state.items];
    newItems[itemIndex].text = content;
    this.setState({
      items: newItems,
    });
    const newContent = ActionsEditable.build(newItems, false);
    const noUpdate = true;
    this.setState({ noUpdate, content: newContent }, () => {
      this.props.onChange(newContent);
    });
  };

  updateContent = () => {};

  // TODO remove
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

  // TODO Move focus to last item when ae_content focus

  handleEntitySelect(itemIndex, type, id, e) {
    this.setState({
      selectedItem: itemIndex,
    });

    if (this.props.editable) {
      this.props.onSelected(type, id, e);
    }
    // TODO get caret position
    // TODO set state selectedItem and caretPosition
  }

  clear = () => {
    const noUpdate = false;
    const selectedItem = -1;
    const caretPosition = 0;
    const content = "";
    const items = ActionsTools.parse(content);
    this.setState(() => ({
      noUpdate,
      selectedItem,
      caretPosition,
      content,
      items,
      itemToFocus: null,
    }));
    this.props.onFocus(false, this);
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

  saveActionEditableRef = (e, itemIndex = null) => {
    if (e && itemIndex !== null) {
      this.itemsElementRefs[itemIndex] = e;
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
    // console.log("insert item: ", item, position);

    let p = position;
    if (this.state.selectedItem === -2) {
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
      this.state.selectedItem === -2 &&
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
    const isEditable = this.props.editable;
    let start;
    let list;
    let end;
    let i = 1;
    let id;
    const len = actions.length;

    // create a start action if empty or first item is not a text
    if (isEditable && (len < 1 || (actions[0] && actions[0].type !== "text"))) {
      // if intent empty start action take all the space
      const style = len < 1 ? { width: "100vw" } : {};
      start = (
        <ActionEditable
          actionId={"ae_start"}
          tabIndex={i}
          type="text"
          editable={isEditable}
          style={style}
          onChange={(...args) => {
            this.handleEntityChange(-1, ...args);
          }}
          onSelect={(e) => {
            this.handleEntitySelect(-1, "text", "ae_start", e);
          }}
        />
      );
      i += 1;
    }

    if (len > 0) {
      list = actions.map((actionItem, index) => {
        id = `ae_${index}`;
        const p = i;
        i += 1;
        const { type } = actionItem;
        return (
          <ActionEditable
            key={index}
            actionId={id}
            tabIndex={p}
            type={type}
            text={actionItem.text}
            editable={isEditable}
            ref={(e) => {
              this.saveActionEditableRef(e, index);
            }}
            onChange={(...args) => {
              this.handleEntityChange(index, ...args);
            }}
            onSelect={(e) => {
              this.handleEntitySelect(index, type, id, e);
            }}
          />
        );
      });
      if (isEditable && actions[len - 1] && actions[len - 1].type !== "text") {
        end = (
          <ActionEditable
            actionId={"ae_end"}
            tabIndex={i}
            type="text"
            editable={isEditable}
            onChange={(...args) => {
              this.handleEntityChange(-2, ...args);
            }}
            onSelect={(e) => {
              this.handleEntitySelect(-2, "text", "ae_end", e);
            }}
          />
        );
      }
    }
    return (
      <div
        id="ae_content"
        tabIndex={0}
        key="0"
        className="contenteditable"
        aria-label={this.props.placeholder}
        spellCheck={false}
        onBlur={this.handleBlur}
        onMouseUp={this.handleMouseUp}
        onTouchEnd={this.handleMouseUp}
        onKeyPress={this.handleKeyPress}
        onKeyDown={this.handleKeyDown}
        ref={(node) => {
          this.node = node;
        }}
      >
        <span>
          {start}
          {list}
          {end}
        </span>
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
  isNew: false,
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
  isNew: PropTypes.bool,
};

export default ActionsEditable;
