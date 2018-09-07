/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint react/display-name: 0 */
import React from "react";
import Front from "zoapp-front/src/shared/front";
import About from "OplaContainers/about";
import Home from "OplaContainers/home";
import CreateAssistant from "OplaContainers/createAssistant";
import AdminManager from "zoapp-front/src/shared/containers/adminManager";
import AgentManager from "OplaContainers/agentManager";
import PublishContainer from "OplaContainers/publishContainer";
import configureStore from "OplaLibs/store";
import DrawerFooter from "zoapp-front/src/shared/containers/drawerFooter";
import Zrmc, { Inner, Cell, Button } from "zrmc";
import PublishDialog from "OplaContainers/dialogs/publishDialog";
import { defaultTemplates, defaultLanguages } from "OplaLibs/reducers/app";
import Extension from "OplaContainers/admin/extensions";
import GeneralAdmin from "OplaContainers/admin/generalAdmin";
import Users from "zoapp-front/src/shared/containers/admin/users";
import Advanced from "zoapp-front/src/shared/containers/admin/advanced";
// eslint-disable-next-line import/no-unresolved
import config from "../../config/default.json";

let store = null;
const handleOpenPublishDialog = () => {
  const dialog = React.createElement(PublishDialog, { open: true, store });
  Zrmc.showDialog(dialog);
};

const appProps = {
  name: "Opla",
  subname: "CE",
  version: "0.1.0",
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
      renderFooter: (props) => <DrawerFooter {...props} />,
    },
  },
  templates: defaultTemplates,
  languages: defaultLanguages,
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
      toolbox: [
        {
          title: "Publish",
          onAction: handleOpenPublishDialog,
          color: "var(--mdc-theme-text-primary-on-primary,#fff)",
          backgroundColor: "var(--mdc-theme-primary,#6200ee)",
        },
      ],
      render: (props) => <AgentManager {...props} />,
    },
    {
      id: "3",
      isDrawerItem: true,
      icon: "settings",
      name: "Admin",
      path: "/admin",
      access: "auth",
      panels: ["General", "Extensions", "Users", "Advanced"],
      render: (props) => (
        <AdminManager
          tabs={[
            <GeneralAdmin key="general" />,
            <Extension key="extension" />,
            <Users key="users" />,
            <Advanced key="advanced">
              <Inner>
                <Cell className="zui-color--white" span={12}>
                  <div className="zap-panel">
                    <div className="zap-panel_title">
                      <span style={{ color: "#b71c1c" }}>
                        Delete this assistant
                      </span>
                      <Button
                        raised
                        style={{
                          backgroundColor: "#b71c1c",
                        }}
                      >
                        DELETE
                      </Button>
                    </div>
                  </div>
                  <div />
                </Cell>
              </Inner>
            </Advanced>,
          ]}
          {...props}
        />
      ),
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
      name: "Documentation",
      icon: "book",
      href: "https://opla.github.io/docs/",
      access: "all",
    },
    {
      id: "7",
      isDrawerItem: true,
      name: "Community chat",
      icon: "chat",
      href: "https://gitter.im/Opla/Community",
      access: "all",
    },
    {
      id: "8",
      isDrawerItem: true,
      name: "Issues",
      icon: "bug_report",
      href: "https://github.com/Opla/opla/issues",
      access: "all",
    },
    {
      id: "9",
      isDrawerItem: true,
      name: "About Opla",
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
