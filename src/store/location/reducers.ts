import _ from "lodash";
import * as actionTypes from "./types";

interface I_InitialState {
  locationsData: any;
  locationDetail: any;
  countriesData: any;
}

const initialState: I_InitialState = {
  locationsData: [],
  locationDetail: {},
  countriesData: {},
};

export const locationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    // **** Begin: countries data ****
    case actionTypes.GET_COUNTRY_LIST:
      return {
        ...state,
        countriesData: { ...action.payload },
      };
    case actionTypes.RESET_COUNTRY_LIST:
      return {
        ...state,
        countriesData: {},
      };

    // **** Begin: Location data ****
    case actionTypes.GET_LOCATION_LIST:
      return {
        ...state,
        locationsData: [ ...action.payload ],
      };
    case actionTypes.GET_LOCATION_DETAIL:
      return {
        ...state,
        locationDetail: { ...action.payload },
      };
    case actionTypes.RESET_LOCATION_DETAIL:
      return {
        ...state,
        locationDetail: {},
      };
    case actionTypes.DELETE_LOCATION: {
      const clonedLocations: any = _.cloneDeep(state.locationsData.locations);
      _.remove(clonedLocations, {
        _id: action.payload._id,
      });
      return {
        ...state,
        locationsData: {
          ...state.locationsData,
          locations: clonedLocations,
        },
      };
    }
    default:
      return state;
  }
};
