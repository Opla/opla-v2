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
import VariableDetail from "../../components/variableDetail";

class VariableContainer extends Component {
  constructor() {
    super();
    this.state = {
      showVariableDetail: false,
      action: null,
      selectedVariableId: -1,
    };
  }

  renderVariableDetail = (variableScope) => (
    <VariableDetail
      onClose={() =>
        this.setState({
          showVariableDetail: false,
          action: null,
          selectedVariableId: -1,
        })
      }
      onSubmit={() => {
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
              ...this.props.variables[this.state.selectedVariableId],
            }
      }
      variableScope={variableScope}
      header={<p>Variable {variableScope}</p>}
    />
  );

  onDelete = () => {
    Zrmc.showDialog({
      header: "Are you sure?",
      body: "This action is definitive. Are you sure ?",
      actions: [{ name: "Cancel" }, { name: "Ok" }],
      onAction: () => {
        console.warn(
          `Deleting specific variable with name=${
            this.props.variables[this.state.selectedVariableId].name
          }`,
        );
        DialogManager.close();
      },
      onClose: () => {
        DialogManager.close();
      },
      style: { width: "720px" },
    });
  };

  handleMenuSelect = (type, index) => {
    switch (type) {
      case "edit":
        this.setState({
          showVariableDetail: true,
          type: "edit",
          selectedVariableId: index,
        });
        break;
      case "delete":
        this.setState(
          {
            showVariableDetail: false,
            type: "delete",
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
    const { user } = this.props;
    const { scope } = user.attributes;

    const { selectedVariableIndex } = this.props;
    let titlename = "";
    switch (selectedVariableIndex) {
      case 0:
        titlename = "System";
        break;
      case 1:
        titlename = "Global";
        break;
      case 2:
        titlename = "Local";
        break;
      default:
        break;
    }
    const headers = ["", "Name", "Value", "Type", "Access", "Description"];
    const items = this.props.variables.map((v) => ({
      id: v.id,
      values: [v.name, v.value, v.type, v.access, v.description],
    }));
    const menu = [
      {
        name: "edit",
        onSelect: this.handleMenuSelect,
        disabled: scope !== "owner" || titlename === "System",
      },
      {
        name: "delete",
        onSelect: this.handleMenuSelect,
        disabled: scope !== "owner" || titlename === "System",
      },
    ];

    const action = [
      {
        name: "Add",
        onClick: () => {
          this.setState({ showVariableDetail: true, type: "create" });
        },
        disabled: scope !== "owner" || titlename === "System",
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
              <div>Variable ${titlename}</div>
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
        {this.state.showVariableDetail &&
          this.renderVariableDetail(titlename.toLowerCase())}
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
  variables: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.shape({}).isRequired,
  isLoading: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => {
  const selectedVariableIndex = state.app ? state.app.selectedVariableIndex : 0;
  const selectedBotId = state.app ? state.app.selectedBotId : null;
  const { user } = state;
  const variables = [
    {
      id: 1,
      name: "example_mail",
      value: "mail@example.ai",
      type: "email",
      access: "Read",
      description: "Used to send mail",
    },
    {
      id: 2,
      name: "example_date",
      value: "11/03/1992",
      type: "date",
      access: "Read",
      description: "Used to save a date",
    },
  ];
  return {
    selectedVariableIndex,
    selectedBotId,
    variables,
    user,
    isLoading: false,
  };
};
const mapDispatchToProps = (dispatch) => ({
  apiGetUsersRequest: () => dispatch(apiGetUsersRequest()),
});
// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VariableContainer);
