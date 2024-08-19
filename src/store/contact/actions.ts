import apiClient from "../../utils/axios";
import {  Dispatch } from "redux";
import * as actionTypes from "./types";
import { toastify } from "../../components/toastify/toastify";

export const ACTION_getContacts = (clientId? : string) => (dispatcher: Dispatch<any>) => {
  const Id = clientId ? clientId : '';
  apiClient
    .get("/contacts?clientId="+Id)
    .then((res) => {
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_CONTACTS_LIST,
          payload: res.data.data,
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_createContact =
  (reqPacket: any, navigate: any, navigateTo = '/contact/list') => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/contacts", reqPacket)
      .then((res) => {
        if (res.data.code === 201) {
          toastify.Success(res.data.message);
          navigate(navigateTo);
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_getContactById =
  (_id: string) => (dispatcher: Dispatch<any>) => {
    apiClient
      .get("/contacts/" + _id)
      .then((res) => {
        if (res.data.code === 200) {
          dispatcher({
            type: actionTypes.GET_CONTACT_DETAIL,
            payload: res.data.data,
          });
          // toastify.Success(res.data.message);
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_deleteContact =
  (reqData: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/contacts/" + reqData._id, reqData)
      .then((res) => {
        if (res.data.code === 200) {
          const _id = reqData?._id
          dispatcher({
            type: actionTypes.DELETE_CONTACT,
            payload: {
              _id
            },
          });
          toastify.Success(res.data.message);
          navigate("/contact/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_updateContact =
  (reqPacket: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .patch("/contacts", reqPacket)
      .then((res) => {
      console.log('update contact res : ', res)
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/contact/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };
