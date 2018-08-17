/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import renderer from "react-test-renderer";
import MessagingsList from "shared/components/messagingsList";

describe("components/messagingsList", () => {
  it("renders correctly", () => {
    const item = [
      { name: "foo", icon: "favorite" },
      { name: "bar", icon: "foobar", enable: "true" },
      { name: "title", icon: "" },
    ];
    const component = renderer.create(
      <MessagingsList name="foo" items={item} onSelect={jest.fn()} />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
