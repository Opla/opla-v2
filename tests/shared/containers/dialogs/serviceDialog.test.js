/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";

import { ServiceDialogBase } from "shared/containers/dialogs/serviceDialog";

describe("containers/serviceDialog", () => {
  it("should update state when props change", () => {
    const wrapper = shallow(
      <ServiceDialogBase
        open={true}
        apiSetMiddlewareRequest={() => {}}
        service={{ getTitle: () => {}, renderSettings: () => {} }}
        instance={{}}
      />,
    );
    expect(wrapper.state("openDialog")).toEqual(true);
    wrapper.setProps({ open: false });
    expect(wrapper.state("openDialog")).toEqual(false);

    // state.instance is set to this.props.lastMiddleware
    expect(wrapper.state("instance")).toEqual({});
    wrapper.setProps({ lastMiddleware: { name: "foo" } });
    expect(wrapper.state("instance")).toEqual({});

    // lastMiddleware props
    wrapper.setProps({ lastMiddleware: { name: "bar" } });
    expect(wrapper.state("instance")).toEqual({ name: "foo" });
  });
});
