import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import EstimationCreate from "./create/EstimationCreate";
import { EstimationList } from "./list/EstimationList";
import EstimationUpdate from "./update/EstimationUpdate";
import EstimationView from "./view/EstimationView";
import { ACTION_getUserDailyCostBreakDownList } from "../../../store/estimate/actions";
import { ACTION_getLocationList } from "../../../store/location/actions";
import { ACTION_getClients } from "../../../store/client/actions";

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: "Estimates",
    path: "/estimates/create",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "list",
    path: "/estimates/list",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "edit",
    path: "/estimates/edit",
    isSeparator: true,
    isActive: false,
  },
];

const EstimatesPage: React.FC = () => {
  const dispatch: any = useDispatch();
  

  useEffect(() => {
    dispatch(ACTION_getLocationList());
    dispatch(ACTION_getClients());
    dispatch(ACTION_getUserDailyCostBreakDownList());
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
              <PageTitle breadcrumbs={[]}>
                Create Estimate
              </PageTitle>
              <EstimationCreate />
            </>
          }
        />
        <Route
          path="create/:orderId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>
                Create Estimate
              </PageTitle>
              <EstimationCreate />
            </>
          }
        />
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={[]} >
                Estimates List
              </PageTitle>
              <EstimationList />
            </>
          }
        />
        <Route
          path="view/:estimateId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>
                Estimates View
              </PageTitle>
              <EstimationView />
            </>
          }
        />
        <Route
          path="update/:estimateId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>
                Estimates Update
              </PageTitle>
              <EstimationUpdate />
            </>
          }
        />
        <Route
          path="copy/:estimateId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>
                Estimates Copy
              </PageTitle>
              <EstimationUpdate />
            </>
          }
        />
        <Route index element={<Navigate to="/estimates/create" />} />
      </Route>
    </Routes>
  );
};

export default EstimatesPage;
