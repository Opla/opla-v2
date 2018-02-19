import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AppContainer } from "react-hot-loader";
import { initServices } from "zoapp-front/services";
import App from "OplaContainers/app";
import configureStore from "OplaLibs/store";


// import DevTools from "../shared/containers/DevTools";
/* eslint-enable no-unused-vars */

initServices();

const store = configureStore();

/* eslint-enable no-restricted-syntax */
const mountNode = document.getElementById("app");

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
    // // console.log("HMR app");
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
