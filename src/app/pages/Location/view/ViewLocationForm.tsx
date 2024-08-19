import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import { useNavigate } from "react-router-dom";
import {
  ACTION_generateEstimatePdf,
  ACTION_getEstimate,
  ACTION_sendEstimatePdf,
} from "../../../../store/estimate/actions";
import _ from "lodash";
import { Col, Row, Table } from "react-bootstrap";
import { getTotalEstimateAmount, timezoneConverter } from "../../../../utils/helpers";
import { ACTION_getWorkOrdersAPI } from "../../../../store/workorder/actions";
import { ACTION_getClients } from "../../../../store/client/actions";
import DeleteEstimateModal from "../../Estimates/delete/DeleteEstimateModal";
import PdfViewerModal from "../../Estimates/PdfViewerModal/PdfViewerModal";
import PDFActions from "../../Estimates/PDFActions";
import SendMailModal from "../../Estimates/sendEstimateMail/SendMailModal";
import { ACTION_getLocationDetail } from "../../../../store/location/actions";
import DeleteLocationModal from "../delete/DeleteLocationModal";
import { KTSVG } from "../../../../_metronic/helpers";
import NotesModal from "../LocationNotes/LocationNotesModal";
import DeleteNoteModal from "../LocationNotes/NoteDeleteModal";

