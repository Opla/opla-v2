/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { shallow } from "enzyme";
import DashboardMessagings from "../../../../src/shared/components/dashboard/dashboardMessagings";

describe("components/dashboard/DashboardMessagins", () => {
  const defaultProps = {
    apiSetPluginRequest: () => {},
    loading: false,
    plugins: [
      { name: "foo", middleware: { status: "start" } },
      { name: "bar", middleware: { status: "disabled" } },
    ],
    selectedBotId: "botId",
  };
  it("render", () => {
    const buildItemsSpy = jest.spyOn(DashboardMessagings, "buildItems");

    const wrapper = shallow(<DashboardMessagings {...defaultProps} />);
    expect(wrapper.find("Panel")).toHaveLength(1);
    expect(buildItemsSpy).toHaveBeenCalled();
  });

  it("build items at render", () => {
    const buildItemsSpy = jest.spyOn(DashboardMessagings, "buildItems");

    const wrapper = shallow(<DashboardMessagings {...defaultProps} />);
    expect(wrapper.find("Panel")).toHaveLength(1);
    expect(buildItemsSpy).toHaveBeenCalled();
    const result = buildItemsSpy.mock.results[0].value.map((v) => [
      v.name,
      v.enabled,
    ]);
    expect(result).toEqual([["foo", true], ["bar", false]]);
  });
});
