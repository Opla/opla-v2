/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Zrmc, { Grid, Inner, Cell, Button } from "zrmc";
import Loading from "zoapp-front/components/loading";
import SignInForm from "zoapp-front/containers/signInForm";

import { apiGetIntentsRequest, apiSendIntentRequest, apiSaveBotRequest, apiImportRequest } from "../actions/api";
import { appUpdateIntent, appSetTitle } from "../actions/app";
import ExplorerContainer from "./explorerContainer";
import IntentContainer from "./intentContainer";
import SandboxContainer from "./sandboxContainer";
import IODialog from "./dialogs/ioDialog";
import FileManager from "../utils/fileManager";

const infoStyleD = {
  fontSize: "16px",
  fontWeight: "400",
  color: "#666",
  padding: "16px",
  lineHeight: "1.1",
  textAlign: "left",
};

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
    this.props.appSetTitle("Builder");
    this.updateIntents();
  }

  onAddIntent = (dialog, action) => {
    if (action === "Create") {
      const intentName = dialog.getFieldValue();
      if (intentName === "") {
        dialog.invalidateField();
        return false;
      }

      const data = {};

      const intent = {
        ...data,
        name: intentName,
      };

      this.props.apiSendIntentRequest(this.props.selectedBotId, intent);
    }
    return true;
  }

  onImportData = (data, options) => {
    // console.log("BotManager.onUpload=", options.filetype);
    if (options.filetype === "application/json" || options.filetype === "text/csv") {
      // WIP detect format
      // console.log("BotManager.onUpload=", data);
      this.props.apiImportRequest(this.props.selectedBotId, data, options);
    }
  }

  onDownloadData = () => {
    const { name } = this.props.bot;
    const data = { name, intents: this.props.intents };
    const json = JSON.stringify(data);
    FileManager.download(json, `${name}.json`, "application/json,.csv", () => { /* console.log("ExplorerContainer.onDownload=", name); */ });
  }

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
  }

  handleAddIntent = (defaultValue = "", data = {}) => {
    const field = {
      defaultValue, pattern: ".+", name: "Intent name", error: "Wrong name",
    };
    Zrmc.showDialog({
      header: "Add new intent", field, actions: [{ name: "Create" }, { name: "Cancel" }], onAction: this.onAddIntent, data,
    });
  }

  handleExportImport = (importOnly = false) => {
    const dialog = (<IODialog
      open
      importOnly={importOnly}
      store={this.props.store}
      onClosed={this.handleCloseDialog}
      accept="application/json"
      onDownload={this.onDownloadData}
      onImport={this.onImportData}
    />);
    Zrmc.showDialog(dialog);
  }

  handlePlaygroundAction = (action, defaultValue = "", data = {}) => {
    if (action === "welcomeMessage") {
      const field = {
        defaultValue, pattern: ".+", name: "Welcome message", error: "Wrong message",
      };
      Zrmc.showDialog({
        header: "Edit Bot", field, actions: [{ name: "Save" }, { name: "Cancel" }], onAction: this.onEditWelcome, data,
      });
    } else if (action === "createIntent") {
      const intent = { input: [defaultValue] };
      this.handleAddIntent(defaultValue, intent);
    } else if (action === "addInput") {
      const intent = { ...this.props.selectedIntent };
      if (!intent.input) {
        intent.input = [];
      }
      // TODO check if sentence already exists in input
      intent.input.push(defaultValue);
      this.props.appUpdateIntent(this.props.selectedBotId, intent);
    }
    // console.log("botManager.handlePlaygroundAction", action);
  }

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
    if ((!isLoading) && (!this.props.intents) && this.props.isSignedIn) {
      isLoading = true;
    }
    if (!this.props.isSignedIn) {
      return (<SignInForm />);
    } else if (this.props.intents == null) {
      return (<Loading />);
    }
    let panel1 = null;
    let panel2 = null;
    if (this.props.intents.length > 0) {
      panel1 = (
        <Cell style={{ margin: "0px", borderRight: "1px solid #e1e1e1" }} className="mdl-color--white mrb-panel" span={2} >
          <ExplorerContainer handleExportImport={this.handleExportImport} />
        </Cell>);
      panel2 = (
        <Cell style={{ margin: "0px" }} className="mdl-color--white mrb-panel" span={6}>
          <IntentContainer />
        </Cell>);
    } else {
      panel1 = (
        <Cell style={{ margin: "0px" }} span={7}>
          <div className="mrb-panel mrb-panel-empty" style={{ height: "80%" }} >
            <div style={{ height: "30%", ...infoStyleD }}>
              <div style={{ /* margin: "48px 0", */ textAlign: "left" }}>
                <h2>Get Started</h2>
                <p>
                This assistant has no data. You need to fill it with intents
                to reply to inputs from end-users.<br />
                To do so you could create an intent. Or you could use
                the playground to help you to create them.<br />
                </p>
                <div style={{ margin: "0", padding: "4px", backgroundColor: "#FFFF8D" }}>
                  For example:
                  <code>send &quot;Hello&quot; using Playground&apos;s textfield at the bottom
                  </code>
                </div>
              </div>
            </div>
            <div style={infoStyleD}>
              <div>
                <Button
                  raised
                  style={{ marginRight: "32px" }}
                  onClick={(e) => { e.preventDefault(); this.handleAddIntent(); }}
                >
                  Create intent
                </Button>
                <Button
                  raised
                  onClick={(e) => { e.preventDefault(); this.handleExportImport(true); }}
                >
                  Import intents
                </Button>
              </div>
            </div>
          </div>
          <div className="mrb-panel" style={{ height: "18.05%", backgroundColor: "#FFFF8D" }}>
            <div style={{
              margin: "16px", padding: "8px", textAlign: "left", backgroundColor: "#FFFF8D",
            }}
            >
              An <b>assistant</b> has a list of intents.<br />An <b>intent</b>
               is an expected behaviour from the end-user.<br />
              Assistant&apos;s <b>NLP</b> (Natural Language Processing)
              engine will use that list to match intent&apos;s <b>input</b>
              with end-user&apos;s input.
              If a match is found assistant responds using selected intent&apos;s <b>output</b>.
            </div>
          </div>
        </Cell>);
      panel2 = "";
    }
    return (
      <div className="mdl-color--grey-100">
        <Grid style={{ margin: "0px", padding: "0px" }}>
          <Inner>
            {panel1}
            {panel2}
            <Cell style={{ margin: "16px 24px" }} className="mdl-color--white mdl-shadow--2dp" span={4}>
              <SandboxContainer onAction={this.handlePlaygroundAction} />
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
  intents: PropTypes.arrayOf(PropTypes.shape({})),
  selectedIntent: PropTypes.shape({}),
  store: PropTypes.shape({}),
  appSetTitle: PropTypes.func.isRequired,
  apiGetIntentsRequest: PropTypes.func.isRequired,
  apiSendIntentRequest: PropTypes.func.isRequired,
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
    selectedIntent = state.app.intents ? state.app.intents[selectedIntentIndex] : null;
  }
  return {
    selectedBotId, bot, intents, isLoading, isSignedIn, selectedIntent,
  };
};

const mapDispatchToProps = dispatch => ({
  apiGetIntentsRequest: (botId) => {
    dispatch(apiGetIntentsRequest(botId));
  },
  appSetTitle: (titleName) => {
    dispatch(appSetTitle(titleName));
  },
  apiSendIntentRequest: (botId, intent) => {
    dispatch(apiSendIntentRequest(botId, intent));
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

export default connect(mapStateToProps, mapDispatchToProps)(BotManager);
