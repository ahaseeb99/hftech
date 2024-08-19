import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import TableContainer from "./StatusTableContainer";
import { timezoneDateConverter } from "../../../../../utils/helpers";
import FlagTableContainer from "./FlagTableContainer";
import LabelTableContainer from "./LabelTableContainer";

const FlagStatusTable = ({
  statusData = [],
  user,
  isLoading,
  flagData,
  isLoadingFlag,
  isLoadingLabel,
  labelData
}: any) => {
  const statusColumn: any = [
    {
      Header: "STATUS NAME",
      accessor: "label",
      Cell: ({ value, row }) => {
        return (
          <Link
            className=" fs-6 p-4"
            to={`/status/view/${row.original._id}`}
            state={row.original}
          >
            {value}
          </Link>
        );
      },
    },
    {
      Header: "STATUS",
      accessor: (values: any) => {
        return <span>{values.Status ? "Active" : "In Active"}</span>;
      },
    },
    {
      Header: "CREATED AT",
      accessor: (values: any) => {
        return (
          <span>
            {timezoneDateConverter(values?.CreatedAt, user?.userTimezone)}{" "}
          </span>
        );
      },
    },
  ];

  const flagColumn = [
    {
      Header: "FLAG NAME",
      accessor: "DisplayAs",
      Cell: ({ value, row }) => {
        return (
          <Link className=" fs-6 p-4" to={`/flag/view/${row.original._id}`}>
            {value}
          </Link>
        );
      },
    },
    {
      Header: "STATUS",
      accessor: (values: any) => {
        return <span>{values.Status ? "Active" : "In Active"}</span>;
      },
    },
    {
      Header: "CREATED AT",
      accessor: (values: any) => {
        return (
          <span>
            {timezoneDateConverter(values?.CreatedAt, user?.userTimezone)}{" "}
          </span>
        );
      },
    },
  ];


  const labelColumn: any = [
    {
      Header: "LABEL NAME",
      accessor: "label",
      Cell: ({ value, row }) => {
        return (
          <Link
            className=" fs-6 p-4"
            to={`/label/view/${row.original._id}`}
            state={row.original}
          >
            {value}
          </Link>
        );
      },
    },
    {
      Header: "STATUS",
      accessor: (values: any) => {
        return <span>{values.Status ? "Active" : "In Active"}</span>;
      },
    },
    {
      Header: "CREATED AT",
      accessor: (values: any) => {
        return (
          <span>
            {timezoneDateConverter(values?.CreatedAt, user?.userTimezone)}{" "}
          </span>
        );
      },
    },
  ];


  const columns: any = useMemo(() => statusColumn, [statusColumn]);
  const flagColumns: any = useMemo(() => flagColumn, [flagColumn]);
  const labelColumns: any = useMemo(() => labelColumn, [labelColumn]);
    
  
  return (
    <>
      <div className="my-10">
        <KTCard>
          <KTCardBody className="py-4 pt-10">
            <TableContainer
              isLoading={isLoading}
              columns={columns}
              data={statusData}
            />
          </KTCardBody>
        </KTCard>
      </div>
      <KTCard>
        <KTCardBody className="py-4 pt-10">
          <FlagTableContainer
            isLoading={isLoadingFlag}
            columns={flagColumns}
            data={flagData}
          />
        </KTCardBody>
      </KTCard>
      <div className="mt-10">
        <KTCard>
          <KTCardBody className="py-4 pt-10">
            <LabelTableContainer
              isLoading={isLoadingLabel}
              columns={labelColumns}
              data={labelData}
            />
          </KTCardBody>
        </KTCard>
      </div>
    </>
  );
};

export default FlagStatusTable;
