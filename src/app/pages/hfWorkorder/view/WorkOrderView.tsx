import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  ACTION_addFlag,
  ACTION_createTask,
  ACTION_deleteWorkOrderFlag,
  ACTION_editWorkOrderFlag,
  ACTION_getEmployeeAPI,
  ACTION_getHFWorkOrderByIdAPI,
  ACTION_getHFWorkOrderEmailDetailByIdAPI,
  ACTION_getWorkOrdersFlags,
  ACTION_restoreWorkOrder,
  ACTION_sendAttachmentsWorkorderEmail,
  ACTION_sendWorkorderEmail,
  ACTION_UpdateHFDocument,
  ACTION_updateTask,
} from "../../../../store/workorder/actions";
import { 
  timezoneConverter, 
  taskRefinementHTML,
  timezoneDateConverter,
  timezoneTimeConverter,
  DateTimeWithtimezoneConverter,
  currencyConverter
} from "../../../../utils/helpers";
import DeleteWorkOrderModal from "../delete/DeleteHfWorkOrderModal";
import DeleteDocumentModal from "../delete/DeleteDocumentModal";
import { uploadFileToS3 } from "../../../../utils/uploadFileToS3";
import "bootstrap/js/src/collapse.js";
import NotesModal from "./NotesModal";
import DeleteNoteModal from "../delete/DeleteNoteModal";
import SendMailModal from './../sendWorkorderMail/sendMailModal'
import FileUploadModal from "./FileUploadModal";
import SendMailAttachmentModal from "../sendWorkorderMail/sendWorkorderAttachmentMail";
import { KTSVG } from "../../../../_metronic/helpers";
import DocumentEditModal from "./DocumentEditModal";
import ContactModal from "../showWorkorderContact/ContactModal";
import TaskModal from "./TaskModal";
import { ACTION_getUsers } from "../../../../store/users/actions";
import TaskEditModal from "./TaskEditModal";
import AddFlagModal from "./FlagAddModal";
import EditFlagModal from "./FlagEditModal";
import { ACTION_getClients } from "../../../../store/client/actions";

