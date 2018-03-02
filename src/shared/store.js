/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import reducers from "./reducers";
import rootSaga from "./sagas";

export default function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  /* global window */
  /* eslint-disable-next-line no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    reducers, initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );

  sagaMiddleware.run(rootSaga);

  /* global module require */
  if (module.hot) {
    module.hot.accept("./reducers", () => {
      /* eslint-disable-next-line global-require */
      const nextRootReducer = require("./reducers/index").default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
