import apiClient from "../../utils/axios";
import {  Dispatch } from "redux";
import * as actionTypes from "./types";
import { toastify } from "../../components/toastify/toastify";

export const ACTION_getClients = () => (dispatcher: Dispatch<any>) => {
  apiClient
    .get("/client")
    .then((res) => {
      if (res.data.code === 200) {
        console.log("client list res : ", res)
        dispatcher({
          type: actionTypes.GET_CLIENTS_LIST,
          payload: res.data.data.clients,
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

// export const ACTION_getInactiveClients = () => (dispatcher: Dispatch<any>) => {
//   apiClient
//     .get("/inActive-client")
//     .then((res) => {
//       if (res.data.code === 200) {
//         console.log("Inactive client list res : ", res)
//         dispatcher({
//           type: actionTypes.GET_CLIENTS_LIST,
//           payload: res.data.data.clients,
//         });
        
//         // toastify.Success(res.data.message);
//       } else {
//         toastify.Error("Something went wrong! Please try again.");
//       }
//     })
//     .catch((error) => console.log("error: ", error));
// };


export const ACTION_createClient =
  async (reqPacket: any, navigate: any)  => {
    const res = await apiClient.post("/client", reqPacket);
      if(res.status === 201) {
        return res
      }else {
        toastify.Error("Something went wrong! Please try again.");
      }
      // .then((res) => {
      //   if (res.data.code === 201) {
      //     toastify.Success(res.data.message);
      //     // navigate("/client/list");
      //   } else {
      //     toastify.Error("Something went wrong! Please try again.");
      //   }
      // })
      // .catch((error) => console.log("error: ", error));
  };

export const ACTION_getClientById =
  (_id: string) => (dispatcher: Dispatch<any>) => {
    apiClient
      .get("/client/" + _id)
      .then((res) => {
        console.log("single client res : ", res)
        if (res.data.code === 200) {
          dispatcher({
            type: actionTypes.GET_CLIENT_DETAIL,
            payload: res.data.data,
          });
          // toastify.Success(res.data.message);
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_deleteClient =
  (_id: string, navigate) => (dispatcher: Dispatch<any>) => {
    apiClient
      .delete("/client/" + _id)
      .then((res) => {
        if (res.data.code === 200) {
          dispatcher({
            type: actionTypes.DELETE_CLIENT,
            payload: {
              _id,
            },
          });
          toastify.Success(res.data.message);
          navigate("/client/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_updateClient =
  (reqPacket: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .patch("/client", reqPacket)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/client/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };
