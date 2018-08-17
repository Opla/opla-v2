/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import ActionsList from "shared/components/actionsList";

describe("components/actionsList", () => {
  it("renders correctly", () => {
    const name = "foobar";
    const component = renderer.create(<ActionsList name={name} />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can be rendered with array of actions typed as strings", () => {
    const name = "foo";
    const action = [
      "any",
      "output_var",
      "variable",
      "br",
      "button",
      "trash",
      "bar",
    ];
    const component = renderer.create(
      <ActionsList name={name} actions={action} />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can be rendered with array of actions typed as shapes", () => {
    const name = "foo";
    const action = [
      { type: "any" },
      { type: "output_var" },
      { type: "variable" },
      { type: "br" },
      { type: "button" },
      { type: "trash" },
      { type: "bar" },
    ];
    const component = renderer.create(
      <ActionsList name={name} actions={action} />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can have different behavior on select", () => {
    const name = "foobar";
    const component = renderer.create(
      <ActionsList name={name} onSelect={jest.fn()} />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can have different behavior on drop", () => {
    const name = "foobar";
    const component = renderer.create(
      <ActionsList name={name} onDrop={jest.fn()} />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can have different behavior on edit", () => {
    const name = "foobar";
    const component = renderer.create(
      <ActionsList name={name} onEdit={jest.fn()} />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can have different behavior on action", () => {
    const name = "foobar";
    const component = renderer.create(
      <ActionsList name={name} onAction={jest.fn()} />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can have an unique id", () => {
    const name = "foobar";
    const component = renderer.create(
      <ActionsList name={name} intentId="unique-id" />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("handle add new action", () => {
    const defaultName = "output";
    const defaultNewAction = {};

    it("should handle string action", () => {
      const newAction = {
        output: "",
      };

      const handleAddActionSpy = jest.fn();
      const onNewActionsChangeSpy = jest.fn();
      const wrapper = shallow(
        <ActionsList
          name={defaultName}
          newAction={newAction}
          onNewActionsChange={onNewActionsChangeSpy}
        />,
      );
      wrapper.instance().handleAddAction = handleAddActionSpy;

      wrapper.instance().handleAddNewAction("new string action *");

      expect(handleAddActionSpy).toHaveBeenCalledWith("new string action *");
      // expect reset newaction field
      expect(onNewActionsChangeSpy).toHaveBeenCalledWith("output", "");
    });

    it("should handle condition action", () => {
      const newAction = {
        name: "conditionName",
        value: "conditionValue",
        text: "condition text",
      };

      const handleAddActionConditionSpy = jest.fn();
      const onNewActionsChangeSpy = jest.fn();
      const wrapper = shallow(
        <ActionsList
          name={defaultName}
          onNewActionsChange={onNewActionsChangeSpy}
        />,
      );
      wrapper.instance().handleAddActionCondition = handleAddActionConditionSpy;

      wrapper.instance().handleAddNewAction(newAction, true);

      expect(handleAddActionConditionSpy).toHaveBeenCalledWith(newAction);
      // expect reset newaction field
      expect(onNewActionsChangeSpy).toHaveBeenCalledWith(
        "output",
        defaultNewAction,
      );
    });

    it("should add condition action with only text as string action", () => {
      const newAction = {
        text: "condition text",
      };

      const handleAddActionSpy = jest.fn();
      const handleAddActionConditionSpy = jest.fn();
      const onNewActionsChangeSpy = jest.fn();
      const wrapper = shallow(
        <ActionsList
          name={defaultName}
          onNewActionsChange={onNewActionsChangeSpy}
        />,
      );
      wrapper.instance().handleAddAction = handleAddActionSpy;
      wrapper.instance().handleAddActionCondition = handleAddActionConditionSpy;

      wrapper.instance().handleAddNewAction(newAction, true);

      expect(handleAddActionSpy).toHaveBeenCalledWith("condition text");
      expect(handleAddActionConditionSpy).not.toHaveBeenCalled();
      // expect reset newaction field as string
      expect(onNewActionsChangeSpy).toHaveBeenCalledWith("output", "");
    });
  });
});
