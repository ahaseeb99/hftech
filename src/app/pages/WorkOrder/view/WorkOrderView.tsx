import moment from "moment-timezone";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  ACTION_getEmployeeAPI,
  ACTION_getWorkOrderByIdAPI,
} from "../../../../store/workorder/actions";
import { taskRefinementHTML } from "../../../../utils/helpers";

const WorkOrderView = () => {
  const dispatch: any = useDispatch();
  let { orderId = "" } = useParams();
  const data: any = useSelector(
    (state: any) => state.workOrder.workOrderDetail
  );
  const listOfEmployees = useSelector(
    (state: any) => state.workOrder.employeeList
  );

  useEffect(() => {
    dispatch(ACTION_getWorkOrderByIdAPI(orderId));
  }, []);

  useEffect(() => {
    if (data?.Assignments?.length > 1) {
      dispatch(ACTION_getEmployeeAPI());
    }
  }, [data]);

  const start = moment.tz(data?.ScheduledStartUtc, "UTC"); // original timezone
  const onSiteByDate = moment.tz(data?.DtOnSiteBy, "UTC");
  const dueByDate = moment.tz(data?.DtDue, "UTC");
  const acknowledgeByDate = moment.tz(data?.DtAcknowledgeBy, "UTC");

  let spaces = data?.ShortLocation?.split("\\");

  return (
    <>
    {data.Id != orderId ? (
      <span></span>
    ) : (
      <div className="border-0 d-flex align-items-center p-5 mb-5 card card-xl-stretch mb-xl-8">
        <Container fluid>
          <Row>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">
                  <a
                    target={"_blank"}
                    className="menu-link"
                    href={`https://am-ce99a.corrigo.com/corpnet/workorder/workorderdetails.aspx/${data?.Id}`}
                    rel="noreferrer"
                  >
                    {" "}
                    {data?.Number}{" "}
                  </a>
                </label>
                <span className="d-block fs-5 text-muted">WO#</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">
                  {data?.StatusId == "New" ? (
                    <i className="bi bi-file-plus-fill fs-0" title="New"></i>
                  ) : (
                    <i
                      className="bi bi-file-check-fill fs-0"
                      title="Completed"
                    ></i>
                  )}
                  {data?.StatusId}
                </label>
                <span className="d-block fs-5 text-muted">status</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">{data?.TypeCategory}</label>
                <span className="d-block fs-5 text-muted">type</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">{data?.Customer?.Name}</label>
                <span className="d-block fs-5 text-muted">client</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">{data?.ContactName}</label>
                <span className="d-block fs-5 text-muted">contact</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">
                  <span className="fw-semibold  d-block fs-3">
                    {spaces?.length > 1 && spaces[0]}
                  </span>
                  <span className="fs-2">
                    {spaces?.length > 1 && spaces[1]}
                  </span>
                </label>
                <span className="d-block fs-5 text-muted">space</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">--</label>
                <span className="d-block fs-5 text-muted">address</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">--</label>
                <span className="d-block fs-5 text-muted">
                  property/workflow
                </span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">
                  <span className="fs-2">
                    {data?.ScheduledStartUtc
                      ? start.tz("MST").format("MM/DD/YYYY")
                      : ""}{" "}
                    <br />
                    {data?.ScheduledStartUtc
                      ? start.tz("MST").format("hh:mm A")
                      : "-"}
                  </span>
                </label>
                <span className="d-block fs-5 text-muted">scheduled to</span>
              </div>
            </Col>

            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">{data?.PoNumber}</label>
                <span className="d-block fs-5 text-muted">P.O.Number</span>
              </div>
            </Col>
          </Row>
          <Row>
            <h2 className="fs-4 mb-5 mt-5">WORK DESCRIPTION</h2>
            <Table bordered responsive className="workorder-table">
              <thead>
                <tr>
                  <th>ASSET</th>
                  <th>TASK</th>
                  <th></th>
                  <th>DESCRIPTION</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data?.TaskRefinement?.split(":")[0]}</td>
                  <td>{data?.TaskRefinement?.split(":")[1]}</td>
                  <td>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: taskRefinementHTML(data?.TaskRefinement),
                      }}
                      style={{ lineHeight: "2rem" }}
                      className="fs-4 "
                    />
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Row>
          <Row>
            <h2 className="fs-4 mb-5 mt-5">WORK PLAN DETAILS</h2>
            <Table bordered responsive className="workorder-table">
              <thead>
                <tr>
                  <th>FLAG</th>
                  <th>WORK PLAN DETAILS</th>
                  <th>CATEGORY</th>
                  <th>ASSET</th>
                  <th>STEPS</th>
                  <th>STATUS</th>
                  <th>ATTACHEMENTS</th>
                  <th>ASSOCIATED WOS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Row>
          <Row>
            <h2 className="fs-4 mb-5 mt-5">SCHEDULING AND ASSIGNMENT</h2>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">{data?.Priority?.DisplayAs}</label>
                <span className="d-block fs-5 text-muted">priority</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">
                  NA{" "}
                  {data?.DtOnSiteBy
                    ? onSiteByDate.tz("GMT").format("MM/DD/YYYY")
                    : ""}{" "}
                  {data?.DtOnSiteBy
                    ? onSiteByDate.tz("GMT").format("hh:mm A")
                    : ""}
                </label>
                <span className="d-block fs-5 text-muted">
                  access/appt/start
                </span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4" style={{ color: "red" }}>
                  {/* {`${data?.DtScheduledStart?.tz("MST").format("MM/DD/YYYY")}`} */}
                  {data?.DtOnSiteBy
                    ? onSiteByDate.tz("GMT").format("MM/DD/YYYY")
                    : "--"}{" "}
                  {data?.DtOnSiteBy
                    ? onSiteByDate.tz("GMT").format("hh:mm A")
                    : "--"}
                </label>
                <span className="d-block fs-5 text-muted">on-site by</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">{data?.Employee?.DisplayAs}</label>
                <span className="d-block fs-5 text-muted">Assigned to</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">
                  {data?.TaskRefinement?.split(":")[1]}
                </label>
                <span className="d-block fs-5 text-muted">Specialty</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4">
                  {data?.Duration ? data?.Duration / 60 : ""}
                </label>
                <span className="d-block fs-5 text-muted">Duration</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4" style={{ color: "red" }}>
                  {data?.DtDue
                    ? dueByDate.tz("GMT").format("MM/DD/YYYY")
                    : "--"}{" "}
                  {data?.DtOnSiteBy
                    ? dueByDate.tz("GMT").format("hh:mm A")
                    : "--"}
                </label>
                <span className="d-block fs-5 text-muted">Due by</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <div className="workorder-field">
                <label className="fs-4" style={{ color: "red" }}>
                  {data?.DtAcknowledgeBy
                    ? acknowledgeByDate.tz("GMT").format("MM/DD/YYYY")
                    : "--"}{" "}
                  {data?.DtOnSiteBy
                    ? acknowledgeByDate.tz("GMT").format("hh:mm A")
                    : "--"}
                </label>
                <span className="d-block fs-5 text-muted">Acknowledge By</span>
              </div>
            </Col>
          </Row>
          <Row>
            <h2 className="fs-4 mb-5 mt-5">ACTIVITY LOG</h2>
            <Table bordered responsive className="workorder-table">
              <thead>
                <tr>
                  <th>BY</th>
                  <th>DATE</th>
                  <th>ACTION</th>
                  <th>COMMENTS</th>
                  <th>VIEW</th>
                </tr>
              </thead>
              <tbody>
                {data?.ActionLogRecords?.length > 0 ? (
                  data.ActionLogRecords.map((log, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: "0.5pt solid lightgray" }}
                    >
                      <td>{log?.Actor?.DisplayAs}</td>
                      <td>
                        {moment
                          .tz(log?.ActionDate, "UTC")
                          .tz("GMT")
                          .format("MM/DD/YYYY")}{" "}
                        {moment
                          .tz(log?.ActionDate, "UTC")
                          .tz("GMT")
                          .format("hh:mm A")}
                      </td>

                      <td>{log?.TypeId}</td>
                      <td>{log?.Comment}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>No Records Found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Row>
          <Row>
            <h2 className="fs-4 mb-5 mt-5">NOTES</h2>
            <Table bordered responsive className="workorder-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>BY</th>
                  <th>NOTE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data?.Notes?.length > 0 ? (
                  data.Notes.map((note, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: "0.5pt solid lightgray" }}
                    >
                      <td>
                        {moment
                          .tz(note?.CreatedDate, "UTC")
                          .tz("GMT")
                          .format("MM/DD/YYYY")}
                      </td>
                      <td>{note?.CreatedBy?.DisplayAs}</td>
                      <td>{note?.Body}</td>
                      <td></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>No Records Found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Row>
          <Row>
            <h2 className="fs-4 mb-5 mt-5">ALERT AND NOTIFICATIONS</h2>
            <Table bordered responsive className="workorder-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>SENT</th>
                  <th>SENT TO</th>
                  <th>ADDRESS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Row>
          <Row>
            <h2 className="fs-4 mb-5 mt-5">EQUIPMENT WORKED ON</h2>
            <Table bordered responsive className="workorder-table">
              <thead>
                <tr>
                  <th>EQUIPMENT WORKED ON</th>
                  <th>COMMENT</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {data?.EquipmentWorkedOn?.length > 0 ? (
                  data.EquipmentWorkedOn.map((item, index) => (
                    <tr
                      key={index}
                      style={{ borderBottom: "0.5pt solid lightgray" }}
                    >
                      <td>{item?.Type}</td>
                      <td>{item?.Comment}</td>
                      <td></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>No Records Found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Row>
          <Row>
            <Col>
              <Row>
                <h2 className="fs-4 mb-5 mt-5">SECONDARY ASSIGNEES</h2>
                <Table bordered responsive className="workorder-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>CHECKED IN</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.Assignments?.length > 1 ? (
                      <tr>
                        <td>
                          {
                            listOfEmployees?.find(
                              (employee) =>
                                employee.Data.Id ===
                                data?.Assignments[1]?.EmployeeId
                            )?.Data?.DisplayAs
                          }
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td>No Records Found</td>
                      </tr>
                    )}
                    <tr>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
              <Row>
                <h2 className="fs-4 mb-5 mt-5">TO-DO</h2>
                <Table bordered responsive className="workorder-table">
                  <thead>
                    <tr>
                      <th>DONE</th>
                      <th>DESCRIPTION</th>
                      <th>DUE BY (USER TIME)</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
              <Row>
                <h2 className="fs-4 mb-5 mt-5">DOCUMENTS</h2>
                <Table bordered responsive className="workorder-table">
                  <thead>
                    <tr>
                      <th>TITLE</th>
                      <th>TYPE</th>
                      <th>SHARE</th>
                      <th>CREATED ON</th>
                      <th>END DATE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.Documents?.length > 0 ? (
                      data.Documents.map((doc, index) => (
                        <tr
                          key={index}
                          style={{ borderBottom: "0.5pt solid lightgray" }}
                        >
                          <td>
                            <a
                              target="_blank"
                              href={doc?.DocUrl}
                              rel="noreferrer"
                            >
                              {doc?.Title}
                            </a>
                          </td>
                          <td>{doc?.DocType?.DisplayAs}</td>
                          <td>{doc?.IsShared ? "Yes" : "No"}</td>
                          <td>
                            {moment
                              .tz(doc?.StartDate, "UTC")
                              .tz("GMT")
                              .format("MM/DD/YYYY")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No Records Found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Row>
              <Row>
                <h2 className="fs-4 mb-5 mt-5">CHECK IN/OUT LOG</h2>
                <Table bordered responsive className="workorder-table">
                  <thead>
                    <tr>
                      <th>BY</th>
                      <th>CHECK IN</th>
                      <th>CHECK OUT</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    )}
    </>
  );
};

export default WorkOrderView;
