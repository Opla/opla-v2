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
import { ListDragComponent, SubToolbar } from "zoapp-ui";
import {
  apiGetIntentsRequest,
  apiSendIntentRequest,
  apiDeleteIntentRequest,
  apiMoveIntentRequest,
} from "../actions/api";
import { appSelectIntent } from "../actions/app";

class ExplorerContainer extends Component {
  onDropIntent = (dragIndex, dropIndex) => {
    // console.log("TODO", `ExplorerContainer.onDropIntent ${dragIndex} / ${dropIndex}`);
    const intent = this.props.intents[dragIndex];
    const intentId = intent.id;
    this.props.apiMoveIntentRequest(
      this.props.selectedBotId,
      intentId,
      dragIndex,
      dropIndex,
    );
  };

  onSelectIntent = (selected) => {
    this.props.appSelectIntent(this.props.selectedBotId, selected);
  };

  onAddIntent = (dialog, action) => {
    if (action === "Create") {
      const intentName = dialog.getFieldValue();
      // console.log("WIP", `ExplorerContainer.onAddIntent :${intentName}`);
      if (intentName === "") {
        dialog.invalidateField();
        return false;
      }
      const intent = { name: intentName };
      this.props.apiSendIntentRequest(this.props.selectedBotId, intent);
    }
    return true;
  };

  onRenameIntent = (dialog, action) => {
    if (action === "Rename") {
      const intentName = dialog.getFieldValue();
      // console.log("WIP", `ExplorerContainer.onRenameIntent :${intentName}`);
      if (intentName === "") {
        dialog.invalidateField();
        return false;
      }
      const selected = this.props.selectedIntentIndex;
      const it = this.props.intents[selected];
      const intent = { ...it, name: intentName };
      this.props.apiSendIntentRequest(this.props.selectedBotId, intent);
    }
    return true;
  };

  onDeleteIntent = (dialog, action) => {
    if (action === "Delete") {
      const selected = this.props.selectedIntentIndex;
      const intent = this.props.intents[selected];
      // console.log("WIP", `ExplorerContainer.onDeleteIntent :${intent.name}`);
      this.props.apiDeleteIntentRequest(this.props.selectedBotId, intent);
    }
    return true;
  };

  handleAddIntent = () => {
    // console.log("WIP", "ExplorerContainer.handleAddIntent");
    const field = {
      defaultValue: "",
      pattern: ".+",
      name: "Intent name",
      error: "Wrong name",
    };
    Zrmc.showDialog({
      header: "Add new intent",
      field,
      actions: [{ name: "Create" }, { name: "Cancel" }],
      onAction: this.onAddIntent,
    });
  };

  handleRename = () => {
    // console.log("TODO", "ExplorerContainer.handleRename");
    const selected = this.props.selectedIntentIndex;
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
      actions: [{ name: "Rename" }, { name: "Cancel" }],
      onAction: this.onRenameIntent,
    });
  };

  handleSynchronize = () => {
    // console.log("WIP", "ExplorerContainer.handleSynchronize");
    this.props.apiGetIntentsRequest(this.props.selectedBotId);
  };

  handleDelete = () => {
    // console.log("WIP", "ExplorerContainer.handleDelete");
    const selected = this.props.selectedIntentIndex;
    const intent = this.props.intents[selected];
    Zrmc.showDialog({
      header: "Intent",
      body: `${intent.name} Do you want to delete it ?`,
      actions: [{ name: "Delete" }, { name: "Cancel" }],
      onAction: this.onDeleteIntent,
    });
  };

  /* handleExportImport = () => {
    const dialog = <IODialog open store={this.props.store}
      onClosed={this.handleCloseDialog} accept={"application/json"}
      onDownload={this.props.onDownloadData} onImport={this.props.onImportData} />;
    Zrmc.showDialog(dialog);
  } */

  render() {
    const selected = this.props.selectedIntentIndex;
    const name = "Intents";
    const items = [];
    if (this.props.intents) {
      this.props.intents.forEach((intent) => {
        const { id } = intent;
        const style = intent.notSaved
          ? {
              marginRight: "4px",
              width: "8px",
              height: "8px",
              marginBottom: "2px",
            }
          : { display: "none", marginRight: "2px" };
        const marginLeft = intent.notSaved ? "-14px" : "0px";
        const n = (
          <span style={{ marginLeft }}>
            <span className="gray_dot" style={style} />
            {intent.name}
          </span>
        );
        items.push({ id, name: n });
      });
    }
    return (
      <div>
        <SubToolbar
          titleName={name}
          menu={{
            items: [
              { name: "Add intent", onSelect: this.handleAddIntent },
              { name: "Rename", onSelect: this.handleRename },
              { name: "Delete", onSelect: this.handleDelete },
              /* { name: "Synchronize", onSelect: this.handleSynchronize }, */
              {
                name: "Export / Import",
                onSelect: () => {
                  this.props.handleExportImport();
                },
              },
            ],
          }}
        />
        <div className="list-box">
          <ListDragComponent
            className="list-content"
            items={items}
            selectedItem={selected}
            onSelect={this.onSelectIntent}
            onDrop={this.onDropIntent}
          />
        </div>
      </div>
    );
  }
}

ExplorerContainer.defaultProps = {
  intents: [],
  selectedIntentIndex: 0,
  selectedBotId: null,
};

ExplorerContainer.propTypes = {
  selectedBotId: PropTypes.string,
  intents: PropTypes.arrayOf(PropTypes.shape({})),
  selectedIntentIndex: PropTypes.number,
  apiGetIntentsRequest: PropTypes.func.isRequired,
  apiSendIntentRequest: PropTypes.func.isRequired,
  apiDeleteIntentRequest: PropTypes.func.isRequired,
  apiMoveIntentRequest: PropTypes.func.isRequired,
  appSelectIntent: PropTypes.func.isRequired,
  handleExportImport: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const selectedIntentIndex = state.app ? state.app.selectedIntentIndex : 0;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const intents = state.app.intents ? state.app.intents : null;
  const { admin } = state.app;
  const bot = admin ? admin.bots[0] : null;
  return {
    intents,
    selectedIntentIndex,
    selectedBotId,
    bot,
  };
};

const mapDispatchToProps = (dispatch) => ({
  apiGetIntentsRequest: (botId) => {
    dispatch(apiGetIntentsRequest(botId));
  },
  apiSendIntentRequest: (botId, intent) => {
    dispatch(apiSendIntentRequest(botId, intent));
  },
  apiDeleteIntentRequest: (botId, intentId) => {
    dispatch(apiDeleteIntentRequest(botId, intentId));
  },
  apiMoveIntentRequest: (botId, intentId, from, to) => {
    dispatch(apiMoveIntentRequest(botId, intentId, from, to));
  },
  appSelectIntent: (botId, intentIndex) => {
    dispatch(appSelectIntent(botId, intentIndex));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerContainer);
