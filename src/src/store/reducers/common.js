import {
  CHAT_MESSAGE_RECEIVE,
  SAVE_ID,
  SEND_CHAT_MESSAGE,
} from "../actions/common";

const initialState = {
  testData: "Initial test data",
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
