import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import { PageLink, PageTitle } from "../../../_metronic/layout/core"
import LocationCreate from "./create/LocationCreate"
// import LocationCreate from "./create/LocationCreate"
import { LocationList } from "./list/LocationList"
import LocationUpdate from "./update/LocationUpdate"
import LocationView from "./view/LocationView"
// import LocationUpdate from "./update/LocationUpdate"

const accountBreadCrumbs: Array<PageLink> = [
	{
		title: "Locations",
		path: "/location/create",
		isSeparator: false,
		isActive: false,
	},
	{
		title: "list",
		path: "/location/list",
		isSeparator: true,
		isActive: false,
	},
	{
		title: "edit",
		path: "/location/edit",
		isSeparator: true,
		isActive: false,
	},
]

const LocationsPage: React.FC = () => {
	const dispatch: any = useDispatch()

	useEffect(() => {
		// dispatch(ACTION_getLocationList())
		// dispatch(ACTION_getLocations())
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
								Create Location
							</PageTitle>
							<LocationCreate />
						</>
					}
				/>
				<Route
					path="list"
					element={
						<>
							<PageTitle breadcrumbs={[]}>
								Locations List
							</PageTitle>
							<LocationList />
						</>
					}
				/>
				<Route
					path="update/:locationId"
					element={
						<>
							<PageTitle breadcrumbs={[]}>
								Locations Update
							</PageTitle>
							<LocationUpdate />
						</>
					}
				/>
				 <Route
          path="view/:clientId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>
                Location View
              </PageTitle>
              <LocationView/>
            </>
          }
        />
			</Route>
		</Routes>
	)
}

export default LocationsPage
