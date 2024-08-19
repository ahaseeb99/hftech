import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { KTCard, KTCardBody, KTSVG } from "../../../../../_metronic/helpers";
// import PDFActions from "./PDFActions"
import TableContainer from "./TableContainer";
import PDFActions from "../../PDFActions";
import { ACTION_getWorkOrdersAPI } from "../../../../../store/workorder/actions";
import { useDispatch, useSelector } from "react-redux";
import { currencyConverter, getTotalEstimateAmount, timezoneDateConverter } from "../../../../../utils/helpers";
import ToggleSwitch from "../../../../../components/ToggleSwitch/toggle";
// const ActionsButtons = (props: any) => {
// 	useEffect(() => {
// 		MenuComponent.reinitialization()
// 	}, [])
//
// 	console.info("----------------------------")
// 	console.info("props =>", props)
// 	console.info("----------------------------")
//
// 	return (
// 		<>
// 			<a
// 				href="#"
// 				className="btn btn-light btn-active-light-primary btn-sm"
// 				data-kt-menu-trigger="click"
// 				data-kt-menu-placement="bottom-end"
// 			>
// 				Actions
// 				<KTSVG
// 					path="/media/icons/duotune/arrows/arr072.svg"
// 					className="svg-icon-5 m-0"
// 				/>
// 			</a>
// 			<div
// 				className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
// 				data-kt-menu="true"
// 			>
// 				<div className="menu-item px-3">
// 					<Link
// 						className="menu-link px-3"
// 						to={`/estimates/update/${props.estimateId}`}
// 					>
// 						Edit
// 					</Link>
// 				</div>
// 				<div className="menu-item px-3">
// 					<a
// 						className="menu-link px-3"
// 						data-kt-users-table-filter="delete_row"
// 						onClick={() => props.showDeleteModalHandler(props.estimateId)}
// 					>
// 						Delete
// 					</a>
// 				</div>
// 			</div>
// 		</>
// 	)
// }

const EstimateTable = ({
  estimateData = [],
  showPdfHandler,
  showSendEstimateModalHandler,
  // showDeleteModalHandler,
  onDownloadBtnHandler,
  onSendEstimateBtnHandler,
  workOrderListHashed,
  user,
  isLoading
}: any) => {
  const  [activeSwitch, setActiveSwitch] = useState(true)
  const handleAccess = (event) => {
    if(!((user?.role?.permissions?.contacts?.includes('view'))) ){
      event.preventDefault()
    } else {
      return
    }
  }
  const extraFilters = () => <ToggleSwitch label="Show Active" activeSwitch={activeSwitch} onChange={
    e => {
      setActiveSwitch(e.target.checked)
    }
  } />

  const estimateColumns: any = [
    // {
    // 	Header: "ID",
    // 	accessor: (values: any, index: any) => {
    // 		return index + 1;
    // 	}
    // },
    {
      Header: "Reference",
      accessor: "referenceNumber",
      Cell: ({ value, row }) => {
        // const currentWorkOrder = workOrderListHashed.find((item)=> item.WONumber === value.workOrderNumber);
        // console.log({value});
        return (
          <Link
            className=" fs-6 p-4"
            onClick={ (event) => handleAccess(event) }
            to={`/estimates/view/${row.original._id}`}
          >
            {" "}
            {value}{" "}
          </Link>
        );
      },
    },
    {
      Header: "Location",
      accessor: "locationId.locationName",
    },
    {
      Header: "CLIENT | CONTACT",
      accessor: "client.DisplayAs",
    },
    // {
    // 	Header: "Status",
    // 	accessor: (values: any) => {
    // 		console.log({values})
    // 		console.log({workOrderListHashed})
    // 		const _workOrderNumber = values?.workOrderNumber;
    // 	return <div className="statusContainer">
    // 			<div className={`menu-link px-3 ${ workOrderListHashed.hasOwnProperty(_workOrderNumber) ? "Completed" : "InProgress"}`}>
    // 			 <a className="workOrderLink" aria-disabled={!_workOrderNumber}  target="_blank" href={`https://am-ce99a.corrigo.com/corpnet/workorder/workorderdetails.aspx/${data?.Id}`} rel="noreferrer">WO</a>
    // 			</div>
    // 			<div className={`menu-link px-3 ${workOrderListHashed[_workOrderNumber] ? "Completed" : "InProgress"}`}>
    // 			{`${values?.workOrderNumber}` ? "PO" : ""}
    // 			</div>
    // 		</div>

    // 	},
    // },
    {
    	Header: "Date",
    	accessor: (values: any) => {
        return (
          <span>
            {timezoneDateConverter(values?.date, user.userTimezone)}{" "}
          </span>
        );
    	}
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Related",
      accessor: (values: any) => {
        const currentWorkOrder = workOrderListHashed?.find(
          (item) => item.WONumber === values.workOrderId
        );
        const _workOrderNumber = values?.workOrderId;
        return (
          <div className="statusContainer">
            <Link
                className="workOrderLink"
                aria-disabled={!_workOrderNumber}
                target="_blank"
                to={`/order/view/${values?.workOrderId?._id}`}
                rel="noreferrer"
            >
                <span
                  className={`badge cursor-pointer badge-lg badge-${
                    values.workOrderId 
                      ? "success"
                      : "secondary"
                  }`}
                >
                  WO
                </span>
            </Link> &nbsp;
            <a>
              <span
                  className={`badge badge-lg badge-${
                    values?.workOrderId?.PoNumber
                      ? "success"
                      : "secondary"
                  }`}
                >
                  PO
                </span>
            </a>
          </div>
        );
      },
    },
   
    // {
    //   Header: "PDF Actions",

    //   accessor: (values: any) => {
    //     return values;
    //   },
    //   Cell: (values: any) => (
    //     <PDFActions
    //       estimateData={values.value}
    //       showPdfHandler={() => showPdfHandler(values.value)}
    //       showSendEstimateModalHandler={() =>
    //         showSendEstimateModalHandler(values.value)
    //       }
    //       onDownloadBtnHandler={onDownloadBtnHandler}
    //       onSendEstimateBtnHandler={() => onSendEstimateBtnHandler()}
    //     />
    //   ),
    // },
    // {
    // 	id: "actions",
    // 	Header: "Action",
    // 	accessor: (values: any) => {
    // 		return values._id
    // 	},
    // 	Cell: (values: any) => (
    // 		<ActionsButtons
    // 			estimateId={values.value}
    // 			showDeleteModalHandler={() => showDeleteModalHandler(values.value)}
    // 		/>
    // 	),
    // },
    {
      Header: "Amount",
      accessor: (value) => <p className="text-start">{getTotalEstimateAmount(value)}</p>,
    },
  ];
  

  const data: any = useMemo(() => estimateData, [estimateData]);
  const columns: any = useMemo(() => estimateColumns, [workOrderListHashed]);
  const filteredData = data.filter(item => activeSwitch ?  !item?.isDeleted : item.isDeleted);
  return (
    <KTCard>
      <KTCardBody className="py-4 pt-10">
        <TableContainer extraFilters={extraFilters} isLoading={isLoading} columns={columns} data={filteredData} />
      </KTCardBody>
    </KTCard>
  );
};

export default EstimateTable;
