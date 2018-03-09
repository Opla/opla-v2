/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { CommonRoutes } from "zoapp-backend";
import Importer from "../utils/importer";

export default class extends CommonRoutes {
  constructor(zoapp) {
    super(zoapp.controllers);
    this.extensions = zoapp.extensions;
    // Actually NodeJS doesn't support ES7 arrow binding so we need to bind manually
    this.createBot = this.createBot.bind(this);
    this.updateBot = this.updateBot.bind(this);
    this.getBots = this.getBots.bind(this);
    this.getBot = this.getBot.bind(this);
    this.import = this.import.bind(this);
    this.publish = this.publish.bind(this);
    this.intents = this.intents.bind(this);
    this.newIntent = this.newIntent.bind(this);
    this.updateIntents = this.updateIntents.bind(this);
    this.updateIntent = this.updateIntent.bind(this);
    this.moveIntent = this.moveIntent.bind(this);
    this.removeIntent = this.removeIntent.bind(this);
    this.sandboxMessages = this.sandboxMessages.bind(this);
    this.sandboxNewMessage = this.sandboxNewMessage.bind(this);
    this.sandboxGetContext = this.sandboxGetContext.bind(this);
    this.sandboxReset = this.sandboxReset.bind(this);
  }

  async authorizeAccess(context) {
    const ctx = context;
    ctx.me = await this.access(context);
    let b = true;
    if (ctx.me) {
      const scope = context.getScope();
      ctx.isMaster = scope === "master";
      ctx.isAdmin = ctx.isMaster || scope === "admin";
      let { botId } = context.getParams();
      if (botId && !context.isAdmin) {
        // WIP check if user as access to this bot
        const botUser = await this.extensions.getBots().getUser(botId, ctx.me);
        if (!botUser) {
          b = false;
          botId = null;
        }
      }
      ctx.botId = botId;
    }
    return b;
  }

  async createBotNext(params, owner, scope) {
    // logger.info("createNowBot");
    const { template, ...botParams } = { ...params };
    botParams.author = owner.username;
    botParams.email = owner.email;
    if (botParams.password) {
      delete botParams.password;
    }
    if (botParams.username) {
      delete botParams.username;
    }
    // logger.info("this.extensions");
    const bot = await this.extensions.getBots().setBot(botParams);
    // logger.info("bot=", bot);
    if (!bot.error) {
      // then associate owner to bot
      // logger.info("owner=" + JSON.stringify(owner));
      const r = await this.extensions.getBots().setUser(bot.id, owner, scope);
      // TODO put admin scope in config

      if (template) {
        // logger.info("bot template=" + JSON.stringify(template));
        await Importer.import(template, {}, bot.id, this.extensions.getBots());
      }
      if (r && r.error) {
        return r;
      }
    }
    return bot;
  }

  async createUserBeforeBot(params, clientId, clientSecret) {
    // logger.info("createUserBeforeBot");
    const { username, email, password } = params;
    const resp = await this.controller.signUp(
      {
        username,
        password,
        email,
        client_id: clientId,
      },
      clientId,
    );
    // logger.info("me=" + JSON.stringify(resp));
    if (resp === null || resp.error) {
      return resp === null ? { error: "Can't create user" } : resp;
    }
    // TODO If first user then "admin" otherwise "owner"
    const user = { password, ...resp.result };
    const scope = await this.controller.authorize(
      user,
      clientId,
      clientSecret,
      "owner",
      "admin",
    );
    // TODO Authenticate user using scope
    return this.createBotNext(params, resp.result, scope);
  }

  async createBot(context) {
    // logger.info("createBot");
    const me = await this.access(context);
    // logger.info("createBot", me);
    const clientId =
      context.getQuery().client_id || context.req.get("client_id");
    const clientSecret =
      context.getQuery().client_secret || context.req.get("client_secret");
    const { ...params } = context.getBody();
    // logger.info("createBot", clientId);
    if (me) {
      const scope = context.getScope(context);
      return this.createBotNext(params, me, scope);
    }
    return this.createUserBeforeBot(params, clientId, clientSecret);
  }

  async updateBot(context) {
    const me = await this.access(context);
    const botParams = context.getBody();
    let bot = null;
    if (me) {
      // TODO check if me is author/owner
      bot = await this.extensions.getBots().setBot(botParams);
    }
    return bot === null ? { error: "Can't update bot" } : bot;
  }

  async getBots(context) {
    const me = await this.access(context);
    const scope = context.getScope();
    const isMaster = scope === "master";
    let user = null;
    // Master will get full bot list
    if (!isMaster) {
      user = me;
    }
    const bots = await this.extensions.getBots().getBots(user);
    return bots === null ? [] : { result: bots };
  }

