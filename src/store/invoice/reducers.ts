import * as actionTypes from "./types";

interface IinitialState {
    allInvoicesData: Array<Object>
    invoiceDetail: any;
    isLoading: boolean;
    workOrderData: Array<Object>
}

const initialState: IinitialState = {
    allInvoicesData: [],
    invoiceDetail: {},
    isLoading: false,
    workOrderData: []
}

export const invoiceReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.GET_ALL_INVOICES:
            return {
                ...state,
                allInvoicesData: [...action.payload],
            };
        case actionTypes.GET_SINGLE_INVOICE_DETAIL:
            return {
                ...state,
                invoiceDetail: { ...action.payload },
            };
        case actionTypes.GET_ALL_INVOICES_IS_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case actionTypes.GET_WORK_ORDER_FOR_INVOICE:
            return {
                ...state,
                workOrderData: action.payload
            }
        default:
            return state;
    }
};