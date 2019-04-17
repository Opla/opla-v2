/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Controller } from "zoapp-backend";

export default class extends Controller {
  constructor(name, main, className) {
    super(name, main, className);
    this.parameters = main.getParameters();
  }

  static serializeVariables(variables) {
    return variables.reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[`${v.scope}.${v.name}`] = v.value;
      return a;
    }, {});
  }

  async setParameters(name, value) {
    return this.parameters.setValue(name, value, "conversationContext");
  }

  async getParameters(name) {
    return this.parameters.getValue(name, "conversationContext");
  }

  async deleteParameters(name) {
    return this.parameters.deleteValue(name, "conversationContext");
  }

  async init(conversation, botId, messenger) {
    const localVariables = await this.main.getBots().getLocalVariables(botId);
    const contextParams = localVariables || {};
    if (!contextParams.userprofile) {
      if (messenger && conversation) {
        const user = await messenger.getConversationUser(
          conversation.conversationId,
          conversation.author,
        );
        if (user && user.username) {
          contextParams["userprofile.username"] = user.username;
        }
      }
    }
    return contextParams;
  }
}
