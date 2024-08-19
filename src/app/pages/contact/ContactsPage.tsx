import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import ContactCreate from "./create/ContactCreate";
import LocationCreate from "./create/ContactCreate";
// import LocationCreate from "./create/LocationCreate"
import { ContactList } from "./list/ContactList";
import ContactUpdate from "./update/ContactUpdate";
import LocationUpdate from "./update/ContactUpdate";
import LocationView from "./view/ContactView";
import ContactView from "./view/ViewContactForm";
// import LocationUpdate from "./update/LocationUpdate"

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: "Locations",
    path: "/location/create",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "list",
    path: "/location/list",
    isSeparator: true,
    isActive: false,
  },
  {
    title: "edit",
    path: "/location/edit",
    isSeparator: true,
    isActive: false,
  },
];

const ContactsPage: React.FC = () => {
  const dispatch: any = useDispatch();

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
              <PageTitle breadcrumbs={[]}>Create Contact</PageTitle>
              <ContactCreate />
            </>
          }
        />
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Contact List</PageTitle>
              <ContactList />
            </>
          }
        />
        <Route
          path="update/:contactId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Contact Update</PageTitle>
              <ContactUpdate />
            </>
          }
        />
        <Route
          path="view/:contactId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Contact View</PageTitle>
              <ContactView />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default ContactsPage;
