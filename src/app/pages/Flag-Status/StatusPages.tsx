import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import StatusCreate from "./Status/create/StatusCreate";
import StatusEdit from "./Status/update/StatusEdit";
import StatusView from "./Status/view/StatusView";

const StatusPages: React.FC = () => {
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
              <PageTitle breadcrumbs={[]}>Create Status</PageTitle>
              <StatusCreate />
            </>
          }
        />
        <Route
          path="view/:id"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Status View</PageTitle>
              <StatusView />
            </>
          }
        />
        <Route
          path="update/:id"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Status Update</PageTitle>
              <StatusEdit />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default StatusPages;
