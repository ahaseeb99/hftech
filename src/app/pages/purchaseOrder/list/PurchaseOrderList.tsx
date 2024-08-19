
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_getAllPurchaseOrder } from "../../../../store/purchaseorder/actions";
import PurchaseOrderTable from "./table/PurchaseOrderTable";

export const PurchaseList: React.FC = () => {
    const dispatch: any = useDispatch()

    useEffect(() => {
        dispatch(ACTION_getAllPurchaseOrder())
    }, [])

    const allPurchaseOrder = useSelector((state: any) => state.purchase.allPurchaseData)
    const currentUser = useSelector((state: any) => state.auth.user)
    const isLoading = useSelector((state: any) => state.purchase.isLoading)


    return (
        <div>
            <PurchaseOrderTable
                purchaseData={allPurchaseOrder}
                user={currentUser}
                isLoading={isLoading}
            />
        </div>
    );
};


export default PurchaseList
