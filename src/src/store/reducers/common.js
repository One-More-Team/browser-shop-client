import { SET_TEST_DATA } from "../actions/common";

const initialState = {
  testData: "Initial test data",
};

const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEST_DATA:
      return {
        ...state,
        testData: action.testData,
      };
    default:
      return state;
  }
};

export default commonReducer;
