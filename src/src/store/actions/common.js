export const SEND_CHAT_MESSAGE = "SEND_CHAT_MESSAGE";
export const CONNECT_TO_WS = "CONNECT_WS";

export const CHAT_MESSAGE_RECEIVE = "CHAT_MESSAGE_RECEIVE";
export const CHAT_MESSAGE_SEND = "CHAT_MESSAGE_SEND";

export const SAVE_ID = "SAVE_ID";
export const GET_ID = "GET_ID";

export const sendChatMessage = (message) => ({
  type: CHAT_MESSAGE_SEND,
  message,
});

export const saveChatMessage = (message) => ({
  type: CHAT_MESSAGE_RECEIVE,
  message,
});

export const saveId = (id) => ({
  type: SAVE_ID,
  id,
});

export const connectWS = (requestedDisplayName) => ({
  type: CONNECT_TO_WS,
  displayName: requestedDisplayName,
});
