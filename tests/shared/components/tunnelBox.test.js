/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import renderer from "react-test-renderer";
import TunnelBox from "shared/components/tunnelBox";

describe("components/tunnelBox", () => {
  it("renders correctly", () => {
    const param = {
      active: { foo: true, bar: false },
      providers: { 1: "foo", 2: "bar", 3: "foobar" },
    };
    const component = renderer.create(
      <TunnelBox params={param} onChange={jest.fn()} />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
