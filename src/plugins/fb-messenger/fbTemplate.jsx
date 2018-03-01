/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Stepper } from "zoapp-ui";

import FBContainer from "./fbContainer";

class FBTemplate extends Component {
  constructor() {
    super();
    this.state = {
      steps: [
        { title: "Fb login", editable: true, active: true },
        { title: "Connect page" },
        { title: "Interactions", optional: true },
        { title: "Publish", optional: true },
      ],
      selectedStep: 0,
    };
  }

  onAction = (action) => {
    if (action === "Manual") {
      this.setSelectedStep(1, true);
    }
    this.props.onAction(action);
  }

  setSelectedStep(index, editable = false) {
    const steps = [...this.state.steps];
    let step = null;
    if (index > -1 && index < steps.length) {
      for (let i = 0; i < index; i += 1) {
        steps[i].editable = false;
        steps[i].active = true;
      }
      for (let i = index + 1; i < steps.length; i += 1) {
        if (steps[i].editable) {
          steps[i].editable = false;
        }
      }
      step = steps[index];
      step.editable = editable;
      step.active = true;
      this.setState({ steps, selectedStep: index });
    }
    return step;
  }

  render() {
    const style = {
      height: "200px",
      width: "502px",
      position: "relative",
    };
    const { steps, selectedStep } = this.state;
    return (
      <div>
        <Stepper steps={steps} onSelect={(index) => { this.setSelectedStep(index, true); }} />
        <div className="mdl-color--grey-100" style={style}>
          <FBContainer
            appId={this.props.appId}
            onAction={this.onAction}
            selectedStep={selectedStep}
          />
        </div>
      </div>
    );
  }
}

FBTemplate.propTypes = {
  appId: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
};

export default FBTemplate;
