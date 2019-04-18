/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Controller } from "zoapp-backend";

export default class extends Controller {
  static serializeVariables(variables) {
    return variables.reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[`${v.scope}.${v.name}`] = v.value;
      return a;
    }, {});
  }

  getParametersController() {
    return this.main.getParameters();
  }

  async getVariables(name, parameters = this.getParametersController()) {
    return parameters.getValue(name, "conversationContext");
  }

  async setVariables(name, value, parameters = this.getParametersController()) {
    return parameters.setValue(name, value, "conversationContext");
  }

  async appendVariables(
    name,
    value,
    parameters = this.getParametersController(),
  ) {
    // const variables = await this.getParameters(name, parameters);
    // TODO
    return parameters.setValue(name, value, "conversationContext");
  }

  async deleteVariables(name, parameters = this.getParametersController()) {
    return parameters.deleteValue(name, "conversationContext");
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
