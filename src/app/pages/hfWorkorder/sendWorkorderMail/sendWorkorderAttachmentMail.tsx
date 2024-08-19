import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getSignatureBodyHTML } from "../../../../utils/helpers";

const SendMailAttachmentModal = (props: any) => {
  const [email, setEmail] = useState<any>([]);
  const [subject, setSubject] = useState<any>();
  const [attachments,setAttachment] = useState<any>([])
  const [body, setBody] = useState<any>();
  const [qouteEmail, setQouteEmail] = useState<string>('')
  const { user } = useSelector((state: any) => state.auth);
  const [ccInputEmails,setCCInputEmails] = useState("")
  const [inputEmail,setInputValue ] = useState("")
  const { workOrder } = props;
  
  useEffect(() => {
    setSubject(`${workOrder.TaskRefinement.replace(/<\/?[^>]+(>|$)/g, "")}`);
    setBody(getSignatureBodyHTML(user));
  }, [workOrder]);

   const handleAttachment = (e, ind) => {
    if (!e.target.checked) {
        attachments.splice(ind, 1);
        setAttachment([...attachments])
    } else {
      const attachmentBody = {
        content: workOrder.Documents[ind]?.DocUrl,
        filename:  workOrder.Documents[ind]?.Title,
        type: workOrder.Documents[ind]?.ContentType,
        disposition: "attachment"
      }
      setAttachment([...attachments, attachmentBody])
    }
  }

  const handle = (e) => {
    e.preventDefault();
    const sperateEmails = inputEmail.split(/[,;]/);  
    const combineEmails = [...email, ...sperateEmails].filter(email => email) 
    const sperateCcEmails = ccInputEmails.split(/[,;]/);  
    const combineCcEmails = [qouteEmail,...sperateCcEmails].filter(email => email)
    props.onSendMailAttachmentBtnHandler(props.workOrder._id, {
      email: [...combineEmails],
      qouteEmail: [...combineCcEmails],
      emailBody: body,
      emailSubject: subject,
      attachments : attachments
    });
    props.closeMailAttachmentHandler();
  };
  
  const onBodyChanged = (event: any, editor: any) => {
    setBody(editor.getData())
  };

  const toogleCheckBox = (e, emailAddress ,index?) => {
    if (e.target.checked) {
      setEmail([...email, workOrder?.Contact[index]?.emailAddress ? workOrder?.Contact[index]?.emailAddress : workOrder?.ContactAddress?.Address])
    } else {
      let emails = [...email];
      emails = emails.filter(email => email != emailAddress)
      setEmail([...emails])
    }
  };

  const toogleDefaultCheckBox = (e) => {
    if(e.target.checked) {
      setQouteEmail('projects@hftechaz.com')
    } else {
      setQouteEmail('')
    }
  }
   
  return (
    <>
     <form onSubmit={handle}>
      <div
        className="modal fade show d-block"
        id="kt_modal_add_user"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-md"
          style={{ width: "950px !important" }}
        >
          <div className="modal-content">
            <div
              className="modal-body scroll-y mx-5 mx-xl-15 my-7"
              style={{ textAlign: "center" }}
            >
                {(workOrder?.Contact?.length > 0 || workOrder?.ContactAddress?.Address) &&
                  <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2 d-flex justify-content-start">
                      To
                    </label>
                    {workOrder?.Contact?.length > 0 ? (
                      workOrder?.Contact?.map((_item, index) => (
                        <div key={index} className="d-flex justify-content-start align-items-center ms-5 my-4 cursor-pointer">
                          <input id={index} className="form-check-input me-5" type="checkbox" onChange={(e) => toogleCheckBox(e, _item?.emailAddress, index)}></input>
                          <div style={{ textAlign: "start" }}>
                            <label htmlFor={index} className="form-check-label cursor-pointer d-block">{`${_item?.fullName}`}</label>
                            <label htmlFor={index} className="form-check-label cursor-pointer d-block">{`${_item?.emailAddress}`}</label>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="d-flex justify-content-start align-items-center ms-5 my-4 cursor-pointer">
                        <input className="form-check-input me-5" type="checkbox" onChange={(e) => toogleCheckBox(e, workOrder?.ContactAddress?.Address)}></input>
                        <div style={{ textAlign: "start" }}>
                          <label className="form-check-label cursor-pointer d-block">{`${workOrder?.ContactAddress?.Address || ""}`}</label>
                          <label className="form-check-label cursor-pointer d-block">{`${workOrder?.ContactName || ""}`}</label>
                        </div>
                      </div>
                    )
                    }
                  </div>
                }
                <div className="fv-row mb-7 ">
                  <div className="d-flex justify-content-start align-content-center">
                    <label className="fw-bold fs-6 mb-2 me-2 d-flex align-content-center justify-content-start">
                      To Emails
                    </label>
                    <i className="bi bi-info-circle fa-lg cursor-pointer" data-toggle="tooltip" data-placement="top" title="Add multiple emails with comma, or semicolon;"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    className={"form-control form-control-solid mb-3 mb-lg-0"}
                    autoComplete="off"
                    defaultValue={inputEmail}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2 d-flex justify-content-start">
                  CC 
                </label>
                <div  className="d-flex justify-content-start ms-5 cursor-pointer">
                  <input className="form-check-input me-5" checked={!!(qouteEmail)} type="checkbox" onChange={toogleDefaultCheckBox}></input>
                  <label className="form-check-label cursor-pointer">
                    quotes@hftechaz.com
                  </label>
                </div>
              </div>
              <div className="fv-row mb-7 ">
                    <div className="d-flex justify-content-start align-content-center">
                     <label className="fw-bold fs-6 mb-2 me-2 d-flex align-content-center justify-content-start">
                      CC Emails
                     </label>
                      <i className="bi bi-info-circle fa-lg cursor-pointer"  data-toggle="tooltip" data-placement="top" title="Add multiple emails with comma, or semicolon;"></i>
                    </div>
                     <input
                      type="text"
                      placeholder="Email"
                      name="email"
                      className={"form-control form-control-solid mb-3 mb-lg-0"}
                      autoComplete="off"
                      defaultValue={ccInputEmails}
                      onChange={(e) => setCCInputEmails(e.target.value)}
                     />
                  </div>
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2 d-flex justify-content-start">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Email Subject"
                  name="subject"
                  className={"form-control form-control-solid mb-3 mb-lg-0"}
                  autoComplete="off"
                  defaultValue={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2  d-flex justify-content-start">
                  Body
                </label>
                <CKEditor
                  id="inputText"
                  type="inline"
                  data={body}
                  className={""}
                  editor={ClassicEditor}
                  onChange={onBodyChanged}
                />
              </div>
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2 d-flex justify-content-start">
                Documents
                </label>
                {workOrder?.Documents?.map((item, index) => (
                 <div key={index} className="form-check form-check-custom form-check-solid cursor-pointer my-4">
                   <input
                      className="form-check-input"
                        type="checkbox"
                         id={item?.Key}
                         onClick={(e) => handleAttachment(e, index)}
                        />
                        <label
                          className="form-check-label fw-bold cursor-pointer text-gray-700 fs-6"
                           htmlFor={item.Key}
                           >
                       {item?.Title}
                 </label>
                 </div>
              ))}
              </div>
              <div style={{ marginTop: "15px" }}>
                <div className="d flex">
                  <Row>
                    <Col>
                      <div className="text-end pt-5">
                        <button
                          className="btn btn-primary"
                          style={{
                            width: "100%",
                          }}
                          type="submit"
                        >
                          Send
                        </button>
                      </div>
                    </Col>
                    <Col xs={6} md={6} lg={6}>
                      <div className="text-end pt-5">
                        <button
                          style={{
                            width: "100%",
                          }}
                          className="btn btn-secondary"
                          onClick={() => props.closeMailAttachmentHandler()}
                        >
                          Cancel
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="modal-backdrop fade show"></div>
      </form>
    </>
  );
};

export default SendMailAttachmentModal;
