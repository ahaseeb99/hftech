import React, { useEffect, useState } from "react";
import { date, number, object, string, array } from "yup";
import { Formik, FieldArray, useFormik } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import { useNavigate } from "react-router-dom";
import { ACTION_postEstimateFormData } from "../../../../store/estimate/actions";
import { Button, Col, Row } from "react-bootstrap";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import { ACTION_clearWorkOrderDetail } from "../../../../store/workorder/actions";
import moment from "moment";
import FileUploadModalEstimate from "../fileAttachmentModal/fileAttachmentModal";
import CustomDropdownMultipleValues from "../../../../components/CustomDropDownMultipleValues/CustomDropDownMultipleValues";
import * as Yup from "yup";
import { ACTION_getHFWorkOrdersForEstimates } from "../../../../store/workorder/actions";
import { currencyConverter } from "../../../../utils/helpers";
import { ACTION_getUsers } from "../../../../store/users/actions";
import CustomDropdownValue from "../../../../components/CustomDropDrownValue/CustomDropDrownValue";

const editEstimatesSchema =  Yup.object().shape({
  date: date().required("Date is required"),
  client: string().required("Client is required"),
  location: string().required("Location is required"), // it is creating issue while create estimate from workorder
  contact: array(),
  amount: number()
    .typeError("Only numbers are allowed"),
   quantityField : number()
   .typeError("Only numbers are allowed"), 
   amountField : number()
   .typeError("Only numbers are allowed"),
  reference: string().required("Reference is required"),
  lineItems: array().of(
    object().shape({
      referenceNumber: string().required("Line item detail is required"),
      total: number()
        .typeError("Only numbers are allowed")
        .required("Amount is required"),
      terms: string().required("Terms are required"),
      quantity : number()
    })
  ),
});

