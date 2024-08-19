import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import LabelCreate from "./Label/create/LabelCreate";
import LabelEdit from "./Label/update/LabelEdit";
import LabelView from "./Label/view/LabelView";

const LabelPages: React.FC = () => {
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
              <PageTitle breadcrumbs={[]}>Create Label</PageTitle>
              <LabelCreate />
            </>
          }
        />
        <Route
          path="view/:id"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Label View</PageTitle>
              <LabelView />
            </> 
          }
        />
        <Route
          path="update/:id"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Label Update</PageTitle>
              <LabelEdit />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default LabelPages;
