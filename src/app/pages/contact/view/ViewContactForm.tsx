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
import { Col, Row } from "react-bootstrap";
import { getTotalEstimateAmount } from "../../../../utils/helpers";
import { ACTION_getWorkOrdersAPI } from "../../../../store/workorder/actions";
import {
  ACTION_getClientById,
  ACTION_getClients,
} from "../../../../store/client/actions";
import DeleteEstimateModal from "../../Estimates/delete/DeleteEstimateModal";
import PdfViewerModal from "../../Estimates/PdfViewerModal/PdfViewerModal";
import PDFActions from "../../Estimates/PDFActions";
import SendMailModal from "../../Estimates/sendEstimateMail/SendMailModal";
import { ACTION_getLocationDetail } from "../../../../store/location/actions";
import { ACTION_getContactById } from "../../../../store/contact/actions";
import DeleteContactModal from "../delete/DeleteContactModal";

const ContactView: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const { userDailyCostBreakDownList } = useSelector(
    (state: any) => state.client
  );


  const { user } = useSelector((state: any) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [userDailyRateCostBreakdownIds, setUserDailyRateCostBreakdownIds] =
    useState<any>([]);

  const clientData = useSelector((state: any) => state.client.clientDetail);
  const [clinetById, setClientById] = useState<any>({});
  const [clientId, setClientId] = useState<string>();
  const currentContact = useSelector(
    (state: any) => state.contacts.contactDetail
  );

  const [client, setClient] = useState<any>("");
  const [location, setLocation] = useState<any>("");
  const [clientName, setClientName] = useState<any>("");
  const [locationName, setLocationName] = useState<any>("");
  const [contactName, setContactName] = useState<any>("");
  const [activeEstimate, setActiveEstimate] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [activePdfEstimate, setActivePdfEstimate] = useState<any>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [showSendEstimateModal, setShowSendEstimateModal] =
    useState<any>(false);
  const [downloadPdfId, setDownloadPdfId] = useState<any>(null);
  const [showDownloadPdf, setShowDownloadPdf] = useState(false);
  const [workList, setWorkList] = useState<any>([]);

  useEffect(() => {
    const id = window.location.pathname.split("/")[3];
    dispatch(ACTION_getContactById(id));
  }, []);

console.log({currentContact})


  let formik = useFormik({
    initialValues: {
      name: currentContact?.fullName ? currentContact?.fullName : "",
      emailAddress: currentContact?.emailAddress
        ? currentContact.emailAddress
        : "",
      phone: currentContact?.phoneNumber ? currentContact.phoneNumber : "",
      clientName: currentContact?.clientId?.DisplayAs ? currentContact?.clientId?.DisplayAs : "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {},
  });


  // console.log("In VIEW",workList[0]?.Data?.Number);

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

  const showDeleteModalHandler = (_estimate: any) => {
    setActiveEstimate(_estimate);
    setShowDeleteModal(true);
  };

  const closeDeleteModalHandler = () => {
    setActiveEstimate(null);
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
    setActiveEstimate(_estimate);
  };

  const closeSendEstimateModalHandler = () => {
    setShowSendEstimateModal(false);
  };

  const closeDownloadPdfHandler = () => {
    setDownloadPdfId(null);
    setShowDownloadPdf(false);
  };

  const onSendEstimateBtnHandler = (activeEstimate: any, reqPacket: any) => {
    closeDownloadPdfHandler();
    dispatch(ACTION_sendEstimatePdf(activeEstimate, reqPacket));
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteContactModal
          closeDeleteModalHandler={closeDeleteModalHandler}
          contactData={activeEstimate}
        />
      )}

      {/* //// */}
      <>
        <form className="form">
          <div className="fv-row mb-7">
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Name</label>
                  <p>{showPlainDescription(formik.values.name)}</p>
                </div>

                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Email Address</label>
                  <p>{formik.values?.emailAddress}</p>
                </div>
              </Col>

              {/* <Col>
              <div className="fv-row mb-7">
              </div>

              <div className="fv-row mb-7">
                <Link to="/client/create" className="btn btn-sm btn-primary"> Add Location </Link>
              </div>

              <div className="fv-row mb-7">
                <Link to="/client/create" className="btn btn-sm btn-primary"> Add Location </Link>
              </div>

            </Col> */}

              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Phone</label>
                <p>{formik.values?.phone}</p>
              </div>

              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Client</label>
                <p>{formik.values?.clientName}</p>
              </div>
            </Row>

            <Row>
              {
                ((user?.role?.permissions?.contacts?.includes('delete'))) && (
                  <Col xs={6} md={6} lg={6}>
                    <div className="text-end pt-15">
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{
                          width: "100%",
                        }}
                        onClick={() => showDeleteModalHandler(currentContact)}
                      >
                        Delete
                      </button>
                    </div>
                  </Col>
                )
              }
              {
                ((user?.role?.permissions?.contacts?.includes('update'))) && (
                  <Col xs={6} md={6} lg={6}>
                    <div className="text-end pt-15">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          width: "100%",
                        }}
                        onClick={() =>
                          navigate(`/contact/update/${currentContact?._id}`)
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

      {/* //// */}
    </>
  );
};

export default ContactView;
