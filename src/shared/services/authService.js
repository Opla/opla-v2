import fetch from "./fetch";

export default class AuthService {
  constructor(client) {
    if (client && client.provider) {
      throw new Error("Provider authentification not implemented");
    } else if ((!client) || (!client.clientId) || (!client.clientSecret) || (!client.url)) {
      throw new Error("AuthClient not configured");
    }
    this.client = { ...client };
    this.resetAttributes();
    this.needToLoad = true;
  }

  resetAttributes() {
    this.authorized = false;
    this.accessToken = null;
    this.expiresIn = null;
    this.scope = null;
  }

  loadAttributes() {
    /* global window */
    this.accessToken = window.localStorage.getItem("access_token");
    this.expiresIn = window.localStorage.getItem("expires_in");
    this.scope = window.localStorage.getItem("scope");
    this.needToLoad = false;
  }

  checkAuthentification(shouldReset = false) {
    if (!this.accessToken) {
      this.loadAttributes();
    } else if (shouldReset) {
      this.resetAttributes();
    }
  }

  isAuthenticated() {
    this.checkAuthentification();
    return this.accessToken != null;
  }

  isAccessTokenValid() {
    this.checkAuthentification(true);
    return !!this.accessToken;
  }

  getClientId() {
    return this.client.clientId;
  }

  authenticateUser({ username, password }) {
    // Authorization request
    // TODO password salt
    const that = this;
    const promise = new Promise((resolve, reject) => {
      that.requestAccessToken({ username, password }, resolve, reject);
    });
    return promise;
  }

  authorizeAccess({ username, password, scope = null }) {
    // console.log("WIP", "AuthService.authorizeAccess " + username);
    const url = this.buildUrl(`${this.client.url}authorize`);
    // TODO password hashing
    return fetch(url, {
      username, password, scope, client_id: this.client.clientId, redirect_uri: "localhost",
    });
  }

  requestAccessToken({ username, password }, resolve, reject) {
    console.log("WIP", `AuthService.requestAccessToken ${username}${password} ${this.client.url}`);
    const url = this.buildUrl(`${this.client.url}access_token`);
    const that = this;
    return fetch(url, {
      username, password, client_id: this.client.clientId, redirect_uri: "localhost", grant_type: "password",
    }).then((response) => {
      const session = response.data;
      if (session.error) {
        that.resetAccess();
        reject(session.error);
      } else {
        /* global window */
        that.accessToken = session.access_token;
        window.localStorage.setItem("access_token", that.accessToken);
        that.expiresIn = session.expires_in;
        window.localStorage.setItem("expires_in", that.expiresIn);
        that.scope = session.scope;
        window.localStorage.setItem("scope", that.scope);
        that.authorized = true;
        window.localStorage.setItem("authorized", "true");
        resolve(that.getAttributes());
      }
    }).catch((error) => {
      that.resetAccess();
      reject(error);
    });
  }

  getAttributes() {
    return { accessToken: this.accessToken, expiresIn: this.expiresIn, scope: this.scope };
  }

  resetAccess() {
    this.resetAttributes();
    /* global window */
    window.localStorage.removeItem("authorized");
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("expires_in");
    window.localStorage.removeItem("scope");
  }

  buildUrl(url, protocol) {
    const p = this.getProtocol(protocol);
    return `${p}://${url}`;
  }

  getProtocol(protocol = "http") {
    let p = protocol;
    if (this.client.secure) {
      p += "s";
    }
    return p;
  }

  buildAuthUrl(url, protocol) {
    if (this.isAuthenticated()) {
      let n = "?access_token=";
      if (url.indexOf("?") > -1) {
        n = "&access_token=";
      }

      return this.buildUrl(url, protocol) + n + this.accessToken;
    }
    // TODO check if auth is ok
    return this.buildUrl(url, protocol);
  }
}
