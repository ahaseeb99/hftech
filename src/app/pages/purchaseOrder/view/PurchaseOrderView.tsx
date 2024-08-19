import { useEffect } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ACTION_deletePurchaseOrder,
  ACTION_getPurchaseOrderDetail,
} from "../../../../store/purchaseorder/actions";
import { currencyConverter } from "../../../../utils/helpers";

const PurchaceOrderView = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const _id = window.location.pathname.split("/")[3];
    dispatch(ACTION_getPurchaseOrderDetail(_id));
  }, []);

  const handleDelete = (_id) => {
    dispatch(ACTION_deletePurchaseOrder(_id, navigate));
  };

  const purchaseDetail = useSelector(
    (state: any) => state.purchase.purchaseDetail
  );
  const user = useSelector((state: any) => state.auth.user);

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
                      <label className="fw-bold fs-3 mb-2">
                        Purchase Order Number
                      </label>
                      <p>{purchaseDetail?.PoNumber}</p>
                    </div>
                  </Col>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Name</label>
                      <p>{purchaseDetail?.Name}</p>
                    </div>
                  </Col>
                </Row>
                <Row>
                <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Status</label>
                      <p>{purchaseDetail?.Status}</p>
                    </div>
                  </Col>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Contact</label>
                      <p>{purchaseDetail?.ContactId?.fullName}</p>
                    </div>
                  </Col>
                </Row>
                <Row>
                    <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">
                        Approved
                      </label>
                      <p>{currencyConverter(purchaseDetail?.ApprovedAmount)}</p>
                    </div>
                  </Col>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Client</label>
                      <p>{purchaseDetail?.ClientId?.DisplayAs}</p>
                    </div>
                  </Col>
                </Row>
                <Row>
                <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">
                       Remaining
                      </label>
                      <p>
                        {purchaseDetail?.AmountRemaining ?  currencyConverter(purchaseDetail?.AmountRemaining)+`(${purchaseDetail?.AmountRemainingPercentage ||
                        purchaseDetail?.AmountRemainingPercentage == 0
                          ? purchaseDetail?.AmountRemainingPercentage.toFixed(
                              2
                            ) + "%"
                          : " "})` : ""}
                      </p>
                    </div>
                  </Col>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">
                        Used
                      </label>
                      <p>
                      {purchaseDetail.UsedAmountPer ? currencyConverter(purchaseDetail?.UsedAmount)+`(${purchaseDetail?.UsedAmountPer ||
                        purchaseDetail?.UsedAmountPer == 0
                          ? purchaseDetail?.UsedAmountPer.toFixed(
                              2
                            ) + "%"
                          : " "})` : ""}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Table bordered responsive className="workorder-table">
                    <thead>
                      <tr>
                        <th>WO</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Estimate Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseDetail?.WorkOrdersIds?.length > 0 ?  purchaseDetail.WorkOrdersIds?.map((workOrder, index) => (
                        <tr>
                          <td>
                            <Link
                              to={`/order/view/${workOrder?._id}`}
                              key={index}
                            >
                              <p>{workOrder?.Number}</p>
                            </Link>
                          </td>
                          <td>{workOrder?.TaskRefinement}</td>
                          <td>
                            {workOrder?.StatusId}
                          </td>
                          <td>
                            <Link
                              to={`/estimates/view/${workOrder?.EstimateId?._id}`}
                              key={index}
                            >
                              <p>{currencyConverter(workOrder?.EstimateId?.total)}</p>
                            </Link>
                          </td>
                        </tr>
                      )) : 
                      <tr>
                        <td>No Records Found</td>
                      </tr>
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
                          onClick={() =>
                            navigate("/purchase/update/" + purchaseDetail?._id)
                          }
                        >
                          Edit
                        </button>
                      )}
                      {user.role.name == "ADMIN" && (
                        <button
                          type="button"
                          className="btn btn-danger w-100 flex-grow-1 me-2"
                          onClick={() => handleDelete(purchaseDetail?._id)}
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

export default PurchaceOrderView;
