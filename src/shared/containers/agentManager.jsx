/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Zrmc, { Grid, Inner, Cell } from "zrmc";
import Loading from "zoapp-front/components/loading";
import SignInForm from "zoapp-front/containers/signInForm";
import { appSetTitle } from "zoapp-front/actions/app";

import {
  apiGetIntentsRequest,
  apiSendIntentRequest,
  apiDeleteIntentRequest,
  apiSaveBotRequest,
  apiImportRequest,
} from "../actions/api";
import { appUpdateIntent } from "../actions/app";
import ExplorerContainer from "./explorerContainer";
import IntentContainer from "./intentContainer";
import PlaygroundContainer from "./playgroundContainer";
import IODialog from "./dialogs/ioDialog";
import FileManager from "../utils/fileManager";

class BotManager extends Component {
  constructor(props) {
    super(props);
    this.state = { needUpdate: true };
  }

  componentWillMount() {
    this.props.appSetTitle("Builder");
    this.updateIntents();
  }

  componentDidUpdate() {
    if (this.props.titleName !== "Builder") {
      this.props.appSetTitle("Builder");
    }
    this.updateIntents();
  }

  onRenameIntent = (dialog, action, data) => {
    if (action === "Rename") {
      const intentName = dialog.getFieldValue();
      // console.log("WIP", `ExplorerContainer.onRenameIntent :${intentName}`);
      if (intentName === "") {
        dialog.invalidateField();
        return false;
      }
      const { selected } = data;
      const it = this.props.intents[selected];
      const intent = { ...it, name: intentName };
      this.props.apiSendIntentRequest(this.props.selectedBotId, intent);
    }
    return true;
  };

  addIntent(intentName, data) {
    let { input } = data;
    if (!input) {
      input = [intentName];
    }
    let { output } = data;
    if (!output) {
      // TODO create a better output
      let i = input[0];
      const il = i.toLowerCase();
      if (!(il === "hello" || il === "hi")) {
        i = "I don't understand.";
      }
      output = [i];
    }
    const intent = {
      input,
      output,
      name: intentName,
    };
    this.props.apiSendIntentRequest(this.props.selectedBotId, intent);
  }

  onAddIntent = (dialog, action, data) => {
    if (action === "Create") {
      const intentName = dialog.getFieldValue();
      this.addIntent(intentName, data);
    }
    return true;
  };

  onDeleteIntent = (dialog, action, data) => {
    if (action === "Delete") {
      const { selected } = data;
      const intent = this.props.intents[selected];
      // console.log("WIP", `ExplorerContainer.onDeleteIntent :${intent.name}`);
      this.props.apiDeleteIntentRequest(this.props.selectedBotId, intent);
    }
    return true;
  };

  onImportData = (data, options) => {
    // console.log("BotManager.onUpload=", options.filetype);
    if (
      options.filetype === "application/json" ||
      options.filetype === "text/csv"
    ) {
      // WIP detect format
      // console.log("BotManager.onUpload=", data);
      this.props.apiImportRequest(this.props.selectedBotId, data, options);
    }
  };

  onDownloadData = () => {
    const { name } = this.props.bot;
    const data = { name, intents: this.props.intents };
    const json = JSON.stringify(data);
    FileManager.download(json, `${name}.json`, "application/json,.csv", () => {
      /* console.log("ExplorerContainer.onDownload=", name); */
    });
  };

  onEditWelcome = (dialog, action) => {
    if (action === "Save") {
      const welcome = dialog.getFieldValue();
      if (welcome === "") {
        dialog.invalidateField();
        return false;
      }
      const bot = { ...this.props.bot, welcome };
      this.props.apiSaveBotRequest(bot);
    }
    return true;
  };

  handleDeleteIntent = (selected = this.props.selectedIntentIndex) => {
    // const selected = this.props.selectedIntentIndex;
    const intent = this.props.intents[selected];
    Zrmc.showDialog({
      header: "Intent",
      body: `${intent.name} Do you want to delete it ?`,
      actions: [{ name: "Cancel" }, { name: "Delete" }],
      onAction: this.onDeleteIntent,
      data: { selected },
    });
  };

