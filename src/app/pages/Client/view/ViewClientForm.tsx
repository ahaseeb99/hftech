import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import { Link, useNavigate } from "react-router-dom";
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
import DeleteClientModal from "../delete/DeleteClientModal";

const ViewClient: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const { userDailyCostBreakDownList } = useSelector(
    (state: any) => state.client
  );
  const [contacts, setContacts] = useState([]);
  const [userDailyRateCostBreakdownIds, setUserDailyRateCostBreakdownIds] =
    useState<any>([]);

  const { clientDetail } = useSelector((state: any) => state.client);
  const { user } = useSelector((state: any) => state.auth);

  const [clinetById, setClientById] = useState<any>({});
  const [clientId, setClientId] = useState<string>();
  const { workOrderList } = useSelector((state: any) => state.workOrder);

  const [client, setClient] = useState<any>("");
  const [contact, setContact] = useState<any>("");
  const [clientName, setClientName] = useState<any>("");
  const [SpacesName, setSpacesName] = useState<any>("");
  const [contactName, setContactName] = useState<any>("");
  const [activeClient, setActiveClient] = useState<any>(null);
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

    dispatch(ACTION_getClientById(id));
    setClientId(id);
  }, []);

  console.log({ clientDetail });
  // console.log(client)

  useEffect(() => {
    setWorkList(workOrderList);
  }, [workOrderList]);

  useEffect(() => {
    setClientById(_find(_.get(clientDetail, "clients", []), ["_id", clientId]));
    setClient(
      _find(_.get(clientDetail, "clients", []), ["_id", clientId])?.client?._id
    );

    const index = contacts.findIndex(
      (_contact: any) =>
        _contact.fullName ===
        _find(_.get(clientDetail, "clients", []), ["_id", clientId])?.contact
          ?.fullName
    );
    const contact: any = contacts[index];
    setContact(contact?._id);
    const refData = _find(_.get(clientDetail, "clients", []), [
      "_id",
      clientId,
    ]);
    setClientName(refData?.client?.fullName);
    setContactName(refData?.contact?.fullName);
  }, [clientDetail?.clients, contacts]);

  let formik = useFormik({
    initialValues: {
      client: clientDetail?.DisplayAs ? clientDetail?.DisplayAs : "",
      prefix: clientDetail?.prefix ? clientDetail?.prefix : "",
      Spaces: clientDetail?.Spaces?.length ? clientDetail?.Spaces : [],
      Contacts: clientDetail?.Contacts?.length ? clientDetail?.Contacts : [],
      description: clientDetail?.description ? clientDetail?.description : "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {},
  });

  // console.log("In VIEW",workList[0]?.Data?.Number);
  console.log({clientDetail})

  useEffect(() => {
    if (userDailyCostBreakDownList && userDailyCostBreakDownList.length) {
      const _userDailyRateCostBreakdownIds: any[] = [];
      userDailyCostBreakDownList.forEach((element: any) => {
        _userDailyRateCostBreakdownIds.push(element._id);
      });
      setUserDailyRateCostBreakdownIds(_userDailyRateCostBreakdownIds);
    } else {
      setUserDailyRateCostBreakdownIds([]);
    }
  }, [userDailyCostBreakDownList]);

  useEffect(() => {
    if (formik.values.client) {
      let filterClient = _find(_get(clientDetail, "clients", []), {
        _id: formik.values.client,
      });
      if (filterClient && filterClient?.contacts) {
        setContacts(filterClient?.contacts);
      } else {
        setContacts([]);
      }
    }
  }, [formik.values.client]);

  const showPlainDescription = (description) => {
    const withoutHtmlTagsDescription = description.replace(/<[^>]+>/g, "");
    return withoutHtmlTagsDescription.replaceAll("&nbsp;", "");
  };

  const showDeleteModalHandler = (_client: any) => {
    setActiveClient(_client);
    setShowDeleteModal(true);
  };

  const closeDeleteModalHandler = () => {
    setActiveClient(null);
    setShowDeleteModal(false);
  };

  const showPdfHandler = (_client: any) => {
    console.log("checking _client: ", _client);
    setActivePdfEstimate(_client);
    setShowPdf(true);
  };

  const closePdfHandler = () => {
    setActivePdfEstimate(null);
    setShowPdf(false);
  };

  const showSendEstimateModalHandler = (_client: any) => {
    setShowSendEstimateModal(true);
    setActiveClient(_client);
  };

  const closeSendEstimateModalHandler = () => {
    setShowSendEstimateModal(false);
  };

  const closeDownloadPdfHandler = () => {
    setDownloadPdfId(null);
    setShowDownloadPdf(false);
  };

  const onSendEstimateBtnHandler = (activeClient: any, reqPacket: any) => {
    closeDownloadPdfHandler();
    dispatch(ACTION_sendEstimatePdf(activeClient, reqPacket));
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteClientModal
          closeDeleteModalHandler={closeDeleteModalHandler}
          clientDetail={activeClient}
        />
      )}

      <form className="form">
        <div className="fv-row mb-7">
          <Row>
            <Col>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Client</label>
                <p>{showPlainDescription(formik.values.client)}</p>
              </div>

              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Location</label>
                <div>
                {formik.values?.Spaces?.length ?
                  formik.values.Spaces.map((loc) => (
                   <> <p style={{display: 'inline'}}>{loc?.locationName}</p>{", "}</>
                  )) : ""
                }
                </div>
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Prefix</label>
                <p>{formik.values.prefix}</p>
              </div>
            </Col>
            <Col>
            <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Contacts</label>
                <div>
                {formik.values?.Contacts?.length ?
                  formik.values.Contacts.map((contact) => (
                   <> <p className="m-0">{contact?.fullName}, </p></>
                  )) : ""
                }
                </div>
              </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Notes</label>
              <p>{showPlainDescription(formik.values.description)}</p>
            </div>
            
            </Col>

            {/* <Col>
              <div className="fv-row mb-7">
              </div>

              <div className="fv-row mb-7">
                <Link to="/client/create" className="btn btn-sm btn-primary"> Add Spaces </Link>
              </div>

              <div className="fv-row mb-7">
                <Link to="/client/create" className="btn btn-sm btn-primary"> Add Spaces </Link>
              </div>

            </Col> */}


          </Row>

          <Row>
            {
              ((clientDetail?.userId == user?._id || user?.role?.permissions?.clients?.includes('delete'))) && (
                <Col xs={6} md={6} lg={6}>
                  <div className="text-end pt-15">
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{
                        width: "100%",
                      }}
                      onClick={() => showDeleteModalHandler(clientId)}
                    >
                      Delete
                    </button>
                  </div>
                </Col>
              )
            }
            {
              ((clientDetail?.userId == user?._id || user?.role?.permissions?.clients?.includes('update'))) && (
                <Col xs={6} md={6} lg={6}>
                  <div className="text-end pt-15">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{
                        width: "100%",
                      }}
                      onClick={() => navigate(`/client/update/${clientId}`)}
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

export default ViewClient;
