import {
  SAVE_ARRIWED_CHAT_MESSAGE,
  SAVE_ID,
  SET_TEST_DATA,
} from "../actions/common";

const initialState = {
  testData: "Initial test data",
  id: "",
  messages: [],
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEST_DATA:
      return {
        ...state,
        testData: action.testData,
      };
    case SAVE_ID:
      return {
        ...state,
        id: action.id,
      };
    default:
      return state;
  }
};

export default commonReducer;
