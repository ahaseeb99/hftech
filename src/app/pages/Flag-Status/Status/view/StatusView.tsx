import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ACTION_deleteStatusAPI, ACTION_getStatusDetailAPI } from "../../../../../store/status-flag/action";
import { timezoneDateRequiredFormat } from "../../../../../utils/helpers";

const StatusView = () => {
  const navigate = useNavigate();
  let { id = "" } = useParams();
  const dispatch : any = useDispatch()
  const state : any = useSelector((state : any) => state.flagStatus.statusDetail)
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    dispatch(ACTION_getStatusDetailAPI(id))
  },[id])

  const handleDeleteStatus = (id) => {
    dispatch(ACTION_deleteStatusAPI(id,navigate))
  }

  return (
    <>
      <div className="row gy-5 g-xl-8">
        <div className="col-xxl-6">
          <div className="card card-xl-stretch mb-xl-8">
            <div className="card-body pt-6">
              <Container fluid className="pt-4">
                <Row>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Status Name</label>
                      <p>{state?.label}</p>
                    </div>
                  </Col>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Status</label>
                      <p>
                        <p>{state?.Status ? "Active" : "In Active"}</p>
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Created At</label>
                      <p>
                        {timezoneDateRequiredFormat(
                          state?.CreatedAt,
                          user.userTimezone
                        )}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row className="d-flex align-items-end">
                  <div>
                    <div className="d-flex">
                      {user.role.name == "ADMIN" && (
                        <button
                          type="button"
                          className="btn btn-primary w-100 flex-grow-1 me-2"
                          onClick={() => navigate(`/status/update/${id}`)}
                        >
                          Edit
                        </button>
                      )}
                      {user.role.name == "ADMIN" && (
                        <button
                          type="button"
                          className="btn btn-danger w-100 flex-grow-1 me-2"
                            onClick={() => handleDeleteStatus(state?._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </Row>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusView;
