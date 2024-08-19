import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const WoWarningModal = (props: any) => {
  const navigate: any = useNavigate();

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
              <div
                style={{
                  display: "block",
                  fontSize: "20px",
                  paddingTop: "5px",
                }}
              >
                Are you sure?
              </div>
              <div style={{ marginTop: "15px" }}>
                <span>This Estimate already has already Work Order associated. Create another?.</span>
                <div className="d flex">
                  <Row>
                    <Col>
                      <div className="text-end pt-5">
                        <button
                          className="btn btn-primary"
                          style={{
                            width: "100%",
                          }}
                          onClick={() => props.handleSubmitWo()}
                        >
                        <i className="bi bi-plus-circle"></i>
                          Create
                        </button>
                      </div>
                    </Col>
                    <Col xs={6} md={6} lg={6}>
                      <div className="text-end pt-5">
                        <button
                          style={{
                            width: "100%",
                          }}
                          type="submit"
                          className="btn btn-secondary"
                          onClick={() => props.handleWoModalClose()}
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
    </>
  );
};

export default WoWarningModal;
