import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import FlagCreate from "./Flag/create/FlagCreate";
import FlagUpdate from "./Flag/update/FlagUpdate";
import FlagView from "./Flag/view/FlagView";
import StatusCreate from "./Status/create/StatusCreate";

const FlagPages: React.FC = () => {
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
              <PageTitle breadcrumbs={[]}>Create Flag</PageTitle>
              <FlagCreate />
            </>
          }
        />
        <Route
          path="view/:id"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Flag View</PageTitle>
              <FlagView />
            </> 
          }
        />
        <Route
          path="update/:id"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Flag Update</PageTitle>
              <FlagUpdate />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default FlagPages;
