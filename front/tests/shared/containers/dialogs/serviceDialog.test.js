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
        apiSetPluginRequest={() => {}}
        plugin={{ name: "fb-messenger", title: "title" }}
      />,
    );
    expect(wrapper.state("openDialog")).toEqual(true);
    wrapper.setProps({ open: false });
    expect(wrapper.state("openDialog")).toEqual(false);
  });
});
