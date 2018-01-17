import React from "react";
import ReactDOM, { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AppContainer } from "react-hot-loader";

import configureStore from "OplaLibs/store";
import DialogManager from "OplaLibs/utils/dialogManager";
import App from "OplaContainers/app";

// import DevTools from "../shared/containers/DevTools";
/* eslint-enable no-unused-vars */

const store = configureStore();

DialogManager.init(store);

// export the React MDL components globally to use them without the ReactMDL prefix
/* eslint-disable no-restricted-syntax */
/* for (const component in ReactMDL) {
  if (Object.prototype.hasOwnProperty(ReactMDL, component)) {
    window[component] = ReactMDL[component];
  }
} */
/* eslint-enable no-restricted-syntax */
const mountNode = document.getElementById("app");

/* const deleteScript = (filename) => {
  const scripts = [...document.getElementsByTagName("script")];
  scripts.find((script) => {
    if (script.getAttribute("src") === filename) {
      script.parentNode.removeChild(script);
      return true;
    }
    return false;
  });
};

const loadScript = (filename, callback) => {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", filename);
  script.onload = callback;
  const body = document.getElementsByTagName("body")[0];
  body.appendChild(script);
}; */

const renderApp = (Root) => {
  render(
    <AppContainer warnings={false}>
      <Provider store={store}>
        <BrowserRouter>
          <Root store={store} />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    mountNode,
  );
};

/* global module */
if (module.hot) {
  /* eslint-disable global-require */
  /* eslint-disable no-undef */
  // const rootPath = "./shared/container/app";
  module.hot.accept("OplaContainers/app", () => {
    console.log("HMR app");
    /* ReactDOM.unmountComponentAtNode(mountNode);
    const parent = mountNode.parentNode;
    parent.removeChild(mountNode);
    mountNode = document.createElement("div");
    mountNode.id = "app";
    parent.insertBefore(mountNode, parent.firstChild);
    deleteScript("js/material.js");
    deleteScript("js/material.ext.js");
    window.componentHandler = null;
    window.MaterialButton = null;
    window.MaterialCheckbox = null;
    window.MaterialIconToggle = null;
    window.MaterialMenu = null;
    window.MaterialProgress = null;
    window.MaterialRadio = null;
    window.MaterialSlider = null;
    window.MaterialSnackbar = null;
    window.MaterialSpinner = null;
    window.MaterialSwitch = null;
    window.MaterialTabs = null;
    window.MaterialTextfield = null;
    window.MaterialTooltip = null;
    window.MaterialLayout = null;
    window.MaterialLayoutTab = null;
    window.MaterialDataTable = null;
    window.MaterialRipple = null;

    loadScript("js/material.js", () => {
      loadScript("js/material.ext.js", () => {
        const newApp = require("OplaContainers/app").default;
        renderApp(newApp);
      });
    }); */
    const newApp = require("OplaContainers/app").default;
    renderApp(newApp);
  });
  /* eslint-enable no-undef */
  /* eslint-enable global-require */
  // module.hot.accept();
}

renderApp(App);

/*
 // global // process // require
if (process.env.NODE_ENV !== "production") {
  const showDevTools = require("./showDevTools");
  showDevTools(store);
} */
