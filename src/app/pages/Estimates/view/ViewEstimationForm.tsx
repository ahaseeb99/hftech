import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import { Link, useNavigate } from "react-router-dom";
import {
  ACTION_deleteEstimateDocument,
  ACTION_generateEstimatePdf,
  ACTION_getEstimate,
  ACTION_getEstimateById,
  ACTION_getEstimateEmailDetail,
  ACTION_sendEstimatePdf,
  ACTION_updateEstimateDocument,
} from "../../../../store/estimate/actions";
import _ from "lodash";
import { Button, Col, Row, Table } from "react-bootstrap";
import DeleteEstimateModal from "../delete/DeleteEstimateModal";
import PdfViewerModal from "../PdfViewerModal/PdfViewerModal";
import SendMailModal from "../sendEstimateMail/SendMailModal";
import PDFActions from "../PDFActions";
import { ACTION_getWorkOrdersAPI } from "../../../../store/workorder/actions";
import { currencyConverter, getTotalEstimateAmount, timezoneConverter, timezoneDateConverter, timezoneDateConverterForFileName } from "../../../../utils/helpers";
import FileUploadModalEstimate from "../fileAttachmentModal/fileAttachmentModal";
import { uploadFileToS3Estimate } from "../../../../utils/uploadFileToS3";
import DocumentEditModal from "../fileAttachmentModal/DocumentEditModal";
import WoWarningModal from "../delete/CreateWOWarningModal";


