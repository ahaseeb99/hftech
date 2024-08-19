import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ToggleSwitch from "../../../../../components/ToggleSwitch/toggle";
import { ACTION_getClients } from "../../../../../store/client/actions";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import TableContainer from "./TableContainer";

const UserTable = ({ usersList = [], showDeleteModalHandler, onDownloadBtnHandler, setShowFilterModal, loading, handleClearFilter,clientList }: any) => {

  const [activeSwitch, setActiveSwitch] = useState(true)
  const [clientsList, setClientsList] = useState([]);

  useEffect(() => {
    setClientsList(clientList);
  }, [clientList]);

  const locationColumns: any = [
    {
      Header: "FIRST NAME",
      accessor: "FirstName",
      Cell: ({ value, row }) => {
        return (
          <Link
            className="menu-link px-3"
            to={`/users/view/${row?.original?._id}`}
          >
            {value}
          </Link>
        );
      },
    },
    {
      Header: "LAST NAME",
      accessor: "LastName",
      Cell: ({ value, row }) => {
        return (
          <Link
            className="menu-link px-3"
            to={`/users/view/${row?.original?._id}`}
          >
            {value}
          </Link>
        );
      },
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Role",
      accessor: "role",
      Cell: ({ value }) => value?.name
    },
    {
      Header: "Emergency",
      accessor: "emergency",
      Cell: ({ value }) => {
        return (
          <span
            className={`badge badge-lg badge-${value
              ? "danger"
              : "secondary"
              }`}
          >
            {'EMR'}
          </span>
        )
      }
    },
    {
      Header: "Phone",
      accessor: "contact",
      Cell: ({ value }) => {
        return (
          <a href={`tel:${value}`}>{value}</a>
        );
      },
    },
    {
      Header: "Personal Phone",
      accessor: "personalContact",
      Cell: ({ value }) => {
        return (
          <a href={`tel:${value}`}>{value}</a>
        );
      },
    },
    {
      Header: "EMAIL",
      accessor: "email",
      Cell: ({ value, row }) => {
        return (
          <a href={`mailto:${value}`}>{value}</a>
        );
      },
    },
    {
      Header: "Intel Id",
      accessor: "intelId",
    }
  ];



  let sortedUsers = usersList.sort(function (a, b) {
    return a.FirstName.localeCompare(b.FirstName);
  });

  const data: any = useMemo(() => sortedUsers, [sortedUsers]);
  const columns: any = useMemo(() => locationColumns, [clientsList]);
  console.log(data.email, "data");



  const extraFilters = () => <ToggleSwitch label="Show Active" activeSwitch={activeSwitch} onChange={
    e => {
      setActiveSwitch(e.target.checked)
    }
  } />

  // const filteredData = data.filter(item => item.status === (activeSwitch ? `ACTIVE` : `INACTIVE`))
  const filteredData = data.filter(item => activeSwitch ? item.status === 'ACTIVE' : item.status != 'ACTIVE')

  return (
    <KTCard>
      <KTCardBody className="py-4">
        <div className="table-responsive">
          {<TableContainer handleClearFilter={handleClearFilter} loading={loading} onDownloadBtnHandler={onDownloadBtnHandler} columns={columns} data={filteredData} setShowFilterModal={setShowFilterModal} extraFilters={extraFilters} />}
        </div>
      </KTCardBody>
    </KTCard>
  );
};

export default UserTable;
