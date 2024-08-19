import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import WorkOrderCreate from "./create/WorkOrderCreate";
import { WorkOrderList } from "./list/WorkOrderList";
import WorkOrderUpdate from "./update/WorkOrderUpdate";
import WorkOrderView from "./view/WorkOrderView";

const WorkOrderPage: React.FC = () => {
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
              <PageTitle breadcrumbs={[]}>Create Work Order</PageTitle>
              <WorkOrderCreate />
            </>
          }
        />
        <Route
          path="create/:estimateId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Create Work Order</PageTitle>
              <WorkOrderCreate />
            </>
          }
        />
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Work Order List</PageTitle>
              <WorkOrderList />
            </>
          }
        />
        <Route
          path="update/:orderId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Work Order Update</PageTitle>
              <WorkOrderUpdate />
            </>
          }
        />
        <Route
          path="view/:orderId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Work Order View</PageTitle>
              <WorkOrderView />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default WorkOrderPage;
