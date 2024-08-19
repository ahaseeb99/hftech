import { Dispatch } from "react";
import { toastify } from "../../components/toastify/toastify";
import apiClient from "../../utils/axios";
import { GET_ALL_PURCHASE, GET_ALL_PURCHASE_ISLOADING, GET_PO_NUMBER, GET_SINGLE_PURCHASE_DETAIL } from "./types";

export const ACTION_createPurchaseOrder =
    (reqPacket: any, navigate: any) => (dispatcher: Dispatch<any>) => {
        apiClient
            .post("/purchase", reqPacket)
            .then((res) => {
                if (res.data.code === 200) {
                    toastify.Success(res.data.message);
                    navigate("/purchase/list");
                } else {
                    toastify.Error("Something went wrong! Please try again.");
                }
            })
            .catch((error) => console.log("error: ", error));
    };


export const ACTION_getAllPurchaseOrder =
    () => (dispatcher: Dispatch<any>) => {
        dispatcher({
            type: GET_ALL_PURCHASE_ISLOADING,
            payload: true
        })
        apiClient
            .get("/purchase")
            .then((res) => {
                if (res.data.code === 200) {
                    dispatcher({
                        type: GET_ALL_PURCHASE,
                        payload: res.data.data
                    })
                } else {
                    toastify.Error("Something went wrong! Please try again.");
                }
                dispatcher({
                    type: GET_ALL_PURCHASE_ISLOADING,
                    payload: false
                })
            })
            .catch((error) => {
                console.log("error: ", error)
                dispatcher({
                    type: GET_ALL_PURCHASE_ISLOADING,
                    payload: false
                })
            });
    };


export const ACTION_getPurchaseOrderDetail =
    (_id: any) => (dispatcher: Dispatch<any>) => {
        apiClient
            .get("/purchase-detail/" + _id)
            .then((res) => {
                if (res.data.code === 200) {
                    dispatcher({
                        type: GET_SINGLE_PURCHASE_DETAIL,
                        payload: res.data.data
                    })
                } else {
                    toastify.Error("Something went wrong! Please try again.");
                }
            })
            .catch((error) => console.log("error: ", error));
    };


export const ACTION_deletePurchaseOrder =
    (_id: any, navigate: any) => (dispatcher: Dispatch<any>) => {
        apiClient
            .post("/purchase/" + _id)
            .then((res) => {
                if (res.data.code === 200) {
                    toastify.Success(res.data.message)
                    navigate("/purchase/list")
                } else {
                    toastify.Error("Something went wrong! Please try again.");
                }
            })
            .catch((error) => console.log("error: ", error));
    };


export const ACTION_editPurchaseOrder =
    (_id: any, navigate: any,reqData) => (dispatcher: Dispatch<any>) => {
        apiClient
            .post("/purchase-update/" + _id,reqData)
            .then((res) => {
                if (res.data.code === 200) {
                    toastify.Success(res.data.message)
                    navigate("/purchase/view/"+_id)
                } else {
                    toastify.Error("Something went wrong! Please try again.");
                }
            })
            .catch((error) => console.log("error: ", error));
    };

    export const ACTION_getPurchaseOrderNumber =
    (clientId) => (dispatcher: Dispatch<any>) => {
        apiClient
            .get("/purchase-get-po-number/" + clientId)
            .then((res) => {
                if (res.data.code === 200) {
                    dispatcher({
                        type : GET_PO_NUMBER,
                        payload : res.data.data
                    })
                } else {
                    toastify.Error("Something went wrong! Please try again.");
                }
            })
            .catch((error) => console.log("error: ", error));
    };
