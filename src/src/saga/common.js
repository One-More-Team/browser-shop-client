import { call, put, takeLatest } from "redux-saga/effects";

import { rsf } from "../firebase";
import { SUCCESFUL_AUTH } from "../store/actions/auth";
import { CONNECT_TO_WS, saveId, SET_TEST_DATA } from "../store/actions/common";

const INIT = "init";

const wsUri = "ws://192.168.2.112:8081/";
let websocket;

function createWebSocket(action) {
  console.log("test 2");
  websocket = new WebSocket(wsUri);

  websocket.onopen = (evt) => onOpen(evt);
  websocket.onclose = (evt) => onClose(evt);
  websocket.onmessage = (evt) => onMessage(evt);
  websocket.onerror = (evt) => onError(evt);
}

function writeToScreen(message) {
  console.log(`${message}`);
}

function onOpen(evt) {
  writeToScreen("CONNECTED");
  doSend('{"header":"init","data":{"name":"Tibikeee"}}');
}

function onClose(evt) {
  writeToScreen("DISCONNECTED");
}

function onMessage(evt) {
  writeToScreen(`----->   ${evt.data}`);
  let rawData = JSON.parse(evt.data);
  let command = rawData.header;

  switch (command) {
    case INIT: {
      callSaveId("joskagyerek");
    }
    default: {
    }
  }
}

function onError(evt) {
  writeToScreen(`ERROR: ${evt.data}`);
}

function doSend(message) {
  writeToScreen(`<-----   ${message}`);
  websocket.send(message);
}

/* function* fetchInitialData(action) {
  const testData = yield call(rsf.firestore.getDocument, "data/test");

  yield put({
    type: SET_TEST_DATA,
    testData: testData.data(),
  });
} */

function* callSaveId(id) {
  yield put(saveId("valamii"));
}

function* Common() {
  yield takeLatest(CONNECT_TO_WS, createWebSocket);
}

export default Common;
