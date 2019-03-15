/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import PropTypes from "prop-types";
import Zrmc, {
  Button,
  DialogManager,
  Icon,
  List,
  ListItem,
  ListItemMeta,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "zrmc";
import { ExpansionPanel } from "zoapp-ui";
import ActionsList from "../components/actionsList";
import ActionEditor from "../components/actionEditor";
import HelpPanel from "../components/helpPanel";

const IntentDetail = ({
  intent,
  newActions,
  displayCondition,
  displayHelp,
  getIntentNameById,
  onDisable,
  onSelect,
  onAction,
  onHelp,
  onSelectActionsComponent,
  onNewActionsChange,
  onDeleteActionClick,
  selectedInput,
  selectedOutput,
  onChangeToolbox,
}) => {
  const { name, input, output } = intent;
  const topic = intent.topic && intent.topic.length > 0 ? intent.topic : "*";
  const isDeactivated = intent.state && intent.state === "deactivated";

  const { previousId } = intent;
  let help = "";
  if (displayHelp > -1) {
    help = <HelpPanel index={displayHelp} onHelp={onHelp} />;
  }
  return (
    <div className="zui-action-panel list-box">
      <div className="list-content">
        {help}
        <ActionsList
          name="input"
          actions={input}
          newAction={newActions.input}
          onSelect={onSelect}
          onAction={onAction}
          onHelp={onHelp}
          intentId={intent.id}
          onSelectActionsComponent={onSelectActionsComponent}
          onNewActionsChange={onNewActionsChange}
          onDeleteActionClick={onDeleteActionClick}
          onChangeToolbox={onChangeToolbox}
          selected={selectedInput}
        />
        <ActionsList
          name="output"
          actions={output}
          displayCondition={displayCondition}
          newAction={newActions.output}
          onSelect={onSelect}
          onAction={onAction}
          onHelp={onHelp}
          intentId={intent.id}
          onSelectActionsComponent={onSelectActionsComponent}
          onNewActionsChange={onNewActionsChange}
          onDeleteActionClick={onDeleteActionClick}
          onChangeToolbox={onChangeToolbox}
          selected={selectedOutput}
        />
        <ExpansionPanel
          label={
            <div style={{ display: "flex", fontWeight: "900" }}>
              <Icon
                style={{
                  marginTop: "0px",
                  marginRight: "16px",
                  marginLeft: "-20px",
                  width: "24px",
                  height: "24px",
                }}
              >
                <svg>
                  <path
                    fill="#000000"
                    d="M7.75,13C7.74,12.65 7.9,12.31 8.17,12.08C8.92,12.24 9.62,12.55 10.25,13C10.25,13.68 9.69,14.24 9,14.24C8.31,14.24 7.76,13.69 7.75,13M13.75,13C14.38,12.56 15.08,12.25 15.83,12.09C16.1,12.32 16.26,12.66 16.25,13C16.25,13.7 15.69,14.26 15,14.26C14.31,14.26 13.75,13.7 13.75,13V13M12,9C9.23,8.96 6.5,9.65 4.07,11L4,12C4,13.23 4.29,14.44 4.84,15.54C7.21,15.18 9.6,15 12,15C14.4,15 16.79,15.18 19.16,15.54C19.71,14.44 20,13.23 20,12L19.93,11C17.5,9.65 14.77,8.96 12,9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"
                  />
                </svg>
              </Icon>Advanced
              <Icon
                name="help"
                className="help_icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onHelp("advanced");
                }}
              />
            </div>
          }
          className="zui-color--white"
          style={{ margin: "12px" }}
          collapsed
          elevation={0}
        >
          <List>
            <ListItem icon="title">
              Topic
              <ListItemMeta>
                <Button
                  ripple
                  className="zui-action-button"
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
                  className="zui-action-button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSelect) {
                      onSelect({ name, state: "previous" });
                    }
                  }}
                >
                  {getIntentNameById(previousId) || "NONE"}
                </Button>
              </ListItemMeta>
            </ListItem>
            <ListItem icon="link">
              Deactivate
              <ListItemMeta style={{ minWidth: "320px", display: "flex" }}>
                <Switch
                  id="deactivate"
                  style={{ margin: "0 auto" }}
                  checked={isDeactivated}
                  onChange={(isDisabled) => {
                    onDisable(isDisabled);
                  }}
                />
              </ListItemMeta>
            </ListItem>
          </List>
        </ExpansionPanel>
      </div>
    </div>
  );
};

IntentDetail.defaultProps = {
  onNewActionsChange: () => {},
  onSelectActionsComponent: () => {},
  onDeleteActionClick: () => {},
  getIntentNameById: () => {},
};

IntentDetail.propTypes = {
  intent: PropTypes.shape({}).isRequired,
  getIntentNameById: PropTypes.func.isRequired,
  onDisable: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
  onHelp: PropTypes.func,
  onSelectActionsComponent: PropTypes.func.isRequired,
  onNewActionsChange: PropTypes.func.isRequired,
  onDeleteActionClick: PropTypes.func.isRequired,
  onChangeToolbox: PropTypes.func,
  newActions: PropTypes.shape({
    input: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
    output: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  }).isRequired,
  displayCondition: PropTypes.bool,
  displayHelp: PropTypes.number,
  selectedInput: PropTypes.number,
  selectedOutput: PropTypes.number,
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
  if (actionDef === "Topic") {
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
  } else if (actionDef === "Previous") {
    content = (
      <Select
        label="Select an intent"
        style={{ width: "100%" }}
        onSelected={(t) => {
          setInput({ value: t !== "default" ? t : "" });
        }}
      >
        {parameters.options.map((int) => (
          <MenuItem
            key={int.id}
            value={int.id || "default"}
            selected={parameters.previousId === int.id}
          >
            {int.name}
          </MenuItem>
        ))}
      </Select>
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
    onClose: () => {
      onEditAction(null, "Cancel");
      DialogManager.close();
    },
    style: { width: "720px" },
  });
};
