import apiClient from "../../utils/axios"
import {  Dispatch } from "redux"
import * as actionTypes from "./types"
import { toastify } from "../../components/toastify/toastify"

export const ACTION_createRole = (reqPacket: any, navigate: any) => () => {
	apiClient
		.post("/role", reqPacket)
		.then((res) => {
			if (res.data.code === 201) {
				toastify.Success(res.data.message)
				navigate("/role/list")
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_updateRole = (reqPacket: any, navigate: any) => () => {
	apiClient
		.patch("/role", reqPacket)
		.then((res) => {
			if (res.data.code === 200) {
				toastify.Success(res.data.message)
				navigate("/role/list")
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_getRoles = () => (dispatcher: Dispatch<any>) => {
    apiClient
		.get("/role")
		.then((res) => {
			if (res.data.code === 200) {
				dispatcher({
					type: actionTypes.GET_ROLES_LIST,
					payload: res.data.data.roles,
				})
				// toastify.Success(res.data.message);
			} else {
				toastify.Error("Something went wrong! Please try again.")
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_getRolesNames = () => (dispatcher: Dispatch<any>) => {
    apiClient
		.get("/role-list")
		.then((res) => {
			if (res.data.code === 200) {
				dispatcher({
					type: actionTypes.GET_ROLES_NAME_LIST,
					payload: res.data.data,
				})
			} else {
				dispatcher({
					type: actionTypes.GET_ROLES_NAME_LIST,
					payload: [],
				})
			}
		})
		.catch((error) => console.log("error: ", error))
}

export const ACTION_getRoleDetail =
	(_id: string) => (dispatcher: Dispatch<any>) => {
		apiClient
			.get(`/role/${_id}`)
			.then((res) => {
				if (res.data.code === 200) {
					dispatcher({
						type: actionTypes.GET_ROLE_DETAIL,
						payload: res.data.data,
					})
					// toastify.Success(res.data.message);
				} else {
					toastify.Error("Something went wrong! Please try again.")
				}
			})
			.catch((error) => console.log("error: ", error))
	}