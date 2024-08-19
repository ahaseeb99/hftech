import * as actionTypes from "./types";

const initialState = {
  allTaskData: [],
  taskDetail: {},
  isLoading: false,
};

export const taskReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_ALL_TASK_ISLOADING:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.GET_ALL_TASK:
      return {
        ...state,
        isLoading: false,
        allTaskData: [...action.payload],
      };
    case actionTypes.GET_TASK_DETAIL:
      return {
        ...state,
        taskDetail: action.payload,
      };
    default:
      return state;
  }
};
