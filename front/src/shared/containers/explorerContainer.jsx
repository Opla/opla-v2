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
  Tooltip,
} from "zoapp-ui";
import { apiMoveIntentRequest } from "../actions/api";
import {
  appSelectIntent,
  appSelectEntity,
  appSelectVariable,
  appSelectFunction,
  appDeleteNewActions,
  appUnSelectIO,
} from "../actions/app";

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

  onSelectEntity = (selected) => {
    this.props.appSelectEntity(this.props.selectedBotId, selected);
  };

  onSelectVariable = (selected) => {
    this.props.appSelectVariable(this.props.selectedBotId, selected);
  };

  onSelectFunction = (selected) => {
    this.props.appSelectFunction(this.props.selectedBotId, selected);
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
            <span
              style={intent.state === "deactivated" ? { opacity: "0.5" } : {}}
            >
              <span style={{ margin: "0 14px 0 0px" }}>#</span>
              {intent.name}
            </span>
          </div>,
        );
        n.push(
          <ListItemMeta key="i_meta">
            <Icon
              name="edit"
              onClick={(e) => {
                e.stopPropagation();
                this.props.onRename(index);
              }}
            />
            <Icon
              name="remove"
              onClick={(e) => {
                e.stopPropagation();
                this.props.onDelete(index);
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
          <div>
            <Tooltip label="add an intent">
              <Icon
                style={{
                  paddingTop: "12px",
                  paddingRight: "4px",
                  marginLeft: "-8px",
                }}
                name="add_circle"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.onAdd();
                }}
              />
            </Tooltip>
            Intents
          </div>
        }
      >
        <ListDragComponent
          items={items}
          selectedItem={selected}
          onSelect={this.onSelectIntent}
          onDrop={this.onDropIntent}
        />
      </ExpansionPanel>
    );
    items = [];
    items.push(
      {
        id: "entitySystem",
        name: (
          <span>
            <span style={{ margin: "0 14px 0 0px" }}>@</span>System
          </span>
        ),
      },
      {
        id: "entityGlobal",
        name: (
          <span>
            <span style={{ margin: "0 14px 0 0px" }}>@</span>Global
          </span>
        ),
      },
    );
    const entityList = (
      <ExpansionPanel
        elevation={0}
        collapsed
        compact
        leftArrow
        label={
          <div>
            <Tooltip label="@TODO Remove this tooltip when styling" />
            Entities
          </div>
        }
      >
        <ListComponent
          items={items}
          selectedItem={this.props.selectedEntityIndex}
          onSelect={this.onSelectEntity}
        />
      </ExpansionPanel>
    );
    items = [];
    items.push(
      {
        id: "variableSystem",
        name: (
          <span>
            <span style={{ margin: "0 14px 0 0px" }}>$</span>System
          </span>
        ),
      },
      {
        id: "variableGlobal",
        name: (
          <span>
            <span style={{ margin: "0 14px 0 0px" }}>$</span>Global
          </span>
        ),
      },
      {
        id: "variableLocal",
        name: (
          <span>
            <span style={{ margin: "0 14px 0 0px" }}>$</span>Local
          </span>
        ),
      },
    );
    const variableList = (
      <ExpansionPanel
        elevation={0}
        collapsed
        compact
        leftArrow
        label={
          <div>
            <Tooltip label="@TODO Remove this tooltip when styling" />
            Variables
          </div>
        }
      >
        <ListComponent
          items={items}
          selectedItem={this.props.selectedVariableIndex}
          onSelect={this.onSelectVariable}
        />
      </ExpansionPanel>
    );

    items = [];
    items.push({
      id: "funcSystem",
      name: (
        <span>
          <span style={{ margin: "0 14px 0 0px" }}>/</span>System
        </span>
      ),
    });
    const callableList = (
      <ExpansionPanel
        elevation={0}
        collapsed
        compact
        leftArrow
        label={
          <div>
            <Tooltip label="TODO add a function">
              <Icon
                style={{
                  paddingTop: "12px",
                  paddingRight: "4px",
                  marginLeft: "-8px",
                }}
                name="add_circle"
                onClick={(e) => {
                  e.stopPropagation();
                  // this.props.handleAdd();
                }}
              />
            </Tooltip>
            Functions
          </div>
        }
      >
        <ListComponent
          items={items}
          selectedItem={this.props.selectedFunctionIndex}
          onSelect={this.onSelectFunction}
        />
      </ExpansionPanel>
    );
    return (
      <div className="list-box explorer" style={{ margin: "0" }}>
        <div className="list-content">
          {intentList}
          {entityList}
          {variableList}
          {callableList}
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
  selectedEntityIndex: PropTypes.number,
  selectedVariableIndex: PropTypes.number,
  selectedFunctionIndex: PropTypes.number,
  apiMoveIntentRequest: PropTypes.func.isRequired,
  appSelectIntent: PropTypes.func.isRequired,
  appSelectEntity: PropTypes.func.isRequired,
  appSelectVariable: PropTypes.func.isRequired,
  appSelectFunction: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const selectedIntentIndex = state.app ? state.app.selectedIntentIndex : 0;
  const selectedEntityIndex = state.app ? state.app.selectedEntityIndex : -1;
  const selectedVariableIndex = state.app
    ? state.app.selectedVariableIndex
    : -1;
  const selectedFunctionIndex = state.app
    ? state.app.selectedFunctionIndex
    : -1;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const intents = state.app.intents ? [...state.app.intents] : null;
  const { bots, project } = state.app;
  const bot = selectedBotId ? bots[project.selectedIndex] : null;

  return {
    intents,
    selectedIntentIndex,
    selectedEntityIndex,
    selectedFunctionIndex,
    selectedVariableIndex,
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
    dispatch(appUnSelectIO());
  },
  appSelectEntity: (botId, index) => {
    dispatch(appDeleteNewActions());
    dispatch(appSelectEntity(botId, index));
  },
  appSelectVariable: (botId, index) => {
    dispatch(appDeleteNewActions());
    dispatch(appSelectVariable(botId, index));
  },
  appSelectFunction: (botId, index) => {
    dispatch(appDeleteNewActions());
    dispatch(appSelectFunction(botId, index));
  },
});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExplorerContainer);
