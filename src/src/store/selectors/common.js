const GetTestData = (state) => state.commonReducer.testData;

const GetMyId = (state) => state.commonReducer.id;

const GetChatMessages = (state) => state.commonReducer.messages;

const GetConnectionStatus = (state) => state.commonReducer.connectionStatus;

const GetDisplayName = (state) => state.commonReducer.displayName;

const GetChatUsers = (state) => state.commonReducer.clientList;

export {
  GetTestData,
  GetMyId,
  GetChatMessages,
  GetConnectionStatus,
  GetDisplayName,
  GetChatUsers,
};
