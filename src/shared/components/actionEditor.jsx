import React, { Component } from "react";
import PropTypes from "prop-types";
import { Icon, Tooltip } from "zoapp-materialcomponents";
import { ContentEditable } from "zoapp-ui";
import ActionsTools from "../utils/actionsTools";

class ActionEditor extends Component {
  static buildFromHtml(children) {
    // WIP convert back html to action syntax
    let actionText = "";
    // TODO append empty text span if first element is not a text
    children.forEach((child, index) => {
      const text = child.textContent;
      const type = child.getAttribute("data");
      const t = text; // .trim();
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

  static renderAction(items) {
    const styleAny = "color: black; background-color: #fcea20;";
    const styleOut = "color: white; background-color: #23b4bb;";
    const styleVar = "color: white; background-color: #552682;";
    const styleHtml = "color: white; background-color: #aaa;";
    const styleText = "height: 32px; display: inline-block; margin: 2px 0px; padding: 0px 4px;";
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
        html += `data="${item.type}" class="mdl-chip" style="${styleAny}" contentEditable=false><span class="mdl-chip__text_ex">any</span></span>`;
        lastIsText = false;
      } else if (item.type === "output_var") {
        // TODO add button to delete chip
        html += `data="${item.type}" class="mdl-chip" style="${styleOut}" contentEditable=true><span class="mdl-chip__text_ex">${item.text}</span></span>`;
        lastIsText = false;
      } else if (item.type === "variable") {
        // TODO add button to delete chip
        html += `data="${item.type}" class="mdl-chip" style="${styleVar}" contentEditable=true><span class="mdl-chip__text_ex">${item.text}</span></span>`;
        lastIsText = false;
      } else if (item.type === "br") {
        // TODO add button to delete chip
        html += `data="${item.type}" class="mdl-chip" style="${styleHtml}" contentEditable=false><span class="mdl-chip__text_ex"><i class="material-icons" style="font-size: 13px;">keyboard_return</i></span></span><br/>`;
        lastIsText = false;
      } else if (item.type === "button") {
        // TODO add button to delete chip
        html += `data="${item.type}" class="mdl-chip" style="${styleHtml}" contentEditable=true><span class="mdl-chip__text_ex">${item.text}</span></span>`;
        lastIsText = false;
      } else {
        html += `data="text" style="${styleText}" contentEditable=true>${item.text}</span>`;
        lastIsText = true;
      }
      i += 1;
    });
    if (!lastIsText) {
      html += `<span tabIndex="${i}" data="text" style="${styleText}" contentEditable=true> </span>`;
    }
    return html;
  }

