import { WebService, AuthService, SocketService } from "zoapp-common";
import { apiConfig, authConfig } from "../config";

export const authService = new AuthService(authConfig);

export const webService = new WebService(apiConfig, authService);

export function createSocketService(path) {
  const url = webService.buildUrl(path, "ws");
  const socketService = new SocketService(url);
  return socketService;
}
