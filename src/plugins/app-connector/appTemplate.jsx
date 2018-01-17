import React, { Component } from "react";
import { Button } from "react-mdl";
import PropTypes from "prop-types";
import { Stepper } from "MdlExt";


export default class AppTemplate extends Component {
  static renderConnectApp() {
    return (
      <div style={{
        width: "320px",
        height: "128px",
        margin: "auto",
        position: "absolute",
        left: "0px",
        right: "0px",
        bottom: "0px",
        top: "0px",
      }}
      >
        <div>Run your app to connect and test it, now.</div>
      </div>);
  }

  constructor() {
    super();
    this.state = {
      steps: [
        {
          id: "1", title: "Create App", editable: true, active: true,
        },
        {
          id: "2", title: "Connect App",
        },
        {
          id: "3", title: "Interactions", optional: true,
        },
        {
          id: "4", title: "Publish", optional: true,
        },
      ],
      selectedStep: 0,
    };
  }

  onAction = (action) => {
    if (action === "Build") {
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
      step.id = `${index}`;
      step = steps[index];
      step.editable = editable;
      step.active = true;
      this.setState({ steps, selectedStep: index });
    }
    return step;
  }

  renderCreateApp() {
    return (
      <div style={{
        width: "420px",
        height: "200px",
        margin: "auto",
        position: "absolute",
        left: "0px",
        right: "0px",
        bottom: "0px",
        top: "0px",
      }}
      >
        <div style={{ marginTop: "8px", textAlign: "center" }}>Download a code template :</div>
        <div style={{
          width: "390px",
          paddingTop: "8px",
          margin: "auto",
        }}
        >
          <Button raised colored ripple style={{ width: "120px", marginRight: "10px" }}>iOS</Button>
          <Button raised colored ripple style={{ width: "120px", marginRight: "10px" }}>Android</Button>
          <Button raised colored ripple style={{ width: "120px" }}>Web</Button>
        </div>
        <div style={{ marginTop: "12px", textAlign: "center" }}>Or install SDK and set appId / appSecret :</div>
        <div style={{
          marginTop: "0px", marginBottom: "0px", fontSize: "10px", color: "black",
        }}
        >appId : cMty8cGsUI2hQfqinzAwMqtPEZ8rUIIuOlYldbZMUHOR4Wx9rSHRbqHFE4CO9HSh
        </div>
        <div style={{
          marginTop: "0px", marginBottom: "12px", fontSize: "10px", color: "black",
        }}
        >appSecret : sDi8tEAh3qXzlsN1TQeh4p8NcsBCULTA84SUZmLcTty260I9ji9y6ra2p9v34u6E
        </div>
        <Button
          raised
          accent
          ripple
          style={{
            width: "200px",
            marginLeft: "110px",
          }}
          onClick={(event) => {
            event.stopPropagation();
            this.onAction("Build");
          }}
        >Ready !
        </Button>
      </div>);
  }

  render() {
    const style = {
      height: "200px",
      width: "502px",
      position: "relative",
    };
    const { steps, selectedStep } = this.state;
    let container = (<div>TODO</div>);
    if (selectedStep === 0) {
      container = this.renderCreateApp();
    } else {
      container = AppTemplate.renderConnectApp();
    }
    return (
      <div>
        <Stepper steps={steps} onSelect={(index) => { this.setSelectedStep(index, true); }} />
        <div className="mdl-color--grey-100" style={style}>
          {container}
        </div>
      </div>);
  }
}

AppTemplate.propTypes = {
  onAction: PropTypes.func.isRequired,
};
