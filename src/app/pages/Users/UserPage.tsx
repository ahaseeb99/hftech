import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import ContactCreate from "./create/UserCreate";
import LocationCreate from "./create/UserCreate";
// import LocationCreate from "./create/LocationCreate"
import { UserList } from "./list/UserList";
import ContactUpdate from "./update/UserUpdate";
import LocationUpdate from "./update/UserUpdate";
import LocationView from "./view/UserView";
import ContactView from "./view/ViewUserForm";
import UserCreate from "./create/UserCreate";
import UserUpdate from "./update/UserUpdate";
import UserView from "./view/ViewUserForm";
import { DocumentList } from "./list/DocumentList";
// import LocationUpdate from "./update/LocationUpdate"

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: "Users",
    path: "/users/create",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "list",
    path: "/users/list",
    isSeparator: true,
    isActive: false,
  },
  {
    title: "edit",
    path: "/users/edit",
    isSeparator: true,
    isActive: false,
  },
];

const UserPage: React.FC = () => {
  useEffect(() => {
    // dispatch(ACTION_getLocationList())
    // dispatch(ACTION_getLocations())
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
              <PageTitle breadcrumbs={[]}>Create User</PageTitle>
              <UserCreate />
            </>
          }
        />
         <Route
          path="documents/list"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Documents List</PageTitle>
              <DocumentList />
            </>
          }
        />
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Users List</PageTitle>
              <UserList />
            </>
          }
        />
        <Route
          path="update/:userId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>User Update</PageTitle>
              <UserUpdate />
            </>
          }
        />
        <Route
          path="view/:userId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>User View</PageTitle>
              <UserView />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default UserPage;
