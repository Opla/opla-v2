/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { SubToolbar } from "zoapp-ui";

class FunctionContainer extends Component {
  render() {
    const { selectedFunctionIndex } = this.props;
    let titlename = "";
    if (selectedFunctionIndex === 0) {
      titlename = "System";
    }

    const action = null;
    return (
      <div>
        {" "}
        <SubToolbar
          className=""
          style={{ margin: "0px 0px 0 0px" }}
          titleName={
            <span>
              <span style={{ color: "#bbb" }}>/</span>
              {titlename}
            </span>
          }
          actions={action}
        />
        <div className="zui-action-panel list-box">
          <div className="list-content">
            <div
              className="zui-color--white mdc-elevation--z1"
              style={{ margin: "12px", padding: "16px", height: "400px" }}
            >
              TODO {titlename} Function
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FunctionContainer.defaultProps = {
  selectedBotId: null,
};

FunctionContainer.propTypes = {
  selectedBotId: PropTypes.string,
  selectedFunctionIndex: PropTypes.number,
};
const mapStateToProps = (state) => {
  const selectedFunctionIndex = state.app ? state.app.selectedFunctionIndex : 0;
  const selectedBotId = state.app ? state.app.selectedBotId : null;

  return {
    selectedFunctionIndex,
    selectedBotId,
  };
};
const mapDispatchToProps = null;

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FunctionContainer);
