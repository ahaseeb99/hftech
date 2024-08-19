import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ContactModal = (props: any) => {
  // const contactData = useSelector((state: any) => state.workOrder.contactInfo);
  const [isCopied, setIsCopied] = useState(false);
  const [currentCopy,setCurrentCopy] = useState('')

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  let isEmail, isPhoneNumber;
  console.log("Props : ", props);
  if (props?.contactData?.contactData?.Address) {
    isEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
      props?.contactData?.contactData?.Address
    );
    isPhoneNumber = /[0-9 ]+/.test(props?.contactData?.contactData?.Address);
  } else {
    isEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
      props?.contactData?.contactData?.emailAddress
    );
    isPhoneNumber = /[0-9 ]+/.test(
      props?.contactData?.contactData?.phoneNumber
    );
  }

  const handleCopy = (copyText : string) => {
    setCurrentCopy(copyText)
    setIsCopied(true)
  }

  const currentAddress = props?.contactData?.contactData?.Address
    ? props?.contactData?.contactData?.Address
    : props?.contactData?.contactData?.phoneNumber

  const currentMail = props?.contactData?.contactData?.Address
    ? props?.contactData?.contactData?.Address
    : props?.contactData?.contactData?.emailAddress


  return (
    <>
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
              <>
                <div className="contactHeader" style={{ textAlign: "center" }}>
                  <h2>{props?.contactData?.contactName}</h2>
                </div>
                {isPhoneNumber && (
                  <div
                    className="fv-row mb-7 "
                    style={{
                      marginTop: "30px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <label className="fw-bold fs-6 mb-2 mt-6  d-flex justify-content-start">
                      {isPhoneNumber && (
                        <p>
                          <a
                            href={`tel:${
                              props?.contactData?.contactData?.Address
                                ? props?.contactData?.contactData?.Address
                                : props?.contactData?.contactData?.phoneNumber
                            }`}
                          >
                            {props?.contactData?.contactData?.Address
                              ? props?.contactData?.contactData?.Address
                              : props?.contactData?.contactData?.phoneNumber}
                          </a>
                        </p>
                      )}
                    </label>
                    <CopyToClipboard
                      onCopy={(e) => handleCopy(e)}
                      text={
                        props?.contactData?.contactData?.Address
                          ? props?.contactData?.contactData?.Address
                          : props?.contactData?.contactData?.phoneNumber
                      }
                    >
                      <FontAwesomeIcon
                        title="copy to clipboard"
                        icon={faCopy}
                        style={{
                          color: (isCopied && currentCopy == currentAddress) ? "red" : "",
                          position: "absolute",
                          top: "97px",
                          right: "20px",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                      />
                    </CopyToClipboard>
                  </div>
                )}
                {isEmail && (
                  <div
                    className="fv-row mb-7 "
                    style={{
                      marginTop: "30px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <label className="fw-bold fs-6 mb-2 mt-6  d-flex justify-content-start">
                      {isEmail && (
                        <p>
                          <a
                            href={`mailto:${
                              props?.contactData?.contactData?.Address
                                ? props?.contactData?.contactData?.Address
                                : props?.contactData?.contactData?.emailAddress
                            }`}
                          >
                            {props?.contactData?.contactData?.Address
                              ? props?.contactData?.contactData?.Address
                              : props?.contactData?.contactData?.emailAddress}
                          </a>
                        </p>
                      )}
                      {/* {props?.contactData?.contactData ? (
                        isEmail ? (
                          <p>
                            <a href={`mailto:${props?.contactData?.contactData?.Address ? props?.contactData?.contactData?.Address :  props?.contactData?.contactData?.emailAddress}`}>
                              {props?.contactData?.contactData?.Address ? props?.contactData?.contactData?.Address :  props?.contactData?.contactData?.emailAddress}
                            </a>
                          </p>
                        ) : isPhoneNumber ? (
                          <p>
                            <a href={`tel:${props?.contactData?.contactData?.Address ? props?.contactData?.contactData?.Address :  props?.contactData?.contactData?.phoneNumber}`}>
                              {props?.contactData?.contactData?.Address ? props?.contactData?.contactData?.Address :  props?.contactData?.contactData?.phoneNumber}
                            </a>
                          </p>
                        ) : (
                          <p>Data : {props?.contactData?.contactData?.Address}</p>
                        )
                      ) : (
                        <p>No contact found!</p>
                      )} */}
                    </label>
                    <CopyToClipboard
                      onCopy={(e) => handleCopy(e)}
                      text={
                        props?.contactData?.contactData?.Address
                          ? props?.contactData?.contactData?.Address
                          : props?.contactData?.contactData?.emailAddress
                      }
                    >
                      <FontAwesomeIcon
                        title="copy to clipboard"
                        icon={faCopy}
                        style={{
                          color: (isCopied && currentCopy == currentMail) ? "red" : "",
                          position: "absolute",
                          top: (isEmail && isPhoneNumber) ? "188px" : "97px",
                          right: "20px",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                      />
                    </CopyToClipboard>
                  </div>
                )}
                {!isPhoneNumber && !isEmail && <p>No contact found!</p>}
              </>
              <div
                style={{
                  marginTop: "15px",
                }}
              >
                <div className="d flex">
                  <Row style={{ display: "flex", justifyContent: "center" }}>
                    <Col xs={6} md={6} lg={6}>
                      <div className="text-end pt-5">
                        <button
                          style={{
                            width: "100%",
                          }}
                          type="submit"
                          className="btn btn-secondary"
                          onClick={() => props.closeContactModalHandler()}
                        >
                          Close
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
    </>
  );
};

export default ContactModal;
