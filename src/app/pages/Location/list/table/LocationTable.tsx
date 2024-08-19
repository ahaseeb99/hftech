import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ToggleSwitch from "../../../../../components/ToggleSwitch/toggle";
import { ACTION_getClients } from "../../../../../store/client/actions";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components";
import { KTCard, KTCardBody, KTSVG } from "../../../../../_metronic/helpers";
import TableContainer from "./TableContainer";

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

const LocationTable = ({ locationData = [], showDeleteModalHandler }: any) => {
  const dispatch = useDispatch<any>();
  const  [activeSwitch, setActiveSwitch] = useState(true)

  const clientList = useSelector(
    (state: any) => state.client.clientsData.clients
  );


  useEffect(() => {
    dispatch(ACTION_getClients());
  }, []);
  const { user } = useSelector((state: any) => state.auth);

  const handleAccess = (event) => {
    if(!((user?.role?.permissions?.locations?.includes('view'))) ){
      event.preventDefault()
    } else {
      return
    }
  }


  const locationColumns: any = [
    {
      Header: "NAME",
      accessor: "locationName",
      Cell: ({ value, row }) => {
        return (
          <Link
            className="menu-link px-3"
            onClick={ (event) => handleAccess(event) }
            to={`/location/view/${row?.original?._id}`}
          >
            {" "}
            {value}{" "}
          </Link>
        );
      },
    },
    // {
    //   Header: "ClIENT",
    //   accessor: (values: any) => {
    //     console.log({ values });
    //     const clinet = clientList?.find((item: any) => {
    //       if (item.locations.some((ci) => ci._id === values._id)) {
    //         return item;
    //       }
    //     });
    //     return <div>{clinet?.fullName}</div>;
    //   },
    // },
    {
      Header: "CLIENT",
      accessor: "clientId.DisplayAs",
    },
    {
      Header: "ADDRESS",
      accessor: "street",
    },
    {
      Header: "CITY",
      accessor: "city",
    },
    {
      Header: "STATE",
      accessor: "state",
    },
    {
      Header: "STATUS",
      accessor: "status",
    },
  ];


  console.log({locationData})

  let sortedLocations= locationData?.sort(function(a, b) {
    return a?.Name?.localeCompare(b?.Name);
 });

  const data: any = useMemo(() => sortedLocations, [sortedLocations]);
  const columns: any = useMemo(() => locationColumns, [sortedLocations]);

  const extraFilters = () => <ToggleSwitch label="Show Active" activeSwitch={activeSwitch} onChange={
    e => {
      setActiveSwitch(e.target.checked)
    }
  } />

  const filteredData = data.filter(item => activeSwitch ? item.status === 'ACTIVE' : item.status != 'ACTIVE')

  return (
    <KTCard>
      <KTCardBody className="py-4">
        {/* <div className="card-body py-4">
					<Row>
						<div className="d-flex justify-content-end">

							<Link to="/location/create" className="btn btn-primary"><span className="svg-icon svg-icon-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mh-50px"><rect opacity="0.5" x="11.364" y="20.364" width="16" height="2" rx="1" transform="rotate(-90 11.364 20.364)" fill="currentColor"></rect><rect x="4.36396" y="11.364" width="16" height="2" rx="1" fill="currentColor"></rect></svg></span>Add Location</Link>

						</div>
					</Row>
				</div> */}

        <div className="table-responsive card-body">
          <TableContainer columns={columns} data={filteredData} extraFilters={extraFilters} sortBy={[{ id: "locationName" }]}/>
        </div>
      </KTCardBody>
    </KTCard>
  );
};

export default LocationTable;
