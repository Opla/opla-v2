/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ListItemMeta, Icon } from "zrmc";
import {
  ListComponent,
  ListDragComponent,
  ExpansionPanel,
  SubToolbar,
} from "zoapp-ui";
import { apiMoveIntentRequest } from "../actions/api";
import { appSelectIntent, appDeleteNewActions } from "../actions/app";

class ExplorerContainer extends Component {
  onDropIntent = (dragIndex, dropIndex) => {
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

  render() {
    const selected = this.props.selectedIntentIndex;
    let items = [];
    if (this.props.intents && this.props.intents.length > 0) {
      this.props.intents.forEach((intent, index) => {
        const { id } = intent;
        const n = [];
        n.push(
          <div key="i_text">
            {intent.notSaved ? <div className="item_notsaved" /> : ""}
            <span style={{ color: "#00000044" }}>#</span>
            {intent.name}
          </div>,
        );
        n.push(
          <ListItemMeta
            key="i_meta"
            style={{ marginRight: "-8px", marginTop: "7px" }}
          >
            <Icon
              name="edit"
              onClick={(e) => {
                e.stopPropagation();
                this.props.handleRename(index);
              }}
            />
            <Icon
              name="remove_circle_outline"
              onClick={(e) => {
                e.stopPropagation();
                this.props.handleDelete(index);
              }}
            />
          </ListItemMeta>,
        );
        items.push({ id, name: n });
      });
    } else {
      items.push({ id: "noIntent", name: "Create an intent" });
    }
    const intentList = (
      <ExpansionPanel
        elevation={0}
        compact
        leftArrow
        label={
          <div
            style={{
              display: "flex",
              fontWeight: "900",
              color: "var(--mdc-theme-text-hint-on-background,rgba(0,0,0,.38))",
            }}
          >
            <Icon
              style={{
                paddingTop: "12px",
                paddingRight: "4px",
                marginLeft: "-8px",
              }}
              name="add_circle_outline"
              onClick={this.props.handleAdd}
            />
            Intents
          </div>
        }
      >
        <ListDragComponent
          style={{ backgroundColor: "rgb(252, 252, 252)", minHeight: "180px" }}
          items={items}
          selectedItem={selected}
          onSelect={this.onSelectIntent}
          onDrop={this.onDropIntent}
        />
      </ExpansionPanel>
    );
    items = [];
    items.push({ id: "noIntent", name: "@System" });
    const entityList = (
      <ExpansionPanel
        elevation={0}
        collapsed
        compact
        leftArrow
        label={
          <div
            style={{
              display: "flex",
              fontWeight: "900",
              color: "var(--mdc-theme-text-hint-on-background,rgba(0,0,0,.38))",
            }}
          >
            <Icon
              style={{
                paddingTop: "12px",
                paddingRight: "4px",
                marginLeft: "-8px",
              }}
              name="add_circle_outline"
              onClick={this.props.handleAdd}
            />
            Entities
          </div>
        }
      >
        <ListComponent
          style={{ backgroundColor: "rgb(252, 252, 252)", minHeight: "180px" }}
          items={items}
          selectedItem={-1}
          onSelect={this.onSelectIntent}
          onDrop={this.onDropIntent}
        />
      </ExpansionPanel>
    );
    items = [];
    items.push({ id: "system", name: "/System" });
    const callableList = (
      <ExpansionPanel
        elevation={0}
        collapsed
        compact
        leftArrow
        label={
          <div
            style={{
              display: "flex",
              fontWeight: "900",
              color: "var(--mdc-theme-text-hint-on-background,rgba(0,0,0,.38))",
            }}
          >
            <Icon
              style={{
                paddingTop: "12px",
                paddingRight: "4px",
                marginLeft: "-8px",
              }}
              name="add_circle_outline"
              onClick={this.props.handleAdd}
            />
            Functions
          </div>
        }
      >
        <ListComponent
          style={{ backgroundColor: "rgb(252, 252, 252)", minHeight: "180px" }}
          items={items}
          selectedItem={-1}
          onSelect={this.onSelectIntent}
          onDrop={this.onDropIntent}
        />
      </ExpansionPanel>
    );
    return (
      <div
        style={{
          backgroundColor: "rgb(252, 252, 252)",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <SubToolbar
          className=""
          style={{ backgroundColor: "rgb(252, 252, 252)", margin: "0" }}
          titleName="Explorer"
          icons={[
            {
              name: "cloud_circle",
              tooltip: "Import / Export",
              onClick: this.props.handleExportImport,
            },
          ]}
        />
        <div className="list-box explorer" style={{ margin: "0" }}>
          <div className="list-content">
            {intentList}
            {entityList}
            {callableList}
          </div>
        </div>
      </div>
    );
  }
}

ExplorerContainer.defaultProps = {
  selectedIntentIndex: 0,
  selectedBotId: null,
};

ExplorerContainer.propTypes = {
  selectedBotId: PropTypes.string,
  intents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedIntentIndex: PropTypes.number,
  apiMoveIntentRequest: PropTypes.func.isRequired,
  appSelectIntent: PropTypes.func.isRequired,
  handleExportImport: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleRename: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const selectedIntentIndex = state.app ? state.app.selectedIntentIndex : 0;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const intents = state.app.intents ? [...state.app.intents] : null;
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
  apiMoveIntentRequest: (botId, intentId, from, to) => {
    dispatch(apiMoveIntentRequest(botId, intentId, from, to));
  },
  appSelectIntent: (botId, intentIndex) => {
    dispatch(appDeleteNewActions());
    dispatch(appSelectIntent(botId, intentIndex));
  },
});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExplorerContainer);
