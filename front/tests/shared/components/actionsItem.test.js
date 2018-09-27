/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";
import ActionsItem from "shared/components/actionsItem";

describe("components/actionsItem", () => {
  const defaultContainerName = "output";

  it("render with text action", () => {
    const wrapper = shallow(
      <ActionsItem containerName={defaultContainerName} />,
    );
    expect(wrapper.find("ConditionsActionsEditable")).toHaveLength(0);
    expect(wrapper.find("ActionsEditable")).toHaveLength(1);
  });

  it("render with condition action", () => {
    const wrapper = shallow(
      <ActionsItem containerName={defaultContainerName} isCondition />,
    );
    expect(wrapper.find("ConditionsActionsEditable")).toHaveLength(1);
    expect(wrapper.find("ActionsEditable")).toHaveLength(0);
  });

  it("render trash icon", () => {
    const wrapper = shallow(
      <ActionsItem containerName={defaultContainerName} isCondition />,
    );

    expect(wrapper.find("ListItemMeta")).toHaveLength(1);
    expect(wrapper.find("ListItemMeta").prop("icon")).toEqual("remove");
  });

  it("render add button", () => {
    const wrapper = shallow(
      <ActionsItem containerName={defaultContainerName} action="foo" isNew />,
    );

    expect(wrapper.find("ListItemMeta")).toHaveLength(1);
    expect(wrapper.find("ListItemMeta").prop("icon")).toEqual("add");

    // hide add icon when new action is empty
    wrapper.setProps({ action: "" });
    expect(wrapper.find("ListItemMeta")).toHaveLength(0);
  });
});
