import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as Yup from "yup";
import { object } from "yup";
import { Formik, useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
import { ACTION_getClients } from "../../../../store/client/actions";
import { ACTION_getHFWorkOrdersForEstimates } from "../../../../store/workorder/actions";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import moment from "moment";
import { ACTION_createInvoice, ACTION_getWorkOrderForInvoice, ACTION_updateWorkOrderValue } from "../../../../store/invoice/action";

const invoiceCreateSchema = Yup.object().shape({
  workOrder: Yup.string().required("Work Order is required"),
  billTo: Yup.string().required("Bill To is required")
});

const InvoiceCreateForm = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate()

  const [currentWo, setCurrentWo] = useState<string>("")

  useEffect(() => {
    dispatch(ACTION_getClients());
    dispatch(ACTION_getHFWorkOrdersForEstimates());
    dispatch(ACTION_updateWorkOrderValue())
  }, []);

  const termsOption = [
    {
      value: "Net 30",
      label: "Net 30"
    },
    {
      value: "Due on Receipt",
      label: "Due on Receipt"
    }
  ]

  const initialValues = {
    billTo: "",
    invoiceNo: "",
    date: "",
    dueDate: "",
    description: "",
    terms: "",
    workOrder: "",
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: invoiceCreateSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleInvoiceSubmit()
    },
  });

  const { user } = useSelector((state: any) => state.auth);
  const clientsList: any = useSelector((state: any) =>
    state.client.clientsData.clients?.filter((x) => x.status == "ACTIVE")
  );
  const workorders = useSelector((state: any) =>
    state.invoices?.workOrderData?.map((x) => ({
      Number: x.Number + " - " + x.TaskRefinement,
      _id: x._id,
    }))
  );

  const handleWorkOrderChange = (e: any) => {
    setCurrentWo(e?.label.split("-")[0])
    formik.setFieldValue("workOrder", e?.value)
  }

  const handleInvoiceSubmit = () => {
    const reqDate = {
      BillTo: formik.values.billTo,
      StartDate: moment.tz(formik.values.date, user?.userTimezone).tz('UTC'),
      EndDate: moment.tz(formik.values.dueDate, user?.userTimezone).tz('UTC'),
      WorkOrder: formik.values.workOrder,
      Description: formik.values.description,
      InvoiceNumber: currentWo,
      Terms: formik.values.terms
    }
    dispatch(ACTION_createInvoice(reqDate, navigate))
  }

  const handleBilToChange = (e) => {
    dispatch(ACTION_getWorkOrderForInvoice(e?.value))
    formik.setFieldValue("billTo", e?.value)
    formik.setFieldValue("workOrder", "")
  }

  const handleTermChange = (e) => {
    formik.setFieldValue("terms", e.value)
    if (e.value == "Net 30") {
      formik.setFieldValue("date", moment().format("yyyy-MM-DD"))
      formik.setFieldValue("dueDate", moment().add("30", "days").format("yyyy-MM-DD"))
    }
    else {
      formik.setFieldValue("date", moment().format("yyyy-MM-DD"))
      formik.setFieldValue("dueDate", moment().format("yyyy-MM-DD"))
    }
  }


  return (
    <>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={(e) => console.log(e)}
          validationSchema={invoiceCreateSchema}
        >
          <form className="pt-4" onSubmit={formik.handleSubmit}>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="required fw-bold fs-6 mb-2">Client - Bill To</label>
                  <CustomDropdown
                    {...formik.getFieldProps("billTo")}
                    name="billTo"
                    options={clientsList?.map((item: any) => {
                      return {
                        label: item?.DisplayAs,
                        value: item?._id,
                      };
                    })}
                    onChange={(e) => handleBilToChange(e)}
                  />
                  {formik.touched.billTo && formik.errors.billTo && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">
                          {formik.errors.billTo as string}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2 required">Work Order</label>
                  <CustomDropdown
                    {...formik.getFieldProps("workOrder")}
                    options={workorders?.map((item: any) => {
                      return {
                        label: item?.Number,
                        value: item?._id,
                      };
                    })}
                    name="workOrder"
                    onChange={(e) =>
                      handleWorkOrderChange(e)
                    }
                  />
                  {formik.touched.workOrder && formik.errors.workOrder && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">
                          {formik.errors.workOrder as string}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Invoice Number</label>
                  <p
                    className={`form-control form-control-solid mb-3 mb-lg-0 ${currentWo ? "" : "py-6"}`}
                  >
                    {currentWo}</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Terms</label>
                  <CustomDropdown
                    {...formik.getFieldProps("terms")}
                    name="terms"
                    options={termsOption}
                    onChange={(e) => {
                      handleTermChange(e)
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Date</label>
                  <input
                    {...formik.getFieldProps("date")}
                    type="date"
                    name="date"
                    className="form-control form-control-solid mb-3 mb-lg-0"
                    autoComplete="off"
                    value={formik.values.date}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Due Date</label>
                  <input
                    {...formik.getFieldProps("dueDate")}
                    type="date"
                    name="dueDate"
                    value={formik.values.dueDate}
                    className="form-control form-control-solid mb-3 mb-lg-0"
                    autoComplete="off"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Description</label>
                  <textarea
                    {...formik.getFieldProps("description")}
                    name="description"
                    className="form-control form-control-solid mb-3 mb-lg-0"
                    autoComplete="off"
                  />
                </div>
              </Col>
            </Row>
            <div className="text-end pt-15">
              <button
                type="reset"
                className="btn btn-light me-3"
                data-kt-users-modal-action="cancel"
                onClick={() => navigate("/invoice/list")}
              >
                Discard
              </button>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </Formik>
      </div>
    </>
  );
};

export default InvoiceCreateForm;
