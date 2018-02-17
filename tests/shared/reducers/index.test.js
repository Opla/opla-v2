import rootReducer from "@shared/reducers";

describe("reducers/index", () => {
  it("combines all the reducers", () => {
    const reducerNames = Object.keys(rootReducer()).sort();

    expect(reducerNames).toEqual([
      "app",
      "auth",
      "initialize",
      "user",
    ]);
  });
});
