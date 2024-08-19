import React from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import { RoleView } from "./view/RoleView";
import { RoleList } from "./list/RoleList";
import { RoleUpdate } from './update/RoleUpdate';
import { RoleCreate } from './create/RoleCreate';


const RolesPage: React.FC = () => {
  const navigate = useNavigate();
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
								Create Role
							</PageTitle>
							<RoleCreate />
						</>
					}
				/>
        <Route
          path="view/:roleId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>
                Role View
              </PageTitle>
              <RoleView />
            </>
          }
        />
        <Route
					path="list"
					element={
						<>
							<PageTitle breadcrumbs={[]}>
								Role List
							</PageTitle>
							<RoleList />
							
						</>
					}
				/>
        <Route
					path="update/:roleId"
					element={
						<>
							<PageTitle breadcrumbs={[]}>
								Role Update
							</PageTitle>
							<RoleUpdate />
						</>
					}
				/>
      </Route>
      
    </Routes>
  );
};

export default RolesPage;
