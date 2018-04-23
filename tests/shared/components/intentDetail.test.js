/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import renderer from "react-test-renderer";
import IntentDetail from "shared/components/intentDetail";

describe("components/intentDetail", () => {
  it("renders correctly", () => {
    const intent = {topic:"some intent"};
    const component = renderer.create(<IntentDetail intent={intent} />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