  async getBot(context) {
    const me = await this.access(context);
    const scope = context.getScope();
    const isMaster = scope === "master";
    const isAnonymous = scope === "anonymous";
    const { botId } = context.getParams();
    let userId = me.id;
    if (isMaster || isAnonymous) {
      userId = null;
    }
    let bot = await this.extensions.getBots().getBot(botId, userId);
    // format anonymous bot data
    if (bot && isAnonymous) {
      bot = await this.extensions
        .getBots()
        .getAnonymousBotConversation(me, bot);
    }
    return bot === null ? { error: "Can't find bot" } : { result: bot };
  }

  async import(context) {
    // const me = await this.access(context);
    // const scope = context.getScope();
    // const isMaster = scope === "master";
    const { botId } = context.getParams();
    const body = context.getBody();
    const { data, options } = body;
    // logger.info("Import data", data, options);
    const payload = await Importer.import(
      data,
      options,
      botId,
      this.extensions.getBots(),
    );
    if (payload) {
      // logger.info("import payload=", payload);
      return payload;
    }
    return { error: "doesn't import anything" };
  }

  async publish(context) {
    // logger.info("publish");
    // WIP get intents with version and put them in another version
    // and set them as published linked to a/several messaging platform/s
    const me = await this.access(context);
    const { botId } = context.getParams();
    /* const scope = context.getScope();
    const isAdmin = scope === "master" || scope === "admin"; */
    const { channels } = context.getBody();
    const fromVersion = context.getBody().from;
    const toVersion = context.getBody().to || "pub";
    return this.extensions
      .getBots()
      .publish(botId, me, channels, toVersion, fromVersion);
  }

  async intents(context) {
    // const me = await this.access(context);
    const { botId } = context.getParams();
    // TODO check if me has access to botId
    const versionId = context.getParams().version;
    // const { query } = context.getQuery();
    // logger.info("intents version=", versionId);
    const intents = await this.extensions
      .getBots()
      .getIntents(botId, versionId);
    // logger.info("intents=", intents);
    if (intents) {
      return { intents };
    }
    return { error: "bot's intents not found" };
  }

  async newIntent(context) {
    return this.updateIntent(context);
  }

  async updateIntents(context) {
    // const me = await this.access(context);
    const { botId } = context.getParams();
    // TODO check if me has access to botId
    const versionId = context.getParams().version;
    const params = context.getBody();
    const intents = await this.extensions
      .getBots()
      .setIntents(botId, params, versionId);
    if (intents) {
      return { intents };
    }
    return { error: "can't set bot's intents" };
  }

  async updateIntent(context) {
    // const me = await this.access(context);
    const { botId, version } = context.getParams();
    // TODO check if me has access to botId
    // const intentId = context.getParams().intentId;
    const params = context.getBody();
    const intent = await this.extensions
      .getBots()
      .setIntent(botId, params, version);
    if (intent) {
      return intent;
    }
    return { error: "can't set bot's intent" };
  }

  async moveIntent(context) {
    // const me = await this.access(context);
    const { botId, intentId } = context.getParams();
    // TODO check if me has access to botId
    const { from, to } = context.getBody();

    const payload = await this.extensions
      .getBots()
      .moveIntent(botId, intentId, from, to);

    if (payload) {
      return payload;
    }

    return { error: "can't move bot's intent" };
  }

  async removeIntent(context) {
    // const me = await this.access(context);
    const { botId, intentId } = context.getParams();
    // TODO check if me has access to botId
    // logger.info(`delete intentId=${intentId} botid=${botId}`);
    const payload = await this.extensions
      .getBots()
      .removeIntent(botId, intentId);
    if (payload) {
      return { ok: "intent removed", id: intentId };
    }
    return { error: "can't remove bot's intent" };
  }

  async sandboxMessages(context) {
    const me = await this.access(context);
    const { botId } = context.getParams();
    // TODO check if me has access to botId
    const messenger = this.extensions.getSandboxMessenger();
    return messenger.getFullBotConversations(me, botId);
  }

  async sandboxNewMessage(context) {
    const me = await this.access(context);
    let user = me;
    const isMaster = context.getScope() === "master";
    if (isMaster) {
      user = null;
    }
    const { botId } = context.getParams();
    // TODO check if me has access to botId
    let { conversationId } = context.getParams();
    const messenger = this.extensions.getSandboxMessenger();
    // logger.info(`conversationId=${conversationId} botId=${botId}`);
    if (!conversationId || conversationId === "undefined") {
      const conversation = await messenger.getBotUserConversation(user, botId);
      if (conversation) {
        conversationId = conversation.id;
      }
    }
    const params = context.getBody();
    return messenger.createMessage(user, conversationId, params);
  }

  async sandboxGetContext(context) {
    this.todo = {};
    return {
      todo: `bots.sandboxGetContext route ${context.req.route.path}`,
    };
  }

  async sandboxReset(context) {
    const me = await this.access(context);
    const { botId } = context.getParams();
    const scope = context.getScope();
    const isAdmin = scope === "master" || scope === "admin";
    // TODO check if me has access to botId
    const messenger = this.extensions.getSandboxMessenger();
    await messenger.resetConversations(me, botId, isAdmin);
    return { result: "ok" };
  }
}
