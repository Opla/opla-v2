/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import rootReducer from "shared/reducers";

describe("reducers/index", () => {
  it("combines all the reducers", () => {
    const reducerNames = Object.keys(rootReducer()).sort();

    expect(reducerNames).toEqual([
      "app",
      "auth",
      "initialize",
      "metrics",
      "user",
    ]);
  });
});
