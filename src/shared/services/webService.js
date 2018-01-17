import fetch from "./fetch";

export default class WebService {
  constructor(client, authService) {
    if (client && client.provider) {
      throw new Error("Provider authentification not implemented");
    } else if ((!client) || (!client.url)) {
      throw new Error("WebClient not configured");
    }
    this.client = { ...client };
    this.authService = authService;
  }

  createUrl(route) {
    const url = this.client.url + route;
    return url;
  }

  buildUrl(route, protocol = "http") {
    const url = this.createUrl(route);
    return this.authService.buildAuthUrl(url, protocol);
  }

  send(route, data, method, auth) {
    const isAuth = this.authService.isAuthenticated();
    const url = this.buildUrl(route);
    const clientId = this.authService.getClientId();
    return new Promise((resolve, reject) => {
      if ((!isAuth) && auth) {
        reject(new Error("not authenticated"));
      } else {
        fetch(url, data, method, { client_id: clientId }).then((response) => {
          const d = response.data;
          if (d.error) {
            reject(d.error);
          } else {
            resolve(d);
          }
        }).catch((error) => {
          reject(error.message);
        });
      }
    });
  }

  get(route, auth = true) {
    return this.send(route, null, "get", auth);
  }

  post(route, inputData, auth = true) {
    return this.send(route, inputData, "post", auth);
  }

  put(route, inputData, auth = true) {
    return this.send(route, inputData, "put", auth);
  }

  delete(route, auth = true) {
    return this.send(route, null, "delete", auth);
  }
}
