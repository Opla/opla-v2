/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";

import IODialog from "shared/containers/dialogs/ioDialog";

describe("containers/ioDialog", () => {
  it("should update state when props open change", () => {
    const wrapper = shallow(
      <IODialog
        open={true}
        accept=""
        onDownload={() => {}}
        onImport={() => {}}
      />,
    );
    expect(wrapper.state("openDialog")).toEqual(true);
    wrapper.setProps({ open: false });
    expect(wrapper.state("openDialog")).toEqual(false);
  });
});
