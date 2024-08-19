import apiClient from "../../utils/axios"
import {  Dispatch } from "redux"
import * as actionTypes from "./types"
import { toastify } from "../../components/toastify/toastify"
import { ACTION_getHFWorkOrderByIdAPI } from "../workorder/actions"
import { uploadFileToS3Estimate } from "../../utils/uploadFileToS3"

export const ACTION_getDailyCostBreakDownList =
	() => (dispatcher: Dispatch<any>) => {
		apiClient
			.get("/dailyCostBreakDownList")
			.then((res) => {
				if (res.data.code === 200) {
					dispatcher({
						type: actionTypes.GET_DAILY_COST_BREAK_DOWN_LIST,
						payload: res.data.data,
					})
					// toastify.Success(res.data.message);
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_addUserDailyCostBreakDownList =
	(reqPacker: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post("/userDailyCostBreakDownList", reqPacker)
			.then((res) => {
				if (res.data.code === 200) {
					toastify.Success(res.data.message)
					dispatcher({
						type: actionTypes.ADD_USER_DAILY_COST_BREAK_DOWN_LIST,
						payload: res.data.data,
					})
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_updateUserDailyCostBreakDownList =
	(reqPacker: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.patch("/userDailyCostBreakDownList", reqPacker)
			.then((res) => {
				if (res.data.code === 200) {
					toastify.Success(res.data.message)
					dispatcher({
						type: actionTypes.UPDATE_USER_DAILY_COST_BREAK_DOWN_LIST,
						payload: res.data.data,
					})
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_deleteUserDailyCostBreakDownList =
	(_id: string, isEstimate?: boolean) => (dispatcher: Dispatch<any>) => {
		apiClient
			.delete("/userDailyCostBreakDownList/" + _id)
			.then((res) => {
				if (res.data.code === 200) {
					if (isEstimate) {
						dispatcher({
							type: actionTypes.DELETE_USER_DAILY_COST_BREAK_DOWN_LIST_FROM_ESTIMATE,
							payload: {
								_id,
							},
						})
					} else {
						dispatcher({
							type: actionTypes.DELETE_USER_DAILY_COST_BREAK_DOWN_LIST,
							payload: {
								_id,
							},
						})
					}
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_getUserDailyCostBreakDownList =
	() => (dispatcher: Dispatch<any>) => {
		apiClient
			.get("/userDailyCostBreakDownList")
			.then((res) => {
				if (res.data.code === 200) {
					dispatcher({
						type: actionTypes.GET_USER_DAILY_COST_BREAK_DOWN_LIST,
						payload: res.data.data,
					})
					// toastify.Success(res.data.message);
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_postEstimate =
	(reqPacket: any, navigate: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post("/estimate", reqPacket)
			.then((res) => {
				if (res.data.code === 201) {
					toastify.Success(res.data.message)
					navigate("/estimates/list")
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_postEstimateFormData =
	(reqPacket: any, formData : any, navigate: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post("/estimate", reqPacket)
			.then((res) => {
				if (res.data.code === 201) {
					toastify.Success(res.data.message)
				    uploadFileToS3Estimate(formData,res.data.data._id)
					navigate("/estimates/list")
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}


export const ACTION_deleteEstimateDocument =
	(woId: string, document: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post(`/estiamte/document/delete/${woId}`, document)
			.then((res) => {
				if (res.data.code === 200) {
					dispatcher(ACTION_getEstimateById(res.data.data._id))
					toastify.Success(res.data.message)
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
}

export const ACTION_updateEstimateDocument =
	(woId: string, document: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post(`/estimate/document/update/${woId}`, document)
			.then((res) => {
				if (res.data.code === 200) {
					dispatcher(ACTION_getEstimateById(res.data.data._id))
					toastify.Success(res.data.message)
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
}


export const ACTION_getEstimate = () => (dispatcher: Dispatch<any>) => {
	apiClient
		.get("/estimate")
		.then((res) => {
			if (res.data.code === 200) {
				dispatcher({
					type: actionTypes.GET_ESTIMATE_LIST,
					payload: res.data.data,
				})
				// toastify.Success(res.data.message);
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_getEstimateEmailDetail = (id) => (dispatcher: Dispatch<any>) => {
	apiClient
		.get("/emaillogs/estimate/"+id)
		.then((res) => {
			if (res.data.code === 200) {
				dispatcher({
					type: actionTypes.GET_ESTIMATE_EMAIL_DETAIL,
					payload: res.data.data,
				})
				// toastify.Success(res.data.message);
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_clearEstimate = () => (dispatcher: Dispatch<any>) => {
	dispatcher({
		type: actionTypes.CLEAR_ESTIMATE_LIST,
		payload: {},
	})
}

export const ACTION_getEstimateById =
	(_id: string) => (dispatcher: Dispatch<any>) => {
		apiClient
			.get("/estimate/" + _id)
			.then((res) => {
				if (res.data.code === 200) {
					dispatcher({
						type: actionTypes.GET_ESTIMATE_DETAIL,
						payload: res.data.data,
					})
					// toastify.Success(res.data.message);
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_deleteEstimate =
	(_id: string, navigate) => (dispatcher: Dispatch<any>) => {
		apiClient
			.delete("/estimate/" + _id)
			.then((res) => {
				if (res.data.code === 200) {
					navigate("/estimates/list")
					toastify.Success(res.data.message);
					dispatcher({
						type: actionTypes.DELETE_ESTIMATE,
						payload: {
							_id,
						},
					})
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_updateEstimate =
	(reqPacket: any, navigate: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.patch("/estimate", reqPacket)
			.then((res) => {
				if (res.data.code === 200) {
					toastify.Success(res.data.message)
					navigate(`/estimates/view/${reqPacket._id}`)
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_addUserDailyCostBreakDownListInEstimate =
	(_id: string, reqPacket: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post(`/add-userDailyCostBreakDownList-in-estimate/${_id}`, reqPacket)
			.then((res) => {
				if (res.data.code === 200) {
					toastify.Success(res.data.message)
					dispatcher({
						type: actionTypes.GET_ESTIMATE_DETAIL,
						payload: res.data.data,
					})
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_generateEstimatePdf =
	(_id: string, fileName: string) => (dispatcher: Dispatch<any>) => {
		apiClient
			.get("/estimate-pdf/" + _id)
			.then((res) => {
				if (res.data.code === 200) {
					dispatcher(ACTION_downloadPdf(res.data.data, _id, fileName))
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_downloadPdf = (url: string, _id: string, fileName: string) => () => {
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
			a.download = fileName
			document.body.appendChild(a)
			a.click()
			window.URL.revokeObjectURL(url)
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_sendEstimatePdf =
	(_id: string, reqPacket: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post("/send-estimate-pdf/" + _id, reqPacket)
			.then((res) => {
				if (res.data.code === 200) {
					toastify.Success(res.data.message)
                    dispatcher(ACTION_getEstimateById(_id))
					dispatcher(ACTION_getEstimateEmailDetail(_id))
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}


	export const ACTION_postNote =
	(wid: string, reqPacket: any, navigate: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.post(`/hf-workorder/${wid}/note`, reqPacket)
			.then((res) => {
				if (res.data.code === 201) {
					toastify.Success(res.data.message)

					dispatcher(ACTION_getHFWorkOrderByIdAPI(wid))

					// navigate("/estimates/list")
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

	export const ACTION_deleteNote =
	(wid: string, noteId: string) => (dispatcher: Dispatch<any>) => {
		apiClient
			.delete(`/hf-workorder/${wid}/note/${noteId}`)
			.then((res) => {
				if (res.data.code === 201) {
					toastify.Success(res.data.message)

					dispatcher(ACTION_getHFWorkOrderByIdAPI(wid))

					// navigate("/estimates/list")
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}