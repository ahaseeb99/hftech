import moment from "moment"
import React, { useEffect, useMemo } from "react"
import { Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useTable } from "react-table"
import { MenuComponent } from "../../../../../_metronic/assets/ts/components"
import { KTCard, KTCardBody, KTSVG } from "../../../../../_metronic/helpers"
import TableContainer from "./TableContainer"

const ActionsButtons = (props: any) => {
	useEffect(() => {
		MenuComponent.reinitialization()
	}, [])

	console.info("----------------------------")
	console.info("props =>", props)
	console.info("----------------------------")

	return (
		<>
			<a
				href="#"
				className="btn btn-light btn-active-light-primary btn-sm"
				data-kt-menu-trigger="click"
				data-kt-menu-placement="bottom-end"
			>
				Actions
				<KTSVG
					path="/media/icons/duotune/arrows/arr072.svg"
					className="svg-icon-5 m-0"
				/>
			</a>
			<div
				className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
				data-kt-menu="true"
			>
				<div className="menu-item px-3">
					<Link
						className="menu-link px-3"
						to={`/inventory/update/${props.inventoryId}`}
					>
						Edit
					</Link>
				</div>
				<div className="menu-item px-3">
					<a
						className="menu-link px-3"
						data-kt-users-table-filter="delete_row"
						onClick={() => props.showDeleteModalHandler(props.inventoryId)}
					>
						Delete
					</a>
				</div>
			</div>
		</>
	)
}

const LocationTable = ({ inventoryData = [], showDeleteModalHandler }: any) => {
	const inventoryColumns: any = [
		{
			Header: "ID",
			accessor: (values: any, index: any) => {
				return index + 1
			},
		},
		{
			Header: "FULL NAME",
			accessor: "fullName",
		},
		{
			Header: "LOCATION",
			accessor: "location",
		},
		{
			Header: "TAGS",
			accessor: "tags",
		},
		{
			Header: "COMPANY",
			accessor: "company",
		},
		{
			Header: "CREATES",
			accessor: (values: any) => {
				return moment(values?.created_at).format("MM-DD-YYYY")
			},
		},
		{
			id: "actions",
			Header: "Action",
			accessor: (values: any) => {
				return values._id
			},
			Cell: (values: any) => (
				<ActionsButtons
					inventoryId={values.value}
					showDeleteModalHandler={() => showDeleteModalHandler(values.value)}
				/>
			),
		},
	]

	const data: any = useMemo(() => inventoryData, [inventoryData])
	const columns: any = useMemo(() => inventoryColumns, [])

	console.log(data)

	return (
		<KTCard>
			<KTCardBody className="py-4">

				{/* <div className="card-body py-4">
					<Row>
						<div className="d-flex justify-content-end">

							<Link to="/inventory/create" className="btn btn-primary"><span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><rect opacity="0.5" x="11.364" y="20.364" width="16" height="2" rx="1" transform="rotate(-90 11.364 20.364)" fill="currentColor"></rect><rect x="4.36396" y="11.364" width="16" height="2" rx="1" fill="currentColor"></rect></svg></span>Add Inventory</Link>

						</div>
					</Row>
				</div> */}

				<div className="table-responsive">
					<TableContainer columns={columns} data={data} />
				</div>
			</KTCardBody>
		</KTCard>
	)
}

export default LocationTable
