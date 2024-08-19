import * as actionTypes from "./types";

import * as _ from "lodash";

interface I_InitialState {
  userDailyCostBreakDownList: any[];
  dailyCostBreakDownList: any[];
  estimateData: any;
  estimateDetail: any;
  estimateEmailDetail : any
  singleWorkOrderEstimate : any
}

const initialState: I_InitialState = {
  userDailyCostBreakDownList: [],
  dailyCostBreakDownList: [],
  estimateData: {},
  estimateDetail: {},
  estimateEmailDetail : [],
  singleWorkOrderEstimate : {}
};

export const estimateReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_DAILY_COST_BREAK_DOWN_LIST:
      return {
        ...state,
        dailyCostBreakDownList: [...action.payload],
      };
    case actionTypes.GET_ESTIMATE_LIST:
      return {
        ...state,
        estimateData: { ...action.payload },
      };
    case actionTypes.CLEAR_ESTIMATE_LIST:
      return {
        ...state,
        estimateDetail: { ...action.payload },
      };
    case actionTypes.GET_ESTIMATE_DETAIL:
      return {
        ...state,
        estimateDetail: action.payload,
      };
      case actionTypes.GET_ESTIMATE_EMAIL_DETAIL:
        return {
          ...state,
          estimateEmailDetail: action.payload,
        }; 
    case actionTypes.DELETE_ESTIMATE: {
      const updatedEstimateList = _.cloneDeep(
        (state.estimateData as any)?.estimations
      );
      _.remove(updatedEstimateList, {
        _id: action.payload._id,
      });
      return {
        ...state,
        estimateData: {
          ...state.estimateData,
          estimations: [...updatedEstimateList],
        },
      };
    }
    // STARTING USER DAILY COST BREAK DOWN LIST SECTION
    case actionTypes.GET_USER_DAILY_COST_BREAK_DOWN_LIST:
      return {
        ...state,
        userDailyCostBreakDownList: [...action.payload],
      };
    case actionTypes.ADD_USER_DAILY_COST_BREAK_DOWN_LIST: {
      const clonedUDBDL = _.cloneDeep(state.userDailyCostBreakDownList);
      return {
        ...state,
        userDailyCostBreakDownList: [action.payload, ...clonedUDBDL],
      };
    }
    case actionTypes.UPDATE_USER_DAILY_COST_BREAK_DOWN_LIST: {
      const clonedUDBDL: any = _.cloneDeep(state.userDailyCostBreakDownList);
      const index = clonedUDBDL.findIndex(
        (element: any) => element._id === action.payload._id
      );
      if (index >= 0) {
        clonedUDBDL[index] = {
          ...action.payload,
        };
      }
      return {
        ...state,
        userDailyCostBreakDownList: [...clonedUDBDL],
      };
    }

    case actionTypes.DELETE_USER_DAILY_COST_BREAK_DOWN_LIST: {
      const clonedUDBDL: any = _.cloneDeep(state.userDailyCostBreakDownList);
      _.remove(clonedUDBDL, {
        _id: action.payload._id,
      });
      return {
        ...state,
        userDailyCostBreakDownList: [...clonedUDBDL],
      };
    }

    case actionTypes.DELETE_USER_DAILY_COST_BREAK_DOWN_LIST_FROM_ESTIMATE: {
      const clonedUDBDL: any = _.cloneDeep(
        state.estimateDetail.userDailyRateCostBreakdownIds
      );
      _.remove(clonedUDBDL, {
        _id: action.payload._id,
      });
      return {
        ...state,
        estimateDetail: {
          ...state.estimateDetail,
          userDailyRateCostBreakdownIds: [...clonedUDBDL],
        },
      };
    }
    default:
      return state;
  }
};
