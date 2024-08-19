import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
import { ACTION_getClients } from "../../../../store/client/actions";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import { ACTION_getContacts } from "../../../../store/contact/actions";
import CustomDropdownValue from "../../../../components/CustomDropDrownValue/CustomDropDrownValue";
import { ACTION_createPurchaseOrder, ACTION_getPurchaseOrderNumber } from "../../../../store/purchaseorder/actions";
import CustomCreateAbleDropdown from "../../../../components/CreateAbleDropDown";

const purchaseCreateSchema = Yup.object().shape({
    poNumber: Yup.string().required("Purchase Order Number is required"),
    client : Yup.string().required("Client is required")
});

const PurchaseCreateForm = () => {
    const dispatch: any = useDispatch();
    const navigate = useNavigate()

    const [currentClient, setCurrentClient] = useState<any>({})

    useEffect(() => {
        dispatch(ACTION_getClients());
        dispatch(ACTION_getContacts());
    }, []);

    const initialValues = {
        poNumber: "",
        client: "",
        status: "",
        approvedAmount: "",
        contact: "",
        name: ""
    };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: purchaseCreateSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            handlePurchaseOrderSubmit()
        },
    });

    const statusOption = ["Approved", "Pending", "On Hold", "Cancelled"];
    const clientsList: any = useSelector((state: any) =>
        state.client.clientsData.clients?.filter((x) => x.status == "ACTIVE")
    );
    const getPoNumbers = useSelector((state: any) => state.purchase.poNumber)

    const handlePurchaseOrderSubmit = () => {
        const reqData = {
            // @ts-ignore
            ContactId: formik.values.contact?.value || null,
            ClientId: formik.values.client,
            Status: formik.values.status,
            PoNumber: formik.values.poNumber,
            ApprovedAmount: formik.values.approvedAmount,
            Name: formik.values.name
        }
        dispatch(ACTION_createPurchaseOrder(reqData,navigate))
    }


    const handleClientChange = (e) => {
        setCurrentClient(e.data)
        formik.setFieldValue("client", e.value)
        formik.setFieldValue("contact", "")
        formik.setFieldValue("poNumber", "")
        dispatch(ACTION_getPurchaseOrderNumber(e?.value))
    }

    return (
        <>
            <div>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(e) => console.log(e)}
                    validationSchema={purchaseCreateSchema}
                >
                    <form className="pt-4" onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col>
                                <div className="fv-row mb-7">
                                    <label className="fw-bold fs-6 mb-2 required">Client</label>
                                    <CustomDropdown
                                        {...formik.getFieldProps("client")}
                                        name="client"
                                        options={clientsList?.map((item: any) => {
                                            return {
                                                data: item,
                                                label: item?.DisplayAs,
                                                value: item?._id,
                                            };
                                        })}

                                        onChange={(e) => handleClientChange(e)}
                                    />
                                    {formik.touched.client && formik.errors.client && (
                                        <div className="fv-plugins-message-container">
                                            <div className="fv-help-block">
                                                <span role="alert">
                                                    {formik.errors.client as string}
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
                                    <label className="required fw-bold fs-6 mb-2">PO Number</label>
                                    <CustomCreateAbleDropdown
                                        name="poNumber"
                                        options={getPoNumbers?.map(item => (
                                            {
                                                label: item?.PoNumber,
                                                value: item?.PoNumber
                                            }
                                        ))}
                                        value={
                                            {
                                                label: formik.values.poNumber,
                                                value: formik.values.poNumber
                                            }
                                        }
                                        placeholder="Po Number..."
                                        isClearable={true}
                                        onChange={e => formik.setFieldValue("poNumber",e?.value)}
                                    />
                                    {formik.touched.poNumber && formik.errors.poNumber && (
                                        <div className="fv-plugins-message-container">
                                            <div className="fv-help-block">
                                                <span role="alert">
                                                    {formik.errors.poNumber as string}
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
                                    <label className="fw-bold fs-6 mb-2">Name</label>
                                    <input
                                        {...formik.getFieldProps("name")}
                                        type="text"
                                        name="name"
                                        placeholder="Name..."
                                        className="form-control form-control-solid mb-3 mb-lg-0"
                                        autoComplete="off"
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="fv-row mb-7">
                                    <label className="fw-bold fs-6 mb-2">Contact</label>
                                    <CustomDropdownValue
                                        {...formik.getFieldProps("contact")}
                                        name="contact"
                                        options={currentClient?.Contacts?.map((item: any) => {
                                            return {
                                                label: item?.fullName,
                                                value: item?._id,
                                            };
                                        })}
                                        value={{
                                            // @ts-ignore
                                            value: formik.values.contact.value,
                                            // @ts-ignore
                                            label: formik.values.contact.label
                                        }}
                                        onChange={(e) => formik.setFieldValue("contact", e)}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="fv-row mb-7">
                                    <label className="fw-bold fs-6 mb-2">Status</label>
                                    <CustomDropdown
                                        {...formik.getFieldProps("status")}
                                        name="status"
                                        options={statusOption?.map((item: any) => {
                                            return {
                                                label: item,
                                                value: item,
                                            };
                                        })}
                                        onChange={(e) => formik.setFieldValue("status", e?.value)}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="fv-row mb-7">
                                    <label className="fw-bold fs-6 mb-2">Approved Amount</label>
                                    <input
                                        {...formik.getFieldProps("approvedAmount")}
                                        type="Number"
                                        name="approvedAmount"
                                        placeholder="Approved Amount..."
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
                                onClick={() => navigate("/purchase/list")}
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

export default PurchaseCreateForm;
