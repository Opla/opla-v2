/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { SubToolbar, TableComponent } from "zoapp-ui";
import zrmc, { DialogManager } from "zrmc";
import EntityDetail from "../../components/entityDetail";
import { apiGetEntitiesRequest } from "../../actions/api";
import {
  apiGetBotEntitiesRequest,
  apiSetBotEntitiesRequest,
} from "../../actions/bot";

class EntityContainer extends Component {
  constructor() {
    super();
    this.state = {
      showEntityDetail: false,
      action: null,
      selectedEntityId: -1,
      selectedEntityIndex: -1,
      titleName: "",
      entities: [],
      hasAccess: false,
      entitieScope: "",
      setEntities: () => {},
      headers: [],
      items: [],
    };
  }

  componentDidMount() {
    this.props.apiGetEntitiesRequest();
    if (this.props.selectedBotId) {
      this.props.apiGetBotEntitiesRequest(this.props.selectedBotId);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedEntityIndex !== state.selectedEntityIndex) {
      const { user, selectedEntityIndex } = props;
      const { scope } = user.attributes;
      let {
        titlename,
        entities,
        hasAccess,
        setEntities,
        headers,
        items,
      } = state;
      switch (selectedEntityIndex) {
        case 0:
          titlename = "System";
          entities = props.systemEntities;
          hasAccess = false;
          headers = ["", "Name", "Type", "Disabled"];
          items = entities.map((v) => ({
            id: v.type,
            values: [
              v.name,
              `@${v.name}`,
              v.disabled ? "true" : "false", // v.disabled one of true or undefined
            ],
          }));
          break;
        case 1:
          titlename = "Global";
          entities = props.botEntities;
          setEntities = (es) =>
            props.apiSetBotEntitiesRequest(props.selectedBotId, es);
          hasAccess = scope === "owner";
          headers = ["", "Name", "Values"];
          items = entities.map((v) => ({
            id: v.type,
            values: [v.name, v.values.join(",")],
          }));
          break;
        default:
          break;
      }
      return {
        titlename,
        entities,
        setEntities,
        hasAccess,
        entitieScope: titlename.toLowerCase(),
        headers,
        items,
      };
    }
    return null;
  }

  renderEntityDetail = () => (
    <EntityDetail
      onClose={() =>
        this.setState({
          showEntityDetail: false,
          action: null,
          selectedEntityId: -1,
        })
      }
      onSubmit={(entity) => {
        const { entities } = this.state;
        if (this.state.action === "create") {
          entities.push(entity);
        } else {
          entities[this.state.selectedEntityId] = entity;
        }
        this.state.setEntities(entities);

        this.setState({
          showEntityDetail: false,
          action: null,
          selectedEntityId: -1,
        });
      }}
      entity={
        this.state.action === "create"
          ? {}
          : {
              ...this.state.entities[this.state.selectedEntityId],
            }
      }
      entityScope={this.state.entitieScope}
      header={<p>Entity {this.state.entitieScope}</p>}
    />
  );

  onDelete = () => {
    zrmc.showDialog({
      header: "Are you sure?",
      body: "This action is definitive. Are you sure ?",
      actions: [{ name: "Cancel" }, { name: "Ok" }],
      onAction: () => {
        const { entities } = this.state;
        entities.splice(this.state.selectedEntityId, 1);
        this.state.setEntities(entities);

        DialogManager.close();
      },
      onClose: () => {
        DialogManager.close();
      },
      style: { width: "720px" },
    });
  };

  handleMenuSelect = (action, index) => {
    switch (action) {
      case "edit":
        this.setState({
          showEntityDetail: true,
          action: "edit",
          selectedEntityId: index,
        });
        break;
      case "delete":
        this.setState(
          {
            showEntityDetail: false,
            action: "delete",
            selectedEntityId: index,
          },
          () => {
            this.onDelete();
          },
        );
        break;
      default:
        break;
    }
  };

  render() {
    const menu = [
      {
        name: "edit",
        onSelect: this.handleMenuSelect,
        disabled: !this.state.hasAccess,
      },
      {
        name: "delete",
        onSelect: this.handleMenuSelect,
        disabled: !this.state.hasAccess,
      },
    ];

    const action = [
      {
        name: "Add",
        onClick: () => {
          this.setState({ showEntityDetail: true, action: "create" });
        },
        disabled: !this.state.hasAccess,
      },
    ];

    return (
      <div className="variables_container">
        <SubToolbar
          className="variables_toolbar"
          style={{ margin: "0px 0px 0 0px" }}
          titleName={
            <div
              className="variables_title"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <p className="variable_overline_title">Entity</p>
              <div>@{this.state.titlename}</div>
            </div>
          }
          actions={action}
        />
        <div className="zui-action-panel list-box variable_table_wrapper">
          <TableComponent
            className="variable_table"
            headers={this.state.headers}
            items={this.state.items}
            selectedItem={-1}
            onSelect={() => {}}
            menu={menu}
          />
        </div>
        {this.state.showEntityDetail && this.renderEntityDetail()}
      </div>
    );
  }
}

EntityContainer.defaultProps = {
  selectedBotId: null,
};

EntityContainer.propTypes = {
  selectedBotId: PropTypes.string,
  selectedEntityIndex: PropTypes.number,
  botEntities: PropTypes.array.isRequired,
  systemEntities: PropTypes.array.isRequired,
  user: PropTypes.shape({}).isRequired,

  apiGetEntitiesRequest: PropTypes.func.isRequired,
  apiGetBotEntitiesRequest: PropTypes.func.isRequired,
  apiSetBotEntitiesRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const selectedEntityIndex = state.app.selectedEntityIndex || 0;
  const { user } = state;
  const { selectedBotId, entities: systemEntities, botEntities } = state.app;

  return {
    selectedEntityIndex,
    selectedBotId,
    botEntities,
    systemEntities,
    user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  apiGetEntitiesRequest: () => dispatch(apiGetEntitiesRequest()),
  apiGetBotEntitiesRequest: (botId) =>
    dispatch(apiGetBotEntitiesRequest(botId)),
  apiSetBotEntitiesRequest: (botId, entities) =>
    dispatch(apiSetBotEntitiesRequest(botId, entities)),
});

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EntityContainer);
