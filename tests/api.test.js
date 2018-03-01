/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import request from "supertest";
import App from "opla-backend/app";

const mysqlConfig = {
  // Global Database
  name: "Opla.ai test",
  version: "0.8.0",
  global: {
    database: {
      datatype: "mysql",
      host: "127.0.0.1",
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

  const app = App(config).zoapp;
  await app.database.reset();
  await app.start();
  context.app = app;
  context.server = app.server.server;

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

  return context;
};

const buildUrl = (context, route, token = null) => {
  let url = context.endpoint + route;

  if (token) {
    url += `?access_token=${token}`;
  }

  return url;
};

const result = (res, callback = null) => {
  expect(res.statusCode).toEqual(200);
  expect(res.header["content-type"]).toMatch(/json/);

  if (callback) {
    callback(res.body);

    return null;
  }

  return res.body;
};

const getAsync = async (context, route, token = null) => {
  const res = await request(context.server)
    .get(buildUrl(context, route, token))
    .set("Accept", "application/json");
  return result(res);
};

const postAsync = async (context, route, token, body) => {
  const cid = context.application.client_id || "";
  const res = await request(context.server)
    .post(buildUrl(context, route, token))
    .set("Accept", "application/json")
    .set("client_id", cid)
    .send(body);
  return result(res);
};

const putAsync = async (context, route, token, body) => {
  const res = await request(context.server)
    .put(buildUrl(context, route, token))
    .set("Accept", "application/json")
    .send(body);
  return result(res);
};

const deleteAsync = async (context, route, token) => {
  const res = await request(context.server)
    .delete(buildUrl(context, route, token))
    .set("Accept", "application/json");
  return result(res);
};

const describeParams = (name, datasets, commonDatasets, func) => {
  datasets.forEach((params) => {
    describe(`${name} using ${params.title}`, () =>
      func(params, commonDatasets));
  });
};

const context = null;

describe("API", () => {
  // we run the same test suite for different datasets.
  const datasets = [
    { title: "MemDataset" },
    { title: "MySQLDataset", config: mysqlConfig },
  ];

  datasets.forEach((params) => {
    describe(`with ${params.title}`, () => {
      const commons = { password: "12345" };

      let context;

      beforeAll(async () => {
        context = await initService({}, params, commons);
      });

      afterAll(async () => {
        await context.app.database.delete();
        await context.app.close();
      });

      describe("/", () => {
        it("should return send infos on / GET", async () => {
          const res = await getAsync(context, "/");
          expect(Object.keys(res).sort()).toEqual(["version", "name"].sort());
        });

        it("should ping on /ping GET", async () => {
          const res = await getAsync(context, "/ping");
          expect(Object.keys(res)).toEqual(["ping"]);
        });
      });

      describe("/users", () => {
        it("should get currentUser on /me GET", async () => {
          context.userProfile1 = await getAsync(
            context,
            "/me",
            context.authUser1.access_token,
          );
          // WIP

          expect(Object.keys(context.userProfile1).sort()).toEqual([
            "id",
            "username",
            "avatar",
            "email",
          ].sort());
        });

        it("should get a SINGLE user on /users/:id GET", async () => {
          const res = await getAsync(
            context,
            `/users/${context.userProfile1.id}`,
            context.authUser1.access_token,
          );
          // WIP
          expect(Object.keys(res).sort()).toEqual([
            "id",
            "username",
            "avatar",
            "email",
          ].sort());
        });
      });

      describe("/conversations", () => {
        it("should list all conversations linked to session's user on /conversations GET", async () => {
          const res = await getAsync(
            context,
            "/conversations",
            context.authUser1.access_token,
          );
          // WIP
          expect(res).toBeInstanceOf(Array);
        });

        it("should create a SINGLE conversation on /conversations POST", async () => {
          context.conversation = await postAsync(
            context,
            "/conversations",
            context.authUser1.access_token,
            { participants: ["user2"] },
          );
          // WIP
          expect(Object.keys(context.conversation).sort()).toEqual([
            "id",
            "created_time",
            "author",
            "participants",
          ].sort());
        });

        it("should get a SINGLE conversation on /conversations/:id GET", async () => {
          const res = await getAsync(
            context,
            `/conversations/${context.conversation.id}`,
            context.authUser1.access_token,
          );
          expect(Object.keys(res).sort()).toEqual([
            "id",
            "created_time",
            "author",
            "participants",
          ].sort());
        });

        it("should get a all conversation's messages on /conversations/:id/messages GET", async () => {
          const res = await getAsync(
            context,
            `/conversations/${context.conversation.id}/messages`,
            context.authUser1.access_token,
          );
          // WIP
          expect(res).toBeInstanceOf(Array);
        });

        it("should create a new message on /conversations/:id/messages POST", async () => {
          const res = await postAsync(
            context,
            `/conversations/${context.conversation.id}/messages`,
            context.authUser1.access_token,
            { body: "hello" },
          );
          // WIP
          expect(Object.keys(res).sort()).toEqual([
            "id",
            "conversationId",
            "created_time",
            "from",
            "body",
            "timestamp",
          ].sort());
        });
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
          expect(Object.keys(context.bot1).sort()).toEqual([
            "id",
            "creation_date",
            "name",
            "author",
            "email",
          ].sort());
        });

        it("should create a SINGLE bot non authentified on /bots POST", async () => {
          const res = await postAsync(context, "/bots", null, {
            name: "bot",
            username: "user3",
            password: "12345",
            email: "user3@test.com",
          });
          // WIP
          expect(Object.keys(res).sort()).toEqual([
            "id",
            "creation_date",
            "name",
            "author",
            "email",
          ].sort());
        });

        it("should get a all bot's intents on /bots/:id/intents GET", async () => {
          const res = await getAsync(
            context,
            `/bots/${context.bot1.id}/intents`,
            context.authUser1.access_token,
          );
          // WIP
          expect(Object.keys(res)).toEqual(["intents"]);
          expect(res.intents).toBeInstanceOf(Array);
        });

        it("should create bot's first intent on /bots/:id/intents POST", async () => {
          const res = await postAsync(
            context,
            `/bots/${context.bot1.id}/intents`,
            context.authUser1.access_token,
            { name: "hello", input: ["hello"], output: ["hello"] },
          );
          // WIP
          expect(Object.keys(res).sort()).toEqual([
            "id",
            "botId",
            "name",
            "input",
            "output",
          ].sort());
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
          expect(Object.keys(res).sort()).toEqual([
            "id",
            "botId",
            "name",
            "input",
            "output",
          ].sort());
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
          expect(Object.keys(res)).toEqual(["intents"]);
          expect(res.intents).toBeInstanceOf(Array);
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
          expect(Object.keys(res).sort()).toEqual([
            "id",
            "botId",
            "name",
            "input",
            "output",
          ].sort());
        });

        it("should delete bot's intent on /bots/:id/intents/:intentId DELETE", async () => {
          const res = await deleteAsync(
            context,
            `/bots/${context.bot1.id}/intents/${context.intent1id}`,
            context.authUser1.access_token,
          );
          // WIP
          // logger.info(`intent.id=${intent1.id}`);
          expect(Object.keys(res).sort()).toEqual(["id", "ok"].sort());
        });

        describe("/bots/sandbox", () => {
          it("should get all bot's sandbox messages on /bots/:id/sandbox/messages GET", async () => {
            const res = await getAsync(
              context,
              `/bots/${context.bot1.id}/sandbox/messages`,
              context.authUser1.access_token,
            );
            // WIP
            expect(res).toBeInstanceOf(Array);
            [context.botconversation] = res;
          });

          it("shouldcreate new message in bot's sandbox on /bots/:id/sandbox/messagesPOST", async () => {
            const res = await postAsync(
              context,
              `/bots/${context.bot1.id}/sandbox/messages/${context
                .botconversation.id}`,
              context.authUser1.access_token,
              { body: "hello" },
            );
            // WIP
            expect(Object.keys(res).sort()).toEqual([
              "id",
              "conversationId",
              "created_time",
              "timestamp",
              "from",
              "body",
            ].sort());
          });

          it("should delete context of bot's sandbox on /bots/:id/sandbox DELETE", async () => {
            const res = await deleteAsync(
              context,
              `/bots/${context.bot1.id}/sandbox`,
              context.authUser1.access_token,
            );
            // WIP
            expect(Object.keys(res)).toEqual(["result"]);
          });
        });
      });

      describe("/metrics", () => {
        it("returns metrics", async () => {
          const metrics = await getAsync(
            context,
            "/metrics",
            context.authUser1.access_token,
          );

          expect(metrics).toHaveProperty("users.count");
          expect(metrics).toHaveProperty("conversations.count");
          expect(metrics).toHaveProperty("conversations.messages_per_conversation");
          expect(metrics).toHaveProperty("sessions.duration");
          expect(metrics).toHaveProperty("errors.rate");
          expect(metrics).toHaveProperty("responses.speed");
        });
      });
    }); // end with dataset
  });
});
