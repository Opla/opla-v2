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
import { ListDragComponent, SubToolbar } from "zoapp-ui";
import {
  /* apiGetIntentsRequest,
  apiSendIntentRequest,
  apiDeleteIntentRequest, */
  apiMoveIntentRequest,
} from "../actions/api";
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
    const name = "Intents";
    const items = [];
    let list = "";
    if (this.props.intents && this.props.intents.length > 0) {
      this.props.intents.forEach((intent, index) => {
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
        const n = [];
        n.push(
          <span
            key="i_text"
            style={{
              marginLeft,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: "160px",
            }}
          >
            <span className="red_dot" style={style} />
            <span style={{ color: "#00000044" }}>#</span>
            {intent.name}
          </span>,
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
    list = (
      <ListDragComponent
        style={{ backgroundColor: "rgb(252, 252, 252)" }}
        className="list-content"
        items={items}
        selectedItem={selected}
        onSelect={this.onSelectIntent}
        onDrop={this.onDropIntent}
      />
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
          titleName={name}
          icons={[
            {
              name: "add_circle_outline",
              tooltip: "Add an intent",
              onClick: this.props.handleAdd,
            },
            {
              name: "cloud_circle",
              tooltip: "Import / Export",
              onClick: this.props.handleExportImport,
            },
          ]}
        />
        <div className="list-box" style={{ margin: "0" }}>
          {list}
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
  /* apiGetIntentsRequest: (botId) => {
    dispatch(apiGetIntentsRequest(botId));
  },
  apiSendIntentRequest: (botId, intent) => {
    dispatch(apiSendIntentRequest(botId, intent));
  },
  apiDeleteIntentRequest: (botId, intentId) => {
    dispatch(apiDeleteIntentRequest(botId, intentId));
  }, */
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
