/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Zrmc, { Button } from "zrmc";
import IODialog from "../containers/dialogs/ioDialog";
import FileManager from "../utils/fileManager";

class DashboardActionbar extends Component {
  constructor(props) {
    super(props);
    this.handleExportImport = this.handleExportImport.bind(this);
  }

  handleExportImport = () => {
    const dialog = (
      <IODialog
        open
        store={this.props.store}
        onClosed={this.handleCloseDialog}
        accept="application/json"
        onDownload={this.onDownloadData}
        onImport={this.onImportData}
      />
    );
    Zrmc.showDialog(dialog);
  };

  onDownloadData = () => {
    const { name, description, language, timezone, welcome } = this.props.bot;
    const data = {
      name,
      description,
      language,
      timezone,
      welcome,
      intents: this.props.intents,
    };
    const json = JSON.stringify(data);
    FileManager.download(json, `${name}.json`, "application/json,.csv", () => {
      /* console.log("ExplorerContainer.onDownload=", name); */
    });
  };

  onImportData = (data, options) => {
    if (
      options.filetype === "application/json" ||
      options.filetype === "text/csv"
    ) {
      // WIP detect format
      this.props.apiImportRequest(this.props.selectedBotId, data, options);
    }
  };

  render() {
    return (
      <React.Fragment>
        <Button dense outlined onClick={this.handleExportImport}>
          Import/Export data
        </Button>
        <Button dense outlined>
          Duplicate
        </Button>
        <Button dense outlined className="warning">
          Delete
        </Button>
      </React.Fragment>
    );
  }
}

DashboardActionbar.propTypes = {
  store: PropTypes.shape({}),
  selectedBotId: PropTypes.string.isRequired,
  bot: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    language: PropTypes.string,
    timezone: PropTypes.string,
    welcome: PropTypes.string,
  }),
  intents: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string })),
  apiImportRequest: PropTypes.func.isRequired,
};

export default DashboardActionbar;
