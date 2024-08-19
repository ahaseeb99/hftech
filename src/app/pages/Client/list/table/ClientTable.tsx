import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTable } from "react-table";
import { ACTION_getEstimate } from "../../../../../store/estimate/actions";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components";
import { KTCard, KTCardBody, KTSVG } from "../../../../../_metronic/helpers";
import TableContainer from "./TableContainer";
import _ from "lodash";
import ToggleSwitch from "../../../../../components/ToggleSwitch/toggle";
import { timezoneDateConverter } from "../../../../../utils/helpers";

const ActionsButtons = (props: any) => {
  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  return (
    <>
      <a
        href="#"
        className="btn btn-light btn-active-light-primary btn-sm"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        Actions
        <KTSVG
          path="/media/icons/duotune/arrows/arr072.svg"
          className="svg-icon-5 m-0"
        />
      </a>
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
        data-kt-menu="true"
      >
        <div className="menu-item px-3">
          <Link
            className="menu-link px-3"
            to={`/client/update/${props.clientId}`}
          >
            Edit
          </Link>
        </div>
        <div className="menu-item px-3">
          <a
            className="menu-link px-3"
            data-kt-users-table-filter="delete_row"
            onClick={() => props.showDeleteModalHandler(props.clientId)}
          >
            Delete
          </a>
        </div>
      </div>
    </>
  );
};

const ClientTable = ({ clientData = [], showDeleteModalHandler, user }: any) => {
  const  [activeSwitch, setActiveSwitch] = useState(true)

  const handleAccess = (event) => {
    if(!((user?.role?.permissions?.clients?.includes('view'))) ){
      event.preventDefault()
    } else {
      return
    }
  }
  const clientColumns: any = [
    // {
    //   Header: "ID",
    //   accessor: (values: any, index: any) => {
    //     return index + 1;
    //   },
    // },
    {
      Header: "NAME",
      accessor: "DisplayAs",
      Cell: ({ value, row }) => {
        const currentClientId = (
          clientData?.find(
            (client: any) => client._id === row.original._id
          ) as any
        )?._id;
        return (
          <Link
            className="menu-link px-3"
            onClick={ (event) => handleAccess(event) }
            to={`/client/view/${currentClientId}`}
          >
            {" "}
            {value}{" "}
          </Link>
        );
      },
    },
    // {
    //   Header: "LASTNAME",
    //   accessor: "LastName",
    //   Cell: ({ value, row }) => {
    //     const currentClientId = (
    //       clientData?.find(
    //         (client: any) => client._id === row.original._id
    //       ) as any
    //     )?._id;
    //     return (
    //       <Link
    //         className="menu-link px-3"
    //         to={`/client/view/${currentClientId}`}
    //       >
    //         {" "}
    //         {value}{" "}
    //       </Link>
    //     );
    //   },
    // },
    // {
    // 	Header: "REFERENCE",
    // 	accessor: "total",
    // },
    // {
    //   Header: "CREATED",
    //   accessor: (values: any) => {
    //     return timezoneDateConverter(values?.CreatedAt, user.userTimezone )
    //   },
    // },
  ];




  let sortedClients= clientData.sort(function(a, b) {
    return a.Name.localeCompare(b.Name);
 });



  const data: any = useMemo(() => sortedClients, [sortedClients]);
  const columns: any = useMemo(() => clientColumns, [sortedClients]);


  const extraFilters = () => <ToggleSwitch label="Show Active" activeSwitch={activeSwitch} onChange={
    e => {
      setActiveSwitch(e.target.checked)
    }
  } />
  // const filteredData = data.filter(item => item.status === (activeSwitch ? `INACTIVE` : `ACTIVE`))
  const filteredData = data.filter(item => activeSwitch ? item.status === 'ACTIVE' : item.status != 'ACTIVE')
  return (
    <KTCard>
      <KTCardBody className="py-4 mt-10">
        <div className="table-responsive">
            {/* <ToggleSwitch label="Inactive Clients" onChange={e => setActiveSwitch(e.target.checked)} /> */}
          <TableContainer columns={columns} data={filteredData} extraFilters={extraFilters}/>
        </div>
      </KTCardBody>
    </KTCard>
  );
};

export default ClientTable;
