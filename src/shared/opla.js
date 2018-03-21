/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint react/display-name: 0 */
import React from "react";
import Front from "zoapp-front/front";
import Screen from "zoapp-front/containers/screen";
import Home from "OplaContainers/home";
import CreateAssistant from "OplaContainers/createAssistant";
import AdminManager from "OplaContainers/adminManager";
import BotManager from "OplaContainers/botManager";
import configureStore from "OplaLibs/store";
import Zrmc from "zrmc";
import PublishDialog from "OplaContainers/dialogs/publishDialog";
// eslint-disable-next-line import/no-unresolved
import config from "../../config/default.json";

let store = null;
const handleOpenPublishDialog = () => {
  const dialog = React.createElement(PublishDialog, { open: true, store });
  Zrmc.showDialog(dialog);
};

const app = {
  name: "Opla CE",
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
      isDrawerItem: true,
      icon: "dashboard",
      name: "Dashboard",
      access: "auth",
      path: "/",
      render: (props) => <Home {...props} />,
    },
    {
      id: "2",
      isDrawerItem: true,
      icon: "build",
      name: "Builder",
      path: "/builder",
      access: "auth",
      panels: ["Intents", "Entities", "Flow"],
      toolbox: [{ title: "Publish", onAction: handleOpenPublishDialog }],
      render: (props) => <BotManager {...props} />,
    },
    {
      id: "3",
      isDrawerItem: true,
      icon: "settings",
      name: "Admin",
      path: "/admin",
      access: "auth",
      panels: ["General", "Extensions", "Users", "Advanced"],
      render: (props) => <AdminManager {...props} />,
    },
    {
      id: "4",
      name: "Create Assistant",
      path: "/create",
      access: "public",
      render: (props) => <CreateAssistant {...props} />,
    },
    {
      id: "5",
      isDrawerItem: true,
      icon: "home",
      name: "Home",
      path: "*",
      access: "public",
      render: (props) => <Home {...props} />,
    },
    {
      id: "6",
      isDrawerItem: true,
      name: "Help",
      icon: "help",
      path: "/help",
      access: "all",
      render: (props) => React.createElement(Screen, props, "Help"),
    },
  ],
};

export default class Opla {
  constructor() {
    store = configureStore({ app });
    this.front = new Front("app", app, config, { store });
  }

  restart() {
    this.front.restart();
  }

  start() {
    this.front.start();
  }
}
