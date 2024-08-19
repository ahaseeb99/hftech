import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DateTimeWithtimezoneConverter, timezoneConverter } from "../../../../../utils/helpers";
import { KTCard, KTCardBody, KTSVG } from "../../../../../_metronic/helpers";
import TableContainer from "./TableContainer";


const RoleTable = ({ rolesData = [] }: any) => {
  const { user } = useSelector((state: any) => state.auth);

  console.log('rolesData in table', rolesData);
  const rolesColumns: any = [
    {
      Header: "NAME",
      accessor: "name",
      Cell: ({ value, row }) => {
        return (
          <Link
            className="menu-link px-3"
            to={`/role/view/${row?.original?._id}`}
          >
            {" "}
            {value}{" "}
          </Link>
        );
      },
    },
    {
      Header: () => <p className="m-0">CREATED AT  <span className="cursor-pointer text-dark" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
        <KTSVG path="/media/svg/shapes/global.svg" />
      </span></p>,
      accessor: "createdAt",
      Cell: ({ value }) => {
        return (
          <p>
            {timezoneConverter(value)}
          </p>
        );
      },
    },
  ];

  let sortedRoles = rolesData?.sort(function (a, b) {
    return a?.name?.localeCompare(b?.name);
  });

  const data: any = useMemo(() => sortedRoles.map((d) => {
    return { ...d, createdAt: DateTimeWithtimezoneConverter(d.createdAt, user.userTimezone) }
  }), [sortedRoles]);
  const columns: any = useMemo(() => rolesColumns, [sortedRoles]);
  return (
    <KTCard>

      <KTCardBody className="py-4">

        <div className="table-responsive card-body">

          <TableContainer columns={columns} data={data} />
        </div>
      </KTCardBody>
    </KTCard>
  )
}


export default RoleTable;