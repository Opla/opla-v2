function createConfiguration(pkg, answers) {
  const config = {
    name: "Opla.ai",
    version: pkg.version,
    global: {
      database: {
        datatype: answers.databaseType,
        host: answers.databaseHost,
        name: answers.databaseName,
        user: answers.databaseUser,
        password: answers.databasePass,
        charset: "utf8mb4",
        version: "2",
      },
      api: {
        endpoint: answers.apiEndpoint,
        version: "1",
        port: 8081,
      },
      botSite: {
        url: "/publish/",
      },
      gateway: {
        url: answers.gatewayUrl,
      },
    },
    backend: {
      managementEndpoint: false
    },
    auth: {
      database: {
        parent: "global",
        name: "auth",
      },
      api: {
        endpoint: answers.authEndpoint,
      },
    },
    messenger: {
      database: {
        parent: "global",
        name: "messenger",
      },
    },
    users: {
      database: {
        parent: "global",
        name: "users",
      },
    },
    bots: {
      database: {
        parent: "global",
        name: "bots",
      },
    },
    webhooks: {
      database: {
        parent: "global",
        name: "webhooks",
      },
    },
    middlewares: {
      database: {
        parent: "global",
        name: "middlewares",
      },
    },
    parameters: {
      database: {
        parent: "global",
        name: "parameters",
      },
    },
  };
  return config;
}
exports.createConfiguration = createConfiguration;
