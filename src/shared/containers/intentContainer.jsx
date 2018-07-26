/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Zrmc, { Icon } from "zrmc";
import { SubToolbar } from "zoapp-ui";
import IntentDetail, { displayActionEditor } from "../components/intentDetail";
import { apiSendIntentRequest } from "../actions/api";
import {
  appDeleteIntentAction,
  appSetIntentAction,
  appUpdateIntent,
  appSetNewActions,
} from "../actions/app";
import IntentTools from "../utils/intentsTools";

class IntentContainer extends Component {
  constructor(props) {
    super(props);
    let { selectedIntent } = this.props;
    if (!selectedIntent || !selectedIntent.id) {
      selectedIntent = IntentTools.generateFirstIntent();
    }
    this.state = {
      editing: false,
      toolboxFocus: false,
      toolboxDisplayMode: "",
      displayCondition: false,
      selectedInput: -1,
      selectedOutput: -1,
      selectedIntent,
    };
    this.selectedActionsComponent = null;
  }

  // handle click outside intent container component
  // inspired by https://medium.com/@pitipatdop/little-neat-trick-to-capture-click-outside-react-component-5604830beb7f
  componentWillMount() {
    document.addEventListener("mousedown", this.handleDocumentClick, false);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleDocumentClick, false);
  }

  handleDocumentClick = (e) => {
    // Mik : Test this.node to fix
    // https://github.com/Opla/front/issues/249
    if (this.node && !this.node.contains(e.target)) {
      this.handleClickOutside();
    }
  };

  handleClickOutside() {
    this.updateToolboxDisplay(false);
  }

  componentDidUpdate(prevProps) {
    // reset when a new intent is selected
    let { selectedIntent } = this.props;
    if (!selectedIntent || !selectedIntent.id) {
      selectedIntent = IntentTools.generateFirstIntent();
    }
    if (
      prevProps.selectedIntent &&
      this.props.selectedIntent &&
      prevProps.selectedIntent.id !== this.props.selectedIntent.id
    ) {
      this.reset({ selectedIntent });
    } else if (prevProps.selectedIntent !== this.props.selectedIntent) {
      this.reset({ selectedIntent });
    }
  }

  reset(moreState = {}) {
    this.selectedAction = undefined;
    this.actionContainer = undefined;
    this.actionType = undefined;
    this.setState({
      editing: false,
      displayCondition: false,
      selectedInput: -1,
      selectedOutput: -1,
      ...moreState,
    });
  }

  handleDeleteActionClick = (containerName, index) => {
    this.actionContainer = containerName;
    this.selectedAction = index;
    Zrmc.showDialog({
      header: "Action",
      body: "Do you want to delete it ?",
      actions: [{ name: "Cancel" }, { name: "Delete" }],
      onAction: this.handleEditAction,
    });
  };

  handleChangeAction = (text, name, value) => {
    let actionValue = null;
    const intent = this.state.selectedIntent;
    let { actionType } = this;
    if (actionType === "condition") {
      if (name === null && (!intent.output || intent.output.length === 0)) {
        actionValue = text;
        actionType = null;
      } else if (name != null && text.length > 0) {
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
    this.props.appSetIntentAction(
      this.actionContainer,
      actionType,
      actionValue,
      this.selectedAction,
    );
    return true;
  };

  appendAction = (editableComponent, action) => {
    if (!editableComponent) {
      return;
    }
    if (action === "text") {
      editableComponent.insertItem({
        type: "text",
        text: "text",
      });
    } else if (action === "any") {
      editableComponent.insertItem({
        type: "any",
        text: "",
      });
    } else if (action === "output_var") {
      editableComponent.insertItem({
        type: "output_var",
        text: "variablename",
      });
    } else if (action === "variable") {
      editableComponent.insertItem({
        type: "variable",
        text: "variablename=value",
      });
    } else if (action === "br") {
      editableComponent.insertItem({
        type: "br",
        text: "",
      });
    } else if (action === "button") {
      editableComponent.insertItem({
        type: "button",
        text: "value",
      });
    } else if (action === "trash") {
      editableComponent.deleteItem();
    }
  };

  handleChangeToolbox = (action) => {
    if (action === "unfocus") {
      this.setState({
        toolboxFocus: false,
        selectedInput: -1,
        selectedOutput: -1,
      });
    } else {
      this.setState({ editing: true, toolboxFocus: true });
      if (action === "condition") {
        this.toggleCondition();
      } else if (action !== "focus" && this.selectedActionsComponent) {
        this.appendAction(this.selectedActionsComponent, action);
      }
    }
  };

  toggleCondition = () => {
    const { newActions } = this.props;
    // change newActions type
    if (newActions.output && typeof newActions.output === "string") {
      this.handleNewActionsChange("output", {
        text: newActions.output,
      });
    } else if (newActions.output && typeof newActions.output === "object") {
      this.handleNewActionsChange("output", newActions.output.text);
    }

    // change condition display
    this.setState({
      displayCondition: !this.state.displayCondition,
    });
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
    if (this.state.selectedIntent) {
      const intent = { ...this.state.selectedIntent };
      if (intent.notSaved) {
        delete intent.notSaved;
        this.props.apiSendIntentRequest(this.props.selectedBotId, intent);
      } else {
        // console.log("WIP", "IntentContainer.handleSaveIntent : intent already saved");
      }
    }
  };

  handleDoActions = ({ name, type, state, index, action }) => {
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
    const intent = this.state.selectedIntent;
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

  // mode: "", "input" or "output"
  updateToolboxDisplay(editing, mode = "") {
    if (this.state.editing !== editing || this.state.mode !== mode) {
      this.setState({ editing, toolboxDisplayMode: mode });
    }
  }

  handleSelectActionsComponent = (selectedActionsComponent, index) => {
    this.selectedActionsComponent = selectedActionsComponent;
    const containerName =
      this.selectedActionsComponent && this.selectedActionsComponent.props
        ? this.selectedActionsComponent.props.containerName
        : "";
    if (containerName === "input") {
      const selected = selectedActionsComponent.props.isNew ? 0 : index + 1;
      this.setState({ selectedOutput: -1, selectedInput: selected });
    } else if (containerName === "output") {
      const selected = selectedActionsComponent.props.isNew ? 0 : index + 1;
      this.setState({ selectedInput: -1, selectedOutput: selected });
    }
    this.updateToolboxDisplay(true, containerName);
  };

  handleNewActionsChange = (container, value) => {
    this.props.appSetNewActions(container, value);
  };

  render() {
    const intent = this.state.selectedIntent;
    let name = "";
    const style = intent.notSaved ? {} : { display: "none" };
    let buttonName = "Save";
    if (!intent.id) {
      buttonName = "Create";
    }
    name = (
      <span>
        <span className="red_dot" style={style} />
        <span style={{ color: "#bbb" }}>#</span>
        {intent.name}
      </span>
    );
    /* const { editing, toolboxFocus } = this.state;
    let toolbox;
    if (editing || toolboxFocus) {
      const isInput = this.state.toolboxDisplayMode === "input";
      const isIntentOutputEmpty =
        !intent || !intent.output || intent.output.length === 0;
      toolbox = (
        <ActionsToolbox
          onChange={this.handleChangeToolbox}
          isInput={isInput}
          condition={isIntentOutputEmpty}
        />
      );
    } */
    return (
      <div
        ref={(node) => {
          this.node = node;
        }}
      >
        <SubToolbar
          className=""
          style={{ margin: "0px 0px 0 0px" }}
          titleName={
            <div
              className="intent_title"
              onClick={(e) => {
                e.preventDefault();
                this.props.handleRename();
              }}
            >
              <div>{name}</div>
              <div className="intent_title_edit">
                <Icon name="edit" />
              </div>
            </div>
          }
          actions={[
            { name: "help", onClick: () => {} },
            { name: buttonName, onClick: this.handleSaveIntent },
          ]}
        />
        <IntentDetail
          intent={intent}
          newActions={this.props.newActions}
          displayCondition={this.state.displayCondition}
          onSelect={this.handleActions}
          onAction={this.handleDoActions}
          onSelectActionsComponent={this.handleSelectActionsComponent}
          onChangeToolbox={this.handleChangeToolbox}
          onNewActionsChange={this.handleNewActionsChange}
          onDeleteActionClick={this.handleDeleteActionClick}
          selectedInput={this.state.selectedInput}
          selectedOutput={this.state.selectedOutput}
        />
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
  selectedIntent: PropTypes.shape({
    id: PropTypes.string,
  }),
  newActions: PropTypes.shape({}).isRequired,
  handleRename: PropTypes.func.isRequired,
  apiSendIntentRequest: PropTypes.func.isRequired,
  appDeleteIntentAction: PropTypes.func.isRequired,
  appSetIntentAction: PropTypes.func.isRequired,
  appUpdateIntent: PropTypes.func.isRequired,
  appSetNewActions: PropTypes.func.isRequired,
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
  const { newActions } = state.app;
  return { selectedIntent, selectedBotId, newActions };
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
  appSetNewActions: (actionContainer, actionValue) => {
    dispatch(appSetNewActions(actionContainer, actionValue));
  },
});

export { IntentContainer as IntentContainerBase };

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntentContainer);
