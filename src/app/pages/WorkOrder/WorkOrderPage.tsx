import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import WorkOrderCreate from "./create/WorkOrderCreate";
import { WorkOrderList } from "./list/WorkOrderList";
import WorkOrderUpdate from "./update/WorkOrderUpdate";
import WorkOrderView from "./view/WorkOrderView";

// import WorkOrderCreate from "./create/WorkOrderCreate"
// import WorkOrderCreate from "./create/WorkOrderCreate"

// import WorkOrderUpdate from "./update/WorkOrderUpdate"
// import WorkOrderUpdate from "./update/WorkOrderUpdate"

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: "order",
    path: "/order/create",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "list",
    path: "/order/list",
    isSeparator: true,
    isActive: false,
  },
  {
    title: "edit",
    path: "/order/edit",
    isSeparator: true,
    isActive: false,
  },
];

const WorkOrderPage: React.FC = () => {
  const dispatch: any = useDispatch();

  useEffect(() => {
    // dispatch(ACTION_getWorkOrderList())
    // dispatch(ACTION_getWorkOrder())
    // dispatch(ACTION_getUserDailyCostBreakDownList())
    // eslint-disable-next-line
  }, []);
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
