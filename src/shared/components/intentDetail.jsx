/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import Zrmc, { List, ListItem, ListItemMeta, TextField, Button } from "zrmc";
import { ExpansionPanel } from "zoapp-ui";
import ActionsList from "../components/actionsList";
import ActionEditor from "../components/actionEditor";

const IntentDetail = ({ intent, onSelect, onEdit, onAction }) => {
  const { name, input, output } = intent;
  const topic = intent.topic && intent.topic.length > 0 ? intent.topic : "*";
  return (
    <div className="mrb-action-panel list-box">
      <div className="list-content">
        <ActionsList
          name="input"
          actions={input}
          onSelect={onSelect}
          onEdit={onEdit}
          onAction={onAction}
          intentId={intent.id}
        />
        <hr />
        <ActionsList
          name="output"
          actions={output}
          onSelect={onSelect}
          onEdit={onEdit}
          onAction={onAction}
          intentId={intent.id}
        />
        <hr />
        <ExpansionPanel label="Parameters" collapsed>
          <List>
            <ListItem icon="title">
              Topic
              <ListItemMeta>
                <Button
                  ripple
                  className="mrb-action-button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSelect) {
                      onSelect({ name, state: "topic" });
                    }
                  }}
                >
                  {topic}
                </Button>
              </ListItemMeta>
            </ListItem>
            <ListItem icon="link">
              Previous
              <ListItemMeta>
                <Button
                  ripple
                  className="mrb-action-button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSelect) {
                      onSelect({ name, state: "previous" });
                    }
                  }}
                >
                  NONE
                </Button>
              </ListItemMeta>
            </ListItem>
          </List>
        </ExpansionPanel>
      </div>
    </div>
  );
};

IntentDetail.propTypes = {
  intent: PropTypes.shape({}).isRequired,
  onSelect: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
};

export default IntentDetail;

export const displayActionEditor = (
  title,
  type,
  action,
  actionDef,
  parameters,
  setInput,
  onEditAction,
  onChange,
  isInput,
) => {
  let condition = "";
  let text = parameters;
  let content = null;
  if (actionDef === "Topic" || actionDef === "Previous") {
    content = (
      <div>
        <TextField
          defaultValue={text}
          pattern=".+"
          label={actionDef}
          error="Wrong value"
          style={{ width: "100%" }}
          ref={(input) => setInput(input)}
        />
      </div>
    );
  } else {
    if (type === "condition") {
      text = parameters.text ? parameters.text : "";
      const name = parameters.name ? parameters.name : "";
      const value = parameters.value ? parameters.value : "";
      condition = (
        <div style={{ width: "100%", display: "table" }}>
          <div style={{ display: "table-cell" }}>
            <TextField
              defaultValue={name}
              pattern=".+"
              label="Condition entity"
              error="Wrong value"
              noFloatingLabel
              style={{ width: "100%", margin: "8px 0px", height: "24px" }}
              ref={(input) => setInput(input, "fieldParamName")}
            />
          </div>
          <div
            style={{
              fontWeight: "900",
              textAlign: "center",
              display: "table-cell",
            }}
          >
            =
          </div>
          <div style={{ display: "table-cell" }}>
            <TextField
              defaultValue={value}
              pattern=".+"
              label="Condition value"
              error="Wrong value"
              noFloatingLabel
              style={{ width: "100%", margin: "0px" }}
              ref={(input) => setInput(input, "fieldParamValue")}
            />
          </div>
        </div>
      );
    }
    content = (
      <div>
        {condition}
        <ActionEditor
          content={text}
          style={{ width: "100%" }}
          onChange={onChange}
          isInput={isInput}
          ref={(input) => setInput(input)}
        />
      </div>
    );
  }

  Zrmc.showDialog({
    header: title,
    body: content,
    actions: [{ name: "Cancel" }, { name: actionDef, title: action }],
    onAction: onEditAction,
    style: { width: "720px" },
  });
};
