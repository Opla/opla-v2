/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Controller } from "zoapp-backend";

export default class Contexts extends Controller {
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

  async setVariables(
    name,
    variables,
    needDispatch = true,
    parameters = this.getParametersController(),
  ) {
    if (needDispatch) {
      await this.dispatch(this.className, {
        action: "setVariables",
        name,
        variables,
      });
    }
    return parameters.setValue(name, variables, "conversationContext");
  }

  async appendVariables(
    name,
    vars,
    needDispatch = true,
    parameters = this.getParametersController(),
  ) {
    const variables = await this.getParameters(name, parameters);
    const names = Object.keys(vars);
    //  merge variables+vars
    names.forEach((n) => {
      variables[n] = vars[n];
    });
    return this.setVariables(name, variables, needDispatch, parameters);
  }

  async deleteVariables(name, parameters = this.getParametersController()) {
    return parameters.deleteValue(name, "conversationContext");
  }

  async initLocalContext(conversation, bot, messenger) {
    const localVariables = await this.main.getBots().getLocalVariables(bot.id);
    const variables = localVariables || {};
    // TODO merge context
    return Contexts.resetLocalContext(conversation, bot, messenger, variables);
  }

  static async resetLocalContext(conversationOrId, bot, messenger, vars) {
    const variables = vars || {};
    const conversationId = conversationOrId.id || conversationOrId;
    if (!variables.userprofile) {
      if (messenger && conversationOrId) {
        const user = await messenger.getConversationUser(
          conversationOrId,
          conversationOrId.author,
        );
        if (user && user.username) {
          variables["userprofile.username"] = user.username;
          variables["userprofile.id"] = user.id;
        }
      }
    }
    variables["bot.name"] = bot.name;
    variables["bot.id"] = bot.id;
    variables["conversation.id"] = conversationId;
    variables["platform.name"] = messenger.name;
    variables["platform.channel"] = messenger.channel;
    variables["platform.service"] = messenger.service;
    // TODO attributes
    return { variables };
  }
}
