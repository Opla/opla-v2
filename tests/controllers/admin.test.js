/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import AdminController from "opla-backend/controllers/admin";

describe("controller/admin", () => {
  describe("getTemplates", () => {
    it("calls the gateway client", async () => {
      const getTemplatesSpy = jest.fn();
      const GatewayClient = {
        getTemplates: getTemplatesSpy,
      };

      const controller = new AdminController(
        "Admin",
        {},
        "admin",
        GatewayClient,
      );
      expect(getTemplatesSpy).not.toHaveBeenCalled();
      await controller.getTemplates();
      expect(getTemplatesSpy).toHaveBeenCalled();
    });
  });

  describe("getLanguages", () => {
    it("calls the gateway client", async () => {
      const getLanguagesSpy = jest.fn();
      const GatewayClient = {
        getLanguages: getLanguagesSpy,
      };

      const controller = new AdminController(
        "Admin",
        {},
        "admin",
        GatewayClient,
      );
      expect(getLanguagesSpy).not.toHaveBeenCalled();
      await controller.getLanguages();
      expect(getLanguagesSpy).toHaveBeenCalled();
    });
  });
});
