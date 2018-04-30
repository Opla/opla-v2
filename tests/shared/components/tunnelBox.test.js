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
    const param = { active: true, providers: [1, 2, 3, 4] };
    const component = renderer.create(
      <ActionsList params={param} onChange={jest.fn()} />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
