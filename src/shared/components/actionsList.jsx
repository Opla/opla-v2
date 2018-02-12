import React, { Component } from "react";
import PropTypes from "prop-types";
import { List, ListItem, ListItemContent, ListItemAction, IconButton, Chip } from "react-mdl";
import { ExpansionPanel } from "zoapp-ui";
/* import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import ListDragItem from "./listDragItem"; */
import ActionsTools from "../utils/actionsTools";

// @DragDropContext(HTML5Backend)
class ActionsList extends Component {
  static renderActions(actionText) {
    const actions = ActionsTools.parse(actionText);
    const styleText = {
      lineHeight: "32px",
      height: "32px",
      display: "inline-block",
      margin: "2px 0",
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
      <span>{actions.map((actionItem, index) => {
        const id = `al_${index}`;
        if (actionItem.type === "any") {
          return (<Chip key={id} style={styleAny}>any</Chip>);
        } else if (actionItem.type === "output_var") {
          return (<Chip key={id} style={styleOut}>{actionItem.text}</Chip>);
        } else if (actionItem.type === "variable") {
          return (<Chip key={id} style={styleVar}>{actionItem.text}</Chip>);
        } else if (actionItem.type === "br") {
          return (<Chip key={id} style={styleHtml}><IconButton name="keyboard_return" style={{ fontSize: "13px" }} /></Chip>);
        } else if (actionItem.type === "button") {
          return (<Chip key={id} style={styleHtml}>{actionItem.text}</Chip>);
        }
        return (<span key={id} style={styleText}>{actionItem.text}</span>);
      })}
      </span>);
  }

  render() {
    const {
      name, actions, onSelect, onDrop,
    } = this.props;
    let content;
    // let addDisabled;
    let type = null;
    if (name === "output" && ((!actions) || actions.length === 0 || actions[0].type === "condition")) {
      type = "condition";
    }
    const icon = name === "input" ? "format_quote" : "chat_bubble_outline";
    const style = { padding: "0px 16px" };
    const addText = name === "input" ? "Add an input sentence" : "Add an output response";
    const color = (!actions) || actions.length === 0 ? "rgb(213, 0, 0)" : "rgb(221, 221, 221)";
    const addContent = (<ListItem className="selectableListItem onFocusAction" onClick={(e) => { e.preventDefault(); if (onSelect) { onSelect({ name, type, state: "add" }); } }}>
      <ListItemContent icon={icon} className="mdl-list_action" style={{ color }}>
        {addText}
      </ListItemContent></ListItem>);
    if (actions && actions.length > 0) {
      if (actions[0].type === "condition") {
        const { children } = actions[0];
        type = "condition";
        // WIP display condition list
        content = (
          <List>{
            children.map((action, index) => {
              const text = ActionsList.renderActions(action.text);
              let condition = action.name && action.name.length > 0 ? `${action.name} = ` : "";
              if (condition.length > 0) {
                condition += `${action.value && action.value.length > 0 ? action.value : "undefined"} ?`;
              }
              if (condition.length === 0) {
                condition = "default";
              }
              const key = `cd_${index}`;
              return (
                <ListItem
                  style={style}
                  key={key}
                  className="selectableListItem onFocusAction"
                  twoLine
                  onDrop={onDrop}
                  onClick={(e) => {
                    e.preventDefault(); if (onSelect) {
                      onSelect({
                        name, type: "condition", state: "select", index,
                      });
                    }
                  }}
                >
                  <ListItemContent icon={icon} subtitle={text} className="mdl-list_action">{condition}</ListItemContent>
                  <ListItemAction>
                    <IconButton
                      name="delete"
                      onClick={(e) => {
                        e.preventDefault(); if (onSelect) {
                          onSelect({
                            name, type: "condition", state: "delete", index,
                          });
                        }
                      }}
                    />
                  </ListItemAction>
                </ListItem>
              );
            })
          }{addContent}
          </List>);
      } else {
        content = (
          <List>{
            actions.map((action, index) => {
              const text = ActionsList.renderActions(action);
              const key = `cd_${index}`;
              return (
                <ListItem
                  style={style}
                  key={key}
                  className="selectableListItem onFocusAction"
                  onDrop={onDrop}
                  onClick={(e) => { e.preventDefault(); if (onSelect) { onSelect({ name, state: "select", index }); } }}
                >
                  <ListItemContent icon={icon} className="mdl-list_action">{text}</ListItemContent>
                  <ListItemAction>
                    <IconButton
                      name="delete"
                      onClick={(e) => { e.preventDefault(); if (onSelect) { onSelect({ name, state: "delete", index }); } }}
                    />
                  </ListItemAction>
                </ListItem>
              );
            })
          }{addContent}
          </List>);
      }
      // addDisabled = false;
    } else {
      content = (<List>{addContent}</List>);
      // addDisabled = true;
    }
    return (
      <ExpansionPanel label={name}>
        {content}
      </ExpansionPanel>
    );
  }
}

ActionsList.defaultProps = {
  actions: [],
  onSelect: null,
  onDrop: null,
};

ActionsList.propTypes = {
  name: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})])),
  onSelect: PropTypes.func,
  onDrop: PropTypes.func,
};

export default ActionsList;
