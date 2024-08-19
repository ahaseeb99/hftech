import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { number } from "yup";
import { ACTION_deleteEstimate } from "../../../../store/estimate/actions";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { getWorkorderMailBodyHTML } from "../../../../utils/helpers";

const SendMailModal = (props: any) => {
  const [email, setEmail] = useState<any>([]);
  const [subject, setSubject] = useState<any>();
  const [body, setBody] = useState<any>();
  const [qouteEmail, setQouteEmail] = useState<string>('projects@hftechaz.com')
  const { user } = useSelector((state: any) => state.auth);
  const [inputEmail,setInputValue ] = useState("")
  const [ccInputEmails,setCCInputEmails] = useState("")
  const [status,setStatus] = useState("")
  const [flag,setFlag] = useState({})
  const { workOrder } = props;
  const flagsData = useSelector((state : any) => state.workOrder.workOrderFlags)


  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  useEffect(() => {
    setSubject(`${workOrder.Number} - ${workOrder.TaskRefinement.replace(/<\/?[^>]+(>|$)/g, "")} - Complete`);
    setBody(getWorkorderMailBodyHTML(workOrder, user));
  }, [workOrder]);

  const handle = (e) => {
    e.preventDefault();
    const sperateEmails = inputEmail.split(/[,;]/);
    const combineEmails = [...email, ...sperateEmails].filter(email => email) 
    const sperateCcEmails = ccInputEmails.split(/[,;]/);  
    const combineCcEmails = [qouteEmail,...sperateCcEmails].filter(email => email)
    props.onSendWorkorderBtnHandler(props.workOrder._id, {
      email: [...combineEmails],
      qouteEmail: [...combineCcEmails],
      emailBody: body,
      emailSubject: subject,
      status,
      flag
    });
    props.closeSendWorkorderModalHandler();
  };

  const onBodyChanged = (event: any, editor: any) => {
    setBody(editor.getData())
  };


  const toogleCheckBox = (e, emailAddress, index?) => {
    if (e.target.checked) {
      setEmail([...email, workOrder?.Contact[index]?.emailAddress ? workOrder?.Contact[index]?.emailAddress : workOrder?.ContactAddress?.Address])
    } else {
      let emails = [...email];
      emails = emails.filter(email => email != emailAddress)
      setEmail([...emails])
    }
  };

  const toogleDefaultCheckBox = () => {
    if(!qouteEmail) {
      setQouteEmail('projects@hftechaz.com')
    } else {
      setQouteEmail('')
    }
  }
  
  const handleStatusChange = (e,value) => {
     if(e.target.checked){
      setStatus(value)
     }
     else{
      setStatus("")
     }
  }
 
  const handleFlagChange = (e,value) => {
   if(e.target.checked){
    const flagData = flagsData.find(item => item.DisplayAs == value)
    setFlag(flagData)
   }else{
    setFlag({})
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
                      To Email
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
                <div className="d-flex justify-content-start ms-5 cursor-pointer">
                  <input id="cc" className="form-check-input me-5" checked={!!(qouteEmail)} type="checkbox" onChange={toogleDefaultCheckBox}></input>
                  <label htmlFor="cc" className="form-check-label cursor-pointer">
                  projects@hftechaz.com
                  </label>
                </div>
              </div>
                <div className="fv-row mb-7 ">
                  <div className="d-flex justify-content-start align-content-center">
                    <label className="fw-bold fs-6 mb-2 me-2 d-flex align-content-center justify-content-start">
                      CC Emails
                    </label>
                    <i className="bi bi-info-circle fa-lg cursor-pointer" data-toggle="tooltip" data-placement="top" title="Add multiple emails with comma, or semicolon;"></i>
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
              <div className="mb-7">
                <label className="fw-bold fs-6 mb-2 d-flex justify-content-start">
                 Status
                </label>
                <div className="cursor-pointer mt-2">
                    {["Completed", "In Progress"].map((item,index) => (
                      <div key={`index ${index}`} className="my-3">
                        <input id={item+index} className="form-check-input me-5" type="checkbox" checked={item.replace(/\s/g,"") == status} onChange={e => handleStatusChange(e,item.replace(/\s/g,""))}></input>
                        <label htmlFor={item+index} className="form-check-label cursor-pointer">
                          {item}
                        </label>
                      </div>
                    ))}
                </div>
            </div>
            <div className="mb-7">
                <label className="fw-bold fs-6 mb-2 d-flex justify-content-start">
                 Flag
                </label>
                <div className="cursor-pointer mt-2">
                    {["Ready to Invoice"].map((item,index) => (
                      <div key={`index ${index}`} className="my-3">
                        <input id={item+index} className="form-check-input me-5" type="checkbox" onChange={e => handleFlagChange(e,item)}></input>
                        <label htmlFor={item+index} className="form-check-label cursor-pointer">
                          {item}
                        </label>
                      </div>
                    ))}
                </div>
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
                          onClick={() => props.closeSendWorkorderModalHandler()}
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

export default SendMailModal;