  findIntentName(name) {
    const { intents } = this.props;

    let result = false;
    if (intents && intents.length > 0) {
      intents.forEach((intent) => {
        if (intent.name.toLowerCase() === name) {
          result = true;
        }
      });
    }
    return result;
  }

  generateIntentName() {
    let name = "Intent";
    let index = 1;
    while (this.findIntentName(name.toLowerCase())) {
      name = `Intent ${index}`;
      index += 1;
    }
    return name;
  }

  handleAddIntent = (defaultValue = this.generateIntentName(), data = {}) => {
    /* const field = {
      defaultValue,
      pattern: ".+",
      name: "Intent name",
      error: "Wrong name",
    };
    Zrmc.showDialog({
      header: "Add new intent",
      field,
      actions: [{ name: "Cancel" }, { name: "Create" }],
      onAction: this.onAddIntent,
      data,
    }); */
    this.addIntent(defaultValue, data);
  };

  handleRenameIntent = (selected = this.props.selectedIntentIndex) => {
    const intent = this.props.intents[selected];
    const field = {
      defaultValue: intent.name,
      pattern: ".+",
      name: "Intent name",
      error: "Wrong name",
    };
    Zrmc.showDialog({
      header: "Rename intent",
      field,
      actions: [{ name: "Cancel" }, { name: "Rename" }],
      onAction: this.onRenameIntent,
      data: { selected },
    });
  };

  handleExportImport = (importOnly = false) => {
    const dialog = (
      <IODialog
        open
        importOnly={importOnly}
        store={this.props.store}
        onClosed={this.handleCloseDialog}
        accept="application/json"
        onDownload={this.onDownloadData}
        onImport={this.onImportData}
      />
    );
    Zrmc.showDialog(dialog);
  };

  handlePlaygroundAction = (action, defaultValue = "", data = {}) => {
    if (action === "welcomeMessage") {
      const field = {
        defaultValue,
        pattern: ".+",
        name: "Welcome message",
        error: "Wrong message",
      };
      Zrmc.showDialog({
        header: "Edit Bot",
        field,
        actions: [{ name: "Cancel" }, { name: "Save" }],
        onAction: this.onEditWelcome,
        data,
      });
    } else if (action === "createIntent") {
      const intent = { input: [defaultValue] };
      this.handleAddIntent(defaultValue, intent);
    } else if (action === "addInput") {
      const intent = { ...this.props.selectedIntent };
      if (!intent.input) {
        intent.input = [];
      }
      // Check if sentence already exists in input
      if (!intent.input.find((i) => i === defaultValue)) {
        intent.input.push(defaultValue);
        // this.props.appUpdateIntent(this.props.selectedBotId, intent);
        delete intent.notSaved;
        this.props.apiSendIntentRequest(this.props.selectedBotId, intent);
      }
    }
    // console.log("botManager.handlePlaygroundAction", action);
  };

  updateIntents() {
    if (!this.props.isSignedIn) {
      if (!this.state.needUpdate) {
        this.setState({ needUpdate: true });
      }
      return;
    }
    if (this.props.selectedBotId && this.state.needUpdate) {
      this.setState({ needUpdate: false });
      this.props.apiGetIntentsRequest(this.props.selectedBotId);
    }
  }

