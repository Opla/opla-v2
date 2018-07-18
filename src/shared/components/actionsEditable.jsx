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
      const t = fromHtml ? encodeURIComponent(text) : text; // .trim();
      if (type === "any") {
        actionText += "*";
      } else if (type === "output_var") {
        // TODO check if t is empty and delete child
        actionText += `{{${t}}}`;
      } else if (type === "variable") {
        // TODO check if t is empty and delete child
        actionText += `<<${t}>>`;
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
      startSpan: null,
      endSpan: null,
      itemToFocus: null,
    };
    this.itemsElementRefs = [];
  }

  componentWillReceiveProps(nextProps) {
    const { content, caretPosition } = nextProps;
    if (content !== this.state.content) {
      const items = ActionsTools.parse(content);
      this.setState({
        content,
        items,
        caretPosition,
      });
    }
  }

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
      e.preventDefault();
      if (this.props.isNew) {
        this.props.onAddAction(text);
      }
    }
  };

  handleMouseUp = (e) => {
    const element = e.target;
    if (element.tabIndex !== 0 && this.props.editable) {
      this.updateCaretPosition();
    }
  };

  updateItemsAndContent = (items) => {
    const content = ActionsEditable.build(items, false);
    // console.log("content", content);
    this.props.onChange(content);
  };

  changeFocus = (itemIndex) => {
    this.setState({ itemToFocus: itemIndex });
  };

  handleEntityChange = (itemIndex, actionId, content) => {
    // add a text item when ae_start or ae_end are edited
    if (itemIndex < 0) {
      this.insertItem({ type: "text", text: content });
      return;
    }
    const newItems = [...this.state.items];
    newItems[itemIndex].text = content;
    this.updateItemsAndContent(newItems, true);
  };

  handleEntitySelect(itemIndex) {
    this.props.onSelected();
    this.setState({
      selectedItem: itemIndex,
    });
    // TODO get caret position
    // TODO set state caretPosition
  }

  clear = () => {
    const selectedItem = -1;
    const caretPosition = 0;
    const content = "";
    const items = ActionsTools.parse(content);
    this.setState(() => ({
      selectedItem,
      caretPosition,
      content,
      items,
      itemToFocus: null,
    }));
    this.props.onFocus(false, this);
  };

  handleContainerClick = (e) => {
    // console.log("ActionsEditable div onClick");
    if (e && e.target && e.target.id === "ae_content") {
      // focus on last item or ae_start if items empty
      const itemsLength = this.state.items.length;
      let itemToFocus;
      if (this.endRef != null) {
        itemToFocus = -2; // ae_end index
      } else if (itemsLength > 0) {
        itemToFocus = itemsLength - 1; // last item index
      } else {
        itemToFocus = -1; // ae_start index
      }
      this.changeFocus(itemToFocus);
    }
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

  // public method
  insertItem(item, position) {
    const { items } = this.state;
    // console.log("insert item: ", item, position);
    if (position == null) {
      const newIndex =
        this.state.selectedItem < 0
          ? this.state.selectedItem
          : this.state.selectedItem + 1;
      // recursive call on new position
      this.insertItem(item, newIndex);
      return;
    }
    if (position === -1) {
      // recursive call on last item position
      this.insertItem(item, 0);
      return;
    }
    if (position === -2) {
      // recursive call on last item position
      this.insertItem(item, items.length);
      return;
    }
    if (position < items.length) {
      items.splice(position, 0, item);
    } else {
      items.push(item);
    }
    // console.log("items", items);

    this.updateItemsAndContent(items);
    this.changeFocus(position);
  }

  // public method
  deleteItem(position = this.state.selectedItem) {
    const { items } = this.state;
    // if focus on ae_end and last action is a text, remove text
    if (position === -2 && items[items.length - 1].type === "text") {
      // recursive call on last item position
      this.deleteItem(items.lenght - 1);
      return;
    }
    // console.log("delete item ", deletePosition);
    if (position > -1 && position < items.length) {
      items.splice(position, 1);
      this.updateItemsAndContent(items);
      const itemToFocus = position > 0 ? position - 1 : position; // move focus to previous item
      this.changeFocus(itemToFocus);
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
      const style = len < 1 ? { flex: "1", minHeight: "15px" } : {};
      start = (
        <ActionEditable
          actionId={"ae_start"}
          tabIndex={i}
          type="text"
          editable={isEditable}
          style={style}
          ref={(e) => {
            this.startRef = e;
          }}
          onChange={(...args) => {
            this.handleEntityChange(-1, ...args);
          }}
          onSelect={() => {
            this.handleEntitySelect(-1);
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
            onSelect={() => {
              this.handleEntitySelect(index);
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
            ref={(e) => {
              this.endRef = e;
            }}
            onChange={(...args) => {
              this.handleEntityChange(-2, ...args);
            }}
            onSelect={() => {
              this.handleEntitySelect(-2);
            }}
          />
        );
      }
    }
    const contentStyle = {
      flex: 1,
      display: "flex",
      alignItems: "center",
    };
    if (this.props.isNew) {
      contentStyle.minHeight = "40px";
    }
    return (
      <div
        id="ae_content"
        style={contentStyle}
        tabIndex={0}
        key="0"
        className="contenteditable"
        aria-label={this.props.placeholder}
        spellCheck={false}
        onClick={this.handleContainerClick}
        onMouseUp={this.handleMouseUp}
        onTouchEnd={this.handleMouseUp}
        onKeyPress={this.handleKeyPress}
        onKeyDown={this.handleKeyDown}
        ref={(node) => {
          this.node = node;
        }}
      >
        <span
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {start}
          {list}
          {end}
        </span>
      </div>
    );
  }

  moveFocus(index) {
    let element;
    switch (index) {
      case -2:
        element = this.endRef;
        break;
      case -1:
        element = this.startRef;
        break;
      default:
        element = this.itemsElementRefs[index];
    }
    // call focus on element reference
    if (element != null) {
      element.focus();
    }
  }

  componentDidUpdate() {
    const { itemToFocus } = this.state;
    // Move focus
    if (itemToFocus !== null) {
      this.moveFocus(itemToFocus);
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
  onAddAction: () => {},
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
  onAddAction: PropTypes.func,
  editable: PropTypes.bool,
  selectedItem: PropTypes.number,
  caretPosition: PropTypes.number,
  style: PropTypes.objectOf(PropTypes.string),
  isNew: PropTypes.bool,
  containerName: PropTypes.string,
};

export default ActionsEditable;
