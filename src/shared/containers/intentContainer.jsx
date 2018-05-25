/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Zrmc from "zrmc";
import { SubToolbar } from "zoapp-ui";

import IntentDetail, { displayActionEditor } from "../components/intentDetail";
import { apiSendIntentRequest } from "../actions/api";
import {
  appDeleteIntentAction,
  appSetIntentAction,
  appUpdateIntent,
} from "../actions/app";
import ActionsToolbox from "../components/actionsToolbox";

class IntentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { editing: false, toolboxFocus: false };
    this.timer = null;
    this.actionsComponent = null;
  }

  componentDidUpdate(prevProps) {
    // reset when a new intent is selected
    if (prevProps.selectedIntent !== this.props.selectedIntent) {
      this.reset();
    }
  }

  reset() {
    this.actionsComponent = null;
    this.selectedAction = undefined;
    this.actionContainer = undefined;
    this.actionType = undefined;
    this.setState({ editing: false });
  }

  handleChangeAction = (text, name, value) => {
    let actionValue = null;
    const intent = this.props.selectedIntent;
    let { actionType } = this;
    if (actionType === "condition") {
      if (name === null && (!intent.output || intent.output.length === 0)) {
        actionValue = text;
        actionType = null;
      } else if (name && text.length > 0) {
        const type = "item";
        actionValue = {
          name,
          value,
          text,
          type,
        };
      }
    } else {
      actionValue = text;
    }
    if (!actionValue || actionValue === "") {
      return false;
    }
    this.props.appSetIntentAction(
      this.actionContainer,
      actionType,
      actionValue,
      this.selectedAction,
    );
    this.reset();
    return true;
  };

  handleChangeToolbox = (action) => {
    if (action === "unfocus") {
      this.setState({ toolboxFocus: false });
    } else {
      this.setState({ editing: true, toolboxFocus: true });
      // console.log("action=", action, this.actionsComponent);
      if (action !== "focus" && this.actionsComponent) {
        this.actionsComponent.appendAction(action);
      }
    }
  };

  handleEditAction = (dialog, editAction) => {
    if (editAction === "Change" || editAction === "Add") {
      const text = this.actionField.getContent().trim();
      let name = null;
      let value = null;
      if (this.actionType === "condition") {
        name = this.paramNameField.inputRef.value.trim();
        if (!name || name.length === 0) {
          name = null;
        }
        value = this.paramValueField.inputRef.value.trim();
        if (!value || value.length === 0) {
          value = null;
        }
      }
      return this.handleChangeAction(text, name, value);
    } else if (editAction === "Delete") {
      this.props.appDeleteIntentAction(
        this.actionContainer,
        this.selectedAction,
      );
    } else if (editAction === "Topic") {
      const topic = this.actionField.inputRef.value.trim();
      const { selectedIntent } = this.props;
      const currentTopic = selectedIntent.topic ? selectedIntent.topic : "";
      if (topic !== currentTopic) {
        const intent = { ...selectedIntent, topic };
        this.props.appUpdateIntent(this.props.selectedBotId, intent);
      }
    } else if (editAction === "Previous") {
      // console.log("TODO", "IntentContainer.onPrevious ");
    }
    this.reset();
    return true;
  };

  handleSaveIntent = () => {
    if (this.props.selectedIntent) {
      const intent = { ...this.props.selectedIntent };
      if (intent.notSaved) {
        delete intent.notSaved;
        this.props.apiSendIntentRequest(this.props.selectedBotId, intent);
      } else {
        // console.log("WIP", "IntentContainer.handleSaveIntent : intent already saved");
      }
    }
  };

  handleDoActions = ({ name, type, state, index, action }) => {
    if (this.actionContainer) {
      return;
    }
    this.actionContainer = name;
    this.actionType = type;
    this.selectedAction = index;
    if (state === "add" || state === "change") {
      this.handleChangeAction(action.text, action.name, action.value);
    }
  };

  handleActions = ({ name, type, state, index }) => {
    if (this.actionContainer) {
      return;
    }
    this.actionContainer = name;
    this.actionType = type;
    this.selectedAction = index;
    const intent = this.props.selectedIntent;
    let title = name;
    let parameters;
    let action;
    let actionDef;
    let editor = true;
    if (state === "select" && index >= 0) {
      if (type === "condition") {
        const condition = intent[name][0];
        parameters = condition.children[index];
      } else {
        parameters = intent[name][index];
      }
      title = `Edit ${title} item`;
      action = "Change";
    } else if (state === "add") {
      if (type === "condition") {
        parameters = { name: "", value: "", text: "" };
      } else {
        parameters = "";
      }
      title = `Add ${title} item`;
      action = "Add";
    } else if (state === "delete") {
      editor = false;
      title = `Remove ${title} item`;
      action = "Delete";
    } else if (state === "topic") {
      title = "Set topic name";
      action = "Set";
      actionDef = "Topic";
      parameters = intent.topic ? intent.topic : "*";
    } else if (state === "previous") {
      title = "Set previous intent";
      action = "Set";
      actionDef = "Previous";
    } else if (state === "addCondition") {
      title = `Add ${title} item`;
      action = "Add";
    }
    if (!actionDef) {
      actionDef = action;
    }
    if (editor) {
      this.setState({ editing: true });
      const isInput = name === "input";
      displayActionEditor(
        title,
        type,
        action,
        actionDef,
        parameters,
        (input, ref = null) => {
          if (ref === "fieldParamName") {
            this.paramNameField = input;
          } else if (ref === "fieldParamValue") {
            this.paramValueField = input;
          } else {
            this.actionField = input;
          }
        },
        this.handleEditAction,
        this.handleChangeAction,
        isInput,
      );
    } else {
      Zrmc.showDialog({
        header: "Action",
        body: "Do you want to delete it ?",
        actions: [{ name: "Cancel" }, { name: "Delete" }],
        onAction: this.handleEditAction,
      });
    }
  };

  handleEdit = (editing, actionsComponent) => {
    // console.log("editing=", editing, actionsComponent);
    if (
      (this.state.editing !== editing ||
        this.actionsComponent !== actionsComponent) &&
      !this.timer
    ) {
      // console.log("handle edit", editing);
      if (editing) {
        this.actionsComponent = actionsComponent;
      }
      this.timer = setTimeout(() => {
        // console.log("set state", editing);
        this.setState({ editing });
        this.timer = null;
      }, 100);
    }
  };

  render() {
    const intent = this.props.selectedIntent;
    let name = "";
    if (intent) {
      const style = intent.notSaved ? {} : { display: "none" };
      name = (
        <span>
          <span className="gray_dot" style={style} />
          {intent.name}
        </span>
      );
      const { editing, toolboxFocus } = this.state;
      let toolbox;
      if (editing || toolboxFocus) {
        // TODO dont use stored component
        const isInput = this.actionsComponent
          ? this.actionsComponent.props.name === "input"
          : false;
        toolbox = (
          <ActionsToolbox
            onChange={this.handleChangeToolbox}
            isInput={isInput}
          />
        );
      }
      return (
        <div>
          <SubToolbar
            titleIcon="question_answer"
            titleName={
              <div>
                <div
                  style={{
                    float: "left",
                    borderRight: "1px solid #ddd",
                    paddingRight: "16px",
                    maxWidth: "10vw",
                    height: "36px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span>{name}</span>
                </div>
                {toolbox}
              </div>
            }
            icons={[{ name: "file_upload", onClick: this.handleSaveIntent }]}
          />
          <IntentDetail
            intent={intent}
            onSelect={this.handleActions}
            onEdit={this.handleEdit}
            onAction={this.handleDoActions}
          />
        </div>
      );
    }
    return (
      <div>
        <SubToolbar
          titleIcon="question_answer"
          titleName={name}
          icons={[{ name: "file_upload", onClick: this.handleSaveIntent }]}
        />
        <div>You need to create an Intent </div>
      </div>
    );
  }
}

IntentContainer.defaultProps = {
  selectedIntent: null,
  selectedBotId: null,
};

IntentContainer.propTypes = {
  selectedBotId: PropTypes.string,
  selectedIntent: PropTypes.shape({}),
  apiSendIntentRequest: PropTypes.func.isRequired,
  appDeleteIntentAction: PropTypes.func.isRequired,
  appSetIntentAction: PropTypes.func.isRequired,
  appUpdateIntent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const selectedIntentIndex = state.app.selectedIntentIndex
    ? state.app.selectedIntentIndex
    : 0;
  let { selectedIntent } = state.app;
  if (!selectedIntent) {
    selectedIntent = state.app.intents
      ? state.app.intents[selectedIntentIndex]
      : null;
  }
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  return { selectedIntent, selectedBotId };
};

const mapDispatchToProps = (dispatch) => ({
  apiSendIntentRequest: (botId, intent) => {
    dispatch(apiSendIntentRequest(botId, intent));
  },
  appUpdateIntent: (botId, intent) => {
    dispatch(appUpdateIntent(botId, intent));
  },
  appSetIntentAction: (
    actionContainer,
    actionType,
    actionValue,
    selectedAction,
  ) => {
    dispatch(
      appSetIntentAction(
        actionContainer,
        actionType,
        actionValue,
        selectedAction,
      ),
    );
  },
  appDeleteIntentAction: (actionContainer, selectedAction) => {
    dispatch(appDeleteIntentAction(actionContainer, selectedAction));
  },
});

export { IntentContainer as IntentContainerBase };
export default connect(mapStateToProps, mapDispatchToProps)(IntentContainer);
