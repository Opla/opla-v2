/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import renderer from "react-test-renderer";

import { DashboardBase } from "shared/containers/dashboard";

describe("containers/Dashboard", () => {
  it("renders correctly", () => {
    const appSetTitleSpy = jest.fn();
    const fetchMetricsSpy = jest.fn();

    const metrics = {
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
        rate: 0.23,
      },
      responses: {
        speed: 40,
      },
    };

    const component = renderer.create(
      <DashboardBase
        appSetTitle={appSetTitleSpy}
        fetchMetrics={fetchMetricsSpy}
        isSignedIn
        metrics={metrics}
      />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    expect(appSetTitleSpy).toHaveBeenCalled();
    expect(fetchMetricsSpy).toHaveBeenCalled();
  });

  it("renders a Loading component when user is not signed in", () => {
    const component = renderer.create(
      <DashboardBase
        appSetTitle={jest.fn()}
        fetchMetrics={jest.fn()}
        isSignedIn={false}
      />
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
      />
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
        metrics={metrics}
      />
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
