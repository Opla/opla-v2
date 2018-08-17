/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";

import { GeneralAdminBase } from "shared/containers/admin/generalAdmin";

describe("containers/admin/generalAdmin", () => {
  const defaultProps = {
    admin: {
      params: {},
    },
    apiSaveBotRequest: jest.fn(),
    bot: {
      name: "bot1",
      description: "description 1",
    },
    timezone: [],
  };
  it("should set state when props change", () => {
    const wrapper = shallow(<GeneralAdminBase {...defaultProps} />);
    expect(wrapper.state("bot").name).toEqual("bot1");
    // change props.bot
    wrapper.setProps({ bot: { ...defaultProps.bot, name: "bot2" } });
    expect(wrapper.state("bot").name).toEqual("bot2");
  });
});
