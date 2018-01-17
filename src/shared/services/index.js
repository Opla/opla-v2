import WebService from "./webService";
import AuthService from "../services/authService";
import SocketService from "../services/socketService";
import { apiConfig, authConfig } from "../config";

export const authService = new AuthService(authConfig);

export const webService = new WebService(apiConfig, authService);

export function createSocketService(path) {
  const url = webService.buildUrl(path, "ws");
  const socketService = new SocketService(url);
  return socketService;
}
