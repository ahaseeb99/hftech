import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ACTION_deleteInvoice, ACTION_getInvoicesDetail } from "../../../../store/invoice/action";
import { timezoneDateRequiredFormat } from "../../../../utils/helpers";


const InvoiceView = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate()
  useEffect(() => {
    const _id = window.location.pathname.split("/")[3];
    dispatch(ACTION_getInvoicesDetail(_id))
  }, [])

  const invoiceDetail = useSelector((state: any) => state.invoices.invoiceDetail)
  const user = useSelector((state: any) => state.auth.user)

  const handleDeleteInvoice = (id) => {
    dispatch(ACTION_deleteInvoice(id, navigate))
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
                      <label className="fw-bold fs-3 mb-2">Invoice Number</label>
                      <p>{invoiceDetail?.InvoiceNumber}</p>
                    </div>
                  </Col>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Work Order Number</label>
                      <p>
                        <Link
                          className="menu-link"
                          to={`/order/view/${invoiceDetail?.WorkOrder?._id}`}
                        >
                          {invoiceDetail?.WorkOrder?.Number}
                        </Link>
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Date</label>
                      <p>{timezoneDateRequiredFormat(invoiceDetail?.StartDate, user.userTimezone)}</p>
                    </div>
                  </Col>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Due Date</label>
                      <p>{timezoneDateRequiredFormat(invoiceDetail?.EndDate, user.userTimezone)}</p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Bill To</label>
                      <p>{invoiceDetail?.BillTo?.DisplayAs}</p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Description</label>
                      <p>{invoiceDetail?.Description}</p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Terms</label>
                      <p>{invoiceDetail?.Terms}</p>
                    </div>
                  </Col>
                </Row>
                <Row className="d-flex align-items-end">
                  <div>
                    <div className="d-flex">
                      {(user.role.name == "ADMIN") &&
                        <button
                          type="button"
                          className="btn btn-primary w-100 flex-grow-1 me-2"
                          onClick={() => navigate("/invoice/update/" + invoiceDetail?._id)}
                        >
                          Edit
                        </button>
                      }
                      {(user.role.name == "ADMIN") &&
                        <button
                          type="button"
                          className="btn btn-danger w-100 flex-grow-1 me-2"
                          onClick={() => handleDeleteInvoice(invoiceDetail?._id)}
                        >
                          Delete
                        </button>
                      }
                    </div>
                  </div>
                </Row>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default InvoiceView;
