import {
  CHAT_MESSAGE_RECEIVE,
  CONNECT_TO_WS,
  SAVE_ID,
} from "../actions/common";

const initialState = {
  testData: "Initial test data",
  isConnectingInProgress: false,
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
        isConnectingInProgress: true,
        displayName: action.displayName,
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
