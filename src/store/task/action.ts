import { Dispatch } from "react";
import { toastify } from "../../components/toastify/toastify";
import apiClient from "../../utils/axios";
import { GET_ALL_TASK, GET_ALL_TASK_ISLOADING, GET_TASK_DETAIL } from "./types";

export const ACTION_addTask =
  (body: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/task", body)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/task/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_updateTask =
  (body: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .patch("/task", body)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/task/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };


export const ACTION_getAllTask = () => (dispatcher: Dispatch<any>) => {
  dispatcher({ type: GET_ALL_TASK_ISLOADING });
  apiClient
    .get("/task")
    .then((res) => {
      if (res.data.code === 200) {
        dispatcher({ type: GET_ALL_TASK, payload: res.data.data });
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getTaskDetail = (_id) => (dispatcher: Dispatch<any>) => {
    apiClient
      .get(`/task/${_id}`)
      .then((res) => {
        if (res.data.code === 200) {
          dispatcher({ type: GET_TASK_DETAIL, payload: res.data.data });
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };
  
export const ACTION_deleteTask = (_id: string, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post(`/task/${_id}`)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/task/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  }; 

export const ACTION_postNoteTask =
  (id: string, reqPacket: any) => (dispatcher: Dispatch<any>) => {
 	apiClient
		.post(`/task/${id}/note`, reqPacket)
		.then((res) => {
			if (res.data.code === 200) {
				toastify.Success(res.data.message)
				dispatcher(ACTION_getTaskDetail(id))
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_deleteNoteTask =
(id: string, reqPacket: any) => (dispatcher: Dispatch<any>) => {
	apiClient
		.patch(`/task/${id}/note`, reqPacket)
		.then((res) => {
			if (res.data.code === 200) {
				toastify.Success(res.data.message)
				dispatcher(ACTION_getTaskDetail(id))
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_deleteTaskDocument =
(id: string, reqPacket: any) => (dispatcher: Dispatch<any>) => {
	apiClient
		.post(`/task/document/delete/${id}`, reqPacket)
		.then((res) => {
			if (res.data.code === 200) {
				toastify.Success(res.data.message)
				dispatcher(ACTION_getTaskDetail(id))
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_UpdateTask =
(id: string, document: any) => (dispatcher: Dispatch<any>) => {
  apiClient
    .post(`/task/document/update/${id}`, document)
    .then((res) => {
      if (res.data.code === 200) {
        toastify.Success(res.data.message)
        dispatcher(ACTION_getTaskDetail(id))
      } else {
        toastify.Error("Something went wrong! Please try again.")
      }
    })
    .catch((error) => console.log("error: ", error))
}
