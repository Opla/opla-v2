/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Loading from "zoapp-front/components/loading";
import Zrmc, { Grid, Inner, Cell } from "zrmc";
import { appSetTitleName } from "zoapp-front/actions/app";
import {
  apiGetIntentsRequest,
  apiSendIntentRequest,
  apiDeleteIntentRequest,
  apiSaveBotRequest,
  apiImportRequest,
} from "../actions/api";
import { appUpdateIntent } from "../actions/app";
import Dashboard from "./dashboard";
import Analytics from "./analytics";
import AgentManager from "./agentManager";
import PlaygroundContainer from "./playgroundContainer";
import IODialog from "./dialogs/ioDialog";
import FileManager from "../utils/fileManager";

class Factory extends Component {
  constructor(props) {
    super(props);
    this.state = { needUpdate: true };
    this.props.appSetTitleName(props.bot ? props.bot.name : "Factory");
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  update() {
    if (this.updateIntents()) {
      this.props.appSetTitleName(
        this.props.bot ? this.props.bot.name : "Chatbot",
        "Factory",
      );
    }
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
    // console.log("AgentManager.onUpload=", options.filetype);
    if (
      options.filetype === "application/json" ||
      options.filetype === "text/csv"
    ) {
      // WIP detect format
      // console.log("AgentManager.onUpload=", data);
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
    }
    if (this.props.selectedBotId && this.state.needUpdate) {
      this.setState({ needUpdate: false });
      this.props.apiGetIntentsRequest(this.props.selectedBotId);
      return true;
    }
    return false;
  }

  render() {
    if (this.props.isLoading) {
      return <Loading />;
    }

    const active = this.props.activeTab;

    let screen;
    if (active === 0) {
      screen = <Dashboard store={this.props.store} />;
    } else if (active === 1) {
      screen = (
        <AgentManager
          onExportImort={this.handleExportImport}
          onRenameIntent={this.handleRenameIntent}
          onAddIntent={this.handleAddIntent}
          onDeleteIntent={this.handleDeleteIntent}
        />
      );
    } else {
      screen = <Analytics />;
    }
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
      <div className="zui-color--grey-100">
        <Grid
          gutter={{ desktop: "0px", tablet: "0px", phone: "0px" }}
          style={{ margin: "0px", padding: "0px" }}
        >
          <Inner style={{ gridGap: "0px" }}>
            <Cell span={8}>{screen}</Cell>
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

Factory.defaultProps = {
  activeTab: 0,
  isLoading: false,
  isSignedIn: false,
};

Factory.propTypes = {
  activeTab: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  selectedBotId: PropTypes.string,
  selectedType: PropTypes.string.isRequired,
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
  appSetTitleName: PropTypes.func.isRequired,
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
  const selectedType = state.app ? state.app.selectedType : "intent";
  if (!selectedIntent) {
    selectedIntent = state.app.intents
      ? state.app.intents[selectedIntentIndex]
      : null;
  }
  const titleName = state.app.activeScreen.name
    ? state.app.activeScreen.name
    : "";
  return {
    selectedBotId,
    bot,
    intents,
    isLoading,
    isSignedIn,
    selectedIntent,
    selectedIntentIndex,
    selectedType,
    titleName,
  };
};

const mapDispatchToProps = (dispatch) => ({
  apiGetIntentsRequest: (botId) => {
    dispatch(apiGetIntentsRequest(botId));
  },
  appSetTitleName: (title, name) => {
    dispatch(appSetTitleName(title, name));
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Factory);
