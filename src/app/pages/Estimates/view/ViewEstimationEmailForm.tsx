import moment from "moment";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_getEstimateEmailDetail } from "../../../../store/estimate/actions";
import { DateTimeWithtimezoneConverter } from "../../../../utils/helpers";

const ViewEstimationEmail = () => {
  const dispatch: any = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  const estimationEmailDetail = useSelector(
    (state: any) => state.estimate.estimateEmailDetail
  );


  useEffect(() => {
    const id = window.location.pathname.split("/")[3];
    dispatch(ACTION_getEstimateEmailDetail(id));
  }, []);
  return (
    <>
      <form className="form">
        <div className="fv-row mb-7 fs-4">
          <Row className="mb-5">
            <Col>
              <h2>Emails Details</h2>
            </Col>
          </Row>
          {estimationEmailDetail.map((details, index) => (
            <>
              <Row className="mb-10 fs-3">
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold mb-2">To</label>
                    <p>{details?.to}</p>
                  </div>
                </Col>
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold mb-2">From</label>
                    <p>{details?.from}</p>
                  </div>
                </Col>
              </Row>
              <Row className="mb-10 fs-3">
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold mb-2">Cc</label>
                    {details?.cc?.length > 0 ? details?.cc?.map((item,index) => (
                      <p className="mb-1" key={index}>{item}</p>
                      )) : details?.cc}
                  </div>
                </Col>
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold mb-2">Date</label>
                    <p>
                      {" "}
                      {DateTimeWithtimezoneConverter(details
                        .date, user.userTimezone)}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row className="mb-10 fs-3">
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold mb-2">Subject</label>
                    <p>{details?.subject}</p>
                  </div>
                </Col>
              </Row>
              <Row className="mb-10 fs-3">
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold mb-2">Body</label>
                    <div
                      dangerouslySetInnerHTML={
                        { __html: details?.emailBody }
                      }
                    ></div>
                  </div>
                </Col>
              </Row>
              <hr />
            </>
          ))}
        </div>
      </form>
    </>
  );
};

export default ViewEstimationEmail;
