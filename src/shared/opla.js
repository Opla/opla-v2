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
import PublishContainer from "OplaContainers/publishContainer";
import configureStore from "OplaLibs/store";
import DrawerFooter from "OplaContainers/drawerFooter";
import Zrmc, { Inner, Cell, Button } from "zrmc";
import PublishDialog from "OplaContainers/dialogs/publishDialog";
import { defaultTemplates, defaultLanguages } from "OplaLibs/reducers/app";
import Extension from "OplaContainers/admin/extensions";
import GeneralAdmin from "OplaContainers/admin/generalAdmin";
import Users from "OplaContainers/admin/users";
import Advanced from "OplaContainers/admin/advanced";
import { infoStyleD } from "OplaContainers/admin/styles";
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
      render: (props) => (
        <AdminManager
          tabs={[
            <GeneralAdmin key="general" />,
            <Extension key="extension" />,
            <Users key="users" />,
            <Advanced key="advanced">
              <Inner>
                <Cell className="mdl-color--white" span={12}>
                  <div style={infoStyleD}>
                    <span style={{ color: "#d50000" }}>
                      Delete this assistant
                    </span>
                    <Button
                      raised
                      style={{
                        float: "right",
                        marginBottom: "24px",
                        backgroundColor: "#d50000",
                      }}
                    >
                      DELETE
                    </Button>
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
      path: "/documentation",
      access: "all",
      render: (props) => React.createElement(Screen, props, "Documentation"),
    },
    {
      id: "7",
      isDrawerItem: true,
      name: "Support",
      icon: "help",
      path: "/support",
      access: "all",
      render: (props) => React.createElement(Screen, props, "Support"),
    },
    {
      id: "7",
      isDrawerItem: false,
      name: "chatbot",
      path: "/publish/:name",
      access: "all",
      render: (props) => <PublishContainer {...props} />,
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
