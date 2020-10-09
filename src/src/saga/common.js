import { call, put, takeLatest } from "redux-saga/effects";

import { rsf } from "../firebase";
import { SUCCESFUL_AUTH } from "../store/actions/auth";
import { SET_TEST_DATA } from "../store/actions/common";

function* fetchInitialData(action) {
  const testData = yield call(rsf.firestore.getDocument, "data/test");

  yield put({
    type: SET_TEST_DATA,
    testData: testData.data(),
  });
}

function* Common() {
  yield takeLatest(SUCCESFUL_AUTH, fetchInitialData);
}

export default Common;
