/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";
import ActionEditable from "shared/components/actionEditable";

describe("components/actionsEditable", () => {
  const defaultProps = {
    actionId: "ae_1",
    editable: true,
    type: "text",
    text: " foo bar ",
    tabIndex: 2,
  };

  it("renders correctly", () => {
    const wrapper = shallow(<ActionEditable {...defaultProps} />);
    expect(wrapper.find("#ae_1").text()).toEqual(" foo bar ");
  });

  it("should sanitize entity type", () => {
    const types = ["text", "any", "variable"];
    let sanitizedType = ActionEditable.sanitizeType(types, "any");
    expect(sanitizedType).toEqual("any");
    sanitizedType = ActionEditable.sanitizeType(types, "/a");
    expect(sanitizedType).toEqual("text");
  });
});
