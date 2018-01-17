import React from "react";
import PropTypes from "prop-types";

// Inspired from https://codepen.io/anon/pen/KqYGNZ
const MdlStepper = (props) => {
  const { steps } = props;
  return (
    <div className="mdl-stepper-horizontal-alternative">
      {steps.map((step, index) => {
        let cn = "mdl-stepper-step";
        cn += step.active ? " active-step" : "";
        cn += step.done ? " step-done" : "";
        cn += step.editable ? " editable-step" : "";
        const { id } = step;
        const i = index + 1;
        const optional = step.optional ? <div className="mdl-stepper-optional">Optional</div> : "";
        return (
          <div
            className={cn}
            key={id}
            role="presentation"
            onKeyDown={() => { }}
            onClick={(event) => {
              event.stopPropagation();
              if (step.active && this.props.onSelect) {
                this.props.onSelect(index);
              }
            }}
          >
            <div className="mdl-stepper-circle"><span>{i}</span></div>
            <div className="mdl-stepper-title">{step.title}</div>
            {optional}
            <div className="mdl-stepper-bar-left" />
            <div className="mdl-stepper-bar-right" />
          </div>);
      })}
    </div>);
};

MdlStepper.propTypes = {
  steps: PropTypes.arrayOf().isRequired,
};

export default MdlStepper;
