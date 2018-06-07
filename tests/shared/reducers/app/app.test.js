/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as apiActions from "shared/actions/api";
import * as authActions from "zoapp-front/actions/auth";
import { appSetTitle } from "zoapp-front/actions/app";
import reducer, {
  initialState,
  defaultTemplates,
  defaultLanguages,
} from "shared/reducers/app";

describe("reducers/app", () => {
  it("returns the initial state", () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it("sets the application title", () => {
    const title = "app title";

    const prevState = reducer(undefined, {});
    expect(prevState).toEqual(initialState);

    const state = reducer(prevState, appSetTitle(title));
    expect(state).toEqual({
      ...prevState,
      titleName: title,
    });
  });

  it("resets the state when user signs out", () => {
    const title = "some title";

    const prevState = reducer(undefined, appSetTitle(title));
    expect(prevState).toEqual({
      ...initialState,
      titleName: title,
    });

    const state = reducer(prevState, authActions.signOutComplete({}));
    expect(state).toEqual(initialState);
  });

  describe("templates", () => {
    it("returns default templates when the request fails", () => {
      const state = reducer(
        initialState,
        apiActions.apiGetTemplatesFailure(Error("it fails")),
      );

      expect(state.templates).toEqual(defaultTemplates);
      expect(state.error).toEqual("it fails");
    });

    it("merges default templates with templates from the API", () => {
      const templates = [{ name: "foo" }, { name: "bar" }];
      const state = reducer(
        initialState,
        apiActions.apiGetTemplatesSuccess(templates),
      );

      expect(state.templates).toEqual(templates.concat(defaultTemplates));
    });
  });

  describe("languages", () => {
    it("returns default languages when the request fails", () => {
      const state = reducer(
        initialState,
        apiActions.apiGetLanguagesFailure(Error("it fails")),
      );

      expect(state.languages).toEqual(defaultLanguages);
      expect(state.error).toEqual("it fails");
    });
  });

  it("returns the languages sent by the api on success", () => {
    const languages = [
      { id: "en", name: "English", default: true },
      { id: "fr", name: "French", default: false },
    ];

    const state = reducer(
      initialState,
      apiActions.apiGetLanguagesSuccess(languages),
    );

    expect(state.languages).toEqual(languages);
  });
});
