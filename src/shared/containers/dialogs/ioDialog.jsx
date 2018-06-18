/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Zrmc, {
  Button,
  Checkbox,
  Dialog,
  DialogFooter,
  DialogBody,
  DialogHeader,
  Tab,
  Tabbar,
} from "zrmc";

import FileManager from "../../utils/fileManager";

class IODialog extends Component {
  constructor(props) {
    super(props);
    const { open } = props;
    this.state = {
      openDialog: open,
      id: props.id,
      activeTab: 0,
      data: null,
      filetype: null,
      deletePrevious: false,
    };
  }

  componentWillReceiveProps(props) {
    if (this.props.open !== props.open) {
      this.setState({ openDialog: props.open });
    }
  }

  /*
  static importCSV(data) {
    const lines = data.split(/\r\n|\n/);
    const headers = lines.shift().split(",");
    const items = [];
    lines.forEach((line) => {
      let open = true;
      let buf = "";
      let i = 0;
      const item = {};
      for (const ch of line) {
        if (open && ch === ",") {
          const name = headers[i];
          if (buf.length > 0) {
            item[name] = buf;
            buf = "";
          }
          i += 1;
        } else if (ch === "\"") {
          open = !open;
        } else {
          buf += ch;
        }
      }
      items.push(item);
    });
    return items;
  }
  */

  onUpload = (selectorFiles) => {
    FileManager.upload(selectorFiles, (data, filetype) => {
      /*
      if (filetype === ".csv" || filetype === "text/csv") {
        const csv = this.importCSV(data);
        // console.log("imported csv", csv);
       }
       */
      this.setState({ data, filetype });
    });
  };

  handleImport = () => {
    if (this.state.data) {
      const { deletePrevious } = this.state;
      const options = { filetype: this.state.filetype, deletePrevious };
      this.props.onImport(this.state.data, options);
      this.handleCloseDialog();
    }
  };

  handleOpenDialog = () => {
    this.setState({
      openDialog: true,
    });
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
    if (this.props.onClosed instanceof Function) {
      this.props.onClosed();
    } else {
      setTimeout(() => {
        Zrmc.closeDialog();
      }, 300);
    }
  };

  render() {
    if (this.props.importOnly) {
      return (
        <Dialog
          open={this.state.openDialog}
          onClose={this.handleCloseDialog}
          header="Import Intents"
        >
          <DialogBody>
            <section>
              <Button
                className="mdl-button--file"
                raised
                style={{ width: "100%", marginTop: "30px" }}
              >
                Upload datasets
                <input
                  type="file"
                  accept={this.props.accept}
                  onChange={(e) => this.onUpload(e.target.files)}
                />
              </Button>
            </section>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                this.handleCloseDialog();
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                this.handleImport();
              }}
            >
              Import
            </Button>
          </DialogFooter>
        </Dialog>
      );
    }

    const p1 = this.state.activeTab === 0 ? "block" : "none";
    const p2 = this.state.activeTab === 1 ? "block" : "none";

    let dialogActions = null;
    if (this.state.activeTab === 0) {
      dialogActions = (
        <DialogFooter>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              this.handleCloseDialog();
            }}
          >
            Done
          </Button>
        </DialogFooter>
      );
    } else {
      dialogActions = (
        <DialogFooter>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              this.handleCloseDialog();
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              this.handleImport();
            }}
          >
            Import
          </Button>
        </DialogFooter>
      );
    }

    return (
      <Dialog
        open={this.state.openDialog}
        id={this.state.id}
        onClose={this.handleCloseDialog}
      >
        <DialogHeader>
          <Tabbar
            activeTab={this.state.activeTab}
            onChange={(name, tabId) => this.setState({ activeTab: tabId })}
            ripple
          >
            <Tab>Export</Tab>
            <Tab>Import</Tab>
          </Tabbar>
        </DialogHeader>
        <DialogBody>
          <section style={{ display: p1 }}>
            <Button
              raised
              style={{ width: "100%", marginTop: "20px" }}
              onClick={() => this.props.onDownload()}
            >
              Download as json
            </Button>
          </section>
          <section style={{ display: p2 }}>
            <Checkbox
              label="Delete previous data"
              checked={this.state.deletePrevious}
              onChange={(e) => {
                this.setState({ deletePrevious: !!e.target.value });
              }}
            />
            <Button
              className="mdl-button--file"
              raised
              style={{ width: "100%", marginTop: "30px" }}
            >
              Upload datasets
              <input
                type="file"
                accept={this.props.accept}
                onChange={(e) => this.onUpload(e.target.files)}
              />
            </Button>
          </section>
        </DialogBody>
        {dialogActions}
      </Dialog>
    );
  }
}

IODialog.defaultProps = {
  open: true,
  id: null,
  onClosed: null,
  importOnly: false,
};

IODialog.propTypes = {
  open: PropTypes.bool,
  id: PropTypes.string,
  importOnly: PropTypes.bool,
  accept: PropTypes.string.isRequired,
  onClosed: PropTypes.func,
  onDownload: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
};

export default IODialog;
