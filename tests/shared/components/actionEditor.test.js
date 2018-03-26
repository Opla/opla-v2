/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import ActionEditor from "shared/components/actionEditor";

describe("components/actionEditor", () => {
  it("renders correctly", () => {
    const content = "some content";
    const component = renderer.create(<ActionEditor content={content} />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders entity and variable with special characters", () => {
    const content = [
      `{{${encodeURIComponent("{{text}}")}}}`,
      `<<${encodeURIComponent("<<var>>")}>>`,
    ].join("");

    const wrapper = shallow(<ActionEditor content={content} />);
    expect(wrapper.state("items")).toHaveLength(2);
  });

  describe("build()", () => {
    it("should escape special characters like `{`, `}`, `<` and `>`", () => {
      const items = [
        { type: "any" },
        { type: "output_var", text: "{{text}}" },
        { type: "variable", text: "<<var>>" },
        { type: "br" },
        { type: "button", text: "text" },
        { type: "text", text: "text" },
      ];
      expect(ActionEditor.build(items)).toEqual(
        [
          "*",
          `{{${encodeURIComponent("{{text}}")}}}`,
          `<<${encodeURIComponent("<<var>>")}>>`,
          "<br/><button>text</button>text",
        ].join(""),
      );
    });
  });
});
