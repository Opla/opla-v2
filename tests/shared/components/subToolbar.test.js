import React from "react";
import renderer from "react-test-renderer";
import SubToolbar from "@shared/components/subToolbar";

describe("SubToolbar", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      <SubToolbar
        titleName="some-name"
      />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
