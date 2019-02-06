import * as actions from "zoapp-front/dist/actions/message";
import reducer, { initialState } from "shared/reducers/message";
import {
  API_CREATEBOT,
  API_DELETEINTENT,
  API_DELETEMIDDLEWARE,
  API_GETINTENTS,
  API_GETMIDDLEWARES,
  API_IMPORT,
  API_MOVEINTENT,
  API_PUBLISH,
  API_SAVEBOT,
  API_SB_GETCONTEXT,
  API_SB_GETMESSAGES,
  API_SB_RESET,
  API_SB_SENDMESSAGE,
  API_SENDINTENT,
  API_SETMIDDLEWARE,
} from "shared/actions/constants";
import { FETCH_FAILURE } from "zoapp-front/dist/actions/constants";

const errorTypes = [
  API_GETMIDDLEWARES + FETCH_FAILURE,
  API_SETMIDDLEWARE + FETCH_FAILURE,
  API_DELETEMIDDLEWARE + FETCH_FAILURE,
  API_CREATEBOT + FETCH_FAILURE,
  API_SAVEBOT + FETCH_FAILURE,
  API_IMPORT + FETCH_FAILURE,
  API_PUBLISH + FETCH_FAILURE,
  API_GETINTENTS + FETCH_FAILURE,
  API_SENDINTENT + FETCH_FAILURE,
  API_DELETEINTENT + FETCH_FAILURE,
  API_MOVEINTENT + FETCH_FAILURE,
  API_SB_GETMESSAGES + FETCH_FAILURE,
  API_SB_SENDMESSAGE + FETCH_FAILURE,
  API_SB_GETCONTEXT + FETCH_FAILURE,
  API_SB_RESET + FETCH_FAILURE,
];

describe("reducers/message", () => {
  it("returns the initial state", () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it("sets message", () => {
    const prevState = reducer(undefined, {});
    expect(prevState).toEqual(initialState);

    const state = reducer(
      prevState,
      actions.addMessage("An error message", "error"),
    );
    expect(state).toEqual({
      ...prevState,
      messages: [{ message: "An error message", level: "error" }],
    });
  });

  it("removes message", () => {
    const prevState = reducer(
      undefined,
      actions.addMessage("Another error message", "error"),
    );
    expect(prevState).toEqual({
      ...initialState,
      messages: [
        { message: "An error message", level: "error" },
        { message: "Another error message", level: "error" },
      ],
    });

    const state = reducer(prevState, actions.removeMessage());
    expect(state).toEqual({
      ...prevState,
      messages: [{ message: "Another error message", level: "error" }],
    });
  });

  it("handles all errors", () => {
    expect.assertions(errorTypes.length + 1);

    const prevState = reducer(undefined, {});
    expect(prevState).toEqual(initialState);

    const messages = [{ message: "Another error message", level: "error" }];

    errorTypes.forEach((type) => {
      const state = reducer(prevState, {
        type,
        error: "Fake error",
      });

      messages.push({ message: "Fake error", level: "error" });

      expect(state).toEqual({
        ...prevState,
        messages,
      });
    });
  });
});
