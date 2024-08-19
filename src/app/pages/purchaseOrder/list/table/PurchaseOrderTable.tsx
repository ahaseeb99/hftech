import { useMemo } from "react";
import { Link } from "react-router-dom";
import { currencyConverter } from "../../../../../utils/helpers";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import TableContainer from "./TableContainer";



const PurchaseOrderTable = ({
    purchaseData = [],
    isLoading
}: any) => {
    const purchaseOrderColumn: any = [
        {
            Header: "PO",
            accessor: value => ({PoNumber : value.PoNumber,name: value?.Name}),
            Cell: ({ value, row }) => {
                return (
                    <Link
                        className=" fs-6 p-4"
                        to={`/purchase/view/${row.original._id}`}
                    >
                        {value.name ? `${value.name} - ${value.PoNumber}`: value.PoNumber}
                    </Link>
                );
            },
        },
        {
            Header: "Client",
            accessor: "ClientId.DisplayAs",
        },
        {
            Header: "STATUS",
            accessor: "Status",
        },
        {
            Header: "APPROVED",
            accessor: "ApprovedAmount",
            Cell : ({value}) => currencyConverter(value)
        }
        ,
        {
            Header: "USED",
            accessor: (props) => ({ UsedAmount: props?.UsedAmount, UsedAmountPer: props?.UsedAmountPer }),
            Cell: ({ value }) => `${currencyConverter(value?.UsedAmount)}(${value?.UsedAmountPer ? value?.UsedAmountPer.toFixed(2) + "%" : ""})`
        },
        {
            Header: "REMAINING",
            accessor: (props) => ({ AmountRemaining: props?.AmountRemaining, AmountRemainingPercentage: props?.AmountRemainingPercentage }),
            Cell: ({ value }) => `${currencyConverter(value.AmountRemaining)}(${value?.AmountRemainingPercentage ? value?.AmountRemainingPercentage.toFixed(2) + "%" : ""})`
        },
        {
            Header: "CONTACT",
            accessor: "ContactId.fullName",
        },
    ];


    const columns: any = useMemo(() => purchaseOrderColumn, [purchaseOrderColumn]);
    return (
        <KTCard>
            <KTCardBody className="py-4 pt-10">
                <TableContainer isLoading={isLoading} columns={columns} data={purchaseData} />
            </KTCardBody>
        </KTCard>
    );
};

export default PurchaseOrderTable;
