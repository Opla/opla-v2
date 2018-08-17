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

class EntityContainer extends Component {
  render() {
    const { selectedEntityIndex } = this.props;
    let titlename = "";
    if (selectedEntityIndex === 0) {
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
              <span style={{ color: "#bbb" }}>@</span>
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
              TODO {titlename} Entity
            </div>
          </div>
        </div>
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
};
const mapStateToProps = (state) => {
  const selectedEntityIndex = state.app ? state.app.selectedEntityIndex : 0;
  const selectedBotId = state.app ? state.app.selectedBotId : null;

  return {
    selectedEntityIndex,
    selectedBotId,
  };
};
const mapDispatchToProps = null;

// prettier-ignore
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EntityContainer);