  static build(items) {
    // WIP convert back html to action syntax
    let actionText = "";
    // TODO append empty text span if first element is not a text
    items.forEach((child, index) => {
      const { text, type } = child;
      const t = text; // .trim();
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
    const toolbox = {
      text: true,
      any: false,
      entity: false,
      code: false,
      linebreak: false,
      button: false,
      trash: true,
    };
    const { content } = this.props;
    const items = ActionsTools.parse(content);
    const selectedItem = items.length - 1;
    const caretPosition = 0;
    this.state = {
      toolbox, content, items, selectedItem, caretPosition,
    };
  }

  onFocusIn = (element /* , caretPosition */) => {
    const type = element.getAttribute("data");
    const key = element.getAttribute("key");
    // console.log("onFocusIn", element.tabIndex, key, type, caretPosition);
    if (type === "any") {
      this.anySelect();
    } else if (type === "variable") {
      this.codeSelect();
    } else if (type === "output_var") {
      this.entitySelect();
    } else if (type === "br") {
      this.lineBreakSelect();
    } else if (type === "button") {
      this.buttonSelect();
    } else {
      this.textSelect();
    }
    const selectedItem = parseInt(key, 10);
    if (this.state.selectedItem !== selectedItem) {
      this.setState(() => ({ selectedItem }));
    }
  }

  onTextSelected() {
    this.textSelect();
    this.insertItem(this.state.selectedItem + 1, { type: "text", text: "text" });
  }

  onAnySelected() {
    this.anySelect();
    this.insertItem(this.state.selectedItem + 1, { type: "any", text: "" });
  }

  onEntitySelected() {
    this.entitySelect();
    this.insertItem(this.state.selectedItem + 1, { type: "output_var", text: "entityname" });
  }

  onCodeSelected() {
    this.codeSelect();
    this.insertItem(this.state.selectedItem + 1, { type: "variable", text: "entityname=value" });
  }

  onLineBreakSelected() {
    this.lineBreakSelect();
    this.insertItem(this.state.selectedItem + 1, { type: "br", text: "" });
  }

  onButtonSelected() {
    this.buttonSelect();
    this.insertItem(this.state.selectedItem + 1, { type: "button", text: "value" });
  }

  onTrashSelected() {
    this.deleteItem(this.state.selectedItem);
  }

  getContent() {
    return this.state.content;
  }

  insertItem(position, item) {
    const { items } = this.state;
    if (position < items.length) {
      items.splice(position, 0, item);
    } else {
      items.push(item);
    }
    const selectedItem = position;
    const content = ActionEditor.build(items);
    this.setState(() => ({ content, items, selectedItem }));
  }

  deleteItem(position) {
    const { items } = this.state;
    if (position < items.length) {
      delete items[position];
      let selectedItem = position - 1;
      if (selectedItem < 0) {
        selectedItem = 0;
      }
      const content = ActionEditor.build(items);
      this.setState(() => ({ content, items, selectedItem }));
    }
  }

  handleChange = (text, element) => {
    const content = ActionEditor.buildFromHtml([...element.children]);
    this.props.onChange(content);
    const items = ActionsTools.parse(content);
    this.setState(() => ({ content, items }));
  }

  textSelect() {
    const toolbox = {
      text: true,
      any: false,
      entity: false,
      code: false,
      linebreak: false,
      button: false,
      trash: true,
    };
    this.setState(() => ({ toolbox }));
  }

  anySelect() {
    const toolbox = {
      text: false,
      any: true,
      entity: false,
      code: false,
      linebreak: false,
      button: false,
      trash: false,
    };
    this.setState(() => ({ toolbox }));
  }

  entitySelect() {
    const toolbox = {
      text: false,
      any: false,
      entity: true,
      code: false,
      linebreak: false,
      button: false,
      trash: false,
    };
    this.setState(() => ({ toolbox }));
  }

  codeSelect() {
    const toolbox = {
      text: false,
      any: false,
      entity: false,
      code: true,
      linebreak: false,
      button: false,
      trash: false,
    };
    this.setState(() => ({ toolbox }));
  }

  lineBreakSelect() {
    const toolbox = {
      text: false,
      any: false,
      entity: false,
      code: false,
      linebreak: true,
      button: false,
      trash: false,
    };
    this.setState(() => ({ toolbox }));
  }

  buttonSelect() {
    const toolbox = {
      text: false,
      any: false,
      entity: false,
      code: false,
      linebreak: false,
      button: true,
      trash: false,
    };
    this.setState(() => ({ toolbox }));
  }

  render() {
    const content = ActionEditor.renderAction(this.state.items, this.state.selectedItem);
    const style = {
      overflow: "hidden", fontSize: "16px", letterSpacing: "0.04em", lineHeight: "1", color: "#757575", margin: "16px",
    };
    const styleToolbox = {
      width: "100%", backgroundColor: "#eee", marginBottom: "16px", display: "table",
    };
    const styleToolbar = { borderRight: "1px solid #ddd", display: "table-cell" };
    const { toolbox } = this.state;
    let extra = "";
    if (!this.props.isInput) {
      extra = (
        <span>
          <Tooltip label="Insert code">
            <Icon colored={toolbox.code} onClick={(e) => { this.onCodeSelected(e); }} name="code" />
          </Tooltip>
          <Tooltip label="Insert Linebreak">
            <Icon colored={toolbox.linebreak} onClick={(e) => { this.onLineBreakSelected(e); }} name="keyboard_return" />
          </Tooltip>
          <Tooltip label="Insert Button">
            <Icon colored={toolbox.button} onClick={(e) => { this.onButtonSelected(e); }} name="insert_link" />
          </Tooltip>
        </span>);
    }
    return (
      <div style={{ backgroundColor: "#f5f5f5" }}>
        <div style={styleToolbox}>
          <div style={styleToolbar}>
            <Tooltip label="Insert text">
              <Icon colored={toolbox.text} onClick={(e) => { this.onTextSelected(e); }} name="text_fields" />
            </Tooltip>
            <Tooltip label="Insert block any">
              <Icon colored={toolbox.any} onClick={(e) => { this.onAnySelected(e); }} name="all_out" />
            </Tooltip>
            <Tooltip label="Insert entity assignment">
              <Icon colored={toolbox.entity} onClick={(e) => { this.onEntitySelected(e); }} name="assignment" />
            </Tooltip>
            {extra}
          </div>
          <div style={styleToolbar}>
            <Tooltip label="Delete selected item">
              <Icon disabled={toolbox.trash} onClick={(e) => { this.onTrashSelected(e); }} name="delete" />
            </Tooltip>
          </div>
        </div>
        <ContentEditable
          content={content}
          onChange={this.handleChange}
          onFocusIn={this.onFocusIn}
          style={style}
          selectedItem={this.state.selectedItem}
          caretPosition={this.state.caretPosition}
        />
      </div>);
  }
}

ActionEditor.defaultProps = {
  content: "",
  onChange: () => { },
  isInput: false,
};

ActionEditor.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func,
  isInput: PropTypes.bool,
};

export default ActionEditor;
