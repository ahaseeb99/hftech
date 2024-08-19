import _ from "lodash";
import * as actionTypes from "./types";

interface I_InitialState {
  workOrderList: any;
  monthlyWorkorderList: any;
  workOrderPaginationMetadata: any;
  allWorkordersList: any;
  allHFWorkordersList: any;
  propertyList: any;
  employeeList: any;
  taskList: any;
  assetList: any;
  contactList: any;
  contactInfo: any;
  workOrderDetail: any;
  employeeDetail: any;
  workOrderEmailDetail : any;
  loading : boolean
  workOrderFlags : any;
  workOrderStatus : any;
  workOrderLabel: any
}

const initialState: I_InitialState = {
  workOrderList: [],
  monthlyWorkorderList: [],
  workOrderPaginationMetadata: {},
  allWorkordersList: [],
  allHFWorkordersList: [],
  propertyList: [],
  employeeList: [],
  taskList: [],
  assetList: [],
  contactList: [],
  contactInfo: {},
  workOrderDetail: {},
  employeeDetail: {},
  workOrderEmailDetail : [],
  loading : false,
  workOrderFlags : [],
  workOrderStatus : [],
  workOrderLabel: []
};

export const workOrderReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_HF_WORK_ORDER_LIST_REQUEST : {
      return {
        ...state,
        loading : action.payload,
      }
    }
    case actionTypes.GET_WORK_ORDER_FLAG_LIST : {
      return {
        ...state,
        workOrderFlags : action.payload,
      }
    }
    case actionTypes.GET_WORK_ORDER_STATUS_LIST : {
      return {
        ...state,
        workOrderStatus : action.payload,
      }
    }
    case actionTypes.GET_WORK_ORDER_LABEL_LIST : {
      return {
        ...state,
        workOrderLabel : action.payload,
      }
    }
    case actionTypes.GET_WORK_ORDER_LIST:
      return {
        ...state,
        workOrderList: action.payload,
      };
      case actionTypes.GET_ALL_WORK_ORDER_LIST:
      return {
        ...state,
        allWorkordersList: action.payload,
      };
      case actionTypes.DELETE_WORKORDER: {
        const clonedWorkOrders: any = _.cloneDeep(state.allWorkordersList);
        _.remove(clonedWorkOrders, {
          _id: action.payload._id,
        });
        return {
          ...state,
          locationsData: {
            ...state.allWorkordersList,
            workOrders: clonedWorkOrders,
          },
        };
      }
    case actionTypes.GET_PROPERTY_LIST:
      return {
        ...state,
        propertyList: action.payload,
      };
    case actionTypes.GET_EMPLOYEE_LIST:
      return {
        ...state,
        employeeList: action.payload,
      };
    case actionTypes.GET_SINGLE_WORK_ORDER_EMAIL_DETAIL:
      return {
        ...state,
        workOrderEmailDetail : action.payload,
    };
    case actionTypes.ASSETS_LIST:
      return {
        ...state,
        assetList: action.payload,
      };
    case actionTypes.GET_TASK_LIST:
      return {
        ...state,
        taskList: action.payload,
      };
    case actionTypes.GET_CONTACTS_LIST:
      return {
        ...state,
        contactList: action.payload,
      };
    case actionTypes.GET_CONTACT_INFO:
      return {
        ...state,
        contactInfo: action.payload,
      };
    case actionTypes.GET_SINGLE_WORK_ORDER:
      return {
        ...state,
        workOrderDetail: action.payload,
      };
    case actionTypes.CLEAR_WORK_ORDER_DETAIL:
      return {
        ...state,
        workOrderDetail: action.payload,
      };
    case actionTypes.GET_SINGLE_EMPLOYEE:
      return {
        ...state,
        employeeDetail: action.payload,
      };
    case actionTypes.GET_HF_WORK_ORDER_LIST:
      return {
        ...state,
        allHFWorkordersList: [...action.payload.workOrders],
        workOrderPaginationMetadata: action.payload.metaData
      };
    case actionTypes.GET_MONTHLY_WORK_ORDER_LIST:
        return {
          ...state,
          monthlyWorkorderList: [...action.payload],
        };
    default:
      return state;
  }
};