const ViewEstimation: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const { userDailyCostBreakDownList } = useSelector(
    (state: any) => state.estimate
  );
  const { clientsData } = useSelector((state: any) => state.client);
  const { locationsData } = useSelector((state: any) => state.location);

  const { user } = useSelector((state: any) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [userDailyRateCostBreakdownIds, setUserDailyRateCostBreakdownIds] =
    useState<any>([]);

  const estimationById = useSelector((state: any) => state.estimate.estimateDetail);

  const [activeEstimate, setActiveEstimate] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [activePdfEstimate, setActivePdfEstimate] = useState<any>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [showSendEstimateModal, setShowSendEstimateModal] =
    useState<any>(false);
  const [downloadPdfId, setDownloadPdfId] = useState<any>(null);
  const [showDownloadPdf, setShowDownloadPdf] = useState(false);
  const [workList, setWorkList] = useState<any>([]);
  const [showFileModal,setShowFileModal] = useState(false)
  const [showDocEditModal,setShowDocEditModal] = useState<boolean>(false)
  const [currentDoc,setCurrentDoc] = useState({})
  const [createWoModal,setCreateWoModal] = useState<boolean>(false)
 
  useEffect(() => {
    dispatch(ACTION_getEstimate());
    const id = window.location.pathname.split("/")[3];
    console.log("ID :: ", id);
    dispatch(ACTION_getEstimateById(id))
    dispatch(ACTION_getEstimateEmailDetail(id))
  }, []);

   
  const uploadBtnText = <span><i className="fa fa-cloud-upload" aria-hidden="true"></i> Upload File</span>
  console.log("Estimate-Data: ", estimationById);
  console.log("Active-Estimate-Data: ", activeEstimate);

  const getDocName = () => {
    let date = timezoneDateConverterForFileName(estimationById.date, user.userTimezone)
    const regex = /[#$/:-?{-~!"^`\[\]]/g;
    const name = estimationById.referenceNumber.replace(regex, '')
    return `${name}_${date}-EST.pdf`;
  };

  let formik = useFormik({
    initialValues: {
      date: estimationById?.date
      ? timezoneDateConverter(estimationById?.date, user.userTimezone)
        : "",
      name: "",
      quantity : estimationById?.quantity ? estimationById?.quantity  : "",
      itemAmonut  :  estimationById?.amount ? estimationById?.amount  :  "",
      client: estimationById?.client?._id ? estimationById?.client?._id : "",
      location: estimationById?.locationId?._id
        ? estimationById?.locationId?._id
        : "",
      contact: estimationById?.contactIds
        ? estimationById?.contactIds
        : [],
      reference: estimationById?.referenceNumber
        ? estimationById?.referenceNumber
        : "",
      amount: estimationById ? getTotalEstimateAmount(estimationById) : "",
      description: estimationById?.description
        ? estimationById?.description
        : "",
      workOrderNumber: estimationById?.workOrderNumber
        ? estimationById.workOrderNumber
        : "",
      terms: estimationById?.terms ? estimationById?.terms : "",
      lineItems: estimationById?.lineItems ? estimationById?.lineItems : [],
      workOrderId: estimationById?.workOrderId ? estimationById?.workOrderId?._id : "",
      document : estimationById.Documents ? estimationById.Documents : [],
      status : estimationById?.status ? estimationById.status : "",
      owner :  estimationById?.ownerId?.FirstName ? estimationById?.ownerId?.FirstName+" "+estimationById?.ownerId?.LastName : estimationById?.userId?.FirstName+" "+estimationById?.userId?.LastName 
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {},
  });

  // console.log("In VIEW",workList[0]?.Data?.Number);
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
      let filterClient = _find(_get(clientsData, "clients", []), {
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

  const showDeleteModalHandler = (_estimate: any) => {
    setActiveEstimate(_estimate);
    setShowDeleteModal(true);
  };

  const closeDeleteModalHandler = () => {
    setActiveEstimate(null);
    setShowDeleteModal(false);
  };

  const onDownloadBtnHandler = (_id: string) => {
    dispatch(ACTION_generateEstimatePdf(_id, getDocName()));
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

  const showSendEstimateModalHandler = async (_estimate: any) => {
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
    closeSendEstimateModalHandler();
    dispatch(ACTION_sendEstimatePdf(activeEstimate, reqPacket));
  };

  let total = estimationById?.lineItems?.length == 0 ? estimationById.total : 0

  if (!!formik?.values?.lineItems?.length) {
    const lineItemAmountArray = formik.values.lineItems.map(item => item)
    total = lineItemAmountArray.reduce(function (accumulator, currentValue) {
      return accumulator + (currentValue?.quantity ? currentValue?.quantity : 1) * currentValue?.total;
    }, 0);
  }

  const fileUploadHandler = async (files,docType) => {
    setShowFileModal(false)
   const form = new FormData();
   files.map(file => {
     form.append("files", file)
   })
   form.append('documentType', docType)
   await uploadFileToS3Estimate(form,estimationById._id)
   const id = window.location.pathname.split("/")[3]
   dispatch(ACTION_getEstimateById(id))
  }

  const deleteDocument = (doc) => { 
    dispatch(ACTION_deleteEstimateDocument(estimationById?._id,doc))
  }

  const hadleDocEdit = (doc) => {
    setCurrentDoc(doc)
    setShowDocEditModal(true)
  }
  
  const handleDocumentEdit = (doc) => {
    dispatch(ACTION_updateEstimateDocument(estimationById?._id,doc))
  } 

  const checkFinancialDocPermission = user.role.permissions.estimates.includes("financial documents");

  const handleWoModalClose = () => {
    setCreateWoModal(false)
  }
 
  const handleSubmitWo = () => {
    navigate(`/order/create/${estimationById?._id}`)
  }


  const handleCreateWo = () => {
    if(estimationById?.workOrderId?._id){
      setCreateWoModal(true)
    }
    else{
      handleSubmitWo()
    }
  }


  
 

  return (
    <> 
     {createWoModal &&
      <WoWarningModal 
       handleWoModalClose={handleWoModalClose}
       handleSubmitWo={handleSubmitWo}
      />
     }
      {showDocEditModal &&
        <DocumentEditModal
          show={showDocEditModal}
          handleCloseModal={(() => setShowDocEditModal(false))}
          handleDocumentEdit={handleDocumentEdit}
          currentEstimateDoc={currentDoc}
        />
      }
      { showFileModal && 
        <FileUploadModalEstimate 
          show={showFileModal}
          handleClose={() => setShowFileModal(false)}
          fileUploadHandler={fileUploadHandler}
        />
      }
      {showDeleteModal && (
        <DeleteEstimateModal
          closeDeleteModalHandler={closeDeleteModalHandler}
          estimateData={activeEstimate}
        />
      )}
      {showPdf && (
        <PdfViewerModal
          closePdfHandler={closePdfHandler}
          estimateData={estimationById}
        />
      )}
      {showSendEstimateModal && (
        <SendMailModal
          closeSendEstimateModalHandler={closeSendEstimateModalHandler}
          estimateData={activeEstimate}
          fileName={getDocName()}
          onSendEstimateBtnHandler={onSendEstimateBtnHandler}
        />
      )}
      <form className="form">
        <div className="fv-row mb-7 fs-4">
          <Row className="mb-5">
            <Col>
              <h2>{formik.values.reference}</h2>
            </Col>
          </Row>
          <Row className="mb-10 fs-3">
            <Col className="fw-bold">{estimationById?.client?.Name}</Col>
            <Col className="fw-bold">{formik.values.date ? formik.values.date : ""}</Col>
          </Row>

          <Row>
            <Col>
            <div className="fv-row mb-7">
              <label className="fw-bold mb-2">Work Order Number</label>
              <p>
                <Link
                  className="menu-link px-3"
                  to={`/order/view/${estimationById?.workOrderId?._id}`}
                >
                  {estimationById?.workOrderId?.Number}
                </Link>
              </p>
            </div>
            </Col>
            <Col>
              <div className="fv-row mb-7">
                <label className="fw-bold mb-2">Purchase Order Number</label>
                <p>{estimationById?.workOrderId?.PoNumber}</p>
              </div>
            </Col>
          </Row>
          {!(formik.values.lineItems.length > 0) && (<Row>
           <Col>
              <div className="fv-row mb-7">
                <label className="fw-bold mb-2">Quantity</label>
                  <p>{formik.values.quantity ? formik.values.quantity : "1"}</p>
              </div>
              </Col>
            <Col>
              <div className="fv-row mb-7">
                <label className="fw-bold mb-2">Amount</label>
                  <p>{currencyConverter(formik.values.itemAmonut)}</p>
              </div>
              </Col>
           </Row>)}
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold mb-2">Location</label>
                  <p>{estimationById?.locationId?.locationName}</p>
                </div>
              </Col>
              <Col>
              <div className="fv-row mb-7">
                <label className="fw-bold mb-2">Total Amount</label>
                  <p>{currencyConverter(total)}</p>
              </div>
              </Col>
            </Row>

        <Row>
            <Col>
            <div className="fv-row mb-7">
              <label className="fw-bold mb-2">Contact Name</label>
              {formik.values?.contact?.map((val : any,_index) => (
                <div key={_index}>
                {val?.fullName ? (<p>{_index + 1 + "."} {val?.fullName}</p>) : ''}
                </div>
              ))}
            </div>
            </Col>
            <Col>
            <div className="fv-row mb-7">
              <label className="fw-bold mb-2">Status</label>
              <p>{formik.values.status}</p>
            </div>
            </Col>
          </Row>
          <Row>
            <Col>
            <div className="fv-row mb-7">
              <label className="fw-bold mb-2">Owner</label>
              <p>{formik?.values?.owner || ""}</p>
            </div>
            </Col>
          </Row>
          <Row>
            <div className="fv-row mb-7">
              <label className="fw-bold mb-2">Description</label>
              <div dangerouslySetInnerHTML={{__html: formik.values.description}}></div>
            </div>
            <div className="fv-row mb-7">
              <div className="d-flex justify-content-between align-content-center ">
               <label className="fw-bold mb-2">Documents</label>
                <div className="mb-2" onClick={() => setShowFileModal(true)}>
                              <Button style={{ padding: "5px", fontSize: "14px" }}>{uploadBtnText}</Button>
                  </div>
              </div>
             <Table bordered responsive className="workorder-table">
                    <thead>
                      <tr>
                        <th>TITLE</th>
                        <th>TYPE</th>
                        <th>BY</th>
                        <th>CREATED ON</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.document?.length > 0 ? (
                        formik.values.document?.filter(doc => doc?.isDeleted !== true)?.map((doc, index) => (
                          <>
                          {((user?.role?.name !== 'ADMIN' && doc.DocumentType != "Financial") || (user?.role?.name == 'ADMIN') || checkFinancialDocPermission ) && (
                              <tr
                              key={index}
                              style={{ borderBottom: "0.5pt solid lightgray" }}
                              >
                              <td className="w-50">
                                <a
                                  target="_blank"
                                  href={doc?.DocUrl}
                                  rel="noreferrer"
                                >
                                  {doc?.Title}
                                </a>
                              </td>
                              <td>{doc?.DocumentType !== "undefined" ? doc?.DocumentType  : "" }</td>
                              <td>{doc?.CreatedBy?.DisplayAs ? doc?.CreatedBy?.DisplayAs  : ""}</td>
                              <td>
                                {timezoneConverter(doc?.UpdatedDate, user.userTimezone)}
                              </td>
                              <td>
                               {((doc.hasOwnProperty('CreatedBy') &&  user?._id == doc?.CreatedBy?.Id)  || user?.role?.name == 'ADMIN') &&  (
                                  <>
                                  <button type="button" className="btn btn-danger"  style={{ padding: "5px", fontSize: "14px" }} onClick={() => deleteDocument(doc) }>Delete</button>
                                  <button type="button" className="btn btn btn-primary p-2 m-2" onClick={() => hadleDocEdit(doc)}>Edit</button>
                                  </>
                              )}
                              </td>
                            </tr>
                             )}
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
            <div className="fv-row mb-7">
              <label className="fw-bold mb-2">Terms</label>
              <div dangerouslySetInnerHTML={{__html: formik.values.terms}}></div>
            </div>
            {formik.values?.lineItems?.length > 0 ? (
            <>
              <label className="fw-bold mb-2">Line Items</label>
              <Table bordered responsive className="workorder-table">
                <thead>
                  <tr>
                    <th>Detail</th>
                    <th>Amount</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody className="mt-2 border border-2">
                  {formik.values?.lineItems?.map((lineItem, i) => {
                    return (
                      <>
                        <tr className="border border-2">
                          <td>
                            <p className="fw-bolder"> {`${i + 1} ) `} {lineItem.referenceNumber}</p>
                          </td>
                          <td>
                            {lineItem.total ? currencyConverter(lineItem.total) : ""}
                          </td>
                          <td>
                            x{lineItem.quantity ? lineItem.quantity : 1}
                          </td>
                          <td>
                            {lineItem.total ? currencyConverter((lineItem.quantity ? lineItem.quantity : 1) * lineItem.total) : ""}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={12}>
                            <div dangerouslySetInnerHTML={{ __html: lineItem?.terms }}></div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </Table>
            </>
            ) : null}
          </Row>
          <Row>
              <Col className="d-flex justify-content-between">
                {
                  ((user?._id == estimationById?.userId?._id || user?.role?.permissions?.estimates?.includes('delete') )) && (
                    <button
                    type="button"
                    className="btn btn-danger flex-grow-1 me-2"
                    onClick={() => showDeleteModalHandler(estimationById?._id)}
                  >
                    Delete
                  </button>
                  )
                }
                {
                  ((user?.role?.permissions?.workorders?.includes('create') )) || (
                    <button
                    type="button"
                    className="btn btn-primary flex-grow-1 me-2"
                    onClick={() => navigate(`/order/create/${estimationById?._id}`)}
                  >
                    Create WO
                  </button>
                  )
                }
                {
                    ((user?._id == estimationById?.userId?._id || user?.role?.permissions?.estimates?.includes('update') )) && (
                      <button
                      type="button"
                      className="btn btn-primary flex-grow-1 me-2"
                      onClick={() => navigate(`/estimates/update/${estimationById?._id}`)}
                    >
                      Edit
                    </button>
                    )
                }

                <PDFActions
                estimateData={estimationById}
                showPdfHandler={showPdfHandler}
                showSendEstimateModalHandler={() =>
                  showSendEstimateModalHandler(estimationById)
                }
                onDownloadBtnHandler={() =>
                  onDownloadBtnHandler(estimationById?._id)
                }
                onSendEstimateBtnHandler={onSendEstimateBtnHandler}
              />
              </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <button
                  type="button"
                  className="btn btn-primary flex-grow-1 me-2"
                  onClick={() => navigate(`/estimates/copy/${estimationById?._id}`)}
              >
                Copy Estimate
              </button>
              <button
                  type="button"
                  className="btn btn-primary flex-grow-1 me-2"
                  onClick={() => handleCreateWo()}
              >
                 Create Work Order
              </button>
            </Col>
          </Row>
        </div>
      </form>
    </>
  );
};

export default ViewEstimation;
