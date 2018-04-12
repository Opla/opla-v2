/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import AdminRoutes from "opla-backend/routes/admin";

describe("routes/admin", () => {
  describe("getTemplates", () => {
    it("calls the controller", () => {
      const getTemplatesSpy = jest.fn();
      const fakeZoapp = {
        extensions: {
          getAdmin: () => ({
            getTemplates: getTemplatesSpy,
          }),
        },
      };

      const routes = new AdminRoutes(fakeZoapp);
      expect(getTemplatesSpy).not.toHaveBeenCalled();
      routes.getTemplates();
      expect(getTemplatesSpy).toHaveBeenCalled();
    });
  });

  describe("getLanguages", () => {
    it("calls the controller", () => {
      const getLanguagesSpy = jest.fn();
      const fakeZoapp = {
        extensions: {
          getAdmin: () => ({
            getLanguages: getLanguagesSpy,
          }),
        },
      };

      const routes = new AdminRoutes(fakeZoapp);
      expect(getLanguagesSpy).not.toHaveBeenCalled();
      routes.getLanguages();
      expect(getLanguagesSpy).toHaveBeenCalled();
    });
  });
});
