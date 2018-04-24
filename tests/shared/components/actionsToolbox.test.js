import React from "react";
import renderer from "react-test-renderer";
import ActionsToolbox from "shared/components/actionsToolbox";

describe("components/actionsToolbox", () => {
  it("can have differents behavior on change", () => {
    const component = renderer.create(<ActionsToolbox onChange={jest.fn()} />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can be typed", () => {
    const types = "any";
    const component = renderer.create(<ActionsToolbox type={types} />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can be an input", () => {
    const component = renderer.create(<ActionsToolbox isInput />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can be disabled", () => {
    const component = renderer.create(<ActionsToolbox disable />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
