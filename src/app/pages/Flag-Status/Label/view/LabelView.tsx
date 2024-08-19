import { useEffect } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ACTION_deleteLabelAPI, ACTION_deleteStatusAPI, ACTION_getLabelDetailAPI } from "../../../../../store/status-flag/action";
import { timezoneConverter, timezoneDateRequiredFormat } from "../../../../../utils/helpers";
import { KTSVG } from "../../../../../_metronic/helpers";

const LabelView = () => {
  const navigate = useNavigate();
  let { id = "" } = useParams();
  const dispatch : any = useDispatch()
  const state : any = useSelector((state : any) => state.flagStatus.labelDetail)
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    dispatch(ACTION_getLabelDetailAPI(id))
  },[id])

  const handleDeleteStatus = (id) => {
    dispatch(ACTION_deleteLabelAPI(id,navigate))
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
                <Row>
                  <label className="fw-bold fs-3 my-2">Label Categories</label>
                  <Table bordered responsive className="workorder-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Created At<span className="cursor-pointer text-dark" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                          <KTSVG path="/media/svg/shapes/global.svg" />
                        </span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(state?.Categories?.length > 0) ?
                        state?.Categories.map(task => (
                          <tr>
                            <td>{task?.label}</td>
                            <td>{task?.status}</td>
                            <td>{timezoneConverter(task?.CreatedAt, user.userTimezone)}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td>No Records Found</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </Table>
                </Row>
                <Row className="d-flex align-items-end">
                  <div>
                    <div className="d-flex">
                      {user.role.name == "ADMIN" && (
                        <button
                          type="button"
                          className="btn btn-primary w-100 flex-grow-1 me-2"
                          onClick={() => navigate(`/label/update/${id}`)}
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

export default LabelView;
