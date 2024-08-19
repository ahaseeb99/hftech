
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_getAllInvoices } from "../../../../store/invoice/action";
import InvoiceTable from "./table/InvoiceTable";

export const InvoiceList: React.FC = () => {
  const dispatch: any = useDispatch()

  

  useEffect(() => {
    dispatch(ACTION_getAllInvoices())
  }, [])

  const allInvoices = useSelector((state: any) => state.invoices.allInvoicesData)
  const currentUser = useSelector((state: any) => state.auth.user)
  const isLoading  = useSelector((state : any) => state.invoices.isLoading)
  

  return (
    <div>
      <InvoiceTable
        invoiceData={allInvoices}
        user={currentUser}
        isLoading={isLoading}
      />
    </div>
  );
};


export default InvoiceList
