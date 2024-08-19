import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

const FlagModal = (props: any) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

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
              {/* TODO: Get data dynamically */}
              <p>Ready to Invoice</p>
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
                          onClick={() => props.closeFlagModalHandler()}
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

export default FlagModal;
