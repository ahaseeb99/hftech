import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import ClientCreate from "./create/ClientCreate";
import { ClientList } from "./list/ClientList";
import ClientUpdate from "./update/ClientUpdate";
import ClientView from "./view/ClientView";

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: "Clients",
    path: "/client/create",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "list",
    path: "/client/list",
    isSeparator: true,
    isActive: false,
  },
  {
    title: "edit",
    path: "/client/edit",
    isSeparator: true,
    isActive: false,
  },
];

const ClientsPage: React.FC = () => {
  const dispatch: any = useDispatch();

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
                Create Client
              </PageTitle>
              <ClientCreate />
            </>
          }
        />
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={[]}>
                Clients List
              </PageTitle>
              <ClientList />
            </>
          }
        />
        <Route
          path="view/:clientId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>
                Clients View
              </PageTitle>
              <ClientView/>
            </>
          }
        />
        <Route
          path="update/:clientId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>
                Clients Update
              </PageTitle>
              <ClientUpdate />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default ClientsPage;
