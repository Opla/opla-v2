/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import IntentDetail from "shared/components/intentDetail";

describe("components/intentDetail", () => {
  const defaultProps = {
    intent: {},
    onSelect: () => {},
    onEdit: () => {},
    onAction: () => {},
  };

  const populatedIntent = {
    id: "T4Zs",
    botId: "HZAw",
    name: "Barquette alimentaire",
    input: ["*barquette", "barquette*", "*barquette*"],
    output: ["Attention, les barquettes alimentaires ne peuvent..."],
    order: 7,
  };

  it("renders correctly", () => {
    const intent = { topic: "some intent" };
    const component = renderer.create(
      <IntentDetail {...defaultProps} intent={intent} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Should render input intents", () => {
    const wrapper = shallow(
      <IntentDetail {...defaultProps} intent={populatedIntent} />,
    );

    expect(wrapper.find("ActionsList")).toHaveLength(2);
    expect(
      wrapper
        .find("ActionsList")
        .at(0)
        .dive()
        .find("ActionsEditable"),
    ).toHaveLength(4);
    expect(
      wrapper
        .find("ActionsList")
        .at(0)
        .dive()
        .find("ActionsEditable")
        .at(2)
        .prop("content"),
    ).toEqual(populatedIntent.input[2]);
  });

  it("Should render output intents", () => {
    const wrapper = shallow(
      <IntentDetail {...defaultProps} intent={populatedIntent} />,
    );

    expect(wrapper.find("ActionsList")).toHaveLength(2);
    expect(
      wrapper
        .find("ActionsList")
        .at(1)
        .dive()
        .find("ActionsEditable"),
    ).toHaveLength(2);
    expect(
      wrapper
        .find("ActionsList")
        .at(1)
        .dive()
        .find("ActionsEditable")
        .at(0)
        .prop("content"),
    ).toEqual(populatedIntent.output[0]);
  });

  it("can render intent with special characters correctly", () => {
    const intentcontent = [
      `{{${encodeURIComponent("{{text}}")}}}`,
      `<<${encodeURIComponent("<<var>>")}>>`,
    ].join("");
    const intent = { topic: intentcontent };
    const component = renderer.create(
      <IntentDetail {...defaultProps} intent={intent} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Should call onSelect on Topic parameters click", () => {
    const onSelectSpy = jest.fn();
    const callArg = {
      name: populatedIntent.name,
      state: "topic",
    };
    const wrapper = shallow(
      <IntentDetail
        {...defaultProps}
        intent={populatedIntent}
        onSelect={onSelectSpy}
      />,
    );

    expect(wrapper.find("ExpansionPanel")).toHaveLength(1);

    const buttonsWrapper = wrapper
      .find("ExpansionPanel")
      .dive()
      .find("Button");
    expect(buttonsWrapper).toHaveLength(2);

    buttonsWrapper.at(0).simulate("click", { preventDefault: () => {} });

    expect(onSelectSpy).toHaveBeenCalled();
    expect(onSelectSpy.mock.calls[0][0]).toEqual(callArg);
  });
});
