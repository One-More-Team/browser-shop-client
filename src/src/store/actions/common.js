export const SEND_CHAT_MESSAGE = "SEND_CHAT_MESSAGE";
export const CONNECT_TO_WS = "CONNECT_WS";
export const CONNECTED_TO_WS = "CONNECTED_TO_WS";
export const CONNECTED_TO_WS_EMULATE = "CONNECTED_TO_WS_EMULATE";

export const CHAT_MESSAGE_RECEIVE = "CHAT_MESSAGE_RECEIVE";
export const CHAT_MESSAGE_SEND = "CHAT_MESSAGE_SEND";

export const SAVE_ID = "SAVE_ID";
export const GET_ID = "GET_ID";

export const ON_BROWSER_SHOP_READY = "ON_BROWSER_SHOP_READY";
export const SYNC_POSITION = "SYNC_POSITION";

export const SAVE_USERS = "SAVE_USERS";
export const SAVE_USER = "SAVE_USER";
export const CLEAR_USER = "CLEAR_USER";

export const SAVE_PRODUCTS = "SAVE_PRODUCTS";

export const saveUsers = (users) => ({
  type: SAVE_USERS,
  users,
});

export const saveUser = (user) => ({
  type: SAVE_USER,
  user,
});

export const clearUser = (userID) => ({
  type: CLEAR_USER,
  userID,
});

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

export const saveProducts = (products) => ({
  type: SAVE_PRODUCTS,
  products,
});

export const connectWS = (requestedDisplayName) => ({
  type: CONNECT_TO_WS,
  displayName: requestedDisplayName,
});

export const connectedToWS = () => ({
  type: CONNECTED_TO_WS,
});

export const connectedToWSEmulate = () => ({
  type: CONNECTED_TO_WS_EMULATE,
});

export const onBrowserShopReady = () => ({
  type: ON_BROWSER_SHOP_READY,
});

export const syncPosition = (position) => ({
  type: SYNC_POSITION,
  position: position,
});
