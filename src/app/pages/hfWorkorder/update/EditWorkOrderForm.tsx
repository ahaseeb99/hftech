import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { FieldArray, useFormik } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import moment from "moment";
import _find from "lodash/find";
import { useNavigate } from "react-router-dom";
// import { ACTION_postWorkOrder } from "../../../../store/workOrder/actions"
import { Col, Form, Row, Table } from "react-bootstrap";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import { ACTION_getHFWorkOrderByIdAPI, ACTION_getWorkOrdersFlags, ACTION_getWorkOrdersLabels, ACTION_getWorkOrderStatus, ACTION_updateWorkOrder } from "../../../../store/workorder/actions";
import { PriorityDropdownData } from "../create/WorkOrderForm";
import { ACTION_getClients } from "../../../../store/client/actions";
import { ACTION_getUsers } from "../../../../store/users/actions";
import CustomDropdownMultipleValues from "../../../../components/CustomDropDownMultipleValues/CustomDropDownMultipleValues";
import CustomDropdownValue from "../../../../components/CustomDropDrownValue/CustomDropDrownValue";
import CustomCreateAbleDropdown from "../../../../components/CreateAbleDropDown";
import { timeZoneConvertForInput } from "../../../../utils/helpers";

const editWorkOrdersSchema = Yup.object().shape({
  // status: Yup.string().required("Status is required"),
  // wo: Yup.string().required("WO# is required"),
  // po: Yup.string(),
  // space: Yup.string().required("Space is required"),
  // scheduleTo: Yup.date().required("Date is required"),
  // priority: Yup.string().required("Priority is required"),
  // flag: Yup.string().required("Flag is required"),
  ContactName: Yup.array().required("Contact is required"),
  description: Yup.string().required("Description is required"),
  tasks: Yup.array().of(
    Yup.object().shape({
        name: Yup.string().required("Name is required"),
        description: Yup.string(),
        dueDate :  Yup.string().nullable(),
        status: Yup.string().required("Status is required"),
        assignedTo: Yup.array()
      })
    )
  // assignTo: Yup.string().required("Assign Employee name is required"),
});

const EditWorkOrderForm: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const { user } = useSelector((state: any) => state.auth);
  const [currentClient, setCurrentClient] = useState<any>({})
  const [flag,setFlag] = useState<any>({})
  const [labelCategories,setLabelCategories] = useState<any>([])
  const [isUpdated,setIsUpdated] = useState({
    client: false
  })
  const usersList = useSelector((state: any) => state.users.usersList);
  const currentWorkOrder: any = useSelector(
    (state: any) => state.workOrder.workOrderDetail
  );
  const clientsList = useSelector(
    (state: any) => state.client.clientsData.clients
  );

useEffect(()=>{
  const id = window.location.pathname.split("/")[3];
  dispatch(ACTION_getHFWorkOrderByIdAPI(id));
  dispatch(ACTION_getClients());
  dispatch(ACTION_getUsers());
  dispatch(ACTION_getWorkOrdersFlags())
  dispatch(ACTION_getWorkOrderStatus())
  dispatch(ACTION_getWorkOrdersLabels())
}, [])
const statusDropdownData = useSelector((state : any) => state.workOrder.workOrderStatus)
const { workOrderFlags: flagDropdownData, workOrderLabel: labelDropdownData } = useSelector((state : any) => state.workOrder)

useEffect(()=>{
  if(currentWorkOrder.hasOwnProperty('customer')){
    const client = clientsList?.find(client => client._id === currentWorkOrder?.customer?._id);
    setCurrentClient(client)
  } else {
    const client = clientsList?.find(client => client.DisplayAs === currentWorkOrder?.Customer?.DisplayAs);
    setCurrentClient(client)
  }
  
},[currentWorkOrder, clientsList])

console.log({currentWorkOrder})
console.log({clientsList})
console.log({currentClient})

const scheduleToFormat = moment.tz(currentWorkOrder?.ScheduledStartUtc, 'UTC');

