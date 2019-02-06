/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint react/display-name: 0 */
import React from "react";
import Front from "zoapp-front/dist/front";
import AdminManager from "zoapp-front/dist/containers/adminManager";
import DrawerFooter from "zoapp-front/dist/containers/drawerFooter";
import Settings from "zoapp-front/dist/containers/settings";
import Zrmc from "zrmc";
import Team from "zoapp-front/dist/containers/admin/team";
import Advanced from "zoapp-front/dist/containers/admin/advanced";
import CreateAssistant from "./containers/createAssistant";
import About from "./containers/about";
import Home from "./containers/home";
import Factory from "./containers/factory";
import PublishContainer from "./containers/publishContainer";
import configureStore from "./store";
import PublishDialog from "./containers/dialogs/publishDialog";
import { defaultTemplates, defaultLanguages } from "./reducers/app";
// eslint-disable-next-line import/no-unresolved
import config from "../../config/default.json";

let store = null;
const handlePublishBot = () => {
  const dialog = React.createElement(PublishDialog, { open: true, store });
  Zrmc.showDialog(dialog);
};

const appProps = {
  name: "Opla",
  subname: "CE",
  version: "0.1.0",
  icon: "images/opla-avatar.png",
  instance: {
    name: "Dev",
    color: "#f05545",
    description: "A warning message",
  },
  design: {
    minTitleName: true,
    toolbar: {
      theme: "white",
    },
    drawer: {
      type: "temporary",
      themeDark: true,
      header: { href: "/" },
      renderFooter: (props) => <DrawerFooter {...props} />,
    },
  },
  templates: defaultTemplates,
  languages: defaultLanguages,
  screens: [
    {
      id: "1",
      name: "Root",
      access: "auth",
      path: "/",
      render: (props) => <Home {...props} />,
    },
    {
      id: "2",
      isDrawerItem: true,
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
        </svg>
      ),
      name: "Factory",
      path: "/factory",
      access: "auth",
      panels: ["Dashboard", "Builder", "Analytics", "Extensions"],
      toolbox: [
        {
          title: "Publish",
          onAction: handlePublishBot,
          color: "var(--mdc-theme-text-primary-on-primary,#fff)",
          backgroundColor: "var(--mdc-theme-primary,#6200ee)",
        },
      ],
      render: (props) => <Factory {...props} />,
    },
    {
      id: "3",
      isDrawerItem: true,
      icon: "settings",
      name: "Admin",
      path: "/admin",
      access: "auth",
      panels: ["Team", "Advanced"],
      render: (props) => (
        <AdminManager
          tabs={[<Team key="team" />, <Advanced key="advanced" />]}
          {...props}
        />
      ),
    },
    {
      id: "4",
      name: "Create an assistant",
      path: "/create",
      access: "auth",
      signUp: true,
      render: (props) => <CreateAssistant {...props} />,
    },
    {
      id: "5",
      icon: "home",
      name: "Home",
      path: "*",
      access: "public",
      render: (props) => <Home {...props} />,
    },
    {
      id: "6",
      isDrawerItem: true,
      name: "Documentation",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M21,5C19.89,4.65 18.67,4.5 17.5,4.5C15.55,4.5 13.45,4.9 12,6C10.55,4.9 8.45,4.5 6.5,4.5C4.55,4.5 2.45,4.9 1,6V20.65C1,20.9 1.25,21.15 1.5,21.15C1.6,21.15 1.65,21.1 1.75,21.1C3.1,20.45 5.05,20 6.5,20C8.45,20 10.55,20.4 12,21.5C13.35,20.65 15.8,20 17.5,20C19.15,20 20.85,20.3 22.25,21.05C22.35,21.1 22.4,21.1 22.5,21.1C22.75,21.1 23,20.85 23,20.6V6C22.4,5.55 21.75,5.25 21,5M21,18.5C19.9,18.15 18.7,18 17.5,18C15.8,18 13.35,18.65 12,19.5V8C13.35,7.15 15.8,6.5 17.5,6.5C18.7,6.5 19.9,6.65 21,7V18.5Z" />
        </svg>
      ),
      href: "https://opla.github.io/docs/",
      access: "all",
    },
    {
      id: "7",
      isDrawerItem: true,
      name: "Community chat",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M17,12V3A1,1 0 0,0 16,2H3A1,1 0 0,0 2,3V17L6,13H16A1,1 0 0,0 17,12M21,6H19V15H6V17A1,1 0 0,0 7,18H18L22,22V7A1,1 0 0,0 21,6Z" />
        </svg>
      ),
      href: "https://gitter.im/Opla/Community",
      access: "all",
    },
    {
      id: "8",
      isDrawerItem: true,
      name: "Issues reporting",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M20.38,8.53C20.54,8.13 21.06,6.54 20.21,4.39C20.21,4.39 18.9,4 15.91,6C14.66,5.67 13.33,5.62 12,5.62C10.68,5.62 9.34,5.67 8.09,6C5.1,3.97 3.79,4.39 3.79,4.39C2.94,6.54 3.46,8.13 3.63,8.53C2.61,9.62 2,11 2,12.72C2,19.16 6.16,20.61 12,20.61C17.79,20.61 22,19.16 22,12.72C22,11 21.39,9.62 20.38,8.53M12,19.38C7.88,19.38 4.53,19.19 4.53,15.19C4.53,14.24 5,13.34 5.8,12.61C7.14,11.38 9.43,12.03 12,12.03C14.59,12.03 16.85,11.38 18.2,12.61C19,13.34 19.5,14.23 19.5,15.19C19.5,19.18 16.13,19.38 12,19.38M8.86,13.12C8.04,13.12 7.36,14.12 7.36,15.34C7.36,16.57 8.04,17.58 8.86,17.58C9.69,17.58 10.36,16.58 10.36,15.34C10.36,14.11 9.69,13.12 8.86,13.12M15.14,13.12C14.31,13.12 13.64,14.11 13.64,15.34C13.64,16.58 14.31,17.58 15.14,17.58C15.96,17.58 16.64,16.58 16.64,15.34C16.64,14.11 16,13.12 15.14,13.12Z" />
        </svg>
      ),
      href: "https://github.com/Opla/opla/issues",
      access: "all",
    },
    {
      id: "9",
      isDrawerItem: true,
      name: "About",
      title: "About Opla",
      icon: "info",
      path: "/about",
      access: "all",
      render: (props) => <About {...props} />,
    },
    {
      id: "10",
      isDrawerItem: false,
      name: "Webchat",
      path: "/publish/:name",
      access: "all",
      isFullscreen: true,
      render: (props) => <PublishContainer {...props} />,
    },
    {
      id: "11",
      icon: "settings",
      name: "Settings",
      access: "auth",
      path: "/settings",
      render: (props) => <Settings {...props} />,
    },
  ],
};

export default class Opla {
  constructor() {
    /* eslint-disable no-undef */
    const env = process.env.APP;
    /* eslint-enable no-undef */
    store = configureStore();
    this.front = new Front("app", appProps, config, env, { store });
  }

  restart() {
    this.front.restart();
  }

  start() {
    this.front.start();
  }
}
