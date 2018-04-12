/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
  getGatewayClient,
  initGatewayClient,
  GatewayClient,
} from "../../src/utils/gatewayClient";

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
