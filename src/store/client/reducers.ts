import * as actionTypes from "./types";
import * as _ from "lodash";

export interface IContact {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
}

export interface IClient extends Document {
  _id?: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  description?: string;
  referenceNumber?: string;
  locations: string[];
  contacts: IContact[];
  isDeleted: boolean;
}

const initialState = {
  clientsData: {},
  clientDetail: {},
};

export const clientsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_CLIENTS_LIST:
      return {
        ...state,
          clientsData: {
            ...state.clientsData,
            clients: [...action.payload],
          },
      };
    case actionTypes.GET_CLIENT_DETAIL:
      return {
        ...state,
        clientDetail: { ...action.payload },
      };
    case actionTypes.DELETE_CLIENT: { 
      const updatedClientList = _.cloneDeep(
        (state.clientsData as any)?.clients
      );
      _.remove(updatedClientList, {
        _id: action.payload._id,
      });
      return {
        ...state,
        clientsData: {
          ...state.clientsData,
          clients: [...updatedClientList],
        },
      };
    }
    default:
      return state;
  }
};
