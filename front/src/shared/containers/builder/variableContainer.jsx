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
import Zrmc, { DialogManager } from "zrmc";
import { apiGetUsersRequest } from "zoapp-front/dist/actions/api";
import {
  apiGetVariablesRequest,
  apiSetVariablesRequest,
} from "../../actions/api";
import {
  apiGetBotVariablesRequest,
  apiSetBotVariablesRequest,
} from "../../actions/bot";
import VariableDetail from "../../components/variableDetail";

class VariableContainer extends Component {
  constructor() {
    super();
    this.state = {
      showVariableDetail: false,
      action: null,
      selectedVariableId: -1,
      selectedVariableIndex: -1,
      titleName: "",
      variables: [],
      hasAccess: false,
      variableScope: "",
      setVariables: () => {},
    };
  }

  componentDidMount() {
    this.props.apiGetVariablesRequest();
    if (this.props.selectedBotId) {
      this.props.apiGetBotVariablesRequest(this.props.selectedBotId);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedVariableIndex !== state.selectedVariableIndex) {
      const { user, selectedVariableIndex } = props;
      const { scope } = user.attributes;
      let { titlename, variables, hasAccess, setVariables } = state;
      switch (selectedVariableIndex) {
        case 0:
          titlename = "System";
          variables = props.systemVariables;
          setVariables = props.apiSetVariablesRequest;
          hasAccess = scope === "admin";
          break;
        case 1:
          titlename = "Global";
          variables = props.botVariables;
          setVariables = (vs) =>
            props.apiSetBotVariablesRequest(props.selectedBotId, vs);
          hasAccess = scope === "owner";
          break;
        case 2:
          titlename = "Local";
          variables = props.botVariables;
          setVariables = (vs) =>
            props.apiSetBotVariablesRequest(props.selectedBotId, vs);
          hasAccess = scope === "owner";
          break;
        default:
          break;
      }
      return {
        titlename,
        variables,
        setVariables,
        hasAccess,
        variableScope: titlename.toLowerCase(),
      };
    }
    return null;
  }

  renderVariableDetail = () => (
    <VariableDetail
      onClose={() =>
        this.setState({
          showVariableDetail: false,
          action: null,
          selectedVariableId: -1,
        })
      }
      onSubmit={(variable) => {
        const { variables } = this.state;
        if (this.state.action === "create") {
          variables.push(variable);
        } else {
          variables[this.state.selectedVariableId] = variable;
        }
        this.state.setVariables(variables);

        this.setState({
          showVariableDetail: false,
          action: null,
          selectedVariableId: -1,
        });
      }}
      variable={
        this.state.action === "create"
          ? {}
          : {
              ...this.state.variables[this.state.selectedVariableId],
            }
      }
      variableScope={this.state.variableScope}
      header={<p>Variable {this.state.variableScope}</p>}
    />
  );

  onDelete = () => {
    Zrmc.showDialog({
      header: "Are you sure?",
      body: "This action is definitive. Are you sure ?",
      actions: [{ name: "Cancel" }, { name: "Ok" }],
      onAction: () => {
        const { variables } = this.state;
        variables.splice(this.state.selectedVariableId, 1);
        this.state.setVariables(variables);

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
          showVariableDetail: true,
          action: "edit",
          selectedVariableId: index,
        });
        break;
      case "delete":
        this.setState(
          {
            showVariableDetail: false,
            action: "delete",
            selectedVariableId: index,
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
    const headers = ["", "Name", "Value", "Type", "Access", "Description"];
    const items = this.state.variables.map((v) => ({
      id: v.id,
      values: [v.name, v.value, v.type, v.access, v.description],
    }));
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
          this.setState({ showVariableDetail: true, action: "create" });
        },
        disabled: !this.state.hasAccess,
      },
    ];
    return (
      <div>
        <SubToolbar
          className="variable_toolbar"
          style={{ margin: "0px 0px 0 0px" }}
          titleName={
            <div
              className="intent_title"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <div>Variable ${this.state.titlename}</div>
            </div>
          }
          actions={action}
        />
        <div className="zui-action-panel list-box">
          <TableComponent
            className="variable_table"
            headers={headers}
            items={items}
            selectedItem={-1}
            onSelect={() => {}}
            menu={menu}
          />
        </div>
        {this.state.showVariableDetail && this.renderVariableDetail()}
      </div>
    );
  }
}

VariableContainer.defaultProps = {
  selectedBotId: null,
};

VariableContainer.propTypes = {
  selectedBotId: PropTypes.string,
  selectedVariableIndex: PropTypes.number,
  botVariables: PropTypes.arrayOf(PropTypes.object),
  systemVariables: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({}).isRequired,
  isLoading: PropTypes.bool.isRequired,

  apiGetVariablesRequest: PropTypes.func.isRequired,
  apiSetVariablesRequest: PropTypes.func.isRequired,
  apiGetBotVariablesRequest: PropTypes.func.isRequired,
  apiSetBotVariablesRequest: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  const selectedVariableIndex = state.app.selectedVariableIndex || 0;
  const { user } = state;
  const { variables: systemVariables, botVariables, selectedBotId } = state.app;
  return {
    selectedVariableIndex,
    selectedBotId,
    botVariables,
    systemVariables,
    user,
    isLoading: false,
  };
};
const mapDispatchToProps = (dispatch) => ({
  apiGetUsersRequest: () => dispatch(apiGetUsersRequest()),
  apiGetVariablesRequest: () => dispatch(apiGetVariablesRequest()),
  apiSetVariablesRequest: (variables) =>
    dispatch(apiSetVariablesRequest(variables)),
  apiGetBotVariablesRequest: (botId) =>
    dispatch(apiGetBotVariablesRequest(botId)),
  apiSetBotVariablesRequest: (botId, variables) =>
    dispatch(apiSetBotVariablesRequest(botId, variables)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VariableContainer);
