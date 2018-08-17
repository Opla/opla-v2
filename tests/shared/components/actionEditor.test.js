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
import ActionsEditable from "shared/components/actionsEditable";

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

    const wrapper = shallow(<ActionsEditable content={content} />);
    expect(wrapper.state("items")).toHaveLength(2);
  });
});
