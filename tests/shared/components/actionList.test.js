/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
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
});
