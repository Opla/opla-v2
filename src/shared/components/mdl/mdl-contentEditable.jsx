import React, { Component } from "react";
import PropTypes from "prop-types";

// Inspired from https://github.com/bmcmahen/react-wysiwyg/blob/master/index.js
class MdlContentEditable extends Component {
  constructor(props) {
    super(props);
    const caretPosition = this.props.caretPosition || -1;
    // const selectedItem = this.props.selectedItem || -1;
    this.state = { caretPosition };
  }

  componentDidMount() {
    // this.updateFocus();
    window.setTimeout(() => { this.updateFocus(); }, 100);
  }

  shouldComponentUpdate(nextProps) {
    const element = this.node; // ReactDOM.findDOMNode(this);
    const template = document.createElement("template");
    let { content } = nextProps;
    template.innerHTML = content;
    content = template.innerHTML;
    const current = element.innerHTML;
    if (content !== current) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    // this.updateFocus();
    window.setTimeout(() => { this.updateFocus(); }, 100);
  }

  onFocus = (e) => {
    // WIP
    const element = e.target;
    if (element.tabIndex !== 0) {
      console.log("onFocus In ", element);
      const caretPosition = this.updateCaretPosition(element);
      this.props.onFocusIn(element, caretPosition);
      // e.preventDefault();
    }
    // console.log("onFocus ", e.target);
  }

  onMouseUp = (e) => {
    const element = e.target;
    if (element.tabIndex !== 0) {
      const caretPosition = this.updateCaretPosition(element);
      console.log("onMouseUp ", caretPosition);
    }
  }

  onKeyPress = (e) => {
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
  }

  onInput = (event) => {
    const element = this.node; // ReactDOM.findDOMNode(this);
    const text = element.textContent.trim();
    const e = event.target;
    const caretPosition = this.updateCaretPosition(e);
    this.props.onChange(text, element, { element: e, caretPosition });
  }

  getCaretPosition() {
    const range = window.getSelection().getRangeAt(0);
    this.range = range;
    // const clone = range.cloneRange();
    // clone.selectNodeContents(element);
    // clone.setEnd(range.endContainer, range.endOffset);
    // console.log("clone ", clone.startOffset, clone.endOffset, clone, range);
    return range.startOffset;
  }

  updateFocus() {
    const source = this.node; // ReactDOM.findDOMNode(this);
    let focusIndex = this.props.selectedItem;
    let { caretPosition } = this.state;
    const children = [...source.children];
    let element = null;

    if (focusIndex === -1) {
      focusIndex = children.length - 1;
    }

    for (let index = 0; index < children.length; index += 1) {
      if (focusIndex === index) {
        element = children[index];
        break;
      }
    }

    if (element) {
      element.focus();
      let len = element.innerText.length - 1;
      if (len < 0) {
        len = 0;
      }
      if (caretPosition < 0 || caretPosition >= len) {
        caretPosition = len;
      }
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(element);
      const carret = 1;
      range.setStart(element, carret);
      range.setEnd(element, carret);
      // range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      console.log("setFocus");
    }
  }

  updateCaretPosition(element) {
    const caretPosition = this.getCaretPosition(element);
    if (this.state.caretPosition !== caretPosition) {
      this.setState(() => ({ caretPosition }));
    }
    return caretPosition;
  }

  navigate(e, name) {
    const element = e.target;
    if (element.tabIndex !== 0) {
      const caretPosition = this.updateCaretPosition(element);
      console.log("navigate", name, caretPosition);
    }
  }

  render() {
    // const editing = true;
    const { className, content } = this.props;
    const tagName = "div";

    // setup our classes
    let classes = "ContentEditable ";

    // TODO set Material Design color
    const placeholderStyle = { color: "#bbbbbb" };

    if (className) {
      classes += className;
    }

    // return our newly created element
    return React.createElement(tagName, {
      tabIndex: 0,
      key: "0",
      className: classes,
      contentEditable: false,
      "aria-label": this.props.placeholder,
      style: this.props.placeholder ? placeholderStyle : this.props.style || {},
      dangerouslySetInnerHTML: {
        __html: content,
      },
      spellCheck: false,
      onFocus: this.onFocus,
      onMouseUp: this.onMouseUp,
      onTouchEnd: this.onMouseUp,
      onKeyUp: this.onKeyPress,
      onInput: this.onInput,
      ref: (node) => { this.node = node; },
    });
  }
}

MdlContentEditable.defaultProps = {
  className: null,
  selectedItem: -1,
  content: "",
  caretPosition: 0,
  placeholder: null,
  onFocusIn: null,
  style: null,
};

MdlContentEditable.propTypes = {
  className: PropTypes.string,
  selectedItem: PropTypes.number,
  content: PropTypes.string,
  caretPosition: PropTypes.number,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFocusIn: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.string),
};

export default MdlContentEditable;