console.log(user.userTimezone);
console.log("utc", currentWorkOrder?.ScheduledStartUtc)
console.log("india: ", scheduleToFormat.tz(user.userTimezone).format())
console.log("phoneix: ", scheduleToFormat.tz('America/Phoenix').format())
console.log("los angeles: ", scheduleToFormat.tz('America/Los_Angeles').format())

const StartFormat = moment.tz(currentWorkOrder?.startDtUtc, user.userTimezone ? user.userTimezone : 'UTC');
const StopFormat = moment.tz(currentWorkOrder?.endDtUtc, user.userTimezone ? user.userTimezone : 'UTC');

  const formik = useFormik({
    
    initialValues: {
      status: currentWorkOrder?.StatusId ? {
        label: currentWorkOrder?.StatusId,
        value: currentWorkOrder?.StatusId
      } : {},
      wo: currentWorkOrder?.Number,
      po: currentWorkOrder?.PoNumber,
      space: {
        label : currentWorkOrder?.ShortLocation?.split("\\")[1]
      },
      scheduleTo: currentWorkOrder?.ScheduledStartUtc
      ? scheduleToFormat?.tz(user?.userTimezone).format("YYYY-MM-DDTHH:mm:ss")
      : "",
      priority: currentWorkOrder?.Priority ? {
        label: currentWorkOrder?.Priority?.label,
        value: currentWorkOrder?.Priority?.Id
      } : {},
      workStart  : currentWorkOrder?.startDtUtc
      ? StartFormat?.tz(user?.userTimezone).format("YYYY-MM-DDTHH:mm:ss")
      : "",
      workStop : currentWorkOrder?.endDtUtc
      ? StopFormat?.tz(user?.userTimezone).format("YYYY-MM-DDTHH:mm:ss")
      : "",
      flag: currentWorkOrder?.Flag,
      description: currentWorkOrder?.TaskRefinement,
      ContactName: currentWorkOrder?.Contact?.length >  0 ? currentWorkOrder?.Contact : currentWorkOrder.ContactName ? [{ value: currentWorkOrder.ContactName, label: currentWorkOrder.ContactName }] : [],
      employee: currentWorkOrder.employee?.length > 0 ? currentWorkOrder?.employee : currentWorkOrder?.Employee?.DisplayAs ? [{value : currentWorkOrder?.Employee?.DisplayAs , label : currentWorkOrder?.Employee?.DisplayAs}] : [],
      client: currentWorkOrder?.Customer ? currentWorkOrder?.Customer : currentWorkOrder?.customer,
      labels : currentWorkOrder?.Labels ? currentWorkOrder?.Labels : [],
      billTo :  currentWorkOrder?.BillTo ? {value : currentWorkOrder?.BillTo?._id , label : currentWorkOrder?.BillTo?.DisplayAs} : {},
      tasks: currentWorkOrder?.Tasks || [],
      labelCategories: currentWorkOrder?.LabelCategories || []
    },
    validationSchema: editWorkOrdersSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmitWorkOrderForm();
    },
  });

  const handleSubmitWorkOrderForm = async () => {
    let spaceFormat;
    if(typeof(formik.values.client) == 'object' && !isUpdated.client){
      spaceFormat =  formik.values?.client?.DisplayAs + "\\" + formik.values.space?.label || ""
    } else {
      const client = clientsList?.find(client => client._id === formik.values.client.value);
      spaceFormat = client?.DisplayAs + "\\" + formik.values.space?.label || ""
    }     
    
    const ScheduledStartUtc = moment.tz(formik.values.scheduleTo, user.userTimezone).tz('UTC');
    const startDtUtc = moment.tz(formik.values.workStart, user.userTimezone).tz('UTC');
    const endDtUtc = moment.tz(formik.values.workStop, user.userTimezone).tz('UTC');
    const filteFlag = flagDropdownData?.filter(item =>  formik.values?.flag?.map(flag => flag.value).includes(item.value))
    const filterPriority = PriorityDropdownData.find(item => item.Id == formik.values.priority.value)

    let reqData = {
      _id: currentWorkOrder?._id,
      userId: user._id,
      StatusId: formik.values.status?.value,
      Number: formik.values.wo,
      startDtUtc : startDtUtc,
      endDtUtc  : endDtUtc,
      PoNumber: formik.values.po,
      ShortLocation: spaceFormat,
      ScheduledStartUtc: ScheduledStartUtc,
      Priority: filterPriority,
      Flag: filteFlag,
      TaskRefinement: formik.values.description,
      Labels : formik.values.labels,
      BillTo : formik.values?.billTo?.value || null,
      Tasks:  formik?.values?.tasks?.map((item: any) => ({ ...item, ["assignedTo"]: item?.assignedTo?.map(item => item?.value ? item?.value : item._id) })),
      LabelCategories: formik.values.labelCategories
    };
    if(currentWorkOrder?.Contact?.length > 0) reqData['Contact'] = formik.values?.ContactName.map(contact => contact?._id)
    if(!(currentWorkOrder?.Contact?.length > 0) && formik.values?.ContactName[0]?.value == currentWorkOrder?.ContactName) reqData['ContactName'] = formik.values?.ContactName[0]?.value
    if(!(currentWorkOrder?.Contact?.length > 0) && formik.values?.ContactName[0]?.value != currentWorkOrder?.ContactName) reqData['Contact'] = formik.values?.ContactName?.map(val => val._id)
 
    if(currentWorkOrder.hasOwnProperty('Employee') && (JSON.stringify(currentWorkOrder?.Employee?.DisplayAs) === JSON.stringify(formik.values?.employee[0]?.value)) ) {
      reqData['Employee'] = currentWorkOrder.Employee;
    }

    if((JSON.stringify(currentWorkOrder?.Employee?.DisplayAs) !== JSON.stringify(formik.values?.employee[0]?.value)) && (formik.values?.employee != undefined) ) {
      reqData['employee'] = formik.values?.employee.map(item => item?.value)
    }
    if(typeof(formik.values.client) == 'object' && !isUpdated.client){
      reqData['Customer'] = formik.values.client
    } else {
      reqData['customer'] = formik.values.client.value
    }
    dispatch(ACTION_updateWorkOrder(reqData, navigate))
    // dispatch(ACTION_postWorkOrder(reqData, navigate))
  };

  const inputHandler = (event: any, editor: any) => {
    // formik.setFieldValue(
    //   "description",
    //   editor.getData().replace(/<[^>]*>/g, "")
    // );

    formik.setFieldValue("description", editor.getData());

    console.info("----------------------------");
    console.info("data =>", editor.getData().replace(/<[^>]*>/g, ""));
    console.info("data =>", editor.getData());
    console.info("----------------------------");
  };



  const handleLabels = (checked: boolean, value: string, categories, indexNo) => {
    var updatedList = [...formik.values.labels];
    if (checked) {
      updatedList = [...formik.values.labels, value];
      if (categories.length > 0) setLabelCategories([...labelCategories, { [`${indexNo}`]: categories }])
    } else {
      formik.setFieldValue("labelCategories", []);
      updatedList?.splice(formik.values.labels?.indexOf(value), 1);
      const FilterlabelCategories = labelCategories.filter(item => !(indexNo in item))
      setLabelCategories([...FilterlabelCategories])
    }
    formik.setFieldValue("labels", updatedList);
  }

  const handleLabelCategories = (checked,value : string) => {
    var updatedList = [...formik.values.labelCategories]
    if (checked) updatedList = [...updatedList, value];
    else   updatedList.splice(formik.values.labelCategories.indexOf(value), 1);
    formik.setFieldValue("labelCategories", [...updatedList]);
  }

  const handleAddTask = (values, setValues) => {
    const tasks = [...values.tasks];
    tasks.push({ name: "", description: "", dueDate: "", status: "New", assignedTo: [], workStart: "", workStop: "", scheduledStart: "" });
    setValues({ ...values, tasks });
  } 
  
  
  const handleRemoveTasks = (values: any, setValues: any, index: any) => {
    const tasks = [...values.tasks];
    tasks.splice(index, 1);
    setValues({ ...values, tasks });
  }
   
  useEffect(() => {
    const selectedValues =  labelDropdownData?.reduce((acc, cur) => {
      if (formik.values?.labels?.includes(cur?.label)) {
        acc.push({[`${cur?._id}`] : cur["Categories"]})
      }
      return acc
    },[])
    if(selectedValues?.length > 0){
      setLabelCategories([...selectedValues])
    }
  },[labelDropdownData,formik.values?.labels])

  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <div className="fv-row mb-7">
        <Row>
          <div className="fv-row mb-7">
            <label className="fw-bold fs-6 mb-4">Label</label>
            <Form>
              {/* @ts-ignore */}
              {[...new Set([...labelDropdownData?.map(item => item?.label) || [],...formik.values?.labels])]?.map((label,index) => (
                <div key={`inline-${label}`} className="mb-3 d-inline-block">
                  <Form.Check
                    inline
                    label={label}
                    checked={formik.values?.labels?.includes(label)}
                    name={label}
                    onChange={e => handleLabels(e.target.checked,label,labelDropdownData[index]["Categories"],labelDropdownData[index]["_id"])}
                    id={`inline-${label}`}
                  />
                </div>
              ))}
            </Form>
            <Form>
              {[...labelCategories]?.map((item: any) => Object.entries(item)?.map(([k, v]) => v)?.flat())?.flat()?.map((item: any, index) => {
                return (
                  <div key={`inline-${item.label}`} className="my-3 d-inline-block">
                    <Form.Check
                      inline
                      label={item.label}
                      name={item.label}
                      id={`inline-${item.label+index}`}
                      checked={[...formik.values.labelCategories].includes(item?.label)}
                    onChange={e => handleLabelCategories(e.target.checked, item?.label)}
                    />
                  </div>
                )
              })}
            </Form>
          </div>
        </Row>
        <Row>
          <Col>
          <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Client</label>
              <CustomDropdownValue
                {...formik.getFieldProps("client")}
                name="client"
                className=""
                value={
                  !isUpdated.client ? {
                    label: currentWorkOrder?.customer ? currentWorkOrder?.customer?.DisplayAs : currentWorkOrder?.Customer?.DisplayAs,
                    value: currentWorkOrder?.customer ? currentWorkOrder?.customer?._id : currentWorkOrder?.Customer?._id, 
                  } : formik.values.client
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
                  formik.setFieldValue("space", '');
                  formik.setFieldValue("ContactName", [])
                  formik.setFieldValue("billTo", '')
                  formik.setFieldValue("client", e);
                  setIsUpdated({ ...isUpdated, ["client"]: true })
                }}
              />
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Status</label>
              <CustomDropdownValue
                {...formik.getFieldProps("status")}
                name="status"
                className=""
                value={formik.values.status}
                options={(statusDropdownData as any).map((item: any) => {
                  return {
                    label: item?.label,
                    value: item?.value,
                  };
                })}
                onChange={(e) => {
                  formik.setFieldValue("status", e);
                }}
              />
            </div>
            <div className="fv-row mb-7">
              <label className=" fw-bold fs-6 mb-2">Work Start</label>
              <input
                  {...formik.getFieldProps("workStart")}
                  type="datetime-local"
                  name="workStart"
                  defaultValue={formik.values.workStart}
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    { "is-invalid": formik.touched.workStart && formik.errors.workStart },
                    {
                      "is-valid": formik.touched.workStart && !formik.errors.workStart,
                    }
                  )}
                  autoComplete="off"
                />
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">WO#</label>
              <input
                {...formik.getFieldProps("wo")}
                type="text"
                placeholder="Enter wo number"
                name="wo"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.wo && formik.errors.wo,
                  },
                  {
                    "is-valid": formik.touched.wo && !formik.errors.wo,
                  }
                )}
                autoComplete="off"
              />
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Bill To </label>
              <CustomDropdownValue
                {...formik.getFieldProps("billTo")}
                name="billTo"
                options={clientsList?.map(item => ({
                  value : item?._id,
                  label : item?.DisplayAs
                }))}
                onChange={(e) => {
                  formik.setFieldValue("billTo", e);
                }}
              />
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">PO#</label>
              <input
                {...formik.getFieldProps("po")}
                type="text"
                placeholder="Enter PO number"
                name="po"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.po && formik.errors.po,
                  },
                  {
                    "is-valid": formik.touched.po && !formik.errors.po,
                  }
                )}
                autoComplete="off"
              />
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Location</label>
              <CustomDropdownValue
                {...formik.getFieldProps("space")}
                name="space"
                className=""
                value={formik.values.space}
                options={currentClient?.Spaces?.map((item: any) => {
                  return {
                    value: item._id,
                    label: item?.locationName,
                  };
                })}
                onChange={(e) => {
                  formik.setFieldValue("space", e);
                }}
              />
            </div>
            <div className="fv-row mb-7">
              <label className=" fw-bold fs-6 mb-2">Schedule To</label>
              <input
                  {...formik.getFieldProps("scheduleTo")}
                  type="datetime-local"
                  name="scheduleTo"
                  defaultValue={formik.values.scheduleTo}
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    { "is-invalid": formik.touched.scheduleTo && formik.errors.scheduleTo },
                    {
                      "is-valid": formik.touched.scheduleTo && !formik.errors.scheduleTo,
                    }
                  )}
                  autoComplete="off"
                />
              {/* <input
                {...formik.getFieldProps("scheduleTo")}
                type="date"
                // value={new Date(currentWorkOrder?.scheduleTo)}
                name="scheduleTo"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.scheduleTo && formik.errors.scheduleTo,
                  },
                  {
                    "is-valid":
                      formik.touched.scheduleTo && !formik.errors.scheduleTo,
                  }
                )}
                autoComplete="off"
              /> */}
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Assign To</label>
              <CustomDropdownMultipleValues
                {...formik.getFieldProps("Employee")}
                name="Employee"
                value={formik?.values?.employee?.length > 0 ? 
                  formik.values?.employee?.map(item => ({
                    label : item?.FirstName ? item?.FirstName : item?.label,
                    value : item?._id ? item?._id : item?.value
                  })) : []
                }
                options={usersList?.map((item: any) => {
                  return {
                    label: item?.FirstName,
                    value: item?._id,
                  };
                })}
                onChange={(e) => {
                  const filterEmployee = e?.filter(item => item?.value !== currentWorkOrder?.Employee?.DisplayAs)
                  formik.setFieldValue("employee", filterEmployee);
                }}
              />
            </div>
          </Col>

          <Col>
            <div className="fv-row mb-7">
              <label className=" fw-bold fs-6 mb-2">Priority</label>
              <CustomDropdownValue
                {...formik.getFieldProps("priority")}
                name="priority"
                className=""
                value={formik.values.priority}
                options={(PriorityDropdownData as any).map((item: any) => {
                  return {
                    data: item,
                    label: item?.label,
                    value: item?.Id,
                  };
                })}
                onChange={(e) => {
                  formik.setFieldValue("priority", e);
                }}
              />
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Flag</label>
              <CustomDropdownMultipleValues
                    {...formik.getFieldProps("flag")}
                     value={ formik.values?.flag?.length > 0 ?
                      formik.values?.flag?.map(item => ({
                       value: item.value,
                       label: item.label ? item.label : item.DisplayAs
                      })) : flag?.label ? flag : []
                    }
                    name="flag"
                    options={flagDropdownData?.map((item: any) => {
                      return {
                        label: item?.DisplayAs,
                        value: item?.value,
                      };
                    })}
                    onChange={(e) => {
                      const flag = e?.reduce((acc,cur) => {
                        if(cur?.value && cur?.value != "0"){
                          acc.push(cur)
                        } else {
                          setFlag(cur)
                        }
                        return acc
                      },[])
                      formik.setFieldValue("flag", flag);
                    }}
                  />
              
            </div>
            <div className="fv-row mb-7">
              <label className=" fw-bold fs-6 mb-2">Work End</label>
              <input
                  {...formik.getFieldProps("workStop")}
                  type="datetime-local"
                  name="workStop"
                  defaultValue={formik.values.workStop}
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    { "is-invalid": formik.touched.workStop && formik.errors.workStop },
                    {
                      "is-valid": formik.touched.workStop && !formik.errors.workStop,
                    }
                  )}
                  autoComplete="off"
                />
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Task</label>
              {/* <textarea
                {...formik.getFieldProps("description")}
                placeholder="Terms"
                name="description"
                rows={3}
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
                autoComplete="off"
              ></textarea> */}
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
              <label className="required fw-bold fs-6 mb-2">Contact Name</label>
              <CustomDropdownMultipleValues
                {...formik.getFieldProps("ContactName")}
                name="ContactName"
                value={formik.values.ContactName.length > 0 ? formik.values.ContactName?.map(_item => ({
                  label: _item?.fullName ? _item?.fullName : _item.label,
                  value: _item
                })) : []}
                className=""
                options={currentClient?.Contacts?.reduce((acc, cur) => {
                  if(!Array.isArray(formik.values?.ContactName) && formik.values?.ContactName?._id != cur?._id) {
                    acc.push({
                      label: cur?.fullName ? cur?.fullName : '',
                      value: cur
                    })
                  }
                  else if(!formik.values?.ContactName?.some(contact => contact?._id == cur?._id)) {
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
                  formik.setFieldValue("ContactName",selectedContacts);
                }}
              />
                {formik.touched.ContactName && formik.errors.ContactName && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">Contact is required</span>
                      </div>
                    </div>
                  )}
            </div>
          </Col>
        </Row>
        
        <Row>
          <h2 className="fs-4 mb-5 mt-5">Assign To Details</h2>
          <Table bordered responsive className="workorder-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {(formik.values.employee.length > 0) ?
                usersList.filter(item => formik.values?.employee?.map(val => val?._id ? val?._id : val?.value)?.includes(item?._id))?.map(user => (
                  <tr>
                    <td>{user?.FirstName + " " + user?.LastName}</td>
                    <td>{user?.title}</td>
                    <td><a href={`tel:${user?.contact}`}>{user?.contact}</a></td>
                    <td><a href={`mailto:${user?.email}`}>{user?.email}</a></td>
                  </tr>
                )) : ''
              }
            </tbody>
          </Table>
        </Row>
        <div>
              {formik.values.tasks?.map((_, i) => {
                const ticketErrors: any =
                  (formik.errors.tasks?.length &&
                    formik.errors.tasks[i]) ||
                  {};
                const ticketTouched: any =
                    // @ts-ignore
                  (formik?.touched?.tasks?.length &&
                    formik.touched.tasks[i]) ||
                  {};
                return(
                <div key={`tasks ${i}`}>
                <hr />
                  <Row className="my-10 pt-2">
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2 required">Task Name</label>
                      <input
                        {...formik.getFieldProps(
                          `tasks.${i}.name`
                        )}
                        type="text"
                        placeholder="Enter Task Name"
                        name={`tasks.${i}.name`}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                        )}
                        autoComplete="off"
                      />
                        {ticketErrors?.name &&
                          ticketTouched?.name && (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                <span role="alert">
                                  {ticketErrors?.name}
                                </span>
                              </div>
                            </div>
                          )}
                    </div>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2">Description</label>
                      <input
                        type="text"
                        {...formik.getFieldProps(
                          `tasks.${i}.description`
                        )}
                        placeholder="Description"
                        name={`tasks.${i}.description`}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                        )}
                        autoComplete="off"
                      />
                    </div>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2">Due Date</label>
                      <input
                        {...formik.getFieldProps(
                          `tasks.${i}.dueDate`
                        )}
                        value={formik.values.tasks[i]?.dueDate ? moment?.tz(formik.values.tasks[i]?.dueDate,user?.userTimezone).format("YYYY-MM-DDTHH:mm:ss") : "t"}
                        type="datetime-local"
                        name={`tasks.${i}.dueDate`}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                        )}
                        autoComplete="off"
                      />
                    </div>
                    <div className="fv-row mb-7">
                        <label className="fw-bold fs-6 mb-2 required">Status</label>
                        <CustomCreateAbleDropdown
                          {...formik.getFieldProps(
                            `tasks.${i}.status`
                          )}
                          value={{
                            label : formik.values.tasks[i]?.status,
                            value: formik.values.tasks[i]?.status
                          }}
                          name={`tasks.${i}.status`}
                          options={["New", "In Progress", "Completed", "Deleted"]?.map(item => (
                            {
                              value: item,
                              label: item
                            }
                          ))}
                          onChange={e => formik.setFieldValue(`tasks.${i}.status`,e.value)}
                        />
                         {ticketErrors?.status &&
                          ticketTouched?.status && (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                <span role="alert">
                                  {ticketErrors?.status}
                                </span>
                              </div>
                            </div>
                          )}
                    </div>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2">Scheduled Start</label>
                      <input
                        {...formik.getFieldProps(
                          `tasks.${i}.scheduledStart`
                        )}
                        value={formik.values.tasks[i]?.scheduledStart ? timeZoneConvertForInput(formik.values.tasks[i]?.scheduledStart,user.userTimezone) : ""}
                        type="datetime-local"
                        name={`tasks.${i}.scheduledStart`}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                        )}
                        autoComplete="off"
                      />
                    </div>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2">Work Start</label>
                      <input
                        {...formik.getFieldProps(
                          `tasks.${i}.workStart`
                        )}
                        value={formik.values.tasks[i]?.workStart ? timeZoneConvertForInput(formik.values.tasks[i]?.workStart,user.userTimezone) : ""}
                        type="datetime-local"
                        name={`tasks.${i}.workStart`}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                        )}
                        autoComplete="off"
                      />
                    </div>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2">Work Stop</label>
                      <input
                        {...formik.getFieldProps(
                          `tasks.${i}.workStop`
                        )}
                        value={formik.values.tasks[i]?.workStop ? timeZoneConvertForInput(formik.values.tasks[i]?.workStop,user.userTimezone) : ""}
                        type="datetime-local"
                        name={`tasks.${i}.workStop`}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                        )}
                        autoComplete="off"
                      />
                    </div>
                    <div className="fv-row mb-7">
                        <label className="fw-bold fs-6 mb-2">Assigned To</label>
                        <CustomDropdownMultipleValues
                          {...formik.getFieldProps(`tasks.${i}.assignedTo`)}
                          name={`tasks.${i}.assignedTo`}
                          value={formik.values.tasks[i]?.assignedTo?.length > 0 ?  
                            formik.values.tasks[i]?.assignedTo?.map((item : any) => ({
                              label : item.FirstName || item.label,
                              value: item._id || item.value
                            }))
                          : []}
                          options={usersList?.map((item: any) => {
                            return {
                              label: item?.FirstName,
                              value: item?._id,
                            };
                          })}
                          onChange={(e) => {
                            formik.setFieldValue(`tasks.${i}.assignedTo`, e);
                          }}
                        />
                      </div>
                    <div className="text-end">
                      <button type="button" onClick={e => { handleRemoveTasks(formik.values, formik.setValues, i) }} className="btn btn-primary">Delete</button>
                    </div>
                  </Row>
                </div>

              )})}
            </div>
            <div className="w-100 d-flex justify-content-end">
              <button 
                onClick={() => handleAddTask(formik.values, formik.setValues)}
                type="button"
                className="btn btn-success"
              >
                Add Task
              </button>
            </div>
        <div className="text-end pt-15">
          <button
            type="reset"
            className="btn btn-light me-3"
            data-kt-users-modal-action="cancel"
            onClick={() => {
              navigate(`/order/view/${currentWorkOrder._id}`);
            }}
          >
            Cancel
          </button>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditWorkOrderForm;
