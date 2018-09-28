/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import FBMessengerPlugin from "./fb-messenger";
import WebChatPlugin from "./webchat-connector";
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
  callback(new WebChatPlugin(manager));
  callback(new SlackPlugin(manager));
  callback(new WPPlugin(manager));
  callback(new SMSPlugin(manager));
  callback(new TwitterPlugin(manager));
  callback(new EmailPlugin(manager));
  callback(new SkypePlugin(manager));
  callback(new TelegramPlugin(manager));

  callback(
    new DummyPlugin(manager, {
      name: "opennlx",
      title: "Open NLX",
      type: "AIProvider",
      icon: "images/opla-logo.png",
    }),
  );
  callback(new OplaAIPlugin(manager));
  callback(
    new DummyPlugin(manager, {
      name: "rasa-nlu",
      title: "RASA NLU",
      type: "AIProvider",
      icon: "images/rasa.png",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "api-ai",
      title: "DialogFlow",
      icon: "images/dialogflow.png",
      type: "AIProvider",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "wit-ai",
      title: "Wit.AI",
      type: "AIProvider",
      icon: "images/wit-ai.png",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "lex-ai",
      title: "Amazon Lex",
      type: "AIProvider",
      icon: "images/amazon-alexa.svg",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "luis-ai",
      title: "Microsoft Luis",
      type: "AIProvider",
      icon: "images/ms-luis.png",
    }),
  );

  callback(
    new DummyPlugin(manager, {
      name: "gdoc-plugins",
      title: "Google Docs",
      icon: "images/google.svg",
      type: "WebServices",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "zapier-plugins",
      title: "Zapier",
      type: "WebServices",
      icon: "images/zapier.png",
    }),
  );
  callback(
    new DummyPlugin(manager, {
      name: "ifttt-plugin",
      title: "IFTTT",
      type: "WebServices",
      icon: "images/iftt.png",
    }),
  );
};
