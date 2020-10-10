export const SET_TEST_DATA = "SET_TEST_DATA";
export const SEND_CHAT_MESSAGE = "SEND_CHAT_MESSAGE";
export const CONNECT_TO_WS = "CONNECT_WS";

export const SAVE_ARRIWED_CHAT_MESSAGE = "SAVE_ARRIWED_CHAT_MESSAGE";

export const SAVE_ID = "SAVE_ID";
export const GET_ID = "GET_ID";

export const setTestData = (testData) => ({ type: SET_TEST_DATA, testData });

export const saveChatMessage = (message) => ({
  type: SET_TEST_DATA,
  message,
});

export const saveId = (id) => () => ({
  type: SAVE_ID,
  id,
});

export const connectWS = () => ({ type: CONNECT_TO_WS });
