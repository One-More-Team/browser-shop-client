import { connectionState } from "../../enums/enums";
import {
  CHAT_MESSAGE_RECEIVE,
  CONNECTED_TO_WS,
  CONNECT_TO_WS,
  SAVE_ID,
} from "../actions/common";

const initialState = {
  testData: "Initial test data",
  connectionStatus: connectionState.CONNECTION_INITIAL,
  displayName: "",
  id: "",
  messages: [],
};

let uniqueChatId = 0;

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_ID:
      return {
        ...state,
        id: action.id,
      };
    case CONNECT_TO_WS:
      return {
        ...state,
        connectionStatus: connectionState.CONNECTION_CONNECTING,
        displayName: action.displayName,
      };
    case CONNECTED_TO_WS:
      return {
        ...state,
        connectionStatus: connectionState.CONNECTION_CONNECTED,
      };
    case CHAT_MESSAGE_RECEIVE:
      return {
        ...state,
        messages: [
          ...state.messages,
          { uid: uniqueChatId++, ...action.message },
        ],
      };
    default:
      return state;
  }
};

export default commonReducer;
