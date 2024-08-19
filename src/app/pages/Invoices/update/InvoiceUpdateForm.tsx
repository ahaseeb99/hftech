import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as Yup from "yup";
import { date, string, object } from "yup";
import { Formik, useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
import { ACTION_getClients } from "../../../../store/client/actions";
import { ACTION_getHFWorkOrdersForEstimates } from "../../../../store/workorder/actions";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import moment from "moment";
import { ACTION_getInvoicesDetail, ACTION_getWorkOrderForInvoice, ACTION_UpdateInvoice, ACTION_updateWorkOrderValue } from "../../../../store/invoice/action";
import CustomDropdownValue from "../../../../components/CustomDropDrownValue/CustomDropDrownValue";

const invoiceCreateSchema = Yup.object().shape({
    workOrder: object().required("Work Order is required"),
    billTo : object().required("Client - Bill To is required")
});

const InvoiceUpdateForm = () => {
    const dispatch: any = useDispatch();
    const navigate = useNavigate()

    const [currentWo, setCurrentWo] = useState<string>("")

    useEffect(() => {
        const _id = window.location.pathname.split("/")[3];
        dispatch(ACTION_getInvoicesDetail(_id))
        dispatch(ACTION_getClients());
        dispatch(ACTION_updateWorkOrderValue())
    }, []);

    const invoiceDetail = useSelector((state: any) => state.invoices.invoiceDetail)


    useEffect(() => {
        dispatch(ACTION_getWorkOrderForInvoice(invoiceDetail?.BillTo?._id))
    }, [invoiceDetail]);

    const initialValues = {
        billTo: invoiceDetail?.BillTo?._id ? { value: invoiceDetail?.BillTo._id, label: invoiceDetail?.BillTo?.DisplayAs } : {},
        date: invoiceDetail?.StartDate ? moment(invoiceDetail?.StartDate).format("yyyy-MM-DD") : "",
        dueDate: invoiceDetail?.EndDate ? moment(invoiceDetail?.EndDate).format("yyyy-MM-DD") : "",
        description: invoiceDetail?.Description,
        terms: invoiceDetail?.Terms ? { value: invoiceDetail?.Terms, label: invoiceDetail?.Terms } : {},
        workOrder: invoiceDetail?.WorkOrder?._id ? { value: invoiceDetail?.WorkOrder._id, label: invoiceDetail?.WorkOrder?.Number + " - " + invoiceDetail?.WorkOrder?.TaskRefinement } : {},
    };

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

    const handleInvoiceSubmit = () => {
        const reqDate = {
            BillTo: formik.values?.billTo?.value,
            StartDate: moment.tz(formik.values.date, user?.userTimezone).tz('UTC'),
            EndDate: moment.tz(formik.values.dueDate, user?.userTimezone).tz('UTC'),
            WorkOrder: formik.values.workOrder.value,
            Description: formik.values.description,
            InvoiceNumber: currentWo || formik?.values?.workOrder?.label?.split("-")[0],
            Terms: formik.values.terms.value
        }
        const _id = window.location.pathname.split("/")[3];
        dispatch(ACTION_UpdateInvoice(reqDate, _id, navigate))
    }

    const handleBillToChange = (e) => {
        dispatch(ACTION_getWorkOrderForInvoice(e?.value))
        formik.setFieldValue("billTo", e)
        formik.setFieldValue("workOrder", "")
        setCurrentWo("")
    }

    const handleTermChange = (e) => {
        formik.setFieldValue("terms", e)
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
                                    <label className="fw-bold fs-6 mb-2 required">Client - Bill To</label>
                                    <CustomDropdown
                                        {...formik.getFieldProps("billTo")}
                                        name="billTo"
                                        options={clientsList?.map((item: any) => {
                                            return {
                                                label: item?.DisplayAs,
                                                value: item?._id,
                                            };
                                        })}
                                        onChange={(e) => handleBillToChange(e)}
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
                                    <label className="fw-bold fs-6 mb-2  required">Work Order</label>
                                    <CustomDropdownValue
                                        {...formik.getFieldProps("workOrder")}
                                        options={workorders?.map((item: any) => {
                                            return {
                                                label: item?.Number,
                                                value: item?._id,
                                            };
                                        })}
                                        name="workOrder"
                                        onChange={(e) => {
                                            setCurrentWo(e?.label.split("-")[0])
                                            formik.setFieldValue("workOrder", e)
                                        }
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
                                        className={`form-control form-control-solid mb-3 mb-lg-0 ${currentWo || formik?.values?.workOrder?.label ? "" : "py-6"}`}
                                    >
                                        {currentWo ? currentWo : formik?.values?.workOrder?.label?.split("-")[0]}</p>
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
                                            formik.setFieldValue("terms", e)
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

export default InvoiceUpdateForm;
