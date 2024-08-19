import * as actionTypes from "./types";
import * as _ from "lodash";

export interface IContact {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  clientId: string;
}

const initialState = {
  contactsData: {},
  contactDetail: {},
};

export const contactsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.GET_CONTACTS_LIST:
      return {
        ...state,
        contactsData: { ...action.payload },
      };
    case actionTypes.GET_CONTACT_DETAIL:
      return {
        ...state,
        contactDetail: { ...action.payload },
      };
    case actionTypes.DELETE_CONTACT: {
      const updatedContactsList = _.cloneDeep(
        (state.contactsData as any)?.contacts
      );
      _.remove(updatedContactsList, {
        _id: action.payload._id,
      });
      return {
        ...state,
        contactsData: {
          ...state.contactsData,
          clients: [...updatedContactsList],
        },
      };
    }
    default:
      return state;
  }
};