const WorkOrderView = () => {
  const dispatch: any = useDispatch();
  let { orderId = "" } = useParams();
  const navigate = useNavigate();
  const [activeWorkOrder, setActiveWorkOrder] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [showDeleteNoteModal, setShowDeleteNoteModal] = useState<boolean>(false);
  const [note, setNote] = useState<object>({});
  const [updateNote, setUpdateNote] = useState<boolean>(false);
  const [showSendWorkorderModal, setShowSendWorkoderModal] = useState<any>(false);
  const [showDocumentDeleteModal, setShowDocumentDeleteModal] = useState<any>(false);
  const [deleteDocument, setDeleteDocument] = useState<object>({});
  const [open, setOpen] = useState<number>(0);
  const { user } = useSelector((state: any) => state.auth);
  const [showMailAttachmentModal,setShowMailAttachmentModal] = useState(false)
  const [showFileModal,setShowFileModal] = useState<boolean>(false)
  const [showDocumentEditModal,setShowDocumentEditModal] = useState<boolean>(false)
  const [currentDoc,setCurrentDoc] = useState({})
  const [showContactModal, setShowContactModal] = useState<any>(false);
  const [contactModalData, setContactModalData] = useState<{}>();
  const [showTaskModal,setShowTaskModal] = useState<boolean>(false)
  const [showTaskEditModal,setShowEditTaskModal] = useState(false)
  const [selectedTask,setSelectedTask] = useState<any>({})
  const [showAddFlagModal,setShowAddFlagModal] = useState<boolean>(false)
  const [currentSelectedFlag,setCurrentSelectedFlag] = useState<any>({})
  const [showFlagEditModal,setShowFlagEditModal] = useState<boolean>(false)

  const { workOrderFlags: flagDropdownData } = useSelector((state : any) => state.workOrder)
  const data: any = useSelector(
    (state: any) => state.workOrder.workOrderDetail
  );
  const listOfEmployees = useSelector(
    (state: any) => state.workOrder.employeeList
  );
  const emailDetails = useSelector(
    (state: any) => state.workOrder.workOrderEmailDetail
  );
 
  const clientsList = useSelector(
    (state: any) => state.client.clientsData.clients
  );

  const showSendWorkorderModalHandler = (_workOrder: any) => {
    setShowSendWorkoderModal(true);
    setActiveWorkOrder(_workOrder);
  };

  const closeSendWorkorderModalHandler = () => {
    setShowSendWorkoderModal(false);
  };

  const showDeleteModalHandler = (_workOrder: any) => {
    setActiveWorkOrder(_workOrder);
    setShowDeleteModal(true);
  };


  const closeDeleteModalHandler = () => {
    setActiveWorkOrder(null);
    setShowDeleteModal(false);
  };
  const onSendWorkorderBtnHandler = (activeWorkOrder: any, reqPacket: any) => {
    closeSendWorkorderModalHandler();
    dispatch(ACTION_sendWorkorderEmail(activeWorkOrder, reqPacket));
  };

  const deleteDoumentModalHandler = (doc) => {
    setShowDocumentDeleteModal(true)
    setDeleteDocument(doc)
  }

  const closeDeleteDocumentModalHandler = () => {
    setDeleteDocument({});
    setShowDocumentDeleteModal(false);
  };

  useEffect(() => {
    dispatch(ACTION_getHFWorkOrderByIdAPI(orderId));
    dispatch(ACTION_getHFWorkOrderEmailDetailByIdAPI(orderId));
    dispatch(ACTION_getWorkOrdersFlags())
    dispatch(ACTION_getUsers());  
    dispatch(ACTION_getClients());
  }, []);

  const showMailAttachmentHandler = (_workOrder : any) => {
    setShowMailAttachmentModal(true)
    setActiveWorkOrder(_workOrder)
  }

  const closeMailAttachmentHandler = () => {
    setShowMailAttachmentModal(false)
  }

  const onSendMailAttachmentBtnHandler = (_id, payload) => {
    //  debugger
    dispatch(ACTION_sendAttachmentsWorkorderEmail(_id, payload))
  }

  const fileUploadHandler = async (file : any,docType : string) => {
    setLoading(true)
    const files = file;
    const form = new FormData();
    files.map(file => {
      form.append("files", file)
    })
    form.append('documentType', docType)
    await uploadFileToS3(form, data?._id);
    dispatch(ACTION_getHFWorkOrderByIdAPI(orderId))
    setLoading(false)
    setShowFileModal(false)
  }

  useEffect(() => {
    if (data?.Assignments?.length > 1) {
      dispatch(ACTION_getEmployeeAPI());
    }
  }, [data]);


  const addNewNote = () => {
    setNote({});
    setShowNote(true);
  };

  const editNote = (note) => {
    setNote(note);
    setUpdateNote(true)
    setShowNote(true);
  };
   const showNoteDeleteModalHandler = (note) => {
    setShowDeleteNoteModal(true);
    setNote(note)
  }
  
  const closeDeleteNoteModalHandler = () => {
    setShowDeleteNoteModal(false)
    setNote({})
  }

  const scheduleToFormat = moment.tz(data?.ScheduledStartUtc, 'UTC'); // original timezone
  const onSiteByDate = moment.tz(data?.DtOnSiteBy, user.userTimezone ? user.userTimezone : 'UTC');
  const dueByDate = moment.tz(data?.DtDue, user.userTimezone ? user.userTimezone : 'UTC');
  const acknowledgeByDate = moment.tz(data?.DtAcknowledgeBy, user.userTimezone ? user.userTimezone : 'UTC');
  const StartFormat = moment.tz(data?.startDtUtc, user.userTimezone ? user.userTimezone : 'UTC'); // original timezone
  const StopFormat = moment.tz(data?.endDtUtc, user.userTimezone ? user.userTimezone : 'UTC');
  const CreatedOnFormat = moment.tz(data?.CreatedDateUtc, user.userTimezone ? user.userTimezone : 'UTC');

  console.log(user.userTimezone);
  console.log("utc", data?.ScheduledStartUtc)
  console.log("india: ", scheduleToFormat.tz(user.userTimezone).format())
  console.log("phoneix: ", scheduleToFormat.tz('America/Phoenix').format())
  console.log("los angeles: ", scheduleToFormat.tz('America/Los_Angeles').format())


  const uploadBtnText = loading ? <span>Loading....</span> : <span><i className="fa fa-cloud-upload" aria-hidden="true"></i> Upload File</span>

  let spaces = data?.ShortLocation?.split("\\");

  const handleStatus = {
    Closed : <i className="bi bi-door-closed-fill fs-0" title="Closed"></i>,
    Open : <i className="bi bi-door-open-fill fs-0 me-2" title="Open"></i>,
    Attention  : <i className="bi bi-exclamation-triangle-fill fs-0 me-2" title="Attention"></i>,
    InProgress : <i className="bi bi-arrow-clockwise fs-0 me-2" title="InProgress"></i>,
    Unknown : <i className="bi bi-question-square-fill fs-0 me-2" title="UnKnown"></i>,
    OnHold : <i className="fa fa-hand" title="onHold me-2" style={{fontSize : "24px"}}></i>,
    Cancelled : <i className="bi bi-trash-fill fs-0 me-2" title="Cancelled"></i>,
    Paused : <i className="bi bi-calendar2-x-fill fs-0 me-2" title="Paused"></i>,
    New : <i className="bi bi-file-plus-fill fs-0 me-2" title="New"></i>,
    Completed : <i className="bi bi-file-check-fill fs-0 me-2" title="Completed"></i>,
  }

  const handleOpneDocumentEditModal = (doc) => {
   setCurrentDoc(doc)
   setShowDocumentEditModal(true)
  }
  const handleDocumentEdit = (doc) => {
    dispatch(ACTION_UpdateHFDocument(data?._id, doc))
  }
  const checkFinancialDocPermission = user.role.permissions.workorders.includes("financial documents");

  const closeContactModalHandler = () => {
    setContactModalData({
      contactName: "",
      contactId: "",
    });
    setShowContactModal(false);
  };


  const handleCreateTask = (data) => {
    dispatch(ACTION_createTask({ ...data, _id: orderId }))
    setShowTaskModal(false)
  }

  const handleEditTask = (item : any) => {
    setShowEditTaskModal(true)
    setSelectedTask(item)
  }
  
  const handleUpdateTask = (data) => {
    dispatch(ACTION_updateTask({ ...data },orderId))
    setShowEditTaskModal(false)
  }

  const handleShowFlagEditModal = (flag) => {
    setCurrentSelectedFlag(flag)
    setShowFlagEditModal(true)
  }

  const handleAddWorkOrderFlag = (flag) =>{
    const reqData = {
      _id: orderId,
      flag,
    }
    dispatch(ACTION_addFlag(reqData))
    setShowAddFlagModal(false)
  }

  const handleEditWorkOrderFlag = (flag) => {
    const reqData = {
      _id: orderId,
      flag,
      flagId: currentSelectedFlag?._id
    }
    dispatch(ACTION_editWorkOrderFlag(reqData))
    setShowFlagEditModal(false)
  }

  const handleDeleteWorkOrderFlag = (flagId) => {
    const reqData = {
      _id: orderId,
      flagId
    }
    dispatch(ACTION_deleteWorkOrderFlag(reqData))
  }
  
  const handleRestoreWorkOrder = () => {
    dispatch(ACTION_restoreWorkOrder(data?._id,navigate))
  }

  return (
    <>
      {showAddFlagModal && 
        <AddFlagModal flags={flagDropdownData} 
        show={showAddFlagModal} 
        handleClose={() => setShowAddFlagModal(false)}
        handleAddFlag={handleAddWorkOrderFlag}
        existFlag={data?.Flag}
        />
      }
      {showFlagEditModal &&
        <EditFlagModal
          show={showFlagEditModal}
          flags={flagDropdownData} 
          handleClose={() => setShowFlagEditModal(false)}
          handleEditFlag={handleEditWorkOrderFlag}
          existFlag={data?.Flag}
          currentFlag={currentSelectedFlag}
        />
      }
      {showContactModal && 
        <ContactModal
          closeContactModalHandler={closeContactModalHandler}
          contactData={contactModalData}
        />
      }
      {showDocumentEditModal &&
        <DocumentEditModal
          show={showDocumentEditModal}
          handleCloseModal={() => setShowDocumentEditModal(false)}
          handleDocumentEdit={handleDocumentEdit}
          currentDoc={currentDoc}
        />
      }
      {
       showFileModal &&
       <FileUploadModal 
        show={showFileModal}
        handleClose={() => setShowFileModal(false)}
        fileUploadHandler={fileUploadHandler}
        />
      }
      {
      	showMailAttachmentModal && 
        <SendMailAttachmentModal 
          closeMailAttachmentHandler={closeMailAttachmentHandler}
          workOrder={activeWorkOrder}
          onSendMailAttachmentBtnHandler={onSendMailAttachmentBtnHandler}
          />
      }
      {
        showDocumentDeleteModal && (
          <DeleteDocumentModal
            closeDeleteDocumentModalHandler={closeDeleteDocumentModalHandler}
            deleteDocument={deleteDocument}
            woid={data._id}
          />
        )
      }
      {showDeleteNoteModal && (
        <DeleteNoteModal
          closeDeleteNoteModalHandler={closeDeleteNoteModalHandler}
          note={note}
          wid={data._id}
        />
        )
      }
      {showDeleteModal && (
        <DeleteWorkOrderModal
          closeDeleteModalHandler={closeDeleteModalHandler}
          workOrderData={activeWorkOrder}
        />
      )}
      {showSendWorkorderModal && (
        <SendMailModal
          closeSendWorkorderModalHandler={closeSendWorkorderModalHandler}
          workOrder={activeWorkOrder}
          onSendWorkorderBtnHandler={onSendWorkorderBtnHandler}
        />
      )}
      {
        showTaskModal &&
        <TaskModal 
          show={showTaskModal}
          handleClose={() => setShowTaskModal(false)}
          handleCreateTask={handleCreateTask}
        />
      }
      {showTaskEditModal &&
        <TaskEditModal 
        task={selectedTask}
        show={showTaskEditModal} 
        handleClose={() => setShowEditTaskModal(false)}
        handleUpdateTask={handleUpdateTask} />
      }
      {data._id !== orderId ? (
        <span></span>
      ) : (
        <div className="border-0 d-flex align-items-center p-5 mb-5 card card-xl-stretch mb-xl-8">
          { showNote &&
            <NotesModal wid={data._id} updateNote={updateNote} show={showNote} handleClose={() => { setShowNote(false); setNote({}); setUpdateNote(false) }} note={note}/>
          }
          <Container fluid>
            <Row>
              <Col>
              <span
                dangerouslySetInnerHTML={{
                  __html: taskRefinementHTML(data?.TaskRefinement,data?.Labels,data?.callerId),
                }}
                style={{ lineHeight: "3rem" }}
                className="fs-2 bagde-xl-child"
                />
                </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    <div
                      className="menu-link"
                    >
                      {" "}
                      {data?.Number}{" "}
                    </div>
                  </label>
                  <span className="d-block fs-5 text-muted">WO#</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    {handleStatus[data?.StatusId]}
                    {data?.StatusId}
                  </label>
                  <span className="d-block fs-5 text-muted">status</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">{data?.TypeCategory}</label>
                  <span className="d-block fs-5 text-muted">type</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">{data?.customer? data?.customer?.Name : data?.Customer?.Name}</label>
                  <span className="d-block fs-5 text-muted">client</span>
                </div>
              </Col>

              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">{data?.PoNumber ? data?.PoNumber : "--"}</label>
                  <span className="d-block fs-5 text-muted">P.O.Number</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    <span className="fs-3">
                      {/* {spaces?.length > 1 && spaces[1]} */}
                      {data?.ShortLocation?.split("\\")[1]}
                    </span>
                  </label>
                  <span className="d-block fs-5 text-muted">location</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">--</label>
                  <span className="d-block fs-5 text-muted">address</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">--</label>
                  <span className="d-block fs-5 text-muted">
                    property/workflow
                  </span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    <span className="fs-2">
                      {data?.ScheduledStartUtc
                        ? timezoneDateConverter(data?.ScheduledStartUtc, user.userTimezone)
                        : ""}{" "}
                      <br />
                      {data?.ScheduledStartUtc
                        ? timezoneTimeConverter(data?.ScheduledStartUtc, user.userTimezone)
                        : "-"}
                    </span>
                  </label>
                    <span className="d-block fs-5 text-muted">scheduled to <span className="cursor-pointer" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                      <KTSVG path="/media/svg/shapes/global.svg" />
                    </span>
                    </span>
                </div>
              </Col>



              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                    {data?.Contact.length > 0 ? [...data?.Contact,...data?.BillTo?.Contacts || []]?.map((item : any, index : number) => (
                      <label className="fs-4">{item?.fullName}</label>
                    )) : <label className="fs-4">{data?.ContactName}</label>}
                  <span className="d-block fs-5 text-muted">contact</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                    {data?.Contact?.length > 0 ? [...data?.Contact,...data?.BillTo?.Contacts || []]?.map(item => (
                      <label className="fs-4">
                        <a onClick={() => {
                          setContactModalData({
                            contactName: item?.fullName,
                            contactData: item
                          });
                          setShowContactModal(true);
                        }}
                          href="javascript:void(0)"
                         >{item?.emailAddress}</a>
                      </label>
                    )) : ''}
                  <span className="d-block fs-5 text-muted">Email Address</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                    {data?.Contact?.length > 0 ? [...data?.Contact,...data?.BillTo?.Contacts || []]?.map(item => (
                      <label className="fs-4">
                        <a
                          onClick={() => {
                            setContactModalData({
                              contactName: item?.fullName,
                              contactData: item
                            });
                            setShowContactModal(true);
                          }}
                          href="javascript:void(0)"
                        >{item?.phoneNumber}</a>
                      </label>
                    )) : ''}
                  <span className="d-block fs-5 text-muted">Phone Number</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    <span className="fs-2">
                      {data?.startDtUtc
                        ? StartFormat.tz(user.userTimezone ? user.userTimezone : 'UTC').format("MM/DD/YYYY")
                        : ""}{" "}
                      <br />
                      {data?.startDtUtc
                        ? StartFormat.tz(user.userTimezone ? user.userTimezone : 'UTC').format("hh:mm A")
                        : "-"}
                    </span>
                  </label>
                    <span className="d-block fs-5 text-muted">Work Start <span className="cursor-pointer" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                      <KTSVG path="/media/svg/shapes/global.svg" />
                    </span></span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    <span className="fs-2">
                      {data?.endDtUtc
                        ? StopFormat.tz(user.userTimezone ? user.userTimezone : 'UTC').format("MM/DD/YYYY")
                        : ""}{" "}
                      <br />
                      {data?.endDtUtc
                        ? StopFormat.tz(user.userTimezone ? user.userTimezone : 'UTC').format("hh:mm A")
                        : "-"}
                    </span>
                  </label>
                    <span className="d-block fs-5 text-muted">Work Stop <span className="cursor-pointer" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                      <KTSVG path="/media/svg/shapes/global.svg" />
                    </span></span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    <span className="fs-2">
                      {data?.userId
                        ? `${data?.userId?.FirstName} ${data?.userId?.LastName}`: ""}
                    </span>
                  </label>
                  <span className="d-block fs-5 text-muted">Created By</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    <span className="fs-2">
                    
                      {data?.CreatedDateUtc
                          ? timezoneDateConverter(data?.CreatedDateUtc, user.userTimezone)
                          : ""}{" "}
                        <br />
                        {data?.CreatedDateUtc
                          ? timezoneTimeConverter(data?.CreatedDateUtc, user.userTimezone)
                          : "-"}
                    </span>
                  </label>
                  <span className="d-block fs-5 text-muted">Created On <span className="cursor-pointer" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                      <KTSVG path="/media/svg/shapes/global.svg" />
                    </span></span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    <span className="fs-2">
                        {data.BillTo?.DisplayAs ? data?.BillTo?.DisplayAs : ''}
                    </span>
                  </label>
                  <span className="d-block fs-5 text-muted">Bill To</span>
                </div>
              </Col>
              {
                (user?.role?.permissions?.estimates?.includes('view') && user?.role?.permissions?.estimates.includes('list')) &&
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    <span className="fs-2">
                      <Link to={`/estimates/view/${data?.EstimateId?._id}`}>
                        { currencyConverter(data?.EstimateId?.total )}
                      </Link>
                    </span>
                  </label>
                  <span className="d-block fs-5 text-muted">Estimate Total</span>
                </div>
              </Col>
              }
              <h2 className="fs-4 mb-5 mt-5">SCHEDULING AND ASSIGNMENT</h2>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">{data?.Priority?.label ? data?.Priority?.label : data?.Priority?.DisplayAs }</label>
                  <span className="d-block fs-5 text-muted">priority</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    NA{" "}
                    {data?.DtOnSiteBy
                      ? onSiteByDate.tz(user.userTimezone ? user.userTimezone : 'UTC').format("MM/DD/YYYY")
                      : ""}{" "}
                    {data?.DtOnSiteBy
                      ? onSiteByDate.tz(user.userTimezone ? user.userTimezone : 'UTC').format("hh:mm A")
                      : ""}
                  </label>
                  <span className="d-block fs-5 text-muted">
                    access/appt/start
                  </span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4" style={{ color: "red" }}>
                    {/* {`${data?.DtScheduledStart?.tz("MST").format("MM/DD/YYYY")}`} */}
                    {data?.DtOnSiteBy
                      ? onSiteByDate.tz(user.userTimezone ? user.userTimezone : 'UTC').format("MM/DD/YYYY")
                      : "--"}{" "}
                    {data?.DtOnSiteBy
                      ? onSiteByDate.tz(user.userTimezone ? user.userTimezone : 'UTC').format("hh:mm A")
                      : "--"}
                  </label>
                  <span className="d-block fs-5 text-muted">on-site by</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    {data?.TaskRefinement?.split(":")[1]}
                  </label>
                  <span className="d-block fs-5 text-muted">Specialty</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4">
                    {data?.Duration ? data?.Duration / 60 : ""}
                  </label>
                  <span className="d-block fs-5 text-muted">Duration</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4" style={{ color: "red" }}>
                    {data?.DtDue
                      ? dueByDate.tz(user.userTimezone ? user.userTimezone : 'UTC').format("MM/DD/YYYY")
                      : "--"}{" "}
                    {data?.DtOnSiteBy
                      ? dueByDate.tz(user.userTimezone ? user.userTimezone : 'UTC').format("hh:mm A")
                      : "--"}
                  </label>
                  <span className="d-block fs-5 text-muted">Due by</span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} lg={3}>
                <div className="workorder-field">
                  <label className="fs-4" style={{ color: "red" }}>
                    {data?.DtAcknowledgeBy
                      ? acknowledgeByDate.tz(user.userTimezone ? user.userTimezone : 'UTC').format("MM/DD/YYYY")
                      : "--"}{" "}
                    {data?.DtOnSiteBy
                      ? acknowledgeByDate.tz(user.userTimezone ? user.userTimezone : 'UTC').format("hh:mm A")
                      : "--"}
                  </label>
                  <span className="d-block fs-5 text-muted">Acknowledge By</span>
                </div>
              </Col>
            </Row>
            <Row>
                <div className="d-flex justify-content-between align-items-center">
                  <h1 className="fs-4 pt-4">Flags</h1>
                  <button type="button" className="mb-5 mt-5 btn btn-primary" onClick={() => setShowAddFlagModal(true)}>Add Flag</button>
                </div>
                <Table bordered responsive className="workorder-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="text-end">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.Flag?.length > 0) ?
                      data?.Flag.map(item => (
                        <tr>
                          <td>{item?.DisplayAs}</td>
                          <td className="text-end">
                            <button onClick={() => handleShowFlagEditModal(item)} className="btn btn-primary py-2 px-3 me-2">
                              Edit
                            </button>
                            <button onClick={() => handleDeleteWorkOrderFlag(item?._id)} className="btn btn-danger py-2 px-3">
                              Delete
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td>No Records Found</td>
                        </tr>
                      )
                    }
                  </tbody>
                </Table>
            </Row>
            <Row>
            <div className="d-flex justify-content-between align-items-center">
             <h1 className="fs-4 pt-4">TASKS</h1>
             <button type="button" className="mb-5 mt-5 btn btn-primary" onClick={() => setShowTaskModal(true)}>Add Task</button>
           </div>  
          <Table bordered responsive className="workorder-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Description</th>
                <th>Assigned To</th>
                <th>Scheduled Start <span className="cursor-pointer text-dark" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                  <KTSVG path="/media/svg/shapes/global.svg" />
                </span></th>
                <th>Work Start <span className="cursor-pointer text-dark" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                  <KTSVG path="/media/svg/shapes/global.svg" />
                </span></th>
                <th>Work Stop <span className="cursor-pointer text-dark" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                  <KTSVG path="/media/svg/shapes/global.svg" />
                </span></th>
                <th>Due Date <span className="cursor-pointer text-dark" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                  <KTSVG path="/media/svg/shapes/global.svg" />
                </span></th>
                <th>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {(data?.Tasks?.length > 0) ?
                data?.Tasks.map(task => (
                  <tr>
                    <td>{task?.name}</td>
                    <td>{task?.status}</td>
                    <td>{task?.description?.replace(/<\/?[^>]+(>|$)/g, "")}</td>
                    <td>{task?.assignedTo?.map(assignTo => assignTo?.FirstName).join(", ")}</td>
                    <td>{timezoneConverter(task?.scheduledStart,user.userTimezone)}</td>
                    <td>{timezoneConverter(task?.workStart,user.userTimezone)}</td>
                    <td>{timezoneConverter(task?.workStop,user.userTimezone)}</td>
                    <td>
                      {timezoneConverter(task?.dueDate, user.userTimezone)}
                    </td>
                    <td>
                      <button onClick={() => handleEditTask(task)}  className="btn btn-primary py-2 px-3">
                         Edit
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td>No Records Found</td>
                  </tr>
                )
              }
            </tbody>
          </Table>
          <Row>
              <h2 className="fs-4 mb-5 mt-5">Activities</h2>
              <Table bordered responsive className="workorder-table">
                <thead>
                  <tr>
                    <th>DATE <span className="cursor-pointer text-dark" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                      <KTSVG path="/media/svg/shapes/global.svg" />
                    </span></th>
                    <th>BY</th>
                    <th>TYPE</th>
                    <th>NOTE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                      {data?.Activities?.length > 0 ? (
                        data.Activities.map((activity, index) => (
                          <>
                            {activity.name == "Email Sent" || activity?.name == "Complete Email Sent" ? <>
                              <tr
                                key={index}
                                style={{ borderBottom: "0.5pt solid lightgray" }}
                              >
                                <td>
                                  {timezoneConverter(activity?.createdAt, user.userTimezone)}
                                </td>
                                <td>{activity?.userId?.FirstName}</td>
                                <td>{activity?.name}</td>
                                <td>{"From: "+activity.from}</td>
                                <td>{"To: "+activity.to}</td>
                              </tr>
                              {activity.cc &&
                                <tr>
                                  <td>{"Cc: " + activity.cc}</td>
                                </tr>
                              }
                              </> :
                              <tr

                                key={index}
                                style={{ borderBottom: "0.5pt solid lightgray" }}
                              >
                                <td>
                                  {timezoneConverter(activity?.createdAt, user.userTimezone)}
                                </td>
                                <td>{activity?.userId?.FirstName}</td>
                                <td>{activity?.name}</td>
                                <td>{activity?.name == "Client Changed" ? clientsList?.find(item => item._id == activity?.previous)?.DisplayAs || "" : activity?.name.includes("Flag") ? JSON.parse(activity?.previous) : activity?.previous?.replace(/<\/?[^>]+(>|$)/g, "")}</td>
                                <td>{activity?.name == "Client Changed" ? clientsList?.find(item => item._id == activity?.updated)?.DisplayAs || "" : activity?.name.includes("Flag") ? JSON.parse(activity?.updated) : activity?.updated?.replace(/<\/?[^>]+(>|$)/g, "")}</td>
                              </tr>
                            }
                          </>
                        ))
                      ) : (
                        <tr>
                          <td>No Records Found</td>
                        </tr>
                      )
                      }
                </tbody>
              </Table>
            </Row>
          <h2 className="fs-4 mb-5 mt-5">Assigned To</h2>
          <Table bordered responsive className="workorder-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {(data?.employee?.length > 0) ?
                data?.employee.map(user => (
                  <tr>
                    <td>{user?.FirstName + " " + user?.LastName}</td>
                    <td>{user?.title}</td>
                    <td><a href={`tel:${user?.contact}`}>{user?.contact}</a></td>
                    <td><a href={`mailto:${user?.email}`}>{user?.email}</a></td>
                  </tr>
                )) : (
                  <tr>
                    <td>{data?.Employee?.DisplayAs}</td>
                  </tr>
                )
              }
            </tbody>
          </Table>
        </Row>
            <Row>
              <h2 className="fs-4 mb-5 mt-5">ACTIVITY LOG</h2>
              <Table bordered responsive className="workorder-table">
                <thead>
                  <tr>
                    <th>BY</th>
                    <th>DATE <span className="cursor-pointer text-dark" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                      <KTSVG path="/media/svg/shapes/global.svg" />
                    </span></th>
                    <th>ACTION</th>
                    <th>COMMENTS</th>
                    <th>VIEW</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.Items?.length > 0 ? (
                    data.Items.map((item, index) => (
                      <tr
                        key={index}
                        style={{ borderBottom: "0.5pt solid lightgray" }}
                      >
                        <td>{item?.Actor?.DisplayAs}</td>
                        <td>
                          {moment
                            .tz(item?.ActionDate, user.userTimezone ? user.userTimezone : 'UTC')
                            .format("MM/DD/YYYY")}{" "}
                          {moment
                            .tz(item?.ActionDate, user.userTimezone ? user.userTimezone : 'UTC')
                            .format("hh:mm A")}
                        </td>

                        <td>{item?.TypeId}</td>
                        <td>{item?.Comment}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No Records Found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Row>
            <Row>
              <h2 className="fs-4 mb-5 mt-5">NOTES</h2>
              <Table bordered responsive className="workorder-table">
                <thead>
                  <tr>
                    <th>DATE <span className="cursor-pointer text-dark" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                      <KTSVG path="/media/svg/shapes/global.svg" />
                    </span></th>
                    <th>BY</th>
                    <th>TYPE</th>
                    <th>NOTE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.Notes?.length > 0 ? (
                    data.Notes.map((note, index) => (
                      <>
                      {
                        ((user?.role?.name !== 'ADMIN' && note?.NotesType != "Financial") || (user?.role?.name == 'ADMIN') || checkFinancialDocPermission) &&
                        <tr
                          key={index}
                          style={{ borderBottom: "0.5pt solid lightgray" }}
                        >
                          <td>
                            {timezoneConverter(note?.CreatedAt, user.userTimezone)}
                          </td>
                          <td>{note?.CreatedBy?.DisplayAs}</td>
                          <td>{note?.NotesType}</td>
                          <td>{note?.Body}</td>
                          <td>
                            {
                              ((user?._id == note?.CreatedBy?.Id && note.NotesType !== "Financial" || user?.role?.name == 'ADMIN')) && (
                                <>
                                  <button type="button" className="btn btn-primary p-2 me-5" onClick={() => { editNote(note); }}>Edit</button>
                                  <button type="button" className="btn btn btn-danger p-2" onClick={() => { showNoteDeleteModalHandler(note); }}>Delete</button>
                                </>
                              )
                            }
                          </td>
                        </tr>
                      }
                      </>
                    ))
                  ) : (
                    <tr>
                      <td>No Records Found</td>
                    </tr>
                    )
                }
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={12} className="text-end">
                      <button type="button" className="btn btn btn-primary" onClick={addNewNote}>Add new note</button>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </Row>
            <Row>
              <h2 className="fs-4 mb-5 mt-5">EMAIL DETAILS</h2>
              <Table bordered responsive className="workorder-table">
                <thead>
                  <tr>
                    <th>DATE <span className="cursor-pointer text-dark" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                      <KTSVG path="/media/svg/shapes/global.svg" />
                    </span></th>
                    <th>FROM</th>
                    <th>TO</th>
                    <th>CC</th>
                    {/* <th>SUBJECT</th> */}
                  </tr>
                </thead>
                <tbody>
                  {emailDetails?.length > 0 ? (
                    emailDetails.map((item, index) => (
                      <>
                       {console.log(open == index)}
                      <tr
                        data-toggle="collapse"
                        data-target="#demo1"
                        aria-controls="multiCollapseExample1"
                        className="accordion-toggle cursor-pointer"
                        key={index}
                        onClick={() => setOpen(index)}
                        style={{ borderBottom: "0.5pt solid lightgray", transition: "1s" }}
                      >
                        <td>
                            {timezoneConverter(item?.createdAt ? item?.createdAt : item?.date, user.userTimezone)}
                        </td>
                        <td>{item.from}</td>
                        <td>{item.to}</td>
                        <td>{item?.cc?.length > 0 && (
                            item.cc.map(item => (
                              <p>{item}</p>
                            ))
                          )}
                        </td>
                      </tr>
                      {open == index && (
                        <tr>
                          <td colSpan={3} className="hiddenRow">
                              <div className="accordian-body collapse" id="demo1">
                              <div className="fv-row mb-7">
                                  <label className="fw-bold mb-2">Subject:</label>
                                    <div>
                                      {item?.subject}
                                    </div>
                                </div>
                                <div className="fv-row mb-7">
                                  <label className="fw-bold mb-2">Body:</label>
                                  <div
                                    dangerouslySetInnerHTML={
                                      { __html: item?.emailBody }
                                    }
                                  ></div>
                                </div>
                                  {/* <div>Subj</div> */}
                                  {/* <h1>Hi from the hiddenRow</h1> */}
                              </div>
                          </td>
                      </tr>
                      )
                      }
                      
                      </>
                    ))
                  ) : (
                    <tr>
                      <td>No Records Found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Row>
            <Row>
              <h2 className="fs-4 mb-5 mt-5">ALERT AND NOTIFICATIONS</h2>
              <Table bordered responsive className="workorder-table">
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>SENT</th>
                    <th>SENT TO</th>
                    <th>ADDRESS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
            </Row>
            <Row>
              <h2 className="fs-4 mb-5 mt-5">EQUIPMENT WORKED ON</h2>
              <Table bordered responsive className="workorder-table">
                <thead>
                  <tr>
                    <th>EQUIPMENT WORKED ON</th>
                    <th>COMMENT</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.EquipmentWorkedOn?.length > 0 ? (
                    data.EquipmentWorkedOn.map((item, index) => (
                      <tr
                        key={index}
                        style={{ borderBottom: "0.5pt solid lightgray" }}
                      >
                        <td>{item?.Type}</td>
                        <td>{item?.Comment}</td>
                        <td></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No Records Found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Row>
            <Row>
              <Col>
                <Row>
                  <h2 className="fs-4 mb-5 mt-5">SECONDARY ASSIGNEES</h2>
                  <Table bordered responsive className="workorder-table">
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>CHECKED IN</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.Assignments?.length > 1 ? (
                        <tr>
                          <td>
                            {
                              listOfEmployees?.find(
                                (employee) =>
                                  employee.Data.Id ===
                                  data?.Assignments[1]?.EmployeeId
                              )?.Data?.DisplayAs
                            }
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td>No Records Found</td>
                        </tr>
                      )}
                      <tr>
                        <td></td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>
                <Row>
                  <h2 className="fs-4 mb-5 mt-5">TO-DO</h2>
                  <Table bordered responsive className="workorder-table">
                    <thead>
                      <tr>
                        <th>DONE</th>
                        <th>DESCRIPTION</th>
                        <th>DUE BY (USER TIME)</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>
                <Row>
                <div>
                  <h2 className="fs-4 mb-5 mt-5">DOCUMENTS</h2>
                  <Table bordered responsive className="workorder-table">
                    <thead>
                      <tr>
                        <th style={{width : "35%"}}>TITLE</th>
                        <th>TYPE</th>
                        <th>BY</th>
                        <th>CREATED ON <span className="cursor-pointer text-dark" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                            <KTSVG path="/media/svg/shapes/global.svg" />
                        </span></th>
                        <th>ACTIONS</th>
                        <th>
                          <div onClick={() => setShowFileModal(true)}>
                            <Button style={{ padding: "5px", fontSize: "14px" }}>{uploadBtnText}</Button>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.Documents?.length > 0 ? (
                        data.Documents?.filter(doc => doc?.isDeleted !== true)?.map((doc, index) => (
                          <>
                          {
                             ((user?.role?.name !== 'ADMIN' && doc.DocumentType != "Financial") || (user?.role?.name == 'ADMIN') || checkFinancialDocPermission) && (
                              <tr
                              key={index}
                              style={{ borderBottom: "0.5pt solid lightgray" }}
                              >
                              <td>
                                <a
                                  target="_blank"
                                  href={doc?.DocUrl}
                                  rel="noreferrer"
                                >
                                  {doc?.Title}
                                </a>
                              </td>
                              <td>{doc?.DocumentType != "undefined" ? doc?.DocumentType : "" }</td>
                              <td>{doc?.CreatedBy?.DisplayAs ? doc?.CreatedBy?.DisplayAs  : ""}</td>
                              <td>
                                {timezoneConverter(doc?.UpdatedDate, user.userTimezone)}
                              </td>
                              <td>
                               {((doc.hasOwnProperty('CreatedBy') &&  user?._id == doc?.CreatedBy?.Id &&  doc.DocumentType != "Financial")  || user?.role?.name == 'ADMIN') && (
                                  <button type="button" className="btn btn-danger"  style={{ padding: "5px", fontSize: "14px" }} onClick={() => deleteDoumentModalHandler(doc) }>Delete</button>
                               )}
                              </td>
                              <td>
                               {((doc.hasOwnProperty('CreatedBy') &&  user?._id == doc?.CreatedBy?.Id &&  doc.DocumentType != "Financial")  || user?.role?.name == 'ADMIN') && (
                                  <button type="button" className="btn btn-primary"  style={{ padding: "5px", fontSize: "14px" }} onClick={() => handleOpneDocumentEditModal(doc) }>Edit</button>
                               )}
                              </td>
                            </tr>
                             )
                          }

                              </>
                        ))
                      ) : (
                        <tr>
                          <td>No Records Found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
                </Row>
                <Row>
                  <h2 className="fs-4 mb-5 mt-5">CHECK IN/OUT LOG</h2>
                  <Table bordered responsive className="workorder-table">
                    <thead>
                      <tr>
                        <th>BY</th>
                        <th>CHECK IN</th>
                        <th>CHECK OUT</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>
                <Row>
                  {
                    ((user?.role?.permissions?.workorders?.includes('delete'))) && (
                      <Col xs={3} md={3} lg={3}>
                      <div className="text-end pt-15">
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{
                            width: "100%",
                          }}
                          onClick={() => showDeleteModalHandler(data?._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </Col>
                    )
                  }
                  {
                    ((user?.role?.permissions?.workorders?.includes('update'))) && (
                      <Col xs={3} md={3} lg={3}>
                      <div className="text-end pt-15">
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{
                            width: "100%",
                          }}
                          onClick={() =>
                            navigate(`/order/update/${data?._id}`)
                          }
                        >
                          Edit
                        </button>
                      </div>
                    </Col>
                    ) 
                  }
                  <Col xs={3} md={3} lg={3}>
                    <div className="text-end pt-15">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          width: "100%",
                        }}
                        onClick={() => showMailAttachmentHandler(data)}
                      >
                        Email
                      </button>
                    </div>
                  </Col>
                  <Col xs={3} md={3} lg={3}>
                    <div className="text-end pt-15">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          width: "100%",
                        }}
                        onClick={() => showSendWorkorderModalHandler(data)}
                      >
                        Complete
                      </button>
                    </div>
                  </Col>
                  <Col xs={3} md={3} lg={3}>
                    <div className="text-end pt-6">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{width: "100%",}}
                        onClick={() =>
                          navigate(`/estimates/create/${data?._id}`)
                        }
                        >
                         Create Estimate
                      </button>
                    </div>
                  </Col>
                    {(data?.isDeleted && user?.role?.name == 'ADMIN') &&
                      <Col xs={3} md={3} lg={3}>
                        <div className="text-end pt-6">
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ width: "100%", }}
                            onClick={handleRestoreWorkOrder}
                          >
                            Restore
                          </button>
                        </div>
                      </Col>
                    }
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default WorkOrderView;
