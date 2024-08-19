import React from "react";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import InvoiceCreate from "./create/InvoiceCreate";
import InvoiceList from "./list/InvoiceList";
import InvoiceUpdate from "./update/InvoiceUpdate";
import InvoiceView from "./view/InvoiceView";

const InvoicesPages: React.FC = () => {

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
              <PageTitle breadcrumbs={[]}>Invoice List</PageTitle>
              <InvoiceList />
            </>
          }
        />
        <Route
          path="create"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Create Invoice</PageTitle>
              <InvoiceCreate />
            </>
          }
        />
        <Route
          path="view"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Invoice View</PageTitle>
              <InvoiceView />
            </>
          }
        />
         <Route
          path="view/:id"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Invoice View</PageTitle>
              <InvoiceView />
            </>
          }
        />
          <Route
          path="update/:id"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Invoice Update</PageTitle>
              <InvoiceUpdate />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default InvoicesPages;
