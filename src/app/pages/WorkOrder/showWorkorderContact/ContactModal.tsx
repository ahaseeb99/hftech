import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ACTION_getContactInfoById } from "../../../../store/workorder/actions";

const ContactModal = (props: any) => {
  // const contactData = useSelector((state: any) => state.workOrder.contactInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [contactData, setContactData] = useState<any>({});

  useEffect(() => {
    const getContactInfo = async (_id: string) => {
      const contactData = await ACTION_getContactInfoById(_id);
      console.log("Our contact : ", contactData);
      setContactData(contactData);
      setIsLoading(false);
    };
    getContactInfo(props.contactData.contactId?.toString());
  }, []);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const isEmail =
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
      contactData?.Address
    );
  const isPhoneNumber = /[0-9 ]+/.test(contactData?.Address);

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
              {isLoading ? (
                <h2>Loading.....</h2>
              ) : (
                <>
                  <div
                    className="contactHeader"
                    style={{ textAlign: "center" }}
                  >
                    <h2>{props?.contactData?.contactName}</h2>
                  </div>
                  <div
                    className="fv-row mb-7 "
                    style={{
                      marginTop: "30px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <label className="fw-bold fs-6 mb-2 mt-6  d-flex justify-content-start">
                      {contactData?.Address ? (
                        isEmail ? (
                          <p>
                            <a href={`mailto:${contactData?.Address}`}>
                              {contactData?.Address}
                            </a>
                          </p>
                        ) : isPhoneNumber ? (
                          <p>
                            <a href={`tel:${contactData?.Address}`}>
                              {contactData?.Address}
                            </a>
                          </p>
                        ) : (
                          <p>Data : {contactData?.Address}</p>
                        )
                      ) : (
                        <p>No contact found!</p>
                      )}
                    </label>
                    <CopyToClipboard
                      onCopy={() => setIsCopied(true)}
                      text={contactData?.Address}
                    >
                      <FontAwesomeIcon
                        title="copy to clipboard"
                        icon={faCopy}
                        style={{
                          color: isCopied ? "red" : "",
                          position: "absolute",
                          top: "97px",
                          right: "20px",
                          cursor: "pointer",
                          fontSize: "18px",
                        }}
                      />
                    </CopyToClipboard>
                  </div>
                </>
              )}

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