const LocationView: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const currentLocation = useSelector(
    (state: any) => state.location.locationDetail
  );

  const { user } = useSelector((state: any) => state.auth);

  const [activeLocation, setActiveLocation] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [activePdfEstimate, setActivePdfEstimate] = useState<any>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [showSendEstimateModal, setShowSendEstimateModal] =
    useState<any>(false);
  const [downloadPdfId, setDownloadPdfId] = useState<any>(null);
  const [showDownloadPdf, setShowDownloadPdf] = useState(false);
  const [workList, setWorkList] = useState<any>([]);
  const [locationId, setLocationId] = useState<string>();
  const [currentClient, setCurrentClient] = useState<any>({});
  const [showNotesModal,setShowNotesModal] = useState<boolean>(false)
  const [notes,setNote] = useState({})
  const [updateNote,setUpdateNote] = useState(false)
  const [showNoteDeleteModal,setShowDeleteNoteModal] = useState(false)

  const id = window.location.pathname.split("/")[3];
  const clientList = useSelector(
    (state: any) => state.client.clientsData.clients
  );

  useEffect(() => {
    setLocationId(id);
    dispatch(ACTION_getLocationDetail(id));
  }, []);


  const handleAddNewNote = () => {
    setNote({});
    setShowNotesModal(true);
    setUpdateNote(false)
  };

  const handleDeleteNote = (note) => {
    setNote(note)
    setShowDeleteNoteModal(true)
  }

  useEffect(() => {
    const client = clientList?.find((item: any) => {
      if (item?.locations?.some((ci) => ci._id === locationId)) {
        return item;
      }
    });
    if (client) {
      setCurrentClient(client);
    }
  }, [clientList]);

  console.log({ currentLocation });

  let formik = useFormik({
    initialValues: {
      name: currentLocation?.locationName ? currentLocation.locationName : "",
      address: currentLocation?.street ? currentLocation.street : "",
      city: currentLocation?.city ? currentLocation.city : "",
      state: currentLocation?.state ? currentLocation.state : "",
      clientName: currentLocation?.clientId?.DisplayAs ? currentLocation?.clientId?.DisplayAs : "",
      status: currentLocation?.status ? currentLocation?.status : "ACTIVE",
      notes: currentLocation.notes ? currentLocation.notes : [],
      contacts: currentLocation.contacts?.length > 0 ? currentLocation.contacts : [] 
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {},
  });

  // useEffect(() => {
  //   if (userDailyCostBreakDownList && userDailyCostBreakDownList.length) {
  //     const _userDailyRateCostBreakdownIds: any[] = [];
  //     userDailyCostBreakDownList.forEach((element: any) => {
  //       _userDailyRateCostBreakdownIds.push(element._id);
  //     });
  //     setUserDailyRateCostBreakdownIds(_userDailyRateCostBreakdownIds);
  //   } else {
  //     setUserDailyRateCostBreakdownIds([]);
  //   }
  // }, [userDailyCostBreakDownList]);

  // useEffect(() => {
  //   if (formik.values.client) {
  //     let filterClient = _find(_get(clientsData, "clients", []), {
  //       _id: formik.values.client
  //     });
  //     if (filterClient && filterClient?.contacts) {
  //       setContacts(filterClient?.contacts);
  //     } else {
  //       setContacts([]);
  //     }
  //   }
  // }, [formik.values.client]);

  const showPlainDescription = (description) => {
    const withoutHtmlTagsDescription = description.replace(/<[^>]+>/g, "");
    return withoutHtmlTagsDescription.replaceAll("&nbsp;", "");
  };

  const showDeleteModalHandler = (_location: any) => {
    setActiveLocation(_location);
    setShowDeleteModal(true);
  };

  const closeDeleteModalHandler = () => {
    setActiveLocation(null);
    setShowDeleteModal(false);
  };

  const showPdfHandler = (_estimate: any) => {
    console.log("checking _estimate: ", _estimate);
    setActivePdfEstimate(_estimate);
    setShowPdf(true);
  };

  const closePdfHandler = () => {
    setActivePdfEstimate(null);
    setShowPdf(false);
  };

  const showSendEstimateModalHandler = (_estimate: any) => {
    setShowSendEstimateModal(true);
    setActiveLocation(_estimate);
  };

  const closeSendEstimateModalHandler = () => {
    setShowSendEstimateModal(false);
  };

  const closeDownloadPdfHandler = () => {
    setDownloadPdfId(null);
    setShowDownloadPdf(false);
  };

  const onSendEstimateBtnHandler = (activeLocation: any, reqPacket: any) => {
    closeDownloadPdfHandler();
    dispatch(ACTION_sendEstimatePdf(activeLocation, reqPacket));
  };

  const handleEditNotes = (note) => {
    setNote(note);
    setUpdateNote(true)
    setShowNotesModal(true);
  }
 
  const handleCloseDeleteModal = () => {
    setNote({})
    setShowDeleteNoteModal(false)
  }

  return (
    <>
      {showDeleteModal && (
        <DeleteLocationModal
          closeDeleteModalHandler={closeDeleteModalHandler}
          locationData={activeLocation}
        />
      )}
      {showPdf && (
        <PdfViewerModal
          closePdfHandler={closePdfHandler}
          clientsData={currentLocation?.clinetId._id}
        />
      )}
      {showSendEstimateModal && (
        <SendMailModal
          closeSendEstimateModalHandler={closeSendEstimateModalHandler}
          clientsData={activeLocation._id}
          onSendEstimateBtnHandler={onSendEstimateBtnHandler}
        />
      )}
      {showNotesModal &&
        <NotesModal show={showNotesModal} handleClose={() => setShowNotesModal(false)} LocationId={id} note={notes} updateNote={updateNote} />
      }
      {showNoteDeleteModal && 
        <DeleteNoteModal closeDeleteNoteModalHandler={handleCloseDeleteModal} LocationId={id} note={notes}  /> 
      }
      {/* <div className="fv-row mb-7 d-flex justify-content-between align-items-center">
				<label className="fw-bold fs-6 mb-2">PDF Actions</label>
				<div>
					<PDFActions
						clientsData={clinetById}
						showPdfHandler={showPdfHandler}
						showSendEstimateModalHandler={() =>
							showSendEstimateModalHandler(clinetById)
						}
						onDownloadBtnHandler={() => onDownloadBtnHandler(clientId!)}
						onSendEstimateBtnHandler={onSendEstimateBtnHandler}
					/>
				</div>
			</div> */}
      <form className="form">
        <div className="fv-row mb-7">
          <Row>
            <Col>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Name</label>
                <p>{formik.values?.name}</p>
              </div>

              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Address</label>
                <p>{formik.values?.address}</p>
              </div>
            </Col>

            <Col>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">City</label>
                <p>{formik.values?.city}</p>
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Client</label>
                <p>{formik.values?.clientName}</p>
              </div>
            </Col>

            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">State</label>
              <p>{formik.values?.state}</p>
            </div>

            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Status</label>
              <p>{formik.values?.status}</p>
            </div>
          </Row>
          <Row>
          <h2 className="fs-4 mb-5 mt-5">CONTACTS</h2>
            <Table bordered responsive className="workorder-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>PHONE NUMBER</th>
                  <th>EMAIL</th>
                </tr>
              </thead>
              <tbody>
                {formik.values.contacts ?.length > 0 ? (
                  formik.values.contacts.map((item, index) => (
                    <>
                      <tr
                        key={index}
                        style={{ borderBottom: "0.5pt solid lightgray" }}
                      >
                        <td>{item?.fullName}</td>
                        <td>
                          <a href={`tel:${item.phoneNumber}`}>{item?.phoneNumber}</a></td>
                        <td>
                          <a href={`mailto:${item?.emailAddress}`}>
                            {item?.emailAddress}
                          </a>
                        </td>
                      </tr>
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
                {formik.values.notes?.length > 0 ? (
                  formik.values.notes.map((note, index) => (
                    <>
                      {
                      ((note?.NotesType != "Financial") || (user?.role?.name == 'ADMIN') || user?.role?.permissions?.locations?.includes('financial documents')) &&
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
                              ((user?._id == note?.createdBy?._id && note.NotesType !== "Financial" || user?.role?.name == 'ADMIN')) && 
                                <>
                                  <button type="button" className="btn btn-primary p-2 me-5" onClick={() => { handleEditNotes(note); }}>Edit</button>
                                  <button type="button" className="btn btn btn-danger p-2" onClick={() => { handleDeleteNote(note); }}>Delete</button>
                                </>
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
                      <button type="button" className="btn btn btn-primary" onClick={handleAddNewNote}>Add new note</button>
                    </td>
                  </tr>
                </tfoot>
            </Table>
          </Row>
          <Row>
            {
              ((user?.role?.permissions?.locations?.includes('delete'))) && (
                <Col xs={6} md={6} lg={6}>
                  <div className="text-end pt-15">
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{
                        width: "100%",
                      }}
                      onClick={() => showDeleteModalHandler(currentLocation?._id)}
                    >
                      Delete
                    </button>
                  </div>
                </Col>
              )
            }
            {
               ((user?.role?.permissions?.locations?.includes('update'))) && (
                <Col xs={6} md={6} lg={6}>
                <div className="text-end pt-15">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                    }}
                    onClick={() =>
                      navigate(`/location/update/${currentLocation?._id}`)
                    }
                  >
                    Edit
                  </button>
                </div>
              </Col>
               ) 
            }
          </Row>
        </div>
      </form>
    </>
  );
};

export default LocationView;
