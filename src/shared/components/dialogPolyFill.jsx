import React, { Component } from "react";
import PropTypes from "prop-types";

export default class DialogPolyFill extends Component {
  constructor(props) {
    super(props);
    this.dialogWidth = 0;
    this.dialogHeight = 0;
  }

  componentDidMount() {
    const dialog = this.dialogRef;

    if (!dialog.showModal) { // avoid chrome warnings and update only on unsupported browsers
      window.dialogPolyfill.registerDialog(dialog);
    } /* else {
      console.log("native dialog");
    } */
    this.dialogRef.addEventListener("cancel", this.props.onCancel);
    if (this.props.open) {
      this.dialogRef.showModal();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.open) {
      if (!prevProps.open) {
        this.dialogRef.showModal();
      }

      // display the dialog at the right location
      // needed for the polyfill, otherwise it's not at the right position
      // const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      if (this.dialogRef) {
        const dialogWidth = this.dialogRef.clientWidth;
        const dialogHeight = this.dialogRef.clientHeight;
        if (dialogWidth !== this.dialogWidth || dialogHeight !== this.dialogHeight) {
          this.dialogWidth = dialogWidth;
          this.dialogHeight = dialogHeight;
          this.dialogRef.style.position = "fixed";
          this.dialogRef.style.top = `${(windowHeight - dialogHeight) / 2}px`;
          // this.dialogRef.style.left = `${(windowWidth - dialogWidth) / 2}px`;
        }
      } else {
        this.dialogRef.close();
      }
    }
  }

  componentWillUnmount() {
    this.dialogRef.removeEventListener("cancel", this.props.onCancel);
  }

  render() {
    const {
      style, className, open, onCancel, onClose, children, ...otherProps
    } = this.props;
    const classes = `${className} mdl-dialog`;
    const s = {};
    if (style && style.width) {
      s.width = style.width;
    }
    return (
      <dialog
        role="presentation"
        style={s}
        ref={(c) => { this.dialogRef = c; }}
        className={classes}
        {...otherProps}
        onKeyUp={() => { }}
        onClick={() => { this.props.onClose(); }}
      >
        <div
          className="mdl-dialog_inner"
          role="presentation"
          onKeyUp={() => { }}
          style={style}
          onClick={(e) => { e.stopPropagation(); }}
        >
          {children}
        </div>
      </dialog>
    );
  }
}

DialogPolyFill.defaultProps = {
  className: "",
  style: null,
  open: true,
  onCancel: null,
};

DialogPolyFill.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.string),
  open: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.element, PropTypes.string])).isRequired,
};
