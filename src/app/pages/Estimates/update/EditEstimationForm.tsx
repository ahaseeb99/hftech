import React, { useEffect, useState, useRef } from "react";
import { array, date, number, object, string } from "yup";
import { FieldArray, useFormik, Formik } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import { useNavigate } from "react-router-dom";
import {
  ACTION_getEstimate,
  ACTION_getEstimateById,
  ACTION_postEstimate,
  ACTION_updateEstimate,
} from "../../../../store/estimate/actions";
import _ from "lodash";
import { Col, FormControl, Row } from "react-bootstrap";
import moment from "moment";
import { stringOrDate } from "react-big-calendar";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import { ACTION_getLocationList } from "../../../../store/location/actions";
import {
  ACTION_getClientById,
  ACTION_getClients,
} from "../../../../store/client/actions";
import { currencyConverter, timezoneDateConverter, timezoneDateRequiredFormat } from "../../../../utils/helpers";
import { ACTION_getHFWorkOrdersForEstimates } from "../../../../store/workorder/actions";
import CustomDropdownMultipleValues from "../../../../components/CustomDropDownMultipleValues/CustomDropDownMultipleValues";
import CustomDropdownValue from "../../../../components/CustomDropDrownValue/CustomDropDrownValue";
import { ACTION_getUsers } from "../../../../store/users/actions";

const editEstimatesSchema = object().shape({
  date: date().required("Date is required"),
  client: string().required("Client is required"),
  locationId: string().required("Location is required"),
  // contact: string().required("Contact is required"),
  description: string(),
  amount: number()
    .typeError("Only numbers are allowed")
    .required("Amount is required"),
   quantityField : number()
    .typeError("Only numbers are allowed"), 
  amountField : number()
    .typeError("Only numbers are allowed"),
  terms: string(),
  reference: string(),
  workOrderNumber: string(),
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
  const locationsList = useSelector(
    (state: any) => state.location.locationsData.locations
  );

  const { user } = useSelector((state: any) => state.auth);

  const [userDailyRateCostBreakdownIds, setUserDailyRateCostBreakdownIds] =
    useState<any>([]);

  const [currentClient, setCurrentClient] = useState<any>({});
  const [estimateCopy, setEstimateCopy] = useState<boolean>(false);
  const clientsList = useSelector(
    (state: any) => state.client.clientsData.clients?.filter(x => x.status == "ACTIVE")
  );
  const currentEstimate = useSelector(
    (state: any) => state.estimate.estimateDetail
  );

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


  useEffect(() => {
    const id = window.location.pathname.split("/")[3];
    const type = window.location.pathname.split("/")[2];
    if(type === 'copy') setEstimateCopy(true)
    dispatch(ACTION_getEstimateById(id));
    dispatch(ACTION_getLocationList());
    dispatch(ACTION_getClients());
    dispatch(ACTION_getHFWorkOrdersForEstimates());
    dispatch(ACTION_getUsers());
  }, []);

 const usersList = useSelector((state: any) => state.users.usersList);

  useEffect(() => {
    if(Object.keys(currentEstimate).length) {
      const client = clientsList?.find(
        (client: any) => client._id === currentEstimate?.client?._id
      );
      setCurrentClient(client);
    }
  }, [currentEstimate]);

  const date = timezoneDateRequiredFormat(currentEstimate?.date, user.userTimezone)
  const initialValues = {
    date: currentEstimate?.date
      ? date
      : "",
    name: "",
    quantityField : currentEstimate?.quantity ? currentEstimate?.quantity  : "1",
    amountField  :  currentEstimate?.amount ? currentEstimate?.amount  :  currentEstimate?.total,
    client: currentEstimate?.client?._id ? currentEstimate?.client?._id : "",
    locationId: currentEstimate?.locationId
      ? currentEstimate?.locationId?._id
      : "",
    contact: currentEstimate?.contactIds ? currentEstimate?.contactIds : [],
    reference: currentEstimate?.referenceNumber
      ? estimateCopy ?  `${currentEstimate?.referenceNumber} - copy` : currentEstimate?.referenceNumber
      : "",
    workOrderNumber: currentEstimate?.workOrderNumber
      ? currentEstimate?.workOrderNumber
      : "",
    amount: currentEstimate?.total ? currentEstimate?.total : 0,
    description: currentEstimate?.description
      ? currentEstimate?.description
      : "",
    terms: currentEstimate?.terms ? currentEstimate?.terms : "",
    lineItems: currentEstimate?.lineItems ? currentEstimate?.lineItems : [],
    workOrderId: currentEstimate?.workOrderId ? estimateCopy ? '' : currentEstimate?.workOrderId : '',
    status : currentEstimate?.status ? currentEstimate?.status : "",
    ownerId: currentEstimate.ownerId ? { label: currentEstimate?.ownerId?.FirstName + " " + currentEstimate?.ownerId?.LastName, value: currentEstimate.ownerId._id } : { label: currentEstimate?.userId?.FirstName + " " + currentEstimate?.userId?.LastName, value: currentEstimate?.userId?._id } 
  };

  let formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: editEstimatesSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("onSubmit");
      setSubmitting(true);
      handleSubmitEstimateForm();
    },
  });
  
  const handleSubmitEstimateForm = async () => {
    if(!Object.keys(formik.values.contact).length) return

     const estimateDateFormat = moment.tz(formik.values.date, user?.userTimezone).tz('UTC');

    let reqData = {
      _id: currentEstimate._id,
      userId: user._id,
      client: formik.values.client,
      total: +totalNumber,
      terms: formik.values.terms,
      contactIds: formik.values?.contact?.map(contact => contact?._id),
      description: formik.values.description,
      locationId: formik.values.locationId,
      userDailyRateCostBreakdownIds,
      date: estimateDateFormat,
      referenceNumber: formik.values.reference,
      workOrderNumber: formik.values.workOrderNumber,
      workOrderId: formik.values.workOrderId?.value ? formik.values.workOrderId?.value : formik.values.workOrderId?._id,
      lineItems: formik.values.lineItems,
      status : formik.values.status,
      amount : formik.values.lineItems.length > 0 ? 0 : +formik.values.amountField,
      quantity : formik.values.lineItems.length > 0 ? 0 : +formik.values.quantityField,
      ownerId : formik.values.ownerId.value
    };
     if(!estimateCopy) {
      dispatch(ACTION_updateEstimate(reqData, navigate));
    } else {
      delete reqData['_id'];
      dispatch(ACTION_postEstimate(reqData, navigate));
    }
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

  const addLineItem = (values, setValues) => {
    // update dynamic form
    const lineItems = [...values.lineItems];
    lineItems.push({ referenceNumber: "", total: "", terms: "" ,quantity : "1"});

    setValues({ ...values, lineItems });
  };



  const inputHandler = (event: any, editor: any) => {
    // formik.setFieldValue(
    //   "description",
    //   editor.getData().replace(/<[^>]*>/g, "")
    // );
    formik.setFieldValue("description", editor.getData());
  };

  const removeLine = (values: any, setValues: any, index: any) => {
    const lineItems = [...values.lineItems];
    if(lineItems[index].hasOwnProperty('_id')){
      lineItems[index]['isDeleted'] = true;
    } else {
      lineItems.splice(index, 1);
    }
    setValues({ ...values, lineItems });
  }

  function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a, b) {
      if (sortOrder === -1) {
        return b[property]?.localeCompare(a[property]);
      } else {
        return a[property]?.localeCompare(b[property]);
      }
    };
  }

  const handleLinesCondition = () => {
    return !((formik.values?.lineItems?.length > 0) && (formik.values?.lineItems.filter(line => !line.isDeleted).length > 0))
  }

    
  const totalNumber = !handleLinesCondition() ? formik.values.lineItems.filter(item => !item.isDeleted).reduce((n, {total,quantity}) =>{
    return n + (Number(quantity ? quantity : 1) * Number(total ? total : 0));
  }, 0) : formik.values.quantityField * formik.values.amountField;


  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmitEstimateForm}
      validationSchema={editEstimatesSchema}
    >
      <form className="form" onSubmit={formik.handleSubmit}>
        <div className="fv-row mb-7">
          <Row><Col>
          <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Reference</label>
              <input
                {...formik.getFieldProps("reference")}
                type="text"
                placeholder="Reference"
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
              {formik.touched.reference &&
                typeof formik.errors.reference === "string" &&
                formik.errors.reference && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.reference}</span>
                    </div>
                  </div>
                )}
            </div>
          </Col></Row>
          <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Owner</label>
                  <CustomDropdown
                    {...formik.getFieldProps("owner")}
                    name="ownerId"
                    options={usersList?.map((item) => {
                      return {
                        label: item?.FirstName+ " "+item?.LastName,
                        value: item?._id,
                      };
                    })}
                    value={formik.values.ownerId}
                    onChange={(e) => {
                      formik.setFieldValue("ownerId", e);
                    }}
                  />
                </div>
              </Col>
            </Row>
          <Row>
            <Col>
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Client</label>
                <CustomDropdown
                {...formik.getFieldProps("client")}
                name="client"
                className=""
                value={
                  {
                    value: currentEstimate?.client?._id,
                    label: currentEstimate?.client?.DisplayAs
                  }
                }
                options={clientsList?.map((item: any) => {
                  return {
                    label: item?.DisplayAs,
                    value: item?._id,
                  };
                })}
                onChange={(e) => {
                  const client = clientsList.find(client => client._id === e.value)
                  setCurrentClient(client)
                  console.log("E",e)
                  formik.setFieldValue("client", e.value);
                  formik.setFieldValue("contact", []);
                  formik.setFieldValue("locationId", '');
                }}
              />
                
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
               
              </div>
            </Col>

            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Location</label>
              <CustomDropdown
                {...formik.getFieldProps("locationId")}
                name="locationId"
                value={
                  formik.values?.locationId ? {
                    value :  currentEstimate?.locationId?._id,
                    label :  currentEstimate?.locationId?.locationName,
                  } : ''
                }
                className=""
                options={currentClient?.Spaces?.map((item: any) => {
                  return {
                    value: item._id,
                    label: item?.locationName,
                  };
                })}
                onChange={(e) => {
                  formik.setFieldValue("locationId", e.value);
                }}
              />
              {formik.touched.locationId &&
                typeof formik.errors.locationId === "string" &&
                formik.errors.locationId && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.locationId}</span>
                    </div>
                  </div>
                )}
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Contact Name</label>
              <CustomDropdownMultipleValues
                {...formik.getFieldProps("ContactName")}
                 name="ContactName"
                 className=""
                 value={
                   Object.keys(formik.values.contact).length > 0 ? 
                    formik.values.contact?.map(_item => ({
                    label: _item?.fullName ? _item?.fullName : '',
                    value: _item
                  }))
                  : []
                }
                 options={currentClient?.Contacts?.reduce((acc, cur) => {
                  if(!Array.isArray(formik.values?.contact) && formik.values?.contact?._id != cur?._id) {
                    acc.push({
                      label: cur?.fullName ? cur?.fullName : '',
                      value: cur
                    })
                  }
                  else if(!formik.values?.contact?.some(contact => contact?._id == cur?._id)) {
                    acc.push({
                      label: cur?.fullName ? cur?.fullName : '',
                      value: cur
                    })
                  }
                  return acc;
                }, [])}
                onChange={(e) => {
                  const selectedContacts = e.reduce((acc, cur) => {
                    acc.push(cur.value);
                    return acc;
                  },[])
                  formik.setFieldValue("contact", [...selectedContacts]);
                }}
              />
              {formik.touched.contact && !Object.keys(formik.values.contact).length && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{'Contact is required'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Work Order</label>
              {estimateCopy ? (
                  <CustomDropdownValue
                    {...formik.getFieldProps("workOrderId")}
                    name="workOrderId"
                    className=""
                    value={{
                      value: formik.values.workOrderId?.value,
                      label: formik.values.workOrderId.label,
                    }}
                    options={workorders?.map((item) => {
                      return {
                        value: item._id,
                        label: item.Number,
                      };
                    })}
                    onChange={(e) => {
                      formik.setFieldValue("workOrderId", e);
                    }}
                  />) :
                  <CustomDropdown
                    {...formik.getFieldProps("workOrderId")}
                    name="workOrderId"
                    className=""
                    value={{
                      value: formik.values.workOrderId?._id,
                      label: formik.values.workOrderId.Number,
                    }}
                    options={workorders?.map((item) => {
                      return {
                        value: item._id,
                        label: item.Number,
                      };
                    })}
                    onChange={(e) => {
                      formik.setFieldValue("workOrderId", e);
                    }
                    } /> 
            }
              {formik.touched.workOrderId && formik.errors.workOrderId && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert"></span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Status</label>
              <CustomDropdown
                {...formik.getFieldProps("status")}
                name="status"
                value={
                    {
                    label: formik.values.status,
                    value: formik.values.status
                  } 
                }
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
                placeholder="Work order number"
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
              {formik.touched.workOrderNumber &&
                typeof formik.errors.workOrderNumber === "string" &&
                formik.errors.workOrderNumber && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.workOrderNumber}</span>
                    </div>
                  </div>
                )}
            </div> */}

            {/* // */}

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
            </div>

            {
              !formik.values.lineItems.includes('isDeleted') && (
                <div></div>
              )
            }
            {handleLinesCondition() && (
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
                            <span role="alert">{formik.errors.amountField as string}</span>
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
                            <span role="alert">{formik.errors.quantityField as string}</span>
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
                    (formik?.touched?.lineItems &&
                      formik.touched.lineItems[i]) ||
                    {};
                  if(!lineItem['isDeleted'] === true){
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
                            className={"form-control form-control-solid mb-3 mb-lg-0"}
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
                                : "")}
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
                          <button type="button" onClick={e => {removeLine(formik.values, formik.setValues, i)}} className="btn btn-danger">Remove Line</button>
                        </div>
                      </div>
                    </div>
                  )};
                })
              }
            </FieldArray>
            </Row>
            <hr />
            <Row>
              <Col xs={6} md={6} lg={6}>
                <label className="required fw-bold fs-6 mb-2">Total Amount</label>
                  <p className="fs-1">
                  {currencyConverter(totalNumber || totalNumber == '0' ? totalNumber : formik.values.amount)}   
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

          <Row>
            <Col xs={6} md={6} lg={6}>
              <div className="text-end pt-15">
                <button
                  className="btn btn-secondary"
                  style={{
                    width: "100%",
                  }}
                  onClick={() => {
                    navigate(`/estimates/view/${currentEstimate?._id}`);
                  }}
                >
                  Cancel
                </button>
              </div>
            </Col>
            <Col xs={6} md={6} lg={6}>
              <div className="text-end pt-15">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                  }}
                >
                  Save
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </form>
    </Formik>
  );
};

export default EstimationForm;