const EstimationForm: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const { userDailyCostBreakDownList } = useSelector(
    (state: any) => state.estimate
  );
  const { clientsData } = useSelector((state: any) => state.client);
  const { locationsData } = useSelector((state: any) => state.location);
  const workorders = useSelector(
    (state: any) => state.workOrder.allHFWorkordersList?.map(x => ({Number: x.Number, _id: x._id}))
  );
  const status = [
  {value : 'Paid' , label : 'Paid'},
  {value : 'Draft' , label : 'Draft'},
  {value : 'Sent' , label : 'Sent'},
  {value : 'Ready' , label : 'Ready' },
  {value : 'Approved' , label : 'Approved'}
];
  console.log("Workorderlist: ", workorders);

  const { user } = useSelector((state: any) => state.auth);

  const [selectedClient, setSelectedClient] = useState<any>({});
  const [selectedLocation, setSelectedLocation] = useState<any>({});
  const [selectedContact, setSelectedContact] = useState([]);
  const [userDailyRateCostBreakdownIds, setUserDailyRateCostBreakdownIds] = useState<any>([]);
  const [showFileModal,setShowFileModal] = useState(false)
  const [formData,setFormData] = useState<any>()
  const [selectedWorkOrder,setSelectedWorkOrder] = useState<any>({})
  const currentWorkOrder: any = useSelector((state: any) => state.workOrder.workOrderDetail);      
  const currentWO = useSelector((state : any) => state.workOrder)
  console.log(currentWO);
  const clientsList = useSelector(
    (state: any) => state.client.clientsData.clients?.filter(x => x.status == "ACTIVE") 
 );
 const usersList = useSelector((state: any) => state.users.usersList);


  useEffect(() => {
    dispatch(ACTION_getHFWorkOrdersForEstimates());
    dispatch(ACTION_getUsers());
    const woId : string = window.location.pathname.split("/")[3];
    if(!woId){
      dispatch(ACTION_clearWorkOrderDetail())
    }
  }, []);

  useEffect(() => {
    if(Object.keys(currentWorkOrder).length) {
      const client = clientsList?.find(
        (client: any) => client._id === currentWorkOrder?.customer._id
      );
      setSelectedClient(client);
    }
  }, [currentWorkOrder]);

  const initialValues = {
    date: "",
    name: "",
    client: currentWorkOrder?.customer?._id ? currentWorkOrder?.customer?._id : "",
    location: currentWorkOrder?.ShortLocation?.split("\\")[1] && selectedClient?.Spaces?.find(item => item.locationName == currentWorkOrder?.ShortLocation?.split("\\")[1]) ? selectedClient?.Spaces?.find(item => item.locationName == currentWorkOrder?.ShortLocation?.split("\\")[1])._id.toString() : '',
    contact:  currentWorkOrder.Contact ? currentWorkOrder?.Contact.map(item => ({ label: item?.fullName, value: item._id })) : [],
    reference: currentWorkOrder?.TaskRefinement?.replace(/<\/?[^>]+(>|$)/g, "") ? currentWorkOrder?.TaskRefinement?.replace(/<\/?[^>]+(>|$)/g, "") : "",
    workOrderNumber: '',
    amount: "",
    description: "Thank you for this opportunity. If you have any questions or concerns, please do not hesitate to contact me directly at my number below.",
    terms: "",
    quantityField : "1",
    amountField : "",
    lineItems: [],
    workOrderId: currentWorkOrder?._id && currentWorkOrder?._id ,
    status  : "Draft",
    owner: { value: user?._id, label: user?.FirstName+" "+user?.LastName }
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: editEstimatesSchema,
    enableReinitialize : true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmitEstimateForm();
    },
  });

  const totalNumber = formik.values.lineItems?.length > 0 ? formik.values.lineItems.reduce((n, {total,quantity}) =>{
    return n + (Number(quantity ? quantity : 1) * Number(total ? total : 0));
    // @ts-ignore
  }, 0) : formik.values.quantityField * formik.values.amountField;
 
  const handleSubmitEstimateForm = async () => {
    const Contacts = formik.values.contact.reduce((acc, cur) => {
      //@ts-ignore
      acc.push(cur.value);
      return acc;
    },[])
    let reqData = {
      userId: user._id,
      client: formik.values.client,
      total: +totalNumber,
      terms: formik.values.terms,
      contactIds: Contacts,
      description: formik.values.description,
      locationId: formik.values.location,
      userDailyRateCostBreakdownIds,
      date: moment.tz(formik.values.date, user?.userTimezone).tz('UTC'),
      referenceNumber: formik.values.reference,
      workOrderNumber: formik.values.workOrderNumber,
      lineItems: formik.values.lineItems,
      workOrderId: formik.values.workOrderId,
      status : formik.values.status,
      amount : formik.values.lineItems.length > 0 ? 0 : +formik.values.amountField,
      quantity : formik.values.lineItems.length > 0 ? 0 : +formik.values.quantityField,
      ownerId : formik.values.owner?.value
    };
    dispatch(ACTION_postEstimateFormData(reqData,formData,navigate));
    dispatch(ACTION_clearWorkOrderDetail())
  };
  const addLineItem = (values, setValues) => {
    // update dynamic form
    const lineItems = [...values.lineItems];
    lineItems.push({ referenceNumber: "", total: "", terms: "" , quantity : "1" });
    setValues({ ...values, lineItems });
  };
  useEffect(() => {
    if (userDailyCostBreakDownList && userDailyCostBreakDownList.length) {
      const _userDailyRateCostBreakdownIds: any[] = [];
      userDailyCostBreakDownList.forEach((element: any) => {
        _userDailyRateCostBreakdownIds.push(element._id);
      });
      setUserDailyRateCostBreakdownIds(_userDailyRateCostBreakdownIds);
    } else {
      setUserDailyRateCostBreakdownIds([]);
    }
  }, [userDailyCostBreakDownList]);

  const inputHandler = (event: any, editor: any) => {
    formik.setFieldValue("description", editor.getData());
    console.info("----------------------------");
    console.info("data =>", editor.getData().replace(/<[^>]*>/g, ""));
    console.info("data =>", editor.getData());
    console.info("----------------------------");
  };

  const removeLine = (values: any, setValues: any, index: any) => {
    const lineItems = [...values.lineItems];
    lineItems.splice(index, 1);
    setValues({ ...values, lineItems });
  }

  console.log({selectedClient})
  console.log("p-client-data", formik.values.lineItems);
  console.log(formik.values,"values")
  
  const fileUploadHandler = (files) => {
    setShowFileModal(false)
    const file = files;
    const form = new FormData();
    file.map(file => {
      form.append("files", file)
    })
    setFormData(form)
  }

  return (
    <>
     { 
       showFileModal &&
       <FileUploadModalEstimate 
        show={showFileModal}
        handleClose={() => setShowFileModal(false)}
        fileUploadHandler={fileUploadHandler}
       />
     }
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmitEstimateForm}
      validationSchema={editEstimatesSchema}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="fv-row mb-7">
          <Row>
            <Col>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Reference</label>
              <input
                {...formik.getFieldProps("reference")}
                type="text"
                placeholder="Enter reference"
                name="reference"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.reference && formik.errors.reference,
                  },
                  {
                    "is-valid":
                      formik.touched.reference && !formik.errors.reference,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.reference && formik.errors.reference && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.reference as string}</span>
                  </div>
                </div>
              )}
            </div>
            </Col>
          </Row>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Owner</label>
                  <CustomDropdownValue
                    {...formik.getFieldProps("owner")}
                    name="owner"
                    options={usersList?.map((item) => {
                      return {
                        label: item?.FirstName+" "+item?.LastName,
                        value: item?._id,
                      };
                    })}
                    value={formik.values.owner}
                    onChange={(e) => {
                      formik.setFieldValue("owner", e);
                    }}
                  />
                </div>
              </Col>
            </Row>
          <Row>
            <Col>
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Client</label>
                <CustomDropdownValue
                  {...formik.getFieldProps("client")}
                  name="client"
                  className=""
                  options={_get(clientsData, "clients", [])?.filter(x => x.status == "ACTIVE").map((item) => {
                    return {
                      data: item,
                      label: item?.DisplayAs,
                      value: item?._id,
                    };
                  })}
                  value={{
                    label: selectedClient.Name ? selectedClient.Name : currentWorkOrder?.Customer ? currentWorkOrder?.Customer.Name : currentWorkOrder?.customer?.Name,
                      value: currentWorkOrder?.customer?._id
                   }}
                  onChange={(e) => {
                    setSelectedClient(e.data);
                    formik.setFieldValue("client", e.value);
                    formik.setFieldValue("contact", []);
                  }}
                />
                {formik.touched.client && formik.errors.client && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.client as string}</span>
                    </div>
                  </div>
                )}
              </div>
            </Col>

            <Col>
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Date</label>
                <input
                  {...formik.getFieldProps("date")}
                  type="date"
                  name="date"
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    { "is-invalid": formik.touched.date && formik.errors.date },
                    {
                      "is-valid": formik.touched.date && !formik.errors.date,
                    }
                  )}
                  autoComplete="off"
                />
                {formik.touched.date && formik.errors.date && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.date}</span>
                    </div>
                  </div>
                )}
              </div>
            </Col>
           <Row>
             <Col>
                <div className="fv-row mb-7">
                  <label className="required fw-bold fs-6 mb-2">Location</label>
                  <CustomDropdownValue
                    {...formik.getFieldProps("location")}
                    options={selectedClient?.Spaces?.map((item) => {
                      return {
                        value: item?._id,
                        label: item?.locationName,
                      };
                    })}
                    value = {{
                      label: selectedLocation.label ? selectedLocation.label : currentWorkOrder?.ShortLocation?.split("\\")[1],
                        value : currentWorkOrder?.ShortLocation?.split("\\")[1],
                    }}
                    onChange={(e) => {
                      setSelectedLocation(e)
                      formik.setFieldValue("location", e.value);
                    }}
                    />
                  {formik.touched.location && formik.errors.location &&  (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.location as string}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
              <Col>
                  <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2">File</label>
                      <Button onClick={() => setShowFileModal(true)} className="form-control mb-3 mb-lg-0" ><i className="fa fa-cloud-upload" aria-hidden="true"></i> Upload File</Button>
                  </div>
                </Col>
              </Row>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Contact </label>
                  <CustomDropdownMultipleValues
                    {...formik.getFieldProps("contact")}
                     name="contact"
                     className=""
                        //@ts-ignore
                      value={formik.values.contact}
                      options={selectedClient?.Contacts?.reduce((acc, cur) => {
                        //@ts-ignore
                        if(!Array.isArray(formik.values?.contact) && formik.values?.contact?.value?._id != cur?._id) {
                          acc.push({
                            label: cur?.fullName ? cur?.fullName : '',
                            value: cur._id
                          })
                        }
                        else if(!formik.values?.contact?.some(contact => contact?.value?._id == cur?._id)) {
                          acc.push({
                            label: cur?.fullName ? cur?.fullName : '',
                            value: cur._id
                          })
                        }
                        return acc;
                      }, [])}
                      onChange={(e) => {
                        setSelectedContact(e)
                        formik.setFieldValue("contact", e)
                      }}
                 />
              {formik.touched.contact && formik.errors.contact && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.contact as string}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Work Order</label>
              <CustomDropdownValue
                {...formik.getFieldProps("workOrderId")}
                name="workOrderId"
                className=""
                value={{ 
                  label: selectedWorkOrder.label ? selectedWorkOrder.label : currentWorkOrder?.Number ? currentWorkOrder?.Number : '',
                  value : currentWorkOrder?.Number ? currentWorkOrder?.Number : ''
                }}
                  options={workorders?.map((item) => {
                  return {
                    value: item._id,
                    label: item.Number,
                  };
                })}
                onChange={(e) => {
                  setSelectedWorkOrder(e)
                  formik.setFieldValue("workOrderId", e.value);
                }}
              />
              {formik.touched.workOrderId && formik.errors.workOrderId && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.workOrderId as string}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Status</label>
              <CustomDropdown
                {...formik.getFieldProps("status")}
                name="status"
                options={status?.map((item) => {
                  return {
                    value: item.value,
                    label: item.label,
                  };
                })}
                onChange={(e) => {
                  formik.setFieldValue("status", e.value);
                }}
              />
            </div>
            {/* <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Work Order Number</label>
              <input
                {...formik.getFieldProps("workOrderNumber")}
                type="text"
                placeholder="Enter work order number"
                name="workOrderNumber"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.workOrderNumber &&
                      formik.errors.workOrderNumber,
                  },
                  {
                    "is-valid":
                      formik.touched.workOrderNumber &&
                      !formik.errors.workOrderNumber,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.workOrderNumber && formik.errors.workOrderNumber && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.workOrderNumber}</span>
                  </div>
                </div>
              )}
            </div> */}

            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Description</label>
              <CKEditor
                id="inputText"
                type="inline"
                data={formik.values.description}
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.description && formik.errors.description,
                  },
                  {
                    "is-valid":
                      formik.touched.description && !formik.errors.description,
                  }
                )}
                editor={ClassicEditor}
                onChange={inputHandler}
              />

              {formik.touched.description && formik.errors.description && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.description}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Terms</label>

              <CKEditor
                id="inputText"
                type="inline"
                data={formik.values.terms}
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.terms && formik.errors.terms,
                  },
                  {
                    "is-valid":
                      formik.touched.terms && !formik.errors.terms,
                  }
                )}
                editor={ClassicEditor}
                onChange={(event: any, editor: any) => { formik.setFieldValue("terms", editor.getData()); }}
              />

              {formik.touched.terms && formik.errors.terms && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.terms}</span>
                  </div>
                </div>
              )}
            </div>
            {!(formik.values?.lineItems?.length > 0) && (
              <>
              <div className="fv-row mb-7">
                 <label className="required fw-bold fs-6 mb-2">
                         Amount
                  </label>
                  <input
                    {...formik.getFieldProps(`amountField`)}
                    name="amountField"
                    type="text"
                    placeholder="Enter amount"
                    className={"form-control form-control-solid mb-3 mb-lg-0" }
                    autoComplete="off"       
                   />
                    {formik.touched.amountField && formik.errors.amountField && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.amountField}</span>
                        </div>
                      </div>
                    )}
              </div>  
              <div className="fv-row mb-7">
                 <label className="required fw-bold fs-6 mb-2">
                         Quantity
                  </label>
                   <input
                      {...formik.getFieldProps(`quantityField`)}
                      name="quantityField"
                      type="text"
                      placeholder="Enter quantity"
                      className={"form-control form-control-solid mb-3 mb-lg-0" }
                      autoComplete="off"    
                     />
                     {formik.touched.quantityField && formik.errors.quantityField && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.quantityField}</span>
                        </div>
                      </div>
                      )}
              </div>
              </>
              )
            }
            <FieldArray name="lineItems">
              {() =>
                formik.values.lineItems.map((lineItem, i) => {
                  const ticketErrors: any =
                    (formik.errors.lineItems?.length &&
                      formik.errors.lineItems[i]) ||
                    {};
                  const ticketTouched: any =
                    (formik?.touched?.lineItems?.length &&
                      formik.touched.lineItems[i]) ||
                    {};
                  return (
                    <div key={i}>
                      {formik.values.lineItems.length && <hr />}
                      <div>
                        
                        <div className="fv-row mb-7">
                          <label className="required fw-bold fs-6 mb-2">
                            Line Item Detail
                          </label>
                          <input
                            {...formik.getFieldProps(
                              `lineItems.${i}.referenceNumber`
                            )}
                            name={`lineItems.${i}.referenceNumber`}
                            type="text"
                            placeholder="Enter reference"
                            className={
                              "form-control form-control-solid mb-3 mb-lg-0" +
                              (ticketErrors?.referenceNumber &&
                              ticketTouched?.referenceNumber
                                ? " is-invalid"
                                : "")
                            }
                            autoComplete="off"
                          />
                          {ticketErrors?.referenceNumber &&
                            ticketTouched?.referenceNumber && (
                              <div className="fv-plugins-message-container">
                                <div className="fv-help-block">
                                  <span role="alert">
                                    {ticketErrors?.referenceNumber}
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                        <div className="fv-row mb-7">
                          <label className="required fw-bold fs-6 mb-2">
                            Amount
                          </label>
                          <input
                            {...formik.getFieldProps(`lineItems.${i}.total`)}
                            name={`lineItems.${i}.total`}
                            type="text"
                            placeholder="Enter amount"
                            className={
                              "form-control form-control-solid mb-3 mb-lg-0" +
                              (ticketErrors?.total && ticketTouched?.total
                                ? " is-invalid"
                                : "")
                            }
                            autoComplete="off"
                          />
                          {ticketErrors?.total && ticketTouched?.total && (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                <span role="alert">{ticketErrors?.total}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="fv-row mb-7">
                          <label className="required fw-bold fs-6 mb-2">
                          Quantity
                          </label>
                          <input
                            {...formik.getFieldProps(`lineItems.${i}.quantity`)}
                            name={`lineItems.${i}.quantity`}
                            type="text"
                            placeholder="Enter quantity"
                            className={"form-control form-control-solid mb-3 mb-lg-0" }
                            autoComplete="off"
                          />
                        </div>
                        <div className="fv-row mb-7">
                          <label className="required fw-bold fs-6 mb-2">
                            Terms
                          </label>
                          <CKEditor
                            id="inputText"
                            type="inline"
                            data={formik.values.lineItems[i]["terms"]}
                            className={
                              "form-control form-control-solid mb-3 mb-lg-0" +
                              (ticketErrors?.terms && ticketTouched?.terms
                                ? " is-invalid"
                                : "")
                            }
                            editor={ClassicEditor}
                            onChange={(event: any, editor: any) => { formik.setFieldValue(`lineItems.${i}.terms`, editor.getData()); }}
                          />
                          {ticketErrors?.terms && ticketTouched?.terms && (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                <span role="alert">{ticketErrors?.terms}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-end">
                          <button type="button" onClick={e => {removeLine(formik.values, formik.setValues, i)}} className="btn btn-primary">Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </FieldArray>
          </Row>
          
            <hr />
            <Row>
              <Col xs={6} md={6} lg={6}>
                <label className="required fw-bold fs-6 mb-2">Total Amount</label>
                <p className="fs-1">
                  {currencyConverter(totalNumber)}
                  </p>
                {formik.touched.amount &&
                  typeof formik.errors.amount === "string" &&
                  formik.errors.amount && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.amount}</span>
                      </div>
                    </div>
                  )}
              </Col>
              <Col xs={6} md={3} lg={3}></Col>
              <Col xs={6} md={3} lg={3}>
                <p className="fw-bold fs-6 mb-2 text-end">&nbsp;</p>
                <div className="input-icon text-end">
                  <button
                    onClick={() => addLineItem(formik.values, formik.setValues)}
                    type="button"
                    className="btn btn-success"
                    style={{
                      outline: "none",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    Add Line
                  </button>
                </div>
            </Col>
          </Row>

          <div className="text-end pt-15">
            <button
              type="reset"
              className="btn btn-light me-3"
              data-kt-users-modal-action="cancel"
              onClick={() => {
                navigate("/estimates/list");
              }}
            >
              Discard
            </button>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </Formik>
    </>
  );
};

export default EstimationForm;
