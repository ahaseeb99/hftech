import { Dispatch } from "react";
import * as actionTypes from "./types";
import { toastify } from "../../components/toastify/toastify";
import apiClient from "../../utils/axios";

export const ACTION_createStatusAPI =
  (body: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/status", body)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/status-flag/list");
        } else if (res.data.code === 403) {
          toastify.Error(res.data.message);
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_getAllStatusAPI = () => (dispatcher: Dispatch<any>) => {
  dispatcher({ type: actionTypes.GET_ALL_STATUS_LOADING });
  apiClient
    .get("/status")
    .then((res) => {
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_ALL_STATUS_SUCCESS,
          payload: res.data.data,
        });
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getStatusDetailAPI =
  (_id: string) => (dispatcher: Dispatch<any>) => {
    apiClient
      .get("/status/" + _id)
      .then((res) => {
        if (res.data.code === 200) {
          dispatcher({ type: actionTypes.GET_STATUS_DETAIL_SUCCESS, payload: res.data.data })
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_deleteStatusAPI =
  (_id: string, navigate) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/status/" + _id)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/status-flag/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_updateStatusAPI =
  (_id: string, body: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/status-update/" + _id, body)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/status-flag/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_getAllFlagAPI = () => (dispatcher: Dispatch<any>) => {
  dispatcher({ type: actionTypes.GET_ALL_FLAG_LOADING });
  apiClient
    .get("/flag")
    .then((res) => {
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_ALL_FLAG_SUCCESS,
          payload: res.data.data,
        });
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_deleteFlagAPI =
  (_id: string, navigate) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/flag/" + _id)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/status-flag/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_createFlagAPI =
  (body: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/flag", body)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/status-flag/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

  export const ACTION_updateFlagAPI =
  (_id: string, body: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/flag-update/"+ _id, body)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/status-flag/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };


  export const ACTION_getFlagDetailAPI =
  (_id: string) => (dispatcher: Dispatch<any>) => {
    apiClient
      .get("/flag/" + _id)
      .then((res) => {
        if (res.data.code === 200) {
          dispatcher({ type: actionTypes.GET_FLAG_DETAIL_SUCCESS, payload: res.data.data })
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };


  export const ACTION_getAllLabelAPI = () => (dispatcher: Dispatch<any>) => {
    dispatcher({ type: actionTypes.GET_ALL_LABEL_LOADING });
    apiClient
      .get("/label")
      .then((res) => {
        if (res.data.code === 200) {
          dispatcher({
            type: actionTypes.GET_ALL_LABEL_SUCCESS,
            payload: res.data.data,
          });
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };
  



export const ACTION_getLabelDetailAPI =
(_id: string) => (dispatcher: Dispatch<any>) => {
  apiClient
    .get("/label/" + _id)
    .then((res) => {
      if (res.data.code === 200) {
        dispatcher({ type: actionTypes.GET_LABEL_DETAIL_SUCCESS, payload: res.data.data })
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};



export const ACTION_deleteLabelAPI =
  (_id: string, navigate) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/label/" + _id)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/status-flag/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };



export const ACTION_updateLabelAPI =
(_id: string, body: any, navigate: any) => (dispatcher: Dispatch<any>) => {
  apiClient
    .post("/label-update/" + _id, body)
    .then((res) => {
      if (res.data.code === 200) {
        toastify.Success(res.data.message);
        navigate("/status-flag/list");
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};


export const ACTION_createLabelAPI =
  (body: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/label", body)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/status-flag/list");
        } else if (res.data.code === 403) {
          toastify.Error(res.data.message);
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };
