import apiClient from "../../utils/axios";
import { Dispatch } from "redux";
import * as actionTypes from "./types";
import { toastify } from "../../components/toastify/toastify";

// Set logged in user (Verified)
export const setCurrentUser = (authToken: string, data: any) => {
  if (!localStorage.authToken || !localStorage.userData) {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userData", JSON.stringify(data));
  }
  return {
    type: actionTypes.SET_CURRENT_USER,
    payload: data,
  };
};

export const clearCurrentUser = () => {
  return {
    type: actionTypes.CLEAR_CURRENT_USER,
  };
};

// Log user out (Verified)
export const logoutUser = (navigate: any) => (dispatch: Dispatch<any>) => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
  dispatch(clearCurrentUser());
  navigate("/");
};

export const ACTION_getProfileData = () => (dispatch: Dispatch<any>) => {
  apiClient
    .get("/auth/profile")
    .then((res) => {
      const { user } = res.data;
      if (user) {
        dispatch({
          type: actionTypes.SET_CURRENT_USER,
          payload: user,
        });
      } else {
        console.log("checking error: ", res.data);
      }
    })
    .catch((err) => {
      console.log("checking err: ", err);
    });
};

export const ACTION_deleteUser = (_id: string) => (dispatch: Dispatch<any>) => {
  apiClient
    .delete("/auth/" + _id)
    .then((res) => {
      const { code } = res.data;
      if (code === 200) {
        dispatch({
          type: actionTypes.DELETE_USER,
          payload: _id,
        });
        toastify.Success(res.data.message);
      } else {
        toastify.Error(res.data.message);
      }
    })
    .catch((err) => {
      console.log("checking err: ", err);
    });
};

export const ACTION_updateUserProfile =
  (reqPacket: any) => (dispatch: Dispatch<any>) => {
    apiClient
      .patch("/auth/update", reqPacket)
      .then((res) => {
        const { data } = res.data;
        if (data) {
          dispatch({
            type: actionTypes.UPDATE_USER_INFO,
            payload: data,
          });
          toastify.Success(res.data.message);
        } else {
          toastify.Error(res.data.message);
        }
      })
      .catch((err) => {
        console.log("checking err: ", err);
      });
  };

export const ACTION_getAllUsers = () => (dispatch: Dispatch<any>) => {
  apiClient
    .get("/auth/users")
    .then((res) => {
      const { data } = res.data;
      if (data) {
        dispatch({
          type: actionTypes.GET_ALL_USERS,
          payload: data,
        });
        toastify.Success(res.data.message);
      } else {
        toastify.Error(res.data.message);
      }
    })
    .catch((err) => {
      console.log("checking err: ", err);
    });
};

export const ACTION_registerUser =
  (reqPacket: any, navigate: any, callBack: (data: any) => void) => async (dispatch: Dispatch<any>) => {
    apiClient
      .post("/auth/register", reqPacket)
      .then((res) => {
        const { code, data } = res.data;
        if (code === 201) {
          toastify.Success(res.data.message);
          navigate("/");
          callBack(data)
        } else {
          toastify.Error(res.data.message);
        }
      })
      .catch((err) => {
        console.log("checking err: ", err);
      });
  };

export const ACTION_login =
  (reqPacket: any, navigate: any, callBack: (data: any) => void) => async (dispatch: Dispatch<any>) => {
    apiClient
      .post("/auth/login", reqPacket)
      .then((res) => {
        const { code, data } = res.data;
        if (code === 200) {
          dispatch(setCurrentUser(data.authToken, data.user));
          toastify.Success(res.data.message);
          navigate("/");
          // need to be changed
          // if (!(data?.user?.signature)) {
            console.log("Action-login-user-data", data.user);
            callBack(data.user);
          // }
        } else {
          toastify.Error(res.data.message);
        }
      })
      .catch((err) => {
        console.log("checking err: ", err);
      });
  };

export const ACTION_forgotPassword =
  (reqPacket: any, navigate: any) => (dispatch: Dispatch<any>) => {
    apiClient
      .post("/auth/forgot-password", reqPacket)
      .then((res) => {
        if (res.status === 200) {
          toastify.Success(res.data.message);
          navigate("/auth/login");
        } else {
          toastify.Error(res.data.message);
        }
      })
      .catch((err) => {
        console.log("checking err: ", err);
      });
  };

export const ACTION_resetPassword =
  (reqPacket: any, navigate: any) => (dispatch: Dispatch<any>) => {
    apiClient
      .post("/auth/reset-password", reqPacket)
      .then((res) => {
        const { code } = res.data;
        if (code === 200) {
          toastify.Success(res.data.message);
          navigate("/auth/login");
        } else {
          toastify.Error(res.data.message);
        }
      })
      .catch((err) => {
        console.log("checking err: ", err);
      });
  };

export const ACTION_sendOtp =
  (reqPacket: any, navigate: any) => (dispatch: Dispatch<any>) => {
    apiClient
      .post("/auth/reset-password", reqPacket)
      .then((res) => {
        const { code, data } = res.data;
        if (code === 200) {
          setCurrentUser(data.authToken, data.user);
          toastify.Success(res.data.message);
          navigate("/verify-otp");
        } else {
          toastify.Error(res.data.message);
        }
      })
      .catch((err) => {
        console.log("checking err: ", err);
      });
  };

export const ACTION_verifyOtp =
  (reqPacket: any, navigate: any) => (dispatch: Dispatch<any>) => {
    apiClient
      .post("/auth/verify-otp", reqPacket)
      .then((res) => {
        const { code, data } = res.data;
        if (code === 200) {
          setCurrentUser(data.authToken, data.user);
          toastify.Success(res.data.message);
          navigate("/update-password");
        } else {
          toastify.Error(res.data.message);
        }
      })
      .catch((err) => {
        console.log("checking err: ", err);
      });
  };

export const ACTION_updatePassword =
  (reqPacket: any, navigate: any) => (dispatch: Dispatch<any>) => {
    apiClient
      .post("/auth/update-password", reqPacket)
      .then((res) => {
        const { code, data } = res.data;
        if (code === 200) {
          setCurrentUser(data.authToken, data.user);
          toastify.Success(res.data.message);
          navigate("/");
        } else {
          toastify.Error(res.data.message);
        }
      })
      .catch((err) => {
        console.log("checking err: ", err);
      });
  };



export const ACTION_signatureImageSave =
  (reqPacket: any, signupData) => (dispatch: Dispatch<any>) => {
    apiClient
      .post("/upload/signature", reqPacket)
      .then((res) => {
        const reqData = { ...signupData, signature: res.data.imageUrl };
        dispatch(ACTION_updateUserProfile(reqData));
      })
      .catch((err) => {
        console.log("checking err: ", err);
      });
  };
