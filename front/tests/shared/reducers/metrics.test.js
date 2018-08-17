/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as actions from "shared/actions/api";
import reducer, { initialState } from "shared/reducers/metrics";

describe("reducers/metrics", () => {
  it("returns the initial state", () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it("stores metrics", () => {
    const metrics = { some: "metrics" };

    const state = reducer(undefined, actions.apiGetMetricsSuccess(metrics));
    expect(state).toEqual({
      loading: false,
      metrics,
    });
  });

  it("resets the state on fetch request", () => {
    const metrics = { some: "metrics" };

    const prevState = reducer(undefined, actions.apiGetMetricsSuccess(metrics));
    expect(prevState).toEqual({
      loading: false,
      metrics,
    });

    const state = reducer(prevState, actions.apiGetMetricsRequest());
    expect(state).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it("resets the state on fetch failure", () => {
    const prevState = reducer(undefined, actions.apiGetMetricsRequest());
    expect(prevState).toEqual({
      ...initialState,
      loading: true,
    });

    const state = reducer(prevState, actions.apiGetMetricsFailure(new Error()));
    expect(state).toEqual({
      ...initialState,
      loading: false,
    });
  });
});
