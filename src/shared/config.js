import config from "../../config/default.json";

export const application = {
};

const { backend } = config;

let { host, port, path } = backend.auth;
if (!host) {
  ({ host } = backend.api);
}
if (!port) {
  ({ port } = backend.api);
}
// TODO remove url from config
let p = port ? `:${port}` : "";
let url = `${host}${p}/${path}`;

const authConfig = {
  clientId: backend.auth.clientId,
  clientSecret: backend.auth.clientSecret,
  url,
  host,
  port,
  path,
  secure: backend.secure,
};

({ host, port, path } = backend.api);
// TODO remove url from config
p = port ? `:${port}` : "";
url = `${host}${p}/${path}`;
const apiConfig = {
  url,
  host,
  port,
  path,
  secure: backend.secure,
};

export { authConfig, apiConfig };
