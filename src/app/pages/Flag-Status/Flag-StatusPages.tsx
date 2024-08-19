import React from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import FlagStatusList from "./List/FlagStatusList";

const FlagStatusPages: React.FC = () => {
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
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Flag & Status List</PageTitle>
              <FlagStatusList />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default FlagStatusPages;
