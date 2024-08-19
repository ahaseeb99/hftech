import * as actionTypes from "./types";
import * as _ from "lodash";

// export interface IContact {
//   fullName: string;
//   phoneNumber: string;
//   emailAddress: string;
// }

// export interface IClient extends Document {
//   _id?: string;
//   userId: string;
//   fullName: string;
//   phoneNumber: string;
//   emailAddress: string;
//   description?: string;
//   referenceNumber?: string;
//   locations: string[];
//   contacts: IContact[];
//   isDeleted: boolean;
// }

const initialState = {
  usersData: {},
  userDetail: {},
  usersList: [],
  loading : false,
  userDocument : [],
  userDocumentLoading: false
};

export const usersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_USER_DOCUMENTS_ISLOADING:
      return {
        ...state,
        userDocumentLoading: true,
      };
    case actionTypes.GET_USER_DOCUMENTS_LIST:
      return {
        ...state,
        userDocument: action.payload,
        userDocumentLoading: false
      };
    case actionTypes.GET_USER_LIST_LOADING:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_USERS_LIST:
      return {
        ...state,
        usersList: [...action.payload],
        loading : false
      };
    case actionTypes.GET_USER_DETAIL:
      return {
        ...state,
        userDetail: { ...action.payload },
      };
    case actionTypes.DELETE_USER: {
      const updatedUserList = _.cloneDeep((state.usersData as any)?.clients);
      _.remove(updatedUserList, {
        _id: action.payload._id,
      });
      return {
        ...state,
        clientsData: {
          ...state.usersData,
          clients: [...updatedUserList],
        },
      };
    }
    default:
      return state;
  }
};
