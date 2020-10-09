import { SUCCESFUL_AUTH } from "../actions/auth";

const initialState = {
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESFUL_AUTH:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default authReducer;
