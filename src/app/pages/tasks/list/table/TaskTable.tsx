import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import AssignToDetailModal from "../../view/AssignedToDetailModal";
import ContactDetailModal from "../../view/ContactDetailModal";
import TableContainer from "./TableContainer";

interface TaskTableProps {
  taskData: any;
  isLoading: boolean;
}

const TaskTable = ({ taskData = [], isLoading }: TaskTableProps) => {

  const { user } = useSelector((state: any) => state.auth);

  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState({});
  const [showAssignedToDetailModal, setShowAssignedToDetailModal] =
    useState(false);
  const [selectedAssignedTo, setSelectedAssignedTo] = useState({});

  const handleAccess = (event) => {
    if(!((user?.role?.permissions?.tasks?.includes('view'))) ){
      event.preventDefault()
    } else {
      return
    }
  }

  const handleShowContactModal = (data) => {
    setShowContactModal(true);
    setSelectedContact({
      contactName: data?.fullName,
      contact: data,
    });
  };

  const closeContactModalHandler = () => {
    setSelectedContact({
      contactName: "",
      contact: "",
    });
    setShowContactModal(false);
  };

  const handleShowAssignedToModal = (data) => {
    setShowAssignedToDetailModal(true);
    setSelectedAssignedTo(data);
  };

  const TaskColumn: any = [
    {
      Header: "Name",
      accessor: (value) => ({ name: value?.name }),
      Cell: ({ value, row }) => {
        return (
          <Link className=" fs-6 p-4" to={`/task/view/${row.original._id}`} onClick={handleAccess}>
            {value?.name}
          </Link>
        );
      },
    },
    {
      Header: "Client",
      accessor: "client.DisplayAs",
    },
    {
      Header: "ASSIGNED TO",
      accessor: (props) => [props.assignedTo],
      Cell: ({ value }) => {
        const [assignedTo] = value;
        return (
          <div className="d-flex align-items-center">
            {assignedTo?.length > 0
              ? assignedTo?.map((assignedTo, index) => (
                  <a
                    key={index}
                    className="text-white rounded-circle d-flex align-items-center justify-content-center avatar"
                    style={{
                      cursor: "pointer",
                      width: "30px",
                      height: "30px",
                      backgroundColor: `${
                        assignedTo?.FirstName ? "lightblue" : "transparent"
                      }`,
                      marginLeft: `${index == 0 ? 0 : "-10px"}`,
                    }}
                    onClick={() => handleShowAssignedToModal(assignedTo)}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={assignedTo?.FirstName + " " + assignedTo?.LastName}
                  >
                    <p style={{ margin: 0 }}>
                      {(assignedTo?.FirstName + " " + assignedTo?.LastName)
                        .split(" ")
                        .map((item) => item.charAt(0).toUpperCase())}
                    </p>
                  </a>
                ))
              : null}
          </div>
        );
      },
    },
    {
      Header: "CONTACTS",
      accessor: (props) => [props.contacts],
      Cell: ({ value }) => {
        const [contacts] = value;
        return (
          <div className="d-flex align-items-center">
            {contacts?.length > 0
              ? contacts?.map((contact, index) => (
                  <a
                    key={index}
                    className="text-white rounded-circle d-flex align-items-center justify-content-center avatar"
                    style={{
                      cursor: "pointer",
                      width: "30px",
                      height: "30px",
                      backgroundColor: `${
                        contact?.fullName ? "lightblue" : "transparent"
                      }`,
                      marginLeft: `${index == 0 ? 0 : "-10px"}`,
                    }}
                    onClick={() => handleShowContactModal(contact)}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={contact?.fullName}
                  >
                    <p style={{ margin: 0 }}>
                      {(contact?.fullName)
                        .split(" ")
                        .map((item) => item.charAt(0).toUpperCase())}
                    </p>
                  </a>
                ))
              : null}
          </div>
        );
      },
    },
  ];

  const columns: any = useMemo(() => TaskColumn, [TaskColumn]);
  return (
    <>
      {showContactModal && (
        <ContactDetailModal
          closeContactModalHandler={closeContactModalHandler}
          contactData={selectedContact}
        />
      )}
      {showAssignedToDetailModal && (
        <AssignToDetailModal
          handleClose={() => setShowAssignedToDetailModal(false)}
          assignedToData={selectedAssignedTo}
        />
      )}
      <KTCard>
        <KTCardBody className="py-4 pt-10">
          <TableContainer
            isLoading={isLoading}
            columns={columns}
            data={taskData}
          />
        </KTCardBody>
      </KTCard>
    </>
  );
};

export default TaskTable;
