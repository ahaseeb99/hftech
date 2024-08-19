import _ from "lodash";
import * as actionTypes from "./types"

interface I_InitialState {
    rolesData: any;
    roleDetail: any;
    rolesNameList : any
  }
  
  const initialState: I_InitialState = {
    rolesData: [],
    roleDetail: {},
    rolesNameList : []
  };

  export const roleReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.GET_ROLES_LIST:
            return {
                ...state,
                rolesData: [ ...action.payload ],
              };
            case actionTypes.GET_ROLE_DETAIL:
                return {
                    ...state,
                    roleDetail: { ...action.payload },
                };
            case actionTypes.GET_ROLES_NAME_LIST : 
            return {
              ...state,
              rolesNameList: [ ...action.payload ],
          };
        default:
        return state;
    }

}

