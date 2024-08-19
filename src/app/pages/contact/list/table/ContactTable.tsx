import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTable } from "react-table";
import { ACTION_getClients } from "../../../../../store/client/actions";
import { formatPhoneNumber } from "../../../../../utils/helpers";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components";
import { KTCard, KTCardBody, KTSVG } from "../../../../../_metronic/helpers";
import TableContainer from "./TableContainer";

const ActionsButtons = (props: any) => {
  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  console.info("----------------------------");
  console.info("props =>", props);
  console.info("----------------------------");

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
            to={`/location/update/${props.locationId}`}
          >
            Edit
          </Link>
        </div>
        <div className="menu-item px-3">
          <a
            className="menu-link px-3"
            data-kt-users-table-filter="delete_row"
            onClick={() => props.showDeleteModalHandler(props.locationId)}
          >
            Delete
          </a>
        </div>
      </div>
    </>
  );
};

const ContactTable = ({ contactData = [], showDeleteModalHandler,clientsData,setClientId,clientId }: any) => {
  const dispatch = useDispatch<any>();

  const clientList = useSelector(
    (state: any) => state.client.clientsData.clients
  );

  const [clientsList, setClientsList] = useState([]);

  useEffect(() => {
    dispatch(ACTION_getClients());
  }, []);

  useEffect(() => {
    setClientsList(clientList);
  }, [clientList]);
  
  const { user } = useSelector((state: any) => state.auth);

  const handleAccess = (event) => {
    if(!((user?.role?.permissions?.contacts?.includes('view'))) ){
      event.preventDefault()
    } else {
      return
    }
  }

  const locationColumns: any = [
    {
      Header: "NAME",
      accessor: "fullName",
      Cell: ({ value, row }) => {
        return (
          <Link
            className="menu-link px-3"
            onClick={ (event) => handleAccess(event) }
            to={`/contact/view/${row?.original?._id}`}
          >
            {" "}
            {value}{" "}
          </Link>
        );
      },
    },
    {
      Header: "CLIENT",
      accessor: (values: any) => {
        return <div>{values?.clientId?.Name}</div>;
      },
    },
    {
      Header: "PHONE",
      accessor: (value) => formatPhoneNumber(value.phoneNumber),
    },
    {
      Header: "EMAIL",
      accessor: "emailAddress",
    },
  ];

  const data: any = useMemo(() => contactData, [contactData]);
  const columns: any = useMemo(() => locationColumns, [clientsList]);

  return (
    <KTCard>
      <KTCardBody className="py-4 pt-10">
        <div className="table-responsive">
          <TableContainer clientsData={clientsData}  clientId={clientId} setClientId={setClientId} columns={columns} data={data} sortBy={[{ id: "fullName" }]} />
        </div>
      </KTCardBody>
    </KTCard>
  );
};

export default ContactTable;
