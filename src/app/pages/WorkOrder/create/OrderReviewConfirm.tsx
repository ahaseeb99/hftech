import React, { useEffect, useState } from "react"
import * as Yup from "yup"
import { useFormik } from "formik"
import clsx from "clsx"
import { useDispatch, useSelector } from "react-redux"
import _get from "lodash/get"
import _find from "lodash/find"
import { useNavigate } from "react-router-dom"
// import { ACTION_postWorkOrder } from "../../../../store/workOrder/actions"
import { Col, Row } from "react-bootstrap"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown"

const createWorkOrdersSchema = Yup.object().shape({
	location: Yup.string().required("Property is required"),
	customer: Yup.string().required("Customer is required"),
	address: Yup.string().required("Address is required"),
	assignTo: Yup.string().required("Assign Employee name is required"),
	warranty: Yup.string().required("Warranty name is required"),
	owner: Yup.string().required("Owner is required"),
	contact: Yup.string().required("Contact is required"),
	type: Yup.string().required("Type is required"),
	access: Yup.string().required("Access is required"),
	specialty: Yup.string().required("Specialty is required"),
})

interface IMyProps {
	setNext: any
}

const OrderReviewConfirm: React.FC<IMyProps> = (props: IMyProps) => {
	const dispatch: any = useDispatch()
	const navigate: any = useNavigate()

	const { user } = useSelector((state: any) => state.auth)
	const [serviceLocation, setServiceLocation] = useState()
	const [location, setProperty] = useState()
	const [task, setTask] = useState()
	const [warranty, setPossibleWarranty] = useState()
	const [priority, setPriority] = useState()

	const formik = useFormik({
		initialValues: {
			location: "",
			customer: "",
			address: "",
			assignTo: "",
			warranty: "",
			owner: "",
			contact: "",
			type: "",
			priority: "",
			access: "",
			specialty: "",
			onSiteBy: "",
			dueBy: "",
		},
		validationSchema: createWorkOrdersSchema,
		onSubmit: async (values, { setSubmitting }) => {
			setSubmitting(true)
			handleSubmitOrderReviewConfirm()
		},
	})

	const handleSubmitOrderReviewConfirm = async () => {
		let reqData = {
			userId: user._id,
			location: formik.values.location,
			customer: formik.values.customer,
			address: formik.values.address,
			assignTo: formik.values.assignTo,
			warranty: formik.values.warranty,
			owner: formik.values.owner,
			contact: formik.values.contact,
			type: formik.values.type,
			priority: formik.values.priority,
			access: formik.values.access,
			specialty: formik.values.specialty,
			onSiteBy: formik.values.onSiteBy,
			dueBy: formik.values.dueBy,
		}

		console.log(reqData)
		// dispatch(ACTION_postWorkOrder(reqData, navigate))
	}

	const locationDropdownData = [
		{
			label: "Arizona State University",
			value: "arizona_state_university",
		},
		{
			label: "AZ-Chandler-Phoenix Campus",
			value: "az-chandler-phoenix_campus",
		},
		{
			label: "HF Tech Internal Training",
			value: "hf-tech-internal_training",
		},
		{
			label: "Intel",
			value: "intel",
		},
		{
			label: "Test Property",
			value: "test_location",
		},
	]

	const priorityDropdownData = [
		{
			label: "1",
			value: "1",
		},
		{
			label: "2",
			value: "2",
		},
		{
			label: "3",
			value: "3",
		},
		{
			label: "4",
			value: "4",
		},
		{
			label: "5",
			value: "5",
		},
	]

	const taskDropdownData = [
		{
			label: "Hand Cleaning (Hazardous)",
			value: "hand_cleaning_hazardous",
		},
		{
			label: "Hand Cleaning (Non-Hazardous)",
			value: "hand_cleaning_non_hazardous",
		},
		{
			label: "Other",
			value: "other",
		},
		{
			label: "Pressure Washing (Hazardous)",
			value: "pressure_washing_Hazardous",
		},
		{
			label: "Pressure Washing (Non-Hazardous)",
			value: "pressure_washing_non_hazardous",
		},
		{
			label: "Pump out (Hazardous)",
			value: "pump_out_hazardous",
		},
		{
			label: "Pump out (Hazardous)",
			value: "pump_out_non_hazardous",
		},
	]

	const warrantyDropdownData = [
		{
			label: "Yes",
			value: "yes",
		},
		{
			label: "No",
			value: "no",
		},
	]

	return (
		<form className="form" onSubmit={formik.handleSubmit}>
			<div className="fv-row mb-7">
				<Row>
					<Col>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">Type</label>
							<input
								disabled
								{...formik.getFieldProps("type")}
								type="text"
								placeholder="Enter type"
								name="type"
								className={clsx(
									"form-control form-control-solid mb-3 mb-lg-0",
									{
										"is-invalid": formik.touched.type && formik.errors.type,
									},
									{
										"is-valid": formik.touched.type && !formik.errors.type,
									}
								)}
								autoComplete="off"
							/>
							{formik.touched.type && formik.errors.type && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.type}</span>
									</div>
								</div>
							)}
						</div>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">Customer</label>
							<input
								disabled
								{...formik.getFieldProps("customer")}
								type="text"
								placeholder="Enter customer"
								name="customer"
								className={clsx(
									"form-control form-control-solid mb-3 mb-lg-0",
									{
										"is-invalid":
											formik.touched.customer && formik.errors.customer,
									},
									{
										"is-valid":
											formik.touched.customer && !formik.errors.customer,
									}
								)}
								autoComplete="off"
							/>
							{formik.touched.customer && formik.errors.customer && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.customer}</span>
									</div>
								</div>
							)}
						</div>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">Location</label>
							<CustomDropdown
								{...formik.getFieldProps("location")}
								name="location"
								className=""
								value={location}
								options={(locationDropdownData as any).map((item: any) => {
									return {
										data: item,
										label: item?.label,
										value: item?.value,
									}
								})}
								onChange={(e) => {
									setProperty(e)
									formik.setFieldValue("location", e.value)
								}}
							/>
							{formik.touched.location && formik.errors.location && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.location}</span>
									</div>
								</div>
							)}
						</div>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">Address</label>
							<input
								disabled
								{...formik.getFieldProps("address")}
								type="text"
								placeholder="Enter address"
								name="address"
								className={clsx(
									"form-control form-control-solid mb-3 mb-lg-0",
									{
										"is-invalid":
											formik.touched.address && formik.errors.address,
									},
									{
										"is-valid":
											formik.touched.address && !formik.errors.address,
									}
								)}
								autoComplete="off"
							/>
							{formik.touched.address && formik.errors.address && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.address}</span>
									</div>
								</div>
							)}
						</div>
					</Col>

					<Col>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">
								Contact/Contact at
							</label>
							<input
								disabled
								{...formik.getFieldProps("contact")}
								type="text"
								placeholder="Enter contact"
								name="contact"
								className={clsx(
									"form-control form-control-solid mb-3 mb-lg-0",
									{
										"is-invalid":
											formik.touched.contact && formik.errors.contact,
									},
									{
										"is-valid":
											formik.touched.contact && !formik.errors.contact,
									}
								)}
								autoComplete="off"
							/>
							{formik.touched.contact && formik.errors.contact && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.contact}</span>
									</div>
								</div>
							)}
						</div>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">Owner</label>
							<input
								disabled
								{...formik.getFieldProps("owner")}
								type="text"
								placeholder="Enter owner"
								name="owner"
								className={clsx(
									"form-control form-control-solid mb-3 mb-lg-0",
									{
										"is-invalid": formik.touched.owner && formik.errors.owner,
									},
									{
										"is-valid": formik.touched.owner && !formik.errors.owner,
									}
								)}
								autoComplete="off"
							/>
							{formik.touched.owner && formik.errors.owner && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.owner}</span>
									</div>
								</div>
							)}
						</div>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">
								PossibleWarranty
							</label>
							<CustomDropdown
								{...formik.getFieldProps("warranty")}
								name="warranty"
								className=""
								value={warranty}
								options={(warrantyDropdownData as any).map((item: any) => {
									return {
										data: item,
										label: item?.label,
										value: item?.value,
									}
								})}
								onChange={(e) => {
									setPossibleWarranty(e)
									formik.setFieldValue("warranty", e.value)
								}}
							/>
							{formik.touched.warranty && formik.errors.warranty && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.warranty}</span>
									</div>
								</div>
							)}
						</div>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">Assign To</label>
							<input
								{...formik.getFieldProps("assignTo")}
								type="text"
								placeholder="Enter assign employee name"
								name="assignTo"
								className={clsx(
									"form-control form-control-solid mb-3 mb-lg-0",
									{
										"is-invalid":
											formik.touched.assignTo && formik.errors.assignTo,
									},
									{
										"is-valid":
											formik.touched.assignTo && !formik.errors.assignTo,
									}
								)}
								autoComplete="off"
							/>
							{formik.touched.assignTo && formik.errors.assignTo && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.assignTo}</span>
									</div>
								</div>
							)}
						</div>
					</Col>
				</Row>
				<span className="fs-2">SCHEDULING DETAILS</span>
				<Row>
					<Col>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">Priority</label>
							<CustomDropdown
								{...formik.getFieldProps("priority")}
								name="priority"
								className=""
								value={priority}
								options={(priorityDropdownData as any).map((item: any) => {
									return {
										data: item,
										label: item?.label,
										value: item?.value,
									}
								})}
								onChange={(e) => {
									setPriority(e)
									formik.setFieldValue("priority", e.value)
								}}
							/>
							{formik.touched.priority && formik.errors.priority && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.priority}</span>
									</div>
								</div>
							)}
						</div>{" "}
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">
								Access/Appt/Start
							</label>
							<input
								disabled
								{...formik.getFieldProps("access")}
								type="text"
								placeholder="Enter access"
								name="access"
								className={clsx(
									"form-control form-control-solid mb-3 mb-lg-0",
									{
										"is-invalid": formik.touched.access && formik.errors.access,
									},
									{
										"is-valid": formik.touched.access && !formik.errors.access,
									}
								)}
								autoComplete="off"
							/>
							{formik.touched.access && formik.errors.access && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.access}</span>
									</div>
								</div>
							)}
						</div>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">
								Property / Workflow
							</label>
							<CustomDropdown
								{...formik.getFieldProps("location")}
								name="location"
								className=""
								value={location}
								options={(locationDropdownData as any).map((item: any) => {
									return {
										data: item,
										label: item?.label,
										value: item?.value,
									}
								})}
								onChange={(e) => {
									setProperty(e)
									formik.setFieldValue("location", e.value)
								}}
							/>
							{formik.touched.location && formik.errors.location && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.location}</span>
									</div>
								</div>
							)}
						</div>
					</Col>
					<Col>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">On-site by</label>
							<input
								{...formik.getFieldProps("onSiteBy")}
								type="date"
								name="onSiteBy"
								className={clsx(
									"form-control form-control-solid mb-3 mb-lg-0",
									{
										"is-invalid":
											formik.touched.onSiteBy && formik.errors.onSiteBy,
									},
									{
										"is-valid":
											formik.touched.onSiteBy && !formik.errors.onSiteBy,
									}
								)}
								autoComplete="off"
							/>
							{formik.touched.onSiteBy && formik.errors.onSiteBy && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.onSiteBy}</span>
									</div>
								</div>
							)}
						</div>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">Due by</label>
							<input
								{...formik.getFieldProps("dueBy")}
								type="date"
								name="dueBy"
								className={clsx(
									"form-control form-control-solid mb-3 mb-lg-0",
									{
										"is-invalid": formik.touched.dueBy && formik.errors.dueBy,
									},
									{
										"is-valid": formik.touched.dueBy && !formik.errors.dueBy,
									}
								)}
								autoComplete="off"
							/>
							{formik.touched.dueBy && formik.errors.dueBy && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.dueBy}</span>
									</div>
								</div>
							)}
						</div>
						<div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">Specialty</label>
							<input
								disabled
								{...formik.getFieldProps("specialty")}
								type="text"
								placeholder="Enter specialty"
								name="specialty"
								className={clsx(
									"form-control form-control-solid mb-3 mb-lg-0",
									{
										"is-invalid":
											formik.touched.specialty && formik.errors.specialty,
									},
									{
										"is-valid":
											formik.touched.specialty && !formik.errors.specialty,
									}
								)}
								autoComplete="off"
							/>
							{formik.touched.specialty && formik.errors.specialty && (
								<div className="fv-plugins-message-container">
									<div className="fv-help-block">
										<span role="alert">{formik.errors.specialty}</span>
									</div>
								</div>
							)}
						</div>
					</Col>
				</Row>

				<div className="text-end pt-15">
					<button
						type="reset"
						className="btn btn-light me-3"
						data-kt-users-modal-action="cancel"
						onClick={() => {
							props.setNext(false)
						}}
					>
						Discard
					</button>

					<button type="submit" className="btn btn-primary">
						Submit
					</button>
				</div>
			</div>
		</form>
	)
}

export default OrderReviewConfirm
