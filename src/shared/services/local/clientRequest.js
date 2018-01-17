/**
 * Local client request wrapper
 * * Try to simulate Axios framework
 */
import server from "./server";

server.init();

const clientRequest = {
  request({ url, method, data }) {
    return server.request({ url, method, data });
  },
};

export default clientRequest;
