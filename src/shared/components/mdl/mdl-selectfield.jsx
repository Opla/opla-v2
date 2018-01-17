import React, { Component } from "react";
import PropTypes from "prop-types";
import mdlUpgrade from "react-mdl/lib/utils/mdlUpgrade";

class MdlSelectfield extends Component {
  constructor(props) {
    super(props);
    this.state = { value: null };
  }
  componentDidMount() {
    if (this.props.error) {
      this.setAsInvalid();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.required !== prevProps.required ||
      this.props.error !== prevProps.error
    ) {
      this.node.MaterialSelectfield.checkValidity();
    }
    if (this.props.disabled !== prevProps.disabled) {
      this.node.MaterialSelectfield.checkDisabled();
    }
    if (this.props.value !== prevProps.value && this.inputRef !== document.activeElement) {
      this.node.MaterialSelectfield.change(this.props.value);
    }
  }

  onChange = () => {
    const { value } = this.inputRef;
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  setAsInvalid() {
    if (this.node.className.indexOf("is-invalid") < 0) {
      this.node.className = `${this.node.className} is-invalid`;
    }
  }

  render() {
    const {
      className, id,
      error, floatingLabel, label,
      style, children, ...otherProps
    } = this.props;

    const customId = id || `selectfield-${label.replace(/[^a-z0-9]/gi, "")}`;

    const selectProps = {
      ...otherProps,
      className: "mdl-selectfield__select mdl-select__arrow",
      id: customId,
      ref: (c) => { this.inputRef = c; },
      onChange: this.onChange,
    };
    const { value } = this.state;
    if (value) {
      selectProps.value = value;
    }

    // TODO find a way to setup label correctly
    /* eslint-disable jsx-a11y/label-has-for */
    const labelContainer = <label className="mdl-selectfield__label" htmlFor={customId}>{label}</label>;
    /* eslint-enable jsx-a11y/label-has-for */
    const errorContainer = !!error && <span className="mdl-selectfield__error">{error}</span>;

    let containerClasses = "mdl-selectfield mdl-js-selectfield ";
    if (floatingLabel) {
      containerClasses += "mdl-selectfield--floating-label ";
    }
    containerClasses += className;

    return (
      <div className={containerClasses} style={style} ref={(n) => { this.node = n; }}>
        <select {...selectProps}>
          {children}
        </select>
        {labelContainer}
        {errorContainer}
      </div>
    );
  }
}

MdlSelectfield.defaultProps = {
  children: null,
  className: "",
  disabled: false,
  error: null,
  floatingLabel: false,
  id: null,
  onChange: null,
  required: false,
  style: null,
  value: "",
};

MdlSelectfield.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.node,
  floatingLabel: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  style: PropTypes.objectOf(PropTypes.string),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default mdlUpgrade(MdlSelectfield);
