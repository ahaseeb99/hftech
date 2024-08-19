import apiClient from "../../utils/axios";
import { Dispatch } from "redux";
import * as actionTypes from "./types";
import { toastify } from "../../components/toastify/toastify";

export const ACTION_getUsers = (roles? : any) => (dispatcher: Dispatch<any>) => {
  dispatcher({type : actionTypes.GET_USER_LIST_LOADING,payload : true})
  apiClient
    .post("/auth/users",{roles})
    .then((res) => {
      console.log("User RES : ", res);
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_USERS_LIST,
          payload: res.data.data.users,
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
  // .then((res) => {
  //   console.log("USERS LiST : ", res?.data?.data?.Entities);
  //   if (res.data.code === 200) {
  //     dispatcher({
  //       type: actionTypes.GET_USERS_LIST,
  //       payload: res.data.data.Entities,
  //     });
  //     // toastify.Success(res.data.message);
  //   } else {
  //     toastify.Error("Something went wrong! Please try again.");
  //   }
  // })
  // .catch((error) => console.log("error: ", error));
};

export const ACTION_generatePhoneList = () => (dispatcher: Dispatch<any>) => {
  apiClient
			.get("/auth/phone-list-pdf")
			.then((res) => {
				if (res.data.code === 200) {
					dispatcher(ACTION_downloadPdf(res.data.data))
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
}

export const ACTION_downloadPdf = (url: string,) => () => {
	apiClient
		.get(url, {
			responseType: "blob",
		})
		.then((res) => {
			const blob = res.data
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.style.display = "none"
			a.href = url
			// the filename you want
			a.download = `phoneList.pdf`
			document.body.appendChild(a)
			a.click()
			window.URL.revokeObjectURL(url)
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_createUser =
  (reqPacket: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/client", reqPacket)
      .then((res) => {
        if (res.data.code === 201) {
          toastify.Success(res.data.message);
          navigate("/client/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_getUserById =
  (_id: string) => (dispatcher: Dispatch<any>) => {
    apiClient
      .get("/auth/" + _id)
      .then((res) => {
        if (res.data.code === 200) {
          console.log("MY USER DETAIL : ", res);
          dispatcher({
            type: actionTypes.GET_USER_DETAIL,
            payload: res.data.data,
          });
          // toastify.Success(res.data.message);
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };


export const ACTION_deleteUserDocument =
  (userId: string, document: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post(`/user/document/delete/${userId}`, document)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message)
          dispatcher(ACTION_getUserById(userId))
        } else {
          toastify.Error("Something went wrong! Please try again.")
        }
      })
      .catch((error) => console.log("error: ", error))
  }

export const ACTION_deleteUser =
  (_id: string, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .delete("/auth/" + _id)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/users/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_updateUser =
  (reqPacket: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .patch("/auth/update", reqPacket)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/users/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };



  export const ACTION_getUsersDocuments =
  (body) => (dispatcher: Dispatch<any>) => {
    dispatcher({
      type: actionTypes.GET_USER_DOCUMENTS_ISLOADING,
    });
    apiClient
      .post("/user/documents",body)
      .then((res) => {
        if (res.data.code === 200) {
          dispatcher({
            type: actionTypes.GET_USER_DOCUMENTS_LIST,
            payload: res.data.data,
          });
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };