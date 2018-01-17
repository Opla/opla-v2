/* eslint-disable no-unused-vars */
import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import BasicDialog from "../components/basicDialog";
/* eslint-enable no-unused-vars */

// https://github.com/xue2han/react-dynamic-modal/blob/master/src/Modal.js
let node;
let modalsArray;
let currentDialog;

const getModals = () => {
  if (!modalsArray) {
    modalsArray = [];
  }
  return modalsArray;
};

const renderModal = () => {
  const modals = getModals();
  const { length } = modals;
  if (length > 0) {
    const dialog = modals[length - 1];
    if (!node) {
      /* global document */
      node = document.createElement("div");
      node.className = "dialog_bg";
      document.body.appendChild(node);
    } else {
      ReactDOM.unmountComponentAtNode(node);
    }
    currentDialog = null;
    let comp = dialog;
    if (dialog.props.store) {
      comp = <Provider store={comp.props.store}>{dialog}</Provider>;
    }
    ReactDOM.render(comp, node);
  }
};


const DialogManager = {
  init(store) {
    this.store = store;
  },

  open({
    dialog, title, content, actions, actionsDef, onAction, className, data, width, render,
  }) {
    let component = null;
    const ref = (r) => {
      currentDialog = r;
    };
    if (dialog) {
      component = React.cloneElement(dialog, { ref }, { ...dialog.props });
    } else {
      component = (<BasicDialog
        open
        title={title}
        content={content}
        actions={actions}
        actionsDef={actionsDef}
        onAction={onAction}
        className={className}
        store={this.store}
        ref={ref}
        data={data}
        width={width}
        render={render}
      />);
    }
    const modals = getModals();
    modals.push(component);
    renderModal();
  },

  closeCurrentDialog() {
    if (currentDialog && currentDialog.onClose) {
      currentDialog.onClose();
    }
  },

  close() {
    ReactDOM.unmountComponentAtNode(node);
    const modals = getModals();
    modals.pop();
    currentDialog = null;
    const overlay = document.getElementsByClassName("_dialog_overlay");
    if (overlay && overlay[0]) {
      overlay[0].style.visibility = "hidden";
    }
    renderModal();
  },

  forceUpdate() {
    if (currentDialog) {
      currentDialog.forceUpdate();
    }
  },
};

export default DialogManager;
