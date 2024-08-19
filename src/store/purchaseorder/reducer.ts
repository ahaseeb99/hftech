import * as actionTypes from "./types";

interface IinitialState {
    allPurchaseData: Array<Object>
    purchaseDetail: any;
    isLoading : boolean;
    poNumber : Array<any>
}

const initialState: IinitialState = {
    allPurchaseData: [],
    purchaseDetail: {},
    isLoading : false,
    poNumber : []
}

export const purchaseReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.GET_ALL_PURCHASE:
            return {
                ...state,
                allPurchaseData: [...action.payload],
            };
        case actionTypes.GET_SINGLE_PURCHASE_DETAIL:
            return {
                ...state,
                purchaseDetail: { ...action.payload },
            };
        case actionTypes.GET_PO_NUMBER:
            return {
                ...state,
                poNumber: [...action.payload],
            };    
        case actionTypes.GET_ALL_PURCHASE_ISLOADING : 
            return {
                ...state,
                isLoading : action.payload
            }   
        default:
            return state;
    }
};