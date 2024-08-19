import * as actionTypes from "./types";

export enum IUserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
  TECH = 'TECH',
}
export enum IUserStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
}

interface I_initialState {
  isAuthenticated: boolean;
  user: any;
  usersData: any;
  loading: boolean;
}

const initialState: I_initialState = {
  isAuthenticated: false,
  user: JSON.parse(localStorage.getItem("userData") as string)
    ? JSON.parse(localStorage.getItem("userData") as string)
    : {},
  usersData: {},
  loading: false,
};

export const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.LOGIN_REQUEST_ERROR:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case actionTypes.CLEAR_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
      };
    case actionTypes.GET_ALL_USERS:
      return {
        ...state,
        usersData: action.payload,
      };
    case actionTypes.UPDATE_USER_INFO: {
      const role = action.payload.role;
      if (role === IUserRoles.ADMIN) {
        return {
          ...state,
          user: { ...action.payload },
        };
      } else {
        const updatedUsers = state.usersData?.users?.map((singleUsers: any) => {
          if (singleUsers._id === action.payload._id) {
            return action.payload;
          } else {
            return singleUsers;
          }
        });
        return {
          ...state,
          usersData: {
            ...state.usersData,
            users: updatedUsers,
          },
        };
      }
    }
    case actionTypes.DELETE_USER: {
      const _id = action.payload;
      const updatedUsers = state.usersData?.users.filter(
        (_user: any) => _user._id !== _id
      );
      return {
        ...state,
        usersData: {
          ...state.usersData,
          users: updatedUsers,
        },
      };
    }
    default:
      return state;
  }
};
