import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import PurchaseOrderCreate from "./create/PurchaseOrderCreate";
import PurchaseList from "./list/PurchaseOrderList";
import PurchaseOrderUpdate from "./update/purchaseOrderupdate";
import PurchaceOrderView from "./view/PurchaseOrderView";

const PurchaseOrderPage: React.FC = () => {
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
                            <PageTitle breadcrumbs={[]}>Create Purchase Order</PageTitle>
                            <PurchaseOrderCreate />
                        </>
                    }
                />
                <Route
                    path="list"
                    element={
                        <>
                            <PageTitle breadcrumbs={[]}>Purchase Order List</PageTitle>
                            <PurchaseList />
                        </>
                    }
                />
                <Route
                    path="update/:orderId"
                    element={
                        <>
                            <PageTitle breadcrumbs={[]}>Purchase Order Update</PageTitle>
                            <PurchaseOrderUpdate />
                        </>
                    }
                />
                <Route
                    path="view/:orderId"
                    element={
                        <>
                            <PageTitle breadcrumbs={[]}>Purchase Order View</PageTitle>
                            <PurchaceOrderView />
                        </>
                    }
                />
            </Route>
        </Routes>
    );
};

export default PurchaseOrderPage;
