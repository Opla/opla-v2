/**
 * local server
 * Try to simulate Axios framework
 */

class LocalServer {
  init() {
    // TODO
    this.todo = {};
  }

  request({
    url, method, header, data,
  }) {
    // TODO
    this.todo = {};
    console.log(url, method, header, data);
  }
}

export default LocalServer;
