import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import reducers from "./reducers";
import rootSaga from "./sagas";

/* global window */
export default function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    reducers, initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );
  sagaMiddleware.run(rootSaga);
  /* eslint-enable no-underscore-dangle */

  /* global module */
  /* eslint-disable global-require */
  /* eslint-disable no-undef */
  if (module.hot) {
    module.hot.accept("OplaLibs/reducers", () => {
      console.log("HMR reducers");
      store.replaceReducer(require("./reducers").default);
    });
    module.hot.accept("OplaLibs/sagas", () => {
      console.log("HMR sagas TODO");
      // TODO reload Sagas
      // @see https://gist.github.com/markerikson/dc6cee36b5b6f8d718f2e24a249e0491
      // SagaManager.cancelSagas(store);
      // require("./sagas").default.startSagas(sagaMiddleware);
    });
  }
  /* eslint-enable no-undef */
  /* eslint-enable global-require */

  return store;
}
