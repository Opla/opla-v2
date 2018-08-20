/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import ActionsTools from "shared/utils/actionsTools";

describe("utils/ActionsTools", () => {
  it("check Action validity", () => {
    // valid actions
    expect(ActionsTools.isActionValid("*foo*")).toBe(true);
    expect(ActionsTools.isActionValid({ type: "condition" })).toBe(true);
    expect(ActionsTools.isActionValid({ type: "random" })).toBe(true);
    // invalid actions
    expect(ActionsTools.isActionValid(null)).toBe(false);
    expect(ActionsTools.isActionValid(undefined)).toBe(false);
    expect(ActionsTools.isActionValid({})).toBe(false);
  });
});
