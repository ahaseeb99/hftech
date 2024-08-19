import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { currencyConverter, taskRefinementHTML, timezoneDateConverter, timezoneTimeConverter } from "../../../../../utils/helpers";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components";
import { KTCard, KTCardBody, KTSVG } from "../../../../../_metronic/helpers";
import ContactModal from "../../showWorkorderContact/ContactModal";
import FlagModal from "../../showWorkorderContact/FlagModal";
import TableContainer from "./TableContainer";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import "../../index.css"
import POModal from "../../showWorkorderContact/PoNumberCopyModal";
import AssignToModal from "../../showWorkorderContact/AssignedToModal";

const PriorityList = {
  Emergency: 1,
  Regular: 2,
  Low: 3,
}

const ActionsButtons = (props: any) => {
  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  // console.info("----------------------------")
  // console.info("props =>", props)
  // console.info("----------------------------")

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
            to={`/order/update/${props?.WorkOrderId?.Id}`}
          >
            Edit
          </Link>
        </div>
        <div className="menu-item px-3">
          <a
            className="menu-link px-3"
            data-kt-users-table-filter="delete_row"
            onClick={() => props.showDeleteModalHandler(props.data.id)}
          >
            Delete
          </a>
        </div>
      </div>
    </>
  );
};

const WorkOrderTable = ({
  WorkOrderData = [],
  showDeleteModalHandler,
  handleDataFilter,
  user,
  handlePageLimit,
  handlePageNumber,
  handleNextPage,
  clientFilterBy,
  handlePreviousPage,
  metaData,
  pageNumber,
  handleFilterChange,
  handleFilterButton,
  setClientFilterBy,
  clientsData,
  handleClearFilterButton,
  loading,
  extraFilters,
  searchQuery,
  handleGetAllData
}: any) => {
  const [contactModalData, setContactModalData] = useState<{}>();
  const [flagModalData, setFlagModalData] = useState("");
  const [poNumber, setPoNumber] = useState<string>("")
  const [poModal, setPoModal] = useState<boolean>(false)
  const [assignedToModal, setAssignedToModal] = useState<boolean>(false)
  const [assignedToData, setAssignedToData] = useState<any>({})
  const [showMoreContact, setShowMoreContact] = useState<any>("")

  const handleAccess = (event) => {
    if (!((user?.role?.permissions?.contacts?.includes('view')))) {
      event.preventDefault()
    } else {
      return
    }
  }

  const handlePoCloseModal = () => {
    setPoModal(false)
  }

  const handlePoModal = (poNumber: string) => {
    setPoNumber(poNumber);
    setPoModal(true)
  }

  const handleShowMoreContact = (index) => {
    if (showMoreContact == index) {
      setShowMoreContact("")
    }
    else {
      setShowMoreContact(index)
    }
  }

  const WorkOrderColumns: any = [
    {
      Header: "STATUS",
      accessor: (props) => ([props.StatusId, props._id]),
      Cell: ({ value }) => {
        let [StatusId, _id] = value;
        let html = "";
        switch (StatusId) {
          case "OnHold":
            html += '<img src="/media/svg/hf-work-order-status/on-hold.svg"  data-toggle="tooltip" data-placement="top" title="onHold" />'
            break
          case "Cancelled":
            html += '<img src="/media/svg/hf-work-order-status/cancelled.svg"  data-toggle="tooltip" data-placement="top" title="Cancelled" />'
            break
          case "Paused":
            html += '<img src="/media/svg/hf-work-order-status/paused.svg"  data-toggle="tooltip" data-placement="top" title="Paused"  />'
            break
          case "Attention":
            html += '<img src="/media/svg/hf-work-order-status/attention.svg"  data-toggle="tooltip" data-placement="top" title="Attention"  />'
            break
          case "Open":
            html += '<img src="/media/svg/hf-work-order-status/open.svg"  data-toggle="tooltip" data-placement="top" title="Open" />'
            break
          case "Closed":
            html += '<img src="/media/svg/hf-work-order-status/closed.svg"  data-toggle="tooltip" data-placement="top" title="Closed" />'
            break
          case "Unknown":
            html += '<img src="/media/svg/hf-work-order-status/un-known.svg"  data-toggle="tooltip" data-placement="top" title="Unknown" />'
            break
          case "InProgress":
            html += '<img src="/media/svg/hf-work-order-status/in-progress.svg"  data-toggle="tooltip" data-placement="top" title="InProgress" />'
            break
          case "New":
            html += '<img src="/media/svg/hf-work-order-status/new.svg"   data-toggle="tooltip" data-placement="top" title="New" />';
            break;
          case "Completed":
            html +=
              '<img src="/media/svg/hf-work-order-status/complete.svg"  data-toggle="tooltip" data-placement="top" title="Completed" />';
            break;
          default:
            html +=
              `<i class="bi bi-bullseye fs-0"></i>`
        }
        return (
          <Link
            className="menu-link"
            onClick={(event) => handleAccess(event)}
            to={`/order/view/${_id}`}
          >
            <span
              style={{ cursor: "pointer" }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Link>
        );
      },
    },
    {
      Header: "WO#",
      accessor: "Number",
      Cell: ({ value, row }) => {
        // debugger
        return (
          <>
            {row.original?._id ? (
              <Link
                className="menu-link"
                onClick={(event) => handleAccess(event)}
                to={`/order/view/${row.original?._id}`}
              >
                {" "}
                {value}{" "}
              </Link>
            ) :
              (<span>{" "}{value}{" "}</span>)}
          </>);
      },
    },
    {
      Header: "PO#",
      accessor: "PoNumber",
      Cell: ({ value }) => {
        return (
          <>
            <span
              onClick={() => handlePoModal(value)}
              data-toggle="tooltip" data-placement="top" title={value}
              className={`badge badge-lg badge-${value
                ? "success cursor-pointer"
                : "secondary"
                }`}
              style={{ pointerEvents: `${value ? 'all' : 'none'}` }}
            >
              PO
            </span>
          </>
        );
      },
    },
    {
      Header: "Bill To",
      accessor: "BillTo",
      Cell: ({ value }) => {
        return (
          <>
            <span
            >
              {value?.DisplayAs}
            </span>
          </>
        );
      },
    },
    {
      Header: "SPACE",
      accessor: "ShortLocation",
      Cell: ({ value }) => {
        let spaces = value?.split("\\");
        return (
          <>
            <span className="text-muted fw-semibold text-muted d-block fs-7">
              {spaces?.length > 0 ? spaces[0] : ""}
            </span>
            <span className="">{spaces?.length > 1 ? spaces[1] : ""}</span>
          </>
        );
      },
    },
    {
      Header: "PRIORITY",
      accessor: "Priority",
      Cell: ({ value }) => {
        const Id = value?.value ? value?.value : value?.Id
        let priority =
          Id == PriorityList.Emergency
            ? "EMR"
            : Id == PriorityList.Regular
              ? "REG"
              : "LOW";
        return (
          <span
            className={`badge badge-lg badge-${priority === "EMR"
              ? "danger"
              : priority === "REG"
                ? "success"
                : "secondary"
              }`}
          >
            {priority}
          </span>
        );
      },
    },
    {
      Header: "DESCRIPTION",
      accessor: (props) => ([props?.TaskRefinement, props?.Labels, props?.callerId]),
      Cell: ({ value }) => {
        let [TaskRefinement, Labels, callerId] = value
        let html = taskRefinementHTML(TaskRefinement, Labels, callerId);
        return (
          <span dangerouslySetInnerHTML={{ __html: html }} />
        );
      },
    },
    {
      Header: "ASSIGNED TO",
      accessor: (props) => ([props.employee, props.Employee]),
      Cell: ({ value }) => {
        const [employee, Employee] = value;
        return (
          <div className="d-flex align-items-center">
            {employee?.length > 0 ? employee?.map((employee, index) => (
              <a
                key={index}
                onClick={() => {
                  setAssignedToData(employee)
                  setAssignedToModal(true)
                }}
                className="text-white rounded-circle d-flex align-items-center justify-content-center avatar"

                style={{ cursor: "pointer", width: "30px", height: "30px", backgroundColor: `${employee?.FirstName ? 'lightblue' : 'transparent'}`, marginLeft: `${index == 0 ? 0 : "-10px"}` }}
                data-toggle="tooltip" data-placement="top" title={employee?.FirstName + " " + employee?.LastName}>

                <p style={{ margin: 0 }}>
                  {(employee?.FirstName + " " + employee?.LastName).split(" ").map(item => item.charAt(0).toUpperCase())}
                </p>
              </a>
            )) : (
              <a
                className="text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ cursor: "pointer", width: "30px", height: "30px", backgroundColor: `${Employee?.DisplayAs ? 'lightblue' : 'transparent'}` }}
                onClick={() => {
                  setAssignedToData(Employee)
                  setAssignedToModal(true)
                }}
                data-toggle="tooltip" data-placement="top" title={Employee?.DisplayAs}>
                <p style={{ margin: 0 }}>
                  {Employee?.DisplayAs ? Employee?.DisplayAs.charAt(0) : null}
                </p>
              </a>
            )}
          </div>
        );
      },
    },
    {
      Header: "SCHEDULED TO",
      accessor: (values: any) => {
        return (
          <span>
            {values?.ScheduledStartUtc
              ? timezoneDateConverter(values?.ScheduledStartUtc, user.userTimezone)
              : ""}{" "}
            <br />
            {values?.ScheduledStartUtc
              ? timezoneTimeConverter(values?.ScheduledStartUtc, user.userTimezone)
              : "-"}
          </span>
        );
      },
    },
    {
      Header: "FLAG",
      accessor: (values: any) => {
        return values?.Flag?.length > 0 ? (
          <i
            onClick={() => {
              setFlagModalData(values?.Flag)
              setShowFlagModal(true)
            }
            }
            style={{
              color: "red",
              cursor: "pointer",
            }}
            className="bi bi-flag-fill"
            title={values?.Flag?.map(item => (
              item?.DisplayAs
            ))}
          ></i>
        ) : (
          ""
        );
      },
    },
    {
      Header: "CONTACT",
      accessor: (props) => ([props.ContactName, props.Contact, props.ContactAddress, props.BillTo]),
      Cell: ({ value, row }) => {
        const [ContactName, Contact, ContactAddress, BillTo] = value;
        return (
          <>
            <div className="d-flex align-items-center">
              {Contact?.length > 0 ? [...Contact, ...BillTo?.Contacts || []].slice(0, 3)?.map((contact, index) => (
                <>
                  <a
                    key={index}
                    className="text-white rounded-circle d-flex align-items-center justify-content-center avatar WorkOrderTableContactBadge"
                    onClick={() => {
                      setContactModalData({
                        contactName: contact?.fullName,
                        contactData: contact
                      });
                      setShowContactModal(true);
                    }}
                    style={{
                      backgroundColor: `${contact?.fullName ? 'lightblue' : 'transparent'}`,
                      marginLeft: `${index == 0 ? 0 : "-10px"}`
                    }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={contact?.fullName}>

                    <p style={{ margin: 0, textAlign: "center" }}>
                      {contact?.fullName.split(" ").map(item => item.charAt(0).toUpperCase())}
                    </p>
                  </a>
                </>
              )) : (
                <a
                  className="text-white rounded-circle d-flex align-items-center justify-content-center"
                  onClick={() => {
                    setContactModalData({
                      contactName: ContactName,
                      contactData: ContactAddress
                    });
                    setShowContactModal(true);
                  }}
                  style={{
                    cursor: "pointer",
                    width: "30px",
                    height: "30px",
                    backgroundColor: `${ContactName ? '#FF4571' : 'transparent'}`
                  }}
                  data-toggle="tooltip" 
                  data-placement="top" 
                  title={ContactName}>
                  <p style={{ margin: 0 }}>
                    {ContactName ? ContactName.charAt(0) : null}
                  </p>
                </a>
              )}
            </div>
            <div>
              {[...Contact, ...BillTo?.Contacts || []]?.length > 3 &&
                <div className="position-relative">
                  <span className="text-info cursor-pointer" style={{ fontSize: "10px" }} onClick={() => handleShowMoreContact(row?.id as string)}>{showMoreContact == row?.id ? "Less" : "Show More"}</span>
                  {showMoreContact == row?.id &&
                    <div className="position-absolute d-flex p-3 border overflow-auto" style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", backgroundColor: "white", width: "200px", height: "300px", zIndex: 9 }}>
                      {[...Contact, ...BillTo?.Contacts || []].slice(1)?.map((contact, index) => (
                        <>
                          <a
                            key={index}
                            className="text-white rounded-circle d-flex align-items-center justify-content-center avatar"
                            onClick={() => {
                              setContactModalData({
                                contactName: contact?.fullName,
                                contactData: contact
                              });
                              setShowContactModal(true);
                            }}
                            style={{ cursor: "pointer", width: "30px", height: "30px", backgroundColor: `${contact?.fullName ? 'lightblue' : 'transparent'}`, marginLeft: `${index == 0 ? 0 : "-10px"}` }}
                            data-toggle="tooltip" data-placement="top" title={contact?.fullName}>
                            <p style={{ margin: 0, textAlign: "center" }}>
                              {contact?.fullName.split(" ").map(item => item.charAt(0).toUpperCase())}
                            </p>
                          </a>
                        </>
                      ))}
                    </div>
                  }
                </div>
              }

            </div>
          </>
        );

      },
    },
    {
      Header: () => {
        return ((user?.role?.permissions?.estimates?.includes('view') && user?.role?.permissions?.estimates?.includes('list')) && "Estimate Total")
      },
      accessor: "EstimateId",
      Cell: ({ value }) => {
        return (
          <>
            {
              (user?.role?.permissions?.estimates?.includes('view') && user?.role?.permissions?.estimates?.includes('list')) &&
              <span className="text-muted  d-block">
                {currencyConverter(value?.total)}
              </span>
            }
          </>
        );
      },
    },
  ];


  const [showContactModal, setShowContactModal] = useState<any>(false);
  const [showFlagModal, setShowFlagModal] = useState<any>(false);
  const navigate = useNavigate();

  const closeContactModalHandler = () => {
    setContactModalData({
      contactName: "",
      contactId: "",
    });
    setShowContactModal(false);
  };

  const data: any = useMemo(() => WorkOrderData, [WorkOrderData, showMoreContact]);

  const columns: any = useMemo(() => WorkOrderColumns, [showMoreContact]);

  return (
    <div>
      {assignedToModal &&
        <AssignToModal
          assignedToData={assignedToData}
          handleClose={() => setAssignedToModal(false)}
        />
      }
      {poModal &&
        <POModal
          poNumber={poNumber}
          handleClose={handlePoCloseModal}
        />
      }
      {showContactModal && (
        <ContactModal
          closeContactModalHandler={closeContactModalHandler}
          contactData={contactModalData}
        //   workOrderData={}
        />
      )}
      {showFlagModal && (
        <FlagModal
          closeFlagModalHandler={() => setShowFlagModal(false)}
          flagData={flagModalData}
        />
      )}
      <KTCard>
        <KTCardBody className="py-4 mt-10">
          <div className="table-responsive WorkOrderListTable">
            <TableContainer
              extraFilters={extraFilters}
              columns={columns}
              data={data}
              sortBy={[{ id: "CreatedDateUtc" }]}
              handleDataFilter={handleDataFilter}
              handlePageLimit={handlePageLimit}
              handlePageNumber={handlePageNumber}
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
              metaData={metaData}
              pageNumber={pageNumber}
              handleFilterChange={handleFilterChange}
              handleFilterButton={handleFilterButton}
              setClientFilterBy={setClientFilterBy}
              clientsData={clientsData}
              clientFilterBy={clientFilterBy}
              handleClearFilterButton={handleClearFilterButton}
              loading={loading}
              searchQuery={searchQuery}
              handleGetAllData={handleGetAllData}
            />
          </div>
        </KTCardBody>
      </KTCard>
    </div>
  );
};

export default WorkOrderTable;