  render() {
    let { isLoading } = this.props;
    if (!isLoading && !this.props.intents && this.props.isSignedIn) {
      isLoading = true;
    }
    if (!this.props.isSignedIn) {
      return <SignInForm />;
    } else if (this.props.intents == null) {
      return <Loading />;
    }
    let panel1 = null;
    let panel2 = null;
    panel1 = (
      <Cell
        style={{ margin: "0px", backgroundColor: "#f2f2f2" }}
        className="mdl-color--white mrb-panel"
        span={2}
      >
        <ExplorerContainer
          handleExportImport={this.handleExportImport}
          handleRename={this.handleRenameIntent}
          handleAdd={this.handleAddIntent}
          handleDelete={this.handleDeleteIntent}
        />
      </Cell>
    );
    panel2 = (
      <Cell
        style={{ margin: "0px", backgroundColor: "#f2f2f2" }}
        className="mdl-color--white mrb-panel"
        span={6}
      >
        <IntentContainer handleRename={this.handleRenameIntent} />
      </Cell>
    );
    const intentsEx = [];
    if (Array.isArray(this.props.intents)) {
      this.props.intents.forEach((intent) => {
        const selected =
          this.props.selectedIntent &&
          intent.id === this.props.selectedIntent.id;
        intentsEx.push({
          id: intent.id,
          selected,
          name: intent.name,
        });
      });
    }
    return (
      <div className="mdl-color--grey-100">
        <Grid
          gutter={{ desktop: "0px", tablet: "0px", phone: "0px" }}
          style={{ margin: "0px", padding: "0px" }}
        >
          <Inner style={{ gridGap: "0px" }}>
            {panel1}
            {panel2}
            <Cell
              style={{
                margin: "0px",
                backgroundColor: "#f2f2f2",
                zIndex: "3",
              }}
              className="mdc-elevation--z4"
              span={4}
            >
              <PlaygroundContainer
                onAction={this.handlePlaygroundAction}
                intents={intentsEx}
              />
            </Cell>
          </Inner>
        </Grid>
      </div>
    );
  }
}

BotManager.defaultProps = {
  bot: null,
  intents: null,
  selectedIntent: null,
  selectedBotId: null,
  store: null,
};

BotManager.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  selectedBotId: PropTypes.string,
  bot: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    language: PropTypes.string,
  }),
  intents: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string })),
  selectedIntentIndex: PropTypes.number.isRequired,
  selectedIntent: PropTypes.shape({ id: PropTypes.string }),
  store: PropTypes.shape({}),
  titleName: PropTypes.string.isRequired,
  appSetTitle: PropTypes.func.isRequired,
  apiGetIntentsRequest: PropTypes.func.isRequired,
  apiSendIntentRequest: PropTypes.func.isRequired,
  apiDeleteIntentRequest: PropTypes.func.isRequired,
  apiSaveBotRequest: PropTypes.func.isRequired,
  apiImportRequest: PropTypes.func.isRequired,
  appUpdateIntent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { admin } = state.app;
  let { selectedIntent } = state.app;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  // TODO get selectedBot from selectBotId
  const bot = selectedBotId ? admin.bots[0] : null;
  const intents = state.app.intents ? state.app.intents : null;
  const isSignedIn = state.user ? state.user.isSignedIn : false;
  const isLoading = state.loading || false;
  const selectedIntentIndex = state.app ? state.app.selectedIntentIndex : 0;
  if (!selectedIntent) {
    selectedIntent = state.app.intents
      ? state.app.intents[selectedIntentIndex]
      : null;
  }
  const titleName = state.app ? state.app.titleName : "";
  return {
    selectedBotId,
    bot,
    intents,
    isLoading,
    isSignedIn,
    selectedIntent,
    selectedIntentIndex,
    titleName,
  };
};

const mapDispatchToProps = (dispatch) => ({
  apiGetIntentsRequest: (botId) => {
    dispatch(apiGetIntentsRequest(botId));
  },
  appSetTitle: (titleName) => {
    dispatch(appSetTitle(titleName));
  },
  apiSendIntentRequest: (botId, intent) => {
    dispatch(apiSendIntentRequest(botId, intent));
  },
  apiDeleteIntentRequest: (botId, intentId) => {
    dispatch(apiDeleteIntentRequest(botId, intentId));
  },
  apiSaveBotRequest: (bot) => {
    dispatch(apiSaveBotRequest(bot));
  },
  apiImportRequest: (botId, data, options) => {
    dispatch(apiImportRequest(botId, data, options));
  },
  appUpdateIntent: (botId, intent) => {
    dispatch(appUpdateIntent(botId, intent));
  },
});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BotManager);
