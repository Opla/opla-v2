/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import Front from "zoapp-front/front";
import Screen from "zoapp-front/containers/screen";
import configureStore from "OplaLibs/store";
import config from "../../config/default.json";

const app = {
  name: "Opla.ai CE",
  version: "0.1.0",
  design: {
    drawer: {
      type: "persistent",
      themeDark: true,
    },
  },
  screens: [
    {
      id: "1",
      to: "/",
      icon: "dashboard",
      name: "Dashboard",
      access: "auth",
      path: "/",
      render: props => React.createElement(Screen, props, "Dashboard"),
    },
    {
      id: "2",
      to: "/builder",
      icon: "build",
      name: "Builder",
      path: "/builder",
      access: "auth",
      panels: ["Intents", "Entities", "Flow"],
      toolbox: ["Publish"],
      render: props => React.createElement(Screen, props, "Builder"),
    },
    {
      id: "3",
      to: "/admin",
      icon: "settings",
      name: "Admin",
      path: "/admin",
      access: "auth",
      panels: ["General", "Extensions", "Users", "Advanced"],
      render: props => React.createElement(Screen, props, "Admin"),
    },
    {
      id: "4",
      to: "/",
      icon: "home",
      name: "Home",
      path: "*",
      access: "public",
      render: props => React.createElement(Screen, props, "Home"),
    },
    {
      id: "5",
      to: "/help",
      name: "Help",
      icon: "help",
      path: "/help",
      access: "all",
      render: props => React.createElement(Screen, props, "Help"),
    },
  ],
};

const store = configureStore({ app });

const front = new Front("app", app, config, { store });
front.start();

