import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import { PageLink, PageTitle } from "../../../_metronic/layout/core"
// import InventoryCreate from "./create/InventoryCreate"
// import InventoryCreate from "./create/InventoryCreate"
import { InventoryList } from "./list/InventoryList"
// import InventoryUpdate from "./update/InventoryUpdate"
// import InventoryUpdate from "./update/InventoryUpdate"

const accountBreadCrumbs: Array<PageLink> = [
	{
		title: "inventory",
		path: "/inventory/create",
		isSeparator: false,
		isActive: false,
	},
	{
		title: "list",
		path: "/inventory/list",
		isSeparator: true,
		isActive: false,
	},
	{
		title: "edit",
		path: "/inventory/edit",
		isSeparator: true,
		isActive: false,
	},
]

const InventoryPage: React.FC = () => {
	const dispatch: any = useDispatch()

	useEffect(() => {
		// dispatch(ACTION_getInventoryList())
		// dispatch(ACTION_getInventory())
		// dispatch(ACTION_getUserDailyCostBreakDownList())
		// eslint-disable-next-line
	}, [])
	return (
		<Routes>
			<Route
				element={
					<>
						<Outlet />
					</>
				}
			>
				<Route
					path="create"
					element={
						<>
							<PageTitle breadcrumbs={[]}>
								Create Inventory
							</PageTitle>
							{/* <InventoryCreate /> */}
						</>
					}
				/>
				<Route
					path="list"
					element={
						<>
							<PageTitle breadcrumbs={[]}>
								Inventory List
							</PageTitle>
							<InventoryList />
						</>
					}
				/>
				<Route
					path="update/:inventoryId"
					element={
						<>
							<PageTitle breadcrumbs={[]}>
								Inventory Update
							</PageTitle>
							{/* <InventoryUpdate /> */}
						</>
					}
				/>
			</Route>
		</Routes>
	)
}

export default InventoryPage
