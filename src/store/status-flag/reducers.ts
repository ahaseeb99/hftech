import * as actionTypes from "./types";

interface IinitialState {
  allStatusData: Array<Object>;
  isLoading: boolean;
  isLoadingFlag: boolean;
  isLoadingLabel: false
  allFlagData: Array<Object>;
  statusDetail : any
  flagDetail : any
  allLabels: any
  labelDetail : any
}

const initialState: IinitialState = {
  allStatusData: [],
  isLoading: false,
  isLoadingFlag: false,
  allFlagData: [],
  statusDetail : {},
  flagDetail : {},
  allLabels : [],
  isLoadingLabel: false,
  labelDetail : {}
};

export const flagStatusReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_ALL_STATUS_SUCCESS:
      return {
        ...state,
        allStatusData: action.payload,
        isLoading: false,
      };
    case actionTypes.GET_ALL_FLAG_SUCCESS:
      return {
        ...state,
        allFlagData: action.payload,
        isLoadingFlag: false,
      };
    case actionTypes.GET_ALL_STATUS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.GET_ALL_FLAG_LOADING:
      return {
        ...state,
        isLoadingFlag: true,
      };
    case actionTypes.GET_STATUS_DETAIL_SUCCESS:
      return {
        ...state,
        statusDetail: action.payload,
      };
      case actionTypes.GET_FLAG_DETAIL_SUCCESS:
        return {
          ...state,
          flagDetail: action.payload,
        };
    case actionTypes.GET_ALL_LABEL_LOADING:
      return {
        ...state,
        isLoadingLabel: true,
      };
    case actionTypes.GET_ALL_LABEL_SUCCESS:
      return {
        ...state,
        allLabels: action.payload,
        isLoadingLabel: false,
      };
      case actionTypes.GET_LABEL_DETAIL_SUCCESS:
        return {
          ...state,
          labelDetail: action.payload,
        };
    default:
      return state;
  }
};
