import { eventChannel } from "redux-saga";
import { call, put, take, select, takeLatest, delay } from "redux-saga/effects";

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
  onBrowserShopReady,
  saveProducts,
  saveUsers,
  saveUser,
  clearUser,
  syncPosition,
  SAVE_USERS,
} from "../store/actions/common";
import { GetDisplayName } from "../store/selectors/common";

const INIT = "init";
const SEND_CHAT_MESSAGE = "sendChatMessage";
const JOIN = "join";
const LEAVE = "leave";
const wsUri = "ws://192.168.2.115:8081/";
let websocket;

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
    };

    socket.onmessage = (evt) => {
      let rawData = JSON.parse(evt.data);
      let command = rawData.header;
      writeToScreen(`----->   ${command}`);

      switch (command) {
        case INIT: {
          emit(saveId(rawData.data.id));
          emit(saveProducts(rawData.data.products));
          emit(saveUsers(rawData.data.clientList));
          break;
        }
        case SEND_CHAT_MESSAGE: {
          emit(saveChatMessage(rawData.data));
          break;
        }
        case JOIN: {
          emit(saveUser(rawData.data));
          break;
        }
        case LEAVE: {
          emit(clearUser(rawData.data));
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

function* emulateConnected() {
  yield delay(2000);
  yield put(connectedToWS());
  const userName = yield select(GetDisplayName);
  yield call(doSend, `{"header":"init","data":{"name":"${userName}"}}`);

  const waitChannel = eventChannel((emitter) => {
    const onReady = () => {
      console.log("Browser Shop is ready!");
      emitter(onBrowserShopReady());
    };
    window.startBrowserShop({
      serverCall: doSend,
      userName,
      onReady,
    });
    return () => {};
  });

  while (true) {
    let action = yield take(waitChannel);
    yield put(action);
  }
}

function* chatMessageSend(action) {
  yield call(doSend, `{"header":"sendChatMessage","data":"${action.message}"}`);
}

function* sendUsersToShop(action) {
  yield delay(5000);
  window.addUsers(action.users);
}

function* Common() {
  yield takeLatest(CONNECT_TO_WS, createWebSocket);
  yield takeLatest(CHAT_MESSAGE_SEND, chatMessageSend);
  yield takeLatest(CONNECTED_TO_WS_EMULATE, emulateConnected);
  yield takeLatest(SAVE_USERS, sendUsersToShop);
}

export default Common;

/*
window.addUsers({ id: 123, name: "NewKrok", position: {x,y,z} })

window.removeUser(123)

windows.syncPositions([{ id: 123, position: {x,y,z}, { id: 456, position: {x,y,z}])

*/
