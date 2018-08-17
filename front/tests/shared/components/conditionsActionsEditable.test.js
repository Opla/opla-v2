/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";
import ConditionsActionsEditable from "shared/components/conditionsActionsEditable";

describe("components/actionsItem", () => {
  const defaultContainerName = "output";
  const defaultAction = {
    name: "actionName",
    value: "actionValue",
    text: "action text",
  };

  it("should render with actions conditions", () => {
    const wrapper = shallow(
      <ConditionsActionsEditable
        containerName={defaultContainerName}
        content={defaultAction}
      />,
    );

    expect(wrapper.find("TextField")).toHaveLength(2);
    expect(wrapper.find("#conditionName")).toHaveLength(1);
    expect(wrapper.find("#conditionName").prop("value")).toEqual("actionName");
    expect(wrapper.find("#conditionValue")).toHaveLength(1);
    expect(wrapper.find("#conditionValue").prop("value")).toEqual(
      "actionValue",
    );

    expect(wrapper.find("ActionsEditable")).toHaveLength(1);
    expect(wrapper.find("ActionsEditable").prop("content")).toEqual(
      "action text",
    );
  });

  it("should handle condition action without value", () => {
    const newAction = {
      name: "conditionName",
      value: undefined,
      text: "condition text",
    };

    const onChangeSpy = jest.fn();
    const wrapper = shallow(
      <ConditionsActionsEditable
        containerName={defaultContainerName}
        content={newAction}
        onChange={onChangeSpy}
      />,
    );

    wrapper.instance().updateContent("value", undefined);
    wrapper.instance().updateContent("value", "");
    expect(onChangeSpy.mock.calls).toEqual([[newAction], [newAction]]);
  });
});
