import apiClient from "../../utils/axios"
import {  Dispatch } from "redux"
import * as actionTypes from "./types"
import { toastify } from "../../components/toastify/toastify"

export const ACTION_getCountries = () => (dispatcher: Dispatch<any>) => {
	apiClient
		.get("/getCountries")
		.then((res) => {
			if (res.data.code === 200) {
				dispatcher({
					type: actionTypes.GET_COUNTRY_LIST,
					payload: res.data.data,
				})
				// toastify.Success(res.data.message);
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_getLocationList = () => (dispatcher: Dispatch<any>) => {
	apiClient
		.get("/location")
		.then((res) => {
			console.log("locations response : ", {res})
			if (res.data.code === 200) {
				dispatcher({
					type: actionTypes.GET_LOCATION_LIST,
					payload: res.data.data.locations,
				})
				// toastify.Success(res.data.message);
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_createLocation = (reqPacket: any, navigate: any) => () => {
	apiClient
		.post("/location", reqPacket)
		.then((res) => {
			if (res.data.code === 201) {
				toastify.Success(res.data.message)
				navigate("/location/list")
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_deleteLocation =
	(_id: string, navigate: any) => (dispatcher: Dispatch<any>) => {
		apiClient
			.delete(`/location/${_id}`)
			.then((res) => {
				if (res.data.code === 200) {
					dispatcher({
						type: actionTypes.DELETE_LOCATION,
						payload: { _id },
					})

					toastify.Success(res.data.message);
					navigate('/location/list')
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_getLocationDetail =
	(_id: string) => (dispatcher: Dispatch<any>) => {
		apiClient
			.get(`/location/${_id}`)
			.then((res) => {
				if (res.data.code === 200) {
					dispatcher({
						type: actionTypes.GET_LOCATION_DETAIL,
						payload: res.data.data,
					})
					// toastify.Success(res.data.message);
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}

export const ACTION_updateLocation = (reqPacket: any, navigate: any) => () => {
	apiClient
		.patch("/location", reqPacket)
		.then((res) => {
			if (res.data.code === 200) {
				toastify.Success(res.data.message)
				navigate("/location/list")
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}


export const ACTION_postNoteLocation =
(locationId: string, reqPacket: any) => (dispatcher: Dispatch<any>) => {
	apiClient
		.post(`/location/${locationId}/note`, reqPacket)
		.then((res) => {
			if (res.data.code === 200) {
				toastify.Success(res.data.message)
				dispatcher(ACTION_getLocationDetail(locationId))
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_deleteNote =
(locationId: string, noteId: string) => (dispatcher: Dispatch<any>) => {
	apiClient
		.post(`location/${locationId}/note-delete/${noteId}`)
		.then((res) => {
			if (res.data.code === 200) {
				toastify.Success(res.data.message)
				dispatcher(ACTION_getLocationDetail(locationId))
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}