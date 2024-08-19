import { useEffect, useState } from "react";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ContactDetailModal = ({ contactData, closeContactModalHandler }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const [currentCopy, setCurrentCopy] = useState("");

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleCopy = (copyText: string) => {
    setCurrentCopy(copyText);
    setIsCopied(true);
  };

  const isEmail = contactData?.contact?.emailAddress;
  const isPhoneNumber = contactData?.contact?.phoneNumber;

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
                  <h2>{contactData?.contactName}</h2>
                </div>
                {contactData?.contact?.phoneNumber && (
                  <div
                    className="fv-row mb-7 "
                    style={{
                      marginTop: "30px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <label className="fw-bold fs-6 mb-2 mt-6  d-flex justify-content-start">
                      {contactData?.contact?.phoneNumber && (
                        <p>
                          <a href={`tel:${contactData?.contact?.phoneNumber}`}>
                            {contactData?.contact?.phoneNumber}
                          </a>
                        </p>
                      )}
                    </label>
                    <CopyToClipboard
                      onCopy={(e) => handleCopy(e)}
                      text={contactData?.contact?.phoneNumber}
                    >
                      <FontAwesomeIcon
                        title="copy to clipboard"
                        icon={faCopy}
                        style={{
                          color:
                            isCopied && currentCopy == isPhoneNumber
                              ? "red"
                              : "",
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
                {contactData?.contact?.emailAddress && (
                  <div
                    className="fv-row mb-7 "
                    style={{
                      marginTop: "30px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <label className="fw-bold fs-6 mb-2 mt-6  d-flex justify-content-start">
                      {contactData?.contact?.emailAddress && (
                        <p>
                          <a
                            href={`mailto:${contactData?.contact?.emailAddress}`}
                          >
                            {contactData?.contact?.emailAddress}
                          </a>
                        </p>
                      )}
                    </label>
                    <CopyToClipboard
                      onCopy={(e) => handleCopy(e)}
                      text={contactData?.contact?.emailAddress}
                    >
                      <FontAwesomeIcon
                        title="copy to clipboard"
                        icon={faCopy}
                        style={{
                          color:
                            isCopied && currentCopy == isEmail ? "red" : "",
                          position: "absolute",
                          top: isEmail && isPhoneNumber ? "188px" : "97px",
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
                          onClick={() => closeContactModalHandler()}
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

export default ContactDetailModal;
