/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import { DashboardBase } from "shared/containers/dashboard";

describe("containers/Dashboard", () => {
  const defaultMetrics = {
    users: {
      count: 123,
    },
    conversations: {
      count: 1200,
      messages_per_conversation: 4,
    },
    sessions: {
      duration: 5000,
    },
    errors: {
      rate: 0.230115,
    },
    responses: {
      speed: 40.219032,
    },
  };
  it("renders and update correctly", () => {
    const appSetTitleSpy = jest.fn();
    const fetchMetricsSpy = jest.fn();

    const component = renderer.create(
      <DashboardBase
        appSetTitle={appSetTitleSpy}
        fetchMetrics={fetchMetricsSpy}
        isSignedIn
        metrics={defaultMetrics}
      />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(appSetTitleSpy).toHaveBeenCalled();
    expect(fetchMetricsSpy).not.toHaveBeenCalled();

    component.update(
      <DashboardBase
        appSetTitle={appSetTitleSpy}
        fetchMetrics={fetchMetricsSpy}
        isSignedIn
        renderingValue
        selectedBotId={"bot1"}
        metrics={defaultMetrics}
      />,
    );
    expect(fetchMetricsSpy).toHaveBeenCalledWith("bot1");
  });

  it("renders a Loading component when user is not signed in", () => {
    const component = renderer.create(
      <DashboardBase
        appSetTitle={jest.fn()}
        fetchMetrics={jest.fn()}
        isSignedIn={false}
      />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders a Loading component when isLoading is true", () => {
    const component = renderer.create(
      <DashboardBase
        appSetTitle={jest.fn()}
        fetchMetrics={jest.fn()}
        isSignedIn
        isLoading
      />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders a Loading component when no metrics", () => {
    const metrics = null;

    const component = renderer.create(
      <DashboardBase
        appSetTitle={jest.fn()}
        fetchMetrics={jest.fn()}
        isSignedIn
        renderingValue
        metrics={metrics}
      />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("fetch metrics when selected bot change", () => {
    const appSetTitleSpy = jest.fn();
    const fetchMetricsSpy = jest.fn();

    const wrapper = shallow(
      <DashboardBase
        appSetTitle={appSetTitleSpy}
        fetchMetrics={fetchMetricsSpy}
        isSignedIn
        metrics={defaultMetrics}
      />,
    );
    wrapper.setProps({ selectedBotId: "abc" });
    expect(fetchMetricsSpy).toHaveBeenCalledWith("abc");
  });
});
