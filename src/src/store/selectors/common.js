const GetTestData = (state) => state.commonReducer.testData;

const GetMyId = (state) => state.commonReducer.id;

const GetChatMessages = (state) => state.commonReducer.messages;

const GetIsConnectingInProgress = (state) =>
  state.commonReducer.isConnectingInProgress;

const GetDisplayName = (state) => state.commonReducer.displayName;

export {
  GetTestData,
  GetMyId,
  GetChatMessages,
  GetIsConnectingInProgress,
  GetDisplayName,
};
