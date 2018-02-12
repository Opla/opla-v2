import { takeEvery } from "redux-saga";
import auth from "./auth";
import api from "./api";

function takeAll(subRoot) {
  const takeList = [];
  subRoot.forEach((sub) => {
    takeList.push(takeEvery(sub[0], sub[1]));
  });
  return takeList;
}

export default function* root() {
  yield takeAll(auth);
  yield takeAll(api);
}
