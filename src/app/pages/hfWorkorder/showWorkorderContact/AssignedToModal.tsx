import React, { useEffect, useState } from "react";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface IAssignToModal {
  handleClose: () => void;
  assignedToData: any;
}

const AssignToModal = ({ handleClose, assignedToData }: IAssignToModal) => {
  const [isCopied, setIsCopied] = useState(false);
  const [currentCopy, setCurrentCopy] = useState("");

  const handleCopy = (copyText: string) => {
    setCurrentCopy(copyText);
    setIsCopied(true);
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_add_user"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        style={{backgroundColor : "rgba(0,0,0,0.2)"}}
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
              <div className="contactHeader" style={{ textAlign: "center" }}>
                {assignedToData.FirstName && (
                  <>
                    <h3>
                      {assignedToData.FirstName + " " + assignedToData.LastName}
                    </h3>
                    <p
                      style={{
                        padding:
                          assignedToData?.JobTitle || assignedToData?.title
                            ? "0"
                            : "10px",
                      }}
                    >
                      {assignedToData?.JobTitle
                        ? assignedToData?.JobTitle
                        : assignedToData?.title}
                    </p>
                  </>
                )}
                {assignedToData.email && (
                  <div
                    className="fv-row mb-7 "
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <label className="fw-bold fs-6 mb-2 mt-6  d-flex justify-content-start">
                      {assignedToData.email && (
                        <p>
                          <a href={`mailto:${assignedToData?.email}`}>
                            {assignedToData?.email}
                          </a>
                        </p>
                      )}
                    </label>
                    <CopyToClipboard
                      onCopy={(e) => handleCopy(e)}
                      text={assignedToData?.email}
                    >
                      <FontAwesomeIcon
                        title="copy to clipboard"
                        icon={faCopy}
                        style={{
                          color:
                            isCopied && currentCopy == assignedToData?.email
                              ? "red"
                              : "",
                          position: "absolute",
                          top: "110px",
                          right: "20px",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                      />
                    </CopyToClipboard>
                  </div>
                )}
                {assignedToData.contact && (
                  <div
                    className="fv-row mb-7 "
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <label className="fw-bold fs-6 mb-2 mt-6  d-flex justify-content-start">
                      {assignedToData.contact && (
                        <p>
                          <a href={`tel:${assignedToData.contact}`}>
                            {assignedToData.contact}
                          </a>
                        </p>
                      )}
                    </label>
                    <CopyToClipboard
                      onCopy={(e) => handleCopy(e)}
                      text={assignedToData.contact}
                    >
                      <FontAwesomeIcon
                        title="copy to clipboard"
                        icon={faCopy}
                        style={{
                          color:
                            isCopied && currentCopy == assignedToData.contact
                              ? "red"
                              : "",
                          position: "absolute",
                          top: "175px",
                          right: "20px",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                      />
                    </CopyToClipboard>
                  </div>
                )}
              </div>
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
                        onClick={() => handleClose()}
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
    </>
  );
};

export default AssignToModal;
