import apiClient from "../../utils/axios";
import { Dispatch } from "redux";
import * as actionTypes from "./types";
import { toastify } from "../../components/toastify/toastify";
import { uploadFileToS3 } from "../../utils/uploadFileToS3";


export const ACTION_getWorkOrdersAPI = () => (dispatcher: Dispatch<any>) => {
  apiClient
    .get("/corrigo?page=undefined&rows=undefined")
    .then((res) => {
      console.log("work order data res : ", res);
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_WORK_ORDER_LIST,
          payload: res?.data?.data?.Entities || [],
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getWorkOrdersFlags = () => (dispatcher: Dispatch<any>) => {
  apiClient
    .get("/hf-workorder-flag")
    .then((res) => {
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_WORK_ORDER_FLAG_LIST,
          payload: res?.data?.data,
        });
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getWorkOrdersLabels = () => (dispatcher: Dispatch<any>) => {
  apiClient
    .get("/hf-workorder-label")
    .then((res) => {
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_WORK_ORDER_LABEL_LIST,
          payload: res?.data?.data,
        });
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getWorkOrderStatus = () => (dispatcher: Dispatch<any>) => {
  apiClient
    .get("/hf-workorder-status")
    .then((res) => {
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_WORK_ORDER_STATUS_LIST,
          payload: res?.data?.data,
        });
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getHFWorkOrderByIdAPI =
  (id) => (dispatcher: Dispatch<any>) => {
    apiClient
      .get("/hfWorkOrder/" + id)
      .then((res) => {
        console.log("work order data res : ", res);
        if (res.data.code === 200) {
          // const resObj = res?.data?.data?.Entities[0]?.Data
          dispatcher({
            type: actionTypes.GET_SINGLE_WORK_ORDER,
            payload: res?.data?.data
            // payload: {...resObj,Documents: resObj.Documents.map(doc => {
            //   return {...doc, IsPublic: true}
            // })},
          });
          // toastify.Success(res.data.message);
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_clearWorkOrderDetail = () => (dispatcher: Dispatch<any>) => {  
  dispatcher({
    type: actionTypes.CLEAR_WORK_ORDER_DETAIL,
    payload: {}

  });
}

export const ACTION_getHFWorkOrderEmailDetailByIdAPI =
(id) => (dispatcher: Dispatch<any>) => {  
  apiClient
    .get("/emaillogs/workorder/" + id)
    .then((res) => {
      console.log("work order email detail data res : ", res);
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_SINGLE_WORK_ORDER_EMAIL_DETAIL,
          payload: res?.data?.data
 
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

  export const ACTION_sendWorkorderEmail = 
  (_id: string, reqPacket: any) => (dispatcher: Dispatch<any>) => {
    apiClient
			.post("/send-workorder-email/" + _id, reqPacket)
			.then((res) => {
				if (res.data.code === 200) {
          dispatcher(ACTION_getHFWorkOrderByIdAPI(_id))
          dispatcher(ACTION_getHFWorkOrderEmailDetailByIdAPI(_id))
					toastify.Success(res.data.message)
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
  }

  export const ACTION_sendAttachmentsWorkorderEmail = 
  (_id: string, reqPacket: any) => (dispatcher: Dispatch<any>) => {
    apiClient
			.post("/workorder-attachments-email/" + _id, reqPacket)
			.then((res) => {
				if (res.data.code === 200) {
					toastify.Success(res.data.message)
          dispatcher(ACTION_getHFWorkOrderEmailDetailByIdAPI(_id))
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
  }


  export const ACTION_getWorkOrderByIdAPI =
  (id) => (dispatcher: Dispatch<any>) => {
    apiClient
      .get("/corrigo/" + id)
      .then((res) => {
        console.log("work order data res : ", res);
        if (res.data.code === 200) {
          // const resObj = res?.data?.data?.Entities[0]?.Data
          dispatcher({
            type: actionTypes.GET_SINGLE_WORK_ORDER,
            payload: res?.data?.data?.Entities[0]?.Data
            // payload: {...resObj,Documents: resObj.Documents.map(doc => {
            //   return {...doc, IsPublic: true}
            // })},
          });
          // toastify.Success(res.data.message);
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_getWorkOrders = () => (dispatcher: Dispatch<any>) => {
  apiClient
    .get("/hf-workorder-new")
    .then((res) => {
      console.log("work order data res : ", res);
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_WORK_ORDER_LIST,
          payload: res?.data?.data?.workOrders || [],
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getAllWorkOrders = () => (dispatcher: Dispatch<any>) => {
  apiClient
    .get("/corrigo/allWorkorders")
    .then((res) => {
      console.log("ALL work order data res : ", res);
      if (res.data.code === 200) {
        const allWorkOrders = res?.data?.data?.Entities.map(wo => wo?.Data);
        dispatcher({
          type: actionTypes.GET_ALL_WORK_ORDER_LIST,
          payload: allWorkOrders || [],
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getMonthlyWorkOrders = (start: string, end: string) => (dispatcher: Dispatch<any>) => {
  apiClient
    .get(`/hf-workorder-monthly?start=${start}&end=${end}`)
    .then((res) => {
      console.log("work order data res : ", res);
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_MONTHLY_WORK_ORDER_LIST,
          payload: res?.data?.data?.workOrders || [],
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getAllHFWorkOrders = () => (dispatcher: Dispatch<any>) => {
  apiClient
    .get("/hf-workorder")
    .then((res) => {
      console.log("ALL HF work order data res : ", res);
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_HF_WORK_ORDER_LIST,
          payload: res?.data?.data?.workOrders || [],
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getHFWorkOrders = (pageLimit: number, PageNumber: number, filters: object,getAllData? : boolean) => (dispatcher: Dispatch<any>) => {
  dispatcher({
    type : actionTypes.GET_HF_WORK_ORDER_LIST_REQUEST,
    payload : true
  })
  apiClient
    .post(`/hf-workorder-new?limit=${pageLimit}&pageNumber=${PageNumber}&getAllData=`+(getAllData || ""), filters )
    .then((res) => {
      console.log("HF work order data res : ", res);
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_HF_WORK_ORDER_LIST,
          payload: {workOrders: res?.data?.data?.workOrders, metaData: {totalPages: res?.data?.data?.totalPages, currentPage: res?.data?.data?.currentPage, length: res?.data?.data?.length,getAllWorkOrder : res.data?.data?.getAllData }},
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
      dispatcher({
        type : actionTypes.GET_HF_WORK_ORDER_LIST_REQUEST,
        payload : false
      })
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getHFWorkOrdersForEstimates = () => (dispatcher: Dispatch<any>) => {
  apiClient
    .get(`/hf-workorder`)
    .then((res) => {
      console.log("HF work order data res : ", res);
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_HF_WORK_ORDER_LIST,
          payload: {workOrders: res?.data?.data?.workOrders || [], metaData: {}},
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getPropertiesAPI = () => (dispatcher: Dispatch<any>) => {
  apiClient
    .get("/corrigo/propertiesList")
    .then((res) => {
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_PROPERTY_LIST,
          payload: res?.data?.data?.Entities || [],
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_assetsListAPI =
  (reqPacker: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/corrigo/assetList", reqPacker)
      .then((res) => {
        if (res.data.code === 200) {
          dispatcher({
            type: actionTypes.ASSETS_LIST,
            payload: res?.data?.data?.Entities || [],
          });
          // toastify.Success(res.data.message);
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_getTaskAPI =
  (modelId: string) => (dispatcher: Dispatch<any>) => {
    apiClient
      .get("/corrigo/task/" + modelId)
      .then((res) => {
        if (res.data.code === 200) {
          dispatcher({
            type: actionTypes.GET_TASK_LIST,
            payload: res?.data?.data?.Entities || [],
          });
          // toastify.Success(res.data.message);
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_getContactInfoById = async (_id: string) => {
  const res = await apiClient.get("/corrigo/contactInfo/" + _id);
  if (res.status === 200) {
    return res.data.data.Data;
  } else {
    console.log("No contact info is found with id " + _id);
  }
};

export const ACTION_getEmployeeAPI = () => (dispatcher: Dispatch<any>) => {
  apiClient
    .get("/corrigo/employeeList")
    .then((res) => {
      if (res.data.code === 200) {
        dispatcher({
          type: actionTypes.GET_EMPLOYEE_LIST,
          payload: res?.data?.data?.Entities || [],
        });
        // toastify.Success(res.data.message);
      } else {
        toastify.Error("Something went wrong! Please try again.");
      }
    })
    .catch((error) => console.log("error: ", error));
};

export const ACTION_getContactListAPI =
  (propertyId: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .get("/corrigo/customerList/" + propertyId)
      .then((res) => {
        if (res.data.code === 200) {
          dispatcher({
            type: actionTypes.GET_CONTACTS_LIST,
            payload: res?.data?.data?.Entities || [],
          });
          // toastify.Success(res.data.message);
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };

export const ACTION_createWorkOrder =
  (reqPacket: any, navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/corrigo/create-work-order", reqPacket)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message);
          navigate("/order/list");
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };


  export const ACTION_updateWorkOrder = (reqPacket: any, navigate: any) => () => {
    apiClient
      .patch("/hf-workorder", reqPacket)
      .then((res) => {
        if (res.data.code === 200) {
          toastify.Success(res.data.message)
          navigate(`/order/view/${reqPacket._id}`)
        } else {
          toastify.Error("Something went wrong! Please try again.")
        }
      })
      .catch((error) => console.log("error: ", error))
  }


  export const ACTION_createHFWorkOrder =
  (reqPacket: any,formData ,navigate: any) => (dispatcher: Dispatch<any>) => {
    apiClient
      .post("/hf-workorder", reqPacket)
      .then((res) => {
        console.log('create work order res :', res)
        if (res.status == 201) {
          toastify.Success(res.data.message);
          dispatcher(ACTION_getHFWorkOrders(50, 1, {
            query: '',
            status: '',
            priority: '',
            poNumber: false,
            contact: '',
            assigned: '',
            flag: '',
            customer: '',
            isDeleted: false,
            missingScheduledTo: false,
            scheduledTo: ''
          }))
          uploadFileToS3(formData, res.data.data._id);
        } else {
          toastify.Error("Something went wrong! Please try again.");
        }
      })
      .catch((error) => console.log("error: ", error));
  };
  

  export const ACTION_deleteHFWorkOrder =
	(_id: string, navigate) => (dispatcher: Dispatch<any>) => {
		apiClient
			.delete(`/hfWorkOrder/${_id}`)
			.then((res) => {
				if (res.data.code === 200) {
					dispatcher({
						type: actionTypes.DELETE_WORKORDER,
						payload: { _id },
					})
          navigate('/order/list')
					toastify.Success(res.data.message);
          
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

  export const ACTION_deleteHFDocument =
	(woId: string, document: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post(`/document/delete/${woId}`, document)
			.then((res) => {
				if (res.data.code === 200) {
					toastify.Success(res.data.message)
					dispatcher(ACTION_getHFWorkOrderByIdAPI(woId))
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

  export const ACTION_UpdateHFDocument =
	(woId: string, document: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post(`/document/update/${woId}`, document)
			.then((res) => {
				if (res.data.code === 200) {
					toastify.Success(res.data.message)
					dispatcher(ACTION_getHFWorkOrderByIdAPI(woId))
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}


export const ACTION_getHFWorkOrderForExcel =
  async () => {
    const data = await apiClient
      .get("/get-workorder-for-excel")
    return data?.data?.data
  };

	export const ACTION_createTask =
	(reqPacket: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post(`/hf-workorder/${reqPacket._id}/task`, reqPacket)
			.then((res) => {
				if (res.data.code === 201) {
					toastify.Success(res.data.message)
					dispatcher(ACTION_getHFWorkOrderByIdAPI(reqPacket._id))
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

  export const ACTION_updateTask =
	(reqPacket: any,_id) => (dispatcher: Dispatch<any>) => {
		apiClient
			.patch(`/hf-workorder/${_id}/task`, reqPacket)
			.then((res) => {
				if (res.data.code === 201) {
					toastify.Success(res.data.message)
					dispatcher(ACTION_getHFWorkOrderByIdAPI(_id))
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

  export const ACTION_addFlag =
	(reqPacket: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post(`/hf-workorder-flag`, reqPacket)
			.then((res) => {
				if (res.data.code === 200) {
					toastify.Success(res.data.message)
					dispatcher(ACTION_getHFWorkOrderByIdAPI(reqPacket._id))
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

  export const ACTION_editWorkOrderFlag =
	(reqPacket: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.patch(`/hf-workorder-flag`, reqPacket)
			.then((res) => {
				if (res.data.code === 200) {
					toastify.Success(res.data.message)
					dispatcher(ACTION_getHFWorkOrderByIdAPI(reqPacket._id))
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

  export const ACTION_deleteWorkOrderFlag =
	(reqPacket: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post(`/hf-workorder-flag-delete`, reqPacket)
			.then((res) => {
				if (res.data.code === 200) {
					toastify.Success(res.data.message)
					dispatcher(ACTION_getHFWorkOrderByIdAPI(reqPacket._id))
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

  export const ACTION_restoreWorkOrder =
	(_id: string,navigate) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post(`/hf-workorder-restore/${_id}`)
			.then((res) => {
				if (res.data.code === 200) {
					toastify.Success(res.data.message)
          navigate('/order/list')
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}