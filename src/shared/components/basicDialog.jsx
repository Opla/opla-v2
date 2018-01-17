import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, DialogTitle, DialogContent, DialogActions, Textfield } from "react-mdl";
import DialogPolyFill from "../components/dialogPolyFill";
import DialogManager from "../utils/dialogManager";

class BasicDialog extends Component {
  constructor(props) {
    super(props);
    const { open } = props;
    this.state = { openDialog: open };
  }

  componentWillReceiveProps(props) {
    this.setState({ openDialog: props.open });
  }

  onClose = () => {
    this.handleAction("Close");
  }

  getFieldValue() {
    return this.textField.inputRef.value.trim();
  }

  getFieldDefaultValue() {
    const obj = this.Content();
    if (obj) {
      return obj.defaultValue;
    }
    return null;
  }

  getContent() {
    const { content } = this.props;
    if (content && typeof content === "object" && (!content.$$typeof)) {
      return content;
    }
    return null;
  }

  getData() {
    return this.props.data || this.getContent();
  }

  invalidateField() {
    this.textField.setAsInvalid();
  }

  handleOpenDialog = () => {
    this.setState({ openDialog: true });
  }

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
    DialogManager.close();
  }

  handleAction = (state) => {
    // console.log("handleAction=", state);
    if (this.props.onAction) {
      if (!this.props.onAction(this, state)) {
        // this.forceUpdate();
        return;
      }
    }
    this.handleCloseDialog();
  }

  render() {
    let content = null;
    if (this.props.render) {
      content = this.props.render();
    } else {
      const obj = this.getContent();
      if (obj) {
        content = (<Textfield
          defaultValue={obj.defaultValue}
          pattern={obj.pattern}
          label={obj.name}
          floatingLabel
          error={obj.error}
          style={{ width: "100%" }}
          ref={(input) => { this.textField = input; }}
        />);
      } else {
        content = this.props.content || "";
      }
    }
    const { actions } = this.props;
    let actionMenu = "";
    const isActions = actions ? actions.length > 0 : true;
    if (isActions) {
      const actionsTxt = actions || ["Ok"];
      const actionsDef = this.props.actionsDef ? this.props.actionsDef : actionsTxt;
      actionMenu = (
        <DialogActions>
          {actionsTxt.map((action, index) => {
            let style = {};
            if (index === 0) {
              style = { color: "#552682" };
            }
            return (
              <Button
                key={action}
                style={style}
                type="button"
                onClick={(e) => { e.stopPropagation(); this.handleAction(actionsDef[index]); }}
              >{action}
              </Button>);
          })}
        </DialogActions>);
    }

    const title = this.props.title ? <DialogTitle>{this.props.title}</DialogTitle> : "";
    let style = null;
    if (this.props.width) {
      style = { width: this.props.width };
    }
    return (
      <DialogPolyFill
        open={this.state.openDialog}
        id={this.state.id}
        className={this.props.className}
        style={style}
        onClose={this.onClose}
      >
        {title}
        <DialogContent>
          {content}
        </DialogContent>
        {actionMenu}
      </DialogPolyFill>
    );
  }
}
BasicDialog.defaultProps = {
  title: null,
  className: null,
  render: null,
  content: null,
  actions: null,
  actionsDef: null,
  onAction: null,
  data: null,
  width: null,
};

BasicDialog.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  render: PropTypes.func,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  actions: PropTypes.arrayOf(PropTypes.string),
  actionsDef: PropTypes.arrayOf(PropTypes.string),
  open: PropTypes.bool.isRequired,
  onAction: PropTypes.func,
  data: PropTypes.shape({}),
  width: PropTypes.string,
};

export default BasicDialog;
