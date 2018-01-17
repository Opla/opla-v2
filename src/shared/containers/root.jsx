// Deprecated
/* import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import App from "OplaContainers/app";
import Home from "OplaContainers/home";
import ReportsManager from "OplaContainers/reportsManager";
import ConversationsManager from "OplaContainers/conversationsManager";
import CampaignsManager from "OplaContainers/campaignsManager";
import BotManager from "OplaContainers/botManager";
import AdminManager from "OplaContainers/adminManager";
import CreateAssistant from "OplaContainers/createAssistant";
import DemoManager from "OplaContainers/demoManager";

const Root = () =>
  (
    <BrowserRouter>
      <Route component={App}>
        <Route path="/reports" component={ReportsManager} />
        <Route path="/campaigns" component={CampaignsManager} />
        <Route path="/users" component={ConversationsManager} />
        <Route path="/builder" render={props => <BotManager {...props} />} />
        <Route path="/admin" render={props => <AdminManager {...props} />} />
        <Route path="/create" component={CreateAssistant} />
        <Route path="/demo" component={DemoManager} />
        <Route path="*" component={Home} />
      </Route>
    </BrowserRouter>);

export default Root; */
