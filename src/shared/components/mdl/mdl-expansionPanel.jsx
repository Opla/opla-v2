import React, { Component } from "react";
import PropTypes from "prop-types";
import { IconButton } from "react-mdl";

class MdlExpansionPanel extends Component {
  constructor(props) {
    super(props);
    const { collapsed } = props;
    this.state = { collapsed };
  }

  onSwitch = () => {
    const collapsed = !this.state.collapsed;
    this.setState({ collapsed });
  }

  render() {
    const { label, disabled, children } = this.props;
    const style = { display: "none" };
    const expanded = !this.state.collapsed;
    if (expanded) {
      style.display = "block";
    }

    const icon = expanded ? "keyboard_arrow_up" : "keyboard_arrow_down";

    return (
      <div className="mrb-sublist">
        <div className="mrb-subheader">
          <IconButton name={icon} className="mrb-subheader-right" disabled={disabled} onClick={(e) => { e.preventDefault(); this.onSwitch(); }} /><div>{label}</div>
        </div>
        <div style={style} >
          {children}
        </div>
      </div>
    );
  }
}

MdlExpansionPanel.defaultProps = {
  collapsed: false,
  disabled: false,
};

MdlExpansionPanel.propTypes = {
  collapsed: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default MdlExpansionPanel;
