/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import renderer from "react-test-renderer";

import TemplatesList from "shared/components/templatesList";

describe("components/TemplatesList", () => {
  it("renders correctly", () => {
    const items = [];

    const component = renderer.create(
      <TemplatesList
        titleName="some-name"
        items={items}
        selectedItem={0}
        onSelect={jest.fn()}
      />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders some items", () => {
    const items = [{ id: "template-1", name: "template 1" }];

    const component = renderer.create(
      <TemplatesList items={items} selectedItem={0} onSelect={jest.fn()} />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("marks an item as selected", () => {
    const items = [
      { id: "template-1", name: "template 1" },
      { id: "template-2", name: "template 2" },
    ];

    const component = renderer.create(
      <TemplatesList items={items} selectedItem={1} onSelect={jest.fn()} />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("creates a form for the 'Import' special item", () => {
    const items = [{ id: "import", name: "Import" }];

    const component = renderer.create(
      <TemplatesList items={items} selectedItem={0} onSelect={jest.fn()} />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
