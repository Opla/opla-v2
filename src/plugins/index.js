/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import FBMessengerPlugin from "./fb-messenger";
import ExternalAppPlugin from "./app-connector";
import WPPlugin from "./wp-connector";
import SlackPlugin from "./slack-connector";
import SMSPlugin from "./sms-connector";
import TwitterPlugin from "./twitter-connector";
import EmailPlugin from "./email-connector";
import SkypePlugin from "./skype-connector";
import TelegramPlugin from "./telegram-connector";

import OplaAIPlugin from "./opla-ai";

import DummyPlugin from "./dummy-plugin";

export default (manager, callback) => {
  // TODO dynamic importing plugins
  callback(new FBMessengerPlugin(manager, { appId: "1908982232707706" }));
  callback(new ExternalAppPlugin(manager));
  callback(new SlackPlugin(manager));
  callback(new WPPlugin(manager));
  callback(new SMSPlugin(manager));
  callback(new TwitterPlugin(manager));
  callback(new EmailPlugin(manager));
  callback(new SkypePlugin(manager));
  callback(new TelegramPlugin(manager));

  callback(new OplaAIPlugin(manager));
  callback(
    new DummyPlugin(manager, {
      name: "simple-nlu",
      title: "Simple NLU",
      type: "AIProvider",
      icon: "images/robot2.svg",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "rasa-nlu",
      title: "RASA NLU",
      type: "AIProvider",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "watson-ai",
      title: "Watson AI",
      type: "AIProvider",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "wit-ai",
      title: "Wit.AI",
      type: "AIProvider",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "api-ai",
      title: "Api.AI",
      type: "AIProvider",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "lex-ai",
      title: "Amazon Lex",
      type: "AIProvider",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "luis-ai",
      title: "MS Luis",
      type: "AIProvider",
    }),
  );

  callback(
    new DummyPlugin(manager, {
      name: "gdoc-plugins",
      title: "Google Docs",
      type: "WebServices",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "msoffice-plugins",
      title: "MS Office",
      type: "WebServices",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "salesforce-plugins",
      title: "Salesforce",
      type: "WebServices",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "ifttt-plugin",
      title: "IFTTT",
      type: "WebServices",
    }),
  );
};
