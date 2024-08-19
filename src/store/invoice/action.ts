import { Dispatch } from "react";
import { toastify } from "../../components/toastify/toastify";
import apiClient from "../../utils/axios";
import { GET_ALL_INVOICES, GET_ALL_INVOICES_IS_LOADING, GET_SINGLE_INVOICE_DETAIL, GET_WORK_ORDER_FOR_INVOICE } from "./types";

export const ACTION_createInvoice =
    (reqPacket: any, navigate: any) => (dispatcher: Dispatch<any>) => {
        apiClient
            .post("/invoice", reqPacket)
            .then((res) => {
                if (res.data.code === 200) {
                    toastify.Success(res.data.message);
                    navigate("/invoice/list");
                } else {
                    toastify.Error("Something went wrong! Please try again.");
                }
            })
            .catch((error) => console.log("error: ", error));
    };

export const ACTION_getAllInvoices =
    () => (dispatcher: Dispatch<any>) => {
        dispatcher({
            type: GET_ALL_INVOICES_IS_LOADING,
            payload: true
        })
        apiClient
            .get("/invoice")
            .then((res) => {
                if (res.data.code === 200) {
                    dispatcher({
                        type: GET_ALL_INVOICES,
                        payload: res.data.data
                    })
                } else {
                    toastify.Error("Something went wrong! Please try again.");
                }
                dispatcher({
                    type: GET_ALL_INVOICES_IS_LOADING,
                    payload: false
                })
            })
            .catch((error) => {
                console.log("error: ", error)
                dispatcher({
                    type: GET_ALL_INVOICES_IS_LOADING,
                    payload: false
                })
            });
    };


export const ACTION_getInvoicesDetail =
    (_id) => (dispatcher: Dispatch<any>) => {
        apiClient
            .get("/invoice-detail/" + _id)
            .then((res) => {
                if (res.data.code === 200) {
                    dispatcher({
                        type: GET_SINGLE_INVOICE_DETAIL,
                        payload: res.data.data
                    })
                } else {
                    toastify.Error("Something went wrong! Please try again.");
                }
            })
            .catch((error) => console.log("error: ", error));
    };

export const ACTION_deleteInvoice =
    (_id: any, navigate: any) => (dispatcher: Dispatch<any>) => {
        apiClient
            .post("/invoice/" + _id)
            .then((res) => {
                if (res.data.code === 200) {
                    toastify.Success(res.data.message);
                    navigate("/invoice/list");
                } else {
                    toastify.Error("Something went wrong! Please try again.");
                }
            })
            .catch((error) => console.log("error: ", error));
    };

export const ACTION_UpdateInvoice =
    (req: any, _id: any, navigate: any) => (dispatcher: Dispatch<any>) => {
        apiClient
            .post("/invoice-update/" + _id, req)
            .then((res) => {
                if (res.data.code === 200) {
                    toastify.Success(res.data.message);
                    navigate("/invoice/list");
                } else {
                    toastify.Error("Something went wrong! Please try again.");
                }
            })
            .catch((error) => console.log("error: ", error));
    };


  
export const ACTION_getWorkOrderForInvoice =
(clientId: any) => (dispatcher: Dispatch<any>) => {
    apiClient
        .get("/invoice-work-order/" + clientId)
        .then((res) => {
            if (res.data.code === 200) {
                dispatcher({
                    type : GET_WORK_ORDER_FOR_INVOICE,
                    payload : res.data.data
                })
            } else {
                toastify.Error("Something went wrong! Please try again.");
            }
        })
        .catch((error) => console.log("error: ", error));
};  

  
export const ACTION_updateWorkOrderValue = () => (dispatcher: Dispatch<any>) => {
        dispatcher({
            type: GET_WORK_ORDER_FOR_INVOICE,
            payload: []
        })

    };  