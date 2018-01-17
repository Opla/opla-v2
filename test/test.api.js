import { setupLogger } from "zoapp-core";
import chai from "chai";
import chaiHttp from "chai-http";
import App from "../src/app";

const { expect } = chai;

chai.use(chaiHttp);

setupLogger("test");

const mysqlConfig = {
  // Global Database
  name: "Opla.ai test",
  version: "0.8.0",
  global: {
    database: {
      datatype: "mysql",
      host: "localhost",
      name: "opla_test",
      user: "root",
      charset: "utf8mb4",
      version: "2",
    },
    api: {
      endpoint: "/api",
      version: "1",
      port: 8081,
    },
  },
  messenger: {
    database: {
      parent: "global",
      name: "messenger",
    },
  },
  bots: {
    database: {
      parent: "global",
      name: "bots",
    },
  },
};

// init : create app / users / auth / token
const initService = async (ctx, params, commons) => {
  const context = ctx;
  let config = {};
  if (params.config) {
    ({ config } = params);
  } else if (commons.config) {
    ({ config } = commons);
  }
  // logger.info("config=", config);
  const app = App(config).zoapp;
  await app.database.reset();
  await app.start();
  context.app = app;
  context.server = app.server.server;
  logger.info("initService with", params.title);
  context.title = params.title;
  const password = params.password ? params.password : commons.password;
  let r = await app.authServer.registerApplication({
    name: "Opla",
    grant_type: "password",
    redirect_uri: "localhost",
    email: "toto@test.com",
  });
  context.application = r.result;
  r = await app.authServer.registerUser({
    client_id: context.application.client_id,
    username: "user1",
    password: "12345",
    email: "user1@test.com",
  });
  context.user1 = r.result;
  r = await app.authServer.authorizeAccess({
    client_id: context.application.client_id,
    username: context.user1.username,
    password,
    redirect_uri: "localhost",
    scope: "admin",
  });
  r = await app.authServer.requestAccessToken({
    client_id: context.application.client_id,
    username: context.user1.username,
    password,
    redirect_uri: "localhost",
    grant_type: "password",
  });
  context.authUser1 = r.result;

  context.endpoint = app.endpoint;
  // logger.info(`app=${JSON.stringify(context.application)}`);
  // logger.info(`user1=${JSON.stringify(context.user1)}`);
  // logger.info(`authUser1=${JSON.stringify(context.authUser1)}`);
  return context;
};

const buildUrl = (context, route, token = null) => {
  // logger.info("context=", context);
  let url = context.endpoint + route;
  logger.info(url);
  if (token) {
    url += `?access_token=${token}`;
  }
  return url;
};

const result = (res, callback = null) => {
  expect(res).to.have.header("content-type", /json/);
  expect(res).to.have.status(200);
  /* eslint-disable no-unused-expressions */
  expect(res).to.be.json;
  /* eslint-enable no-unused-expressions */
  if (callback) {
    callback(res.body);
    return null;
  }
  return res.body;
};

const getAsync = async (context, route, token = null) => {
  const res = await chai
    .request(context.server)
    .get(buildUrl(context, route, token))
    .set("Accept", "application/json");
  return result(res);
};

const postAsync = async (context, route, token, body) => {
  const cid = context.application.client_id || "";
  const res = await chai
    .request(context.server)
    .post(buildUrl(context, route, token))
    .set("Accept", "application/json")
    .set("client_id", cid)
    .send(body);
  return result(res);
};

const putAsync = async (context, route, token, body) => {
  const res = await chai
    .request(context.server)
    .put(buildUrl(context, route, token))
    .set("Accept", "application/json")
    .send(body);
  return result(res);
};

const deleteAsync = async (context, route, token) => {
  const res = await chai
    .request(context.server)
    .delete(buildUrl(context, route, token))
    .set("Accept", "application/json");
  return result(res);
};

const describeParams = (name, datasets, commonDatasets, func) => {
  datasets.forEach((params) => {
    describe(`${name} using ${params.title}`, () => func(params, commonDatasets));
  });
};

let context = null;

describeParams("API", [{ title: "MemDataset" }, { title: "MySQLDataset", config: mysqlConfig }], { password: "12345" }, (params, commons) => {
  before(async () => {
    context = await initService({}, params, commons);
  });

  after(async () => {
    await context.app.database.delete();
    await context.app.close();
  });

  describe("/", () => {
    it("should return send infos on / GET", async () => {
      const res = await getAsync(context, "/");
      expect(res).to.have.all.keys(["version", "name"]);
    });
    it("should ping on /ping GET", async () => {
      const res = await getAsync(context, "/ping");
      expect(res).to.have.all.keys(["ping"]);
      // logger.info("context=", JSON.stringify(context));
    });
  });


  describe("/users", () => {
    it("should get currentUser on /me GET", async () => {
      context.userProfile1 = await getAsync(context, "/me", context.authUser1.access_token);
      // WIP
      expect(context.userProfile1).to.have.all.keys(["id", "username", "avatar", "email"]);
    });
    it("should list users on /users GET"); // TODO
    it("should get a SINGLE user on /users/:id GET", async () => {
      const res = await getAsync(
        context, `/users/${context.userProfile1.id}`,
        context.authUser1.access_token,
      );
      // WIP
      expect(res).to.have.all.keys(["id", "username", "avatar", "email"]);
    });
    it("should create a SINGLE user on /users POST"); // TODO
    it("should update a SINGLE user on /users/<id> PUT"); // TODO
    it("should delete a SINGLE user on /users/<id> DELETE"); // TODO
  });

  describe("/conversations", () => {
    it("should list all conversations linked to session's user on /conversations GET", async () => {
      const res = await getAsync(context, "/conversations", context.authUser1.access_token);
      // WIP
      expect(res).to.be.an("array");
    });

    it("should create a SINGLE conversation on /conversations POST", async () => {
      context.conversation = await postAsync(
        context,
        "/conversations",
        context.authUser1.access_token,
        { participants: ["user2"] },
      );
      // WIP
      expect(context.conversation).to.have.all.keys([
        "id",
        "created_time",
        "author",
        "participants",
      ]);
    });
    it("should get a SINGLE conversation on /conversations/:id GET", async () => {
      const res = await getAsync(
        context,
        `/conversations/${context.conversation.id}`,
        context.authUser1.access_token,
      );
      expect(res).to.have.all.keys([
        "id",
        "created_time",
        "author",
        "participants",
      ]);
    });
    // it("should update a SINGLE conversation on /conversations/<id> PUT");
    // it("should delete a SINGLE conversation on /conversations/<id> DELETE");
    it("should get a all conversation's messages on /conversations/:id/messages GET", async () => {
      const res = await getAsync(
        context,
        `/conversations/${context.conversation.id}/messages`,
        context.authUser1.access_token,
      );
      // WIP
      expect(res).to.be.an("array");
    });
    it("should create a new message on /conversations/:id/messages POST", async () => {
      const res = await postAsync(
        context,
        `/conversations/${context.conversation.id}/messages`,
        context.authUser1.access_token,
        { body: "hello" },
      );
      // WIP
      expect(res).to.have.all.keys([
        "id",
        "conversationId",
        "created_time",
        "from",
        "body",
        "timestamp",
      ]);
    });
  });

  describe("/admin", () => {
    it("should get admin infos /admin GET");
  });

  describe("/bots", () => {
    // it("should list all bots linked to session's user on /bots GET");
    // it("should get a SINGLE bot on /bots/:id GET");
    it("should create a SINGLE bot authentified on /bots POST", async () => {
      context.bot1 = await postAsync(
        context,
        "/bots",
        context.authUser1.access_token,
        {
          name: "bot",
          username: "user1",
          password: "12345",
          email: "user1@test.com",
        },
      );
      // WIP
      expect(context.bot1).to.have.all.keys(["id", "creation_date", "name", "author", "email"]);
    });
    it("should create a SINGLE bot non authentified on /bots POST", async () => {
      const res = await postAsync(
        context,
        "/bots",
        null,
        {
          name: "bot",
          username: "user3",
          password: "12345",
          email: "user3@test.com",
        },
      );
      // WIP
      expect(res).to.have.all.keys(["id", "creation_date", "name", "author", "email"]);
    });
    // it("should update a SINGLE bot on /bots/<id> PUT");
    // it("should delete a SINGLE bot on /bots/<id> DELETE");
    it("should get a all bot's intents on /bots/:id/intents GET", async () => {
      const res = await getAsync(
        context, `/bots/${context.bot1.id}/intents`,
        context.authUser1.access_token,
      );
      // WIP
      expect(res).to.have.all.keys([
        "intents",
      ]);
      expect(res.intents).to.be.an("array");
    });
    it("should publish bot's intents on /bots/:id/intents/publish POST");
    it("should create bot's first intent on /bots/:id/intents POST", async () => {
      const res = await postAsync(
        context,
        `/bots/${context.bot1.id}/intents`,
        context.authUser1.access_token,
        { name: "hello", input: ["hello"], output: ["hello"] },
      );
      // WIP
      expect(res).to.have.all.keys([
        "id",
        "botId",
        "name",
        "input",
        "output",
      ]);
      context.intent1 = { ...res };
      // logger.info(`intentId=${context.intent1.id}`);
      context.intent1id = context.intent1.id;
    });
    it("should create bot's another intent on /bots/:id/intents POST", async () => {
      const res = await postAsync(
        context,
        `/bots/${context.bot1.id}/intents`,
        context.authUser1.access_token,
        { name: "what", input: ["what"], output: ["what"] },
      );
      // WIP
      expect(res).to.have.all.keys([
        "id",
        "botId",
        "name",
        "input",
        "output",
      ]);
    });
    it("should update bot's intents on /bots/:id/intents PUT", async () => {
      const res = await putAsync(
        context,
        `/bots/${context.bot1.id}/intents`,
        context.authUser1.access_token,
        [
          {
            id: context.intent1.id,
            botId: context.intent1.botId,
            name: "hello",
            input: ["hello", "hi"],
            output: ["hello"],
          },
        ],
      );
      // WIP
      expect(res).to.have.all.keys([
        "intents",
      ]);
      expect(res.intents).to.be.an("array");
    });
    it("should update SINGLE bot's intent on /bots/:id/intents/:intentId PUT", async () => {
      const res = await putAsync(
        context,
        `/bots/${context.bot1.id}/intents/${context.intent1id}/`,
        context.authUser1.access_token,
        {
          id: context.intent1id,
          botId: context.intent1.botId,
          name: "hello",
          input: ["hello", "hi"],
          output: ["hello"],
        },
      );
      // WIP
      expect(res).to.have.all.keys([
        "id",
        "botId",
        "name",
        "input",
        "output",
      ]);
    });
    /*
    it("should move bot's intent from 0 to 2 on /bots/:id/intents/:intentId/move PUT", async () => {
      const res = await putAsync(
        context,
        `/bots/${context.bot1.id}/intents/${context.intent1id}/move`,
        context.authUser1.access_token,
        { fromIndex: 0, toIndex: 2 },
      );
      // WIP
      expect(res).to.have.all.keys(["id", "botId", "fromIndex", "toIndex"]);
    });
    it("should move bot's intent from 2 to 0 on /bots/:id/intents/:intentId/move PUT", async () => {
      const res = await putAsync(
        context,
        `/bots/${context.bot1.id}/intents/${context.intent1id}/move`,
        context.authUser1.access_token,
        { fromIndex: 2, toIndex: 0 },
      );
      // WIP
      expect(res).to.have.all.keys(["id", "botId", "fromIndex", "toIndex"]);
    }); */

    it("should delete bot's intent on /bots/:id/intents/:intentId DELETE", async () => {
      const res = await deleteAsync(
        context,
        `/bots/${context.bot1.id}/intents/${context.intent1id}`,
        context.authUser1.access_token,
      );
      // WIP
      // logger.info(`intent.id=${intent1.id}`);
      expect(res).to.have.all.keys(["id", "ok"]);
    });

    describe("/bots/sandbox", () => {
      it("should get all bot's sandbox messages on /bots/:id/sandbox/messages GET", async () => {
        const res = await getAsync(
          context, `/bots/${context.bot1.id}/sandbox/messages`,
          context.authUser1.access_token,
        );
        // WIP
        expect(res).to.be.an("array");
        [context.botconversation] = res;
      });
      it("shouldcreate new message in bot's sandbox on /bots/:id/sandbox/messagesPOST", async () => {
        const res = await postAsync(
          context,
          `/bots/${context.bot1.id}/sandbox/messages/${context.botconversation.id}`,
          context.authUser1.access_token,
          { body: "hello" },
        );
          // WIP
        expect(res).to.have.all.keys([
          "id",
          "conversationId",
          "created_time",
          "timestamp",
          "from",
          "body",
        ]);
      });
      it("should get context of bot's sandbox on /bots/:id/sandbox/context GET");
      it("should delete context of bot's sandbox on /bots/:id/sandbox DELETE", async () => {
        const res = await deleteAsync(
          context,
          `/bots/${context.bot1.id}/sandbox`,
          context.authUser1.access_token,
        );
        // WIP
        expect(res).to.have.all.keys(["result"]);
      });
    });
  });

  /* describe("/webhooks", () => {
    it("should register webhook /webhooks POST", async () => {
      context.webhook = await postAsync(
          context,
          "/webhooks",
          context.authUser1.access_token,
          { path: "/oplabot", url: "http://127.0.0.1:8889", name: "OplaBot", secret: "boing14", actions: "messenger,bot" },
          );
      // WIP
      expect(context.webhook).to.have.all.keys([
        "id",
        "path",
        "name",
        "secret",
        "actions",
        "url",
      ]);
    });
    it("should unregister webhook /webhooks DELETE", async () => {
      const res = await deleteAsync(
          context,
          `/webhooks/${context.webhook.id}`,
          context.authUser1.access_token);
      // WIP
      expect(res).to.have.all.keys(["result"]);
    });
    it("should test webhook /webhooks/:id/test/:action POST");
  }); */
});
