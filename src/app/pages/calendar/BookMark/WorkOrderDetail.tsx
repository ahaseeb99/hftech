import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { taskRefinementHTML, timezoneDateConverter, timezoneTimeConverter } from "../../../../utils/helpers";
import { KTSVG } from "../../../../_metronic/helpers";

const WorkOrderDetail = ({ workOrderData, user }) => {
  useEffect(() => { }, [workOrderData.Id]);
  let data = workOrderData;

  let spaces = data.ShortLocation ? data.ShortLocation.split("\\") : "";

  const handleStatus = {
    Closed: <i className="bi bi-door-closed-fill" title="Closed"></i>,
    Open: <i className="bi bi-door-open-fill" title="Open"></i>,
    Attention: <i className="bi bi-exclamation-triangle-fill" title="Attention"></i>,
    InProgress: <i className="bi bi-arrow-clockwise" title="InProgress"></i>,
    UnKnown: <i className="bi bi-question-square-fill" title="UnKnown"></i>,
    OnHold: <i className="fa fa-hand" title="onHold me-2"></i>,
    Cancelled: <i className="bi bi-trash-fill" title="Cancelled"></i>,
    Paused: <i className="bi bi-calendar2-x-fill" title="Paused"></i>,
    New: <i className="bi bi-file-plus-fill" title="New"></i>,
    Completed: <i className="bi bi-file-check-fill" title="Completed"></i>
  }

  return (
    <>
      <div className="border-0 p-5 card">
        <div className="fv-row WorkOrderDetailCard">
          <Row className="WorkOrderDetailHeader">
            <Col>
              <h2>Work Order Detail</h2>
            </Col>
          </Row>
          <Row className="WorkOrderDetailRow">
            <div className="col-md-6 col-sm-12 WorkOrderDetailCol">
              <label className="WorkOrderDetailLabel">
                Work Order Number
              </label>
              <a
                className="menu-link WorkOrderDetailLink"
                href={`/order/view/${data._id}`}
                rel="noreferrer"
              >
                {data?.Number}
              </a>
            </div>
            <div className="col-md-6 col-sm-12 WorkOrderDetailCol">
              <label className="WorkOrderDetailLabel">
                Purchase Order Number
              </label>
              <p>{data?.PoNumber}</p>
            </div>
            <div className="col-md-6 col-sm-12 WorkOrderDetailCol">
              <label className="WorkOrderDetailLabel">CLIENT</label>
              <p>{spaces[0]}</p>
            </div>
            <div className="col-md-6 col-sm-12 WorkOrderDetailCol">
              <label className="WorkOrderDetailLabel">Status</label>
              <p>
                {handleStatus[data?.StatusId]}
                <span>{data?.StatusId}</span>
              </p>
            </div>
            <div className="col-md-6 col-sm-12 WorkOrderDetailCol">
              <label className="WorkOrderDetailLabel">Priority</label>
              <p>{data?.Priority?.label ? data?.Priority?.label : data?.Priority?.DisplayAs}</p>
            </div>
            <div className="col-md-6 col-sm-12 WorkOrderDetailCol">
              <label className="WorkOrderDetailLabel">Location</label>
              <p>{spaces[1]}</p>
            </div>
            <div className="col-md-12 col-sm-12 WorkOrderDetailCol">
              <label className="WorkOrderDetailLabel">
                Description
              </label>
              <span
                dangerouslySetInnerHTML={{
                  __html: taskRefinementHTML(data?.TaskRefinement, data.Labels),
                }}
                className="bagde"
              />
            </div>
            <div className="col-md-6 col-sm-12 WorkOrderDetailCol">
              <label className="WorkOrderDetailLabel">Document</label>
              {data?.Documents?.length > 0 ? (
                data.Documents.map((doc, index) => (
                  <p key={index} className="fs-2">
                    <a target="_blank" href={doc?.DocUrl} rel="noreferrer">
                      {doc?.Title}
                    </a>
                  </p>
                ))
              ) : (
                <p>No Document found</p>
              )}
            </div>
            <div className="col-md-6 col-sm-12 WorkOrderDetailCol">
              <label className="WorkOrderDetailLabel">
                Assigned To
              </label>
              {data?.employee?.length > 0 ? (data?.employee?.map((item, index) => (
                <p key={index}>{item?.FirstName + " " + item?.LastName}</p>
              ))) : (<p>{data?.Employee?.DisplayAs}</p>)
              }
            </div>
            <div className="col-md-6 col-sm-12 WorkOrderDetailCol">
              <label className="WorkOrderDetailLabel">
                Schedule To
              </label>
              <span>
                {data.ScheduledStartUtc
                  ? timezoneDateConverter(data.ScheduledStartUtc, user.userTimezone)
                  : ""}
                  {" "}
                  <strong>
                    |
                  </strong>
                  {" "}
                {data.ScheduledStartUtc
                  ? timezoneTimeConverter(data.ScheduledStartUtc, user.userTimezone)
                  : "-"}
              </span>
            </div>
            <div className="col-md-6 col-sm-12 WorkOrderDetailCol">
              <label className="WorkOrderDetailLabel">Flag</label>
              <p>
                {data?.Flag?.length > 0
                  ? data.Flag?.map(item => item?.DisplayAs).join(", ")
                  : " No Flag Found"}
              </p>
            </div>
            <div className="col-md-6 col-sm-12 WorkOrderDetailCol">
              <label className="WorkOrderDetailLabel">
                Contact Name
              </label>
              {data?.Contact?.length > 0 ? data?.Contact?.map(contact => (
                <p className="">
                  {contact.fullName}
                </p>
              )) : data.ContactName}
              <p></p>
            </div>
          </Row>
        </div>
      </div>
    </>
  );
};

export default WorkOrderDetail;
