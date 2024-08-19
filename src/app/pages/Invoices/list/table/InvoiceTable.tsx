import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import TableContainer from "./TableContainer";
import { timezoneDateConverter } from "../../../../../utils/helpers";



const InvoiceTable = ({
    invoiceData = [],
    user,
    isLoading
}: any) => {
    const invoiceColumn: any = [
        {
            Header: "Invoice Number",
            accessor: "InvoiceNumber",
            Cell: ({ value, row }) => {
                return (
                    <Link
                        className=" fs-6 p-4"
                        to={`/invoice/view/${row.original?._id}`}
                    >
                        {value}
                    </Link>
                );
            },
        },
        {
            Header: "DESCRIPTION",
            accessor: "Description",
        },
        {
            Header: "TERMS",
            accessor: "Terms",
        },
        {
            Header: "Date",
            accessor: (values: any) => {
                return (
                    <span>
                        {timezoneDateConverter(values?.StartDate, user?.userTimezone)}{" "}
                    </span>
                );
            }
        },
        {
            Header: "Due Date",
            accessor: (values: any) => {
                return (
                    <span>
                        {timezoneDateConverter(values?.EndDate, user?.userTimezone)}{" "}
                    </span>
                );
            }
        },
        {
            Header: "Bill To",
            accessor: "BillTo.DisplayAs",
        },
        {
            Header: "Related",
            accessor: (values: any) => {
                const _workOrderNumber = values?.WorkOrder?._id;
                return (
                    <div className="statusContainer">
                        <Link
                            className="workOrderLink"
                            aria-disabled={!_workOrderNumber}
                            target="_blank"
                            to={`/order/view/${_workOrderNumber}`}
                            rel="noreferrer"
                        >
                            <span
                                className={`badge cursor-pointer badge-lg badge-${_workOrderNumber
                                    ? "success"
                                    : "secondary"
                                    }`}
                            >
                                WO
                            </span>
                        </Link>
                    </div>
                );
            },
        },
    ];


    const columns: any = useMemo(() => invoiceColumn, [invoiceColumn]);
    return (
        <KTCard>
            <KTCardBody className="py-4 pt-10">
                <TableContainer isLoading={isLoading} columns={columns} data={invoiceData} />
            </KTCardBody>
        </KTCard>
    );
};

export default InvoiceTable;
