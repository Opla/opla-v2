import * as actions from "shared/actions/api";
import reducer, { initialState } from "shared/reducers/metrics";

describe("reducers/metrics", () => {
  it("returns the initial state", () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it("stores metrics", () => {
    const metrics = { some: 'metrics' };

    const state = reducer(undefined, actions.apiGetMetricsSuccess(metrics));
    expect(state).toEqual({
      metrics,
    });
  });

  it("resets the state on fetch request", () => {
    const metrics = { some: 'metrics' };

    const prevState = reducer(undefined, actions.apiGetMetricsSuccess(metrics));
    expect(prevState).toEqual({
      metrics,
    });

    const state = reducer(prevState, actions.apiGetMetricsRequest());
    expect(state).toEqual(initialState);
  });
});
