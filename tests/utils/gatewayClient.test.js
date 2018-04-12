/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fetch from "zoapp-backend/utils/fetch";
import {
  getGatewayClient,
  initGatewayClient,
  GatewayClient,
} from "opla-backend/utils/gatewayClient";

describe("getGatewayClient", () => {
  it("throws an error if the gateway is not initialized", () => {
    expect(() => {
      getGatewayClient();
    }).toThrowError("client must be initialized before using it");
  });

  it("returns a valid Gateway instance once initialized", () => {
    initGatewayClient();
    const client = getGatewayClient();
    expect(client).toBeInstanceOf(GatewayClient);
  });
});

jest.mock("zoapp-backend/utils/fetch");
describe("GatewayClient", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe("getTemplates", () => {
    it("should call /templates endpoint", () => {
      const client = new GatewayClient("https://gateway.opla.ai");
      client.getTemplates();
      expect(fetch).toHaveBeenCalledWith("https://gateway.opla.ai/templates");
    });
  });

  describe("getLanguages", () => {
    it("should call /languages endpoint", () => {
      const client = new GatewayClient("https://gateway.opla.ai");
      client.getLanguages();
      expect(fetch).toHaveBeenCalledWith("https://gateway.opla.ai/languages");
    });
  });
});
