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
  onChangeAction = (/* actionText */) => {
    // console.log("IntentContainer.onChangeAction =", actionText);
  };

  onEditAction = (dialog, editAction) => {
    if (editAction === "Change" || editAction === "Add") {
      const text = this.actionField.getContent().trim();
      let actionValue = null;
      const intent = this.props.selectedIntent;
      let { actionType } = this;
      if (this.actionType === "condition") {
        let name = this.paramNameField.inputRef.value.trim();
        if (!name || name.length === 0) {
          name = null;
        }
        let value = this.paramValueField.inputRef.value.trim();
        if (!value || value.length === 0) {
          value = null;
        }
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
    this.selectedAction = undefined;
    this.actionContainer = undefined;
    this.actionType = undefined;
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
        this.onEditAction,
        this.onChangeAction,
        isInput,
      );
    } else {
      Zrmc.showDialog({
        header: "Action",
        body: "Do you want to delete it ?",
        actions: [{ name: "Delete" }, { name: "Cancel" }],
        onAction: this.onEditAction,
      });
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
      return (
        <div>
          <SubToolbar
            titleIcon="question_answer"
            titleName={
              <div>
                name
                <ActionsToolbox />
              </div>
            }
            icons={[{ name: "file_upload", onClick: this.handleSaveIntent }]}
          />
          <IntentDetail intent={intent} onSelect={this.handleActions} />
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

export default connect(mapStateToProps, mapDispatchToProps)(IntentContainer);
