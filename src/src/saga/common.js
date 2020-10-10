import { eventChannel } from "redux-saga";
import { call, delay, put, take, takeLatest } from "redux-saga/effects";

import { rsf } from "../firebase";
import { SUCCESFUL_AUTH } from "../store/actions/auth";
import {
  CHAT_MESSAGE_SEND,
  CONNECT_TO_WS,
  CONNECTED_TO_WS_EMULATE,
  saveId,
  saveChatMessage,
  connectedToWS,
  connectedToWSEmulate,
} from "../store/actions/common";

const INIT = "init";
const SEND_CHAT_MESSAGE = "sendChatMessage";
const wsUri = "ws://192.168.2.115:8081/";
let websocket;

function* chatMessageSend(action) {
  doSend(`{"header":"sendChatMessage","data":"${action.message}"}`);
}

function* createWebSocket(action) {
  console.log("test 2");
  websocket = new WebSocket(wsUri);
  websocket.onclose = (evt) => onClose(evt);
  websocket.onerror = (evt) => onError(evt);

  const channel = yield call(subscribe, websocket);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function* subscribe(socket) {
  return new eventChannel((emit) => {
    socket.onopen = (evt) => {
      writeToScreen("CONNECTED");
      emit(connectedToWSEmulate());
      doSend('{"header":"init","data":{"name":"Tibikeee"}}');
    };

    socket.onmessage = (evt) => {
      let rawData = JSON.parse(evt.data);
      let command = rawData.header;
      writeToScreen(`----->   ${command}`);

      switch (command) {
        case INIT: {
          emit(saveId(rawData.data.id));
          break;
        }
        case SEND_CHAT_MESSAGE: {
          emit(saveChatMessage(rawData.data));
          break;
        }
        default: {
        }
      }
    };

    return () => {};
  });
}

function writeToScreen(message) {
  console.log(`${message}`);
}

function onOpen(evt) {}

function onClose(evt) {
  writeToScreen("DISCONNECTED");
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

function* emulateCOnnected() {
  yield delay(2000);
  yield put(connectedToWS());
}

function* Common() {
  yield takeLatest(CONNECT_TO_WS, createWebSocket);
  yield takeLatest(CHAT_MESSAGE_SEND, chatMessageSend);
  yield takeLatest(CONNECTED_TO_WS_EMULATE, emulateCOnnected);
}

export default Common;
