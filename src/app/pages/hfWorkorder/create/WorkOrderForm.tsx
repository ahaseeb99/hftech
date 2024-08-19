import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik, Formik, FieldArray } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import { useNavigate } from "react-router-dom";
import "react-dropdown-tree-select/dist/styles.css";
import { Col, Row, Button, Form, Table } from "react-bootstrap";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import {
  ACTION_createHFWorkOrder,
  ACTION_getAllHFWorkOrders,
  ACTION_getPropertiesAPI,
  ACTION_getTaskAPI,
  ACTION_getWorkOrdersFlags,
  ACTION_getWorkOrdersLabels,
} from "../../../../store/workorder/actions";
import DropdownTreeSelect from "react-dropdown-tree-select";
import _ from "lodash";
import "../index.css";
import { ACTION_getClients } from "../../../../store/client/actions";
import { ACTION_getLocationList } from "../../../../store/location/actions";
import { ACTION_getUsers } from "../../../../store/users/actions";
import { 
  ACTION_getEstimateById, 
  ACTION_clearEstimate
} from "../../../../store/estimate/actions";
import moment from "moment";
import FileUploadModal from "../view/FileUploadModal";
import CustomDropdownMultipleValues from "../../../../components/CustomDropDownMultipleValues/CustomDropDownMultipleValues";
import CustomCreateAbleDropdown from "../../../../components/CreateAbleDropDown";

const editWorkOrdersSchema = Yup.object().shape({
  // StatusId: Yup.string().required("StatusId is required"),
  // wo: Yup.string().required("WO# is required"),
  // po: Yup.string().required("PO# is required"),
  scheduleTo: Yup.date(),
  ShortLocation: Yup.string().required("location is required"),
  ContactName: Yup.array().required("contact is required"),
  tasks: Yup.array().of(
  Yup.object().shape({
      name: Yup.string().required("Name is required"),
      description: Yup.string(),
      dueDate :  Yup.string(),
      status: Yup.string().required("Status is required"),
      assignedTo: Yup.array()
    })
  )
  // TaskRefinement: Yup.string().required("TaskRefinement is required"),
  // Employee: Yup.string().required("Assign Employee name is required"),
});

export const PriorityDropdownData = [
  {
    label: "Emergency",
    Id: 1,
  },
  {
    label: "Regular",
    Id: 2,
  },
  {
    label: "Low",
    Id: 3,
  }
];

const WorkOrderForm: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const {  assetList, taskList } =
    useSelector((state: any) => state.workOrder);
  const { user } = useSelector((state: any) => state.auth);
  const [Priority, setPriority] = useState("1");
  const [task, setTask] = useState<any>();
  const [taskData, setTaskData] = useState<any>();
  const [currentClient, setCurrentClient] = useState<any>({});
  const [flag, setFlag] = useState<any>({});
  const [assetData, setAssetData] = useState<any[]>([]);
  const [ShortLocation, setShortLocation] = useState<any>();
  const clientsList = useSelector(
    (state: any) => state.client.clientsData.clients?.filter(x => x.status == "ACTIVE")
  );
  const [activeUserList, setActiveUserList] = useState<any>([])
  const locationList = useSelector((state: any) => state.location.locationsData);
  const usersList = useSelector((state: any) => state.users.usersList);
  const [currentEstimateId, setCurrentEstimateId] = useState<any>('undefined');
  const [locations, setLocations] = useState<any[]>();
  const [formData, setFormData] = useState<any>();
  const [error, setError] = useState('');
  const [showFileModal,setShowFileModal] = useState<boolean>(false)
  const [woLabels,setWoLabels] = useState<string[]>([]) 
  const [labelCategories,setLabelCategories] = useState<any>([])
  const [labelCategoriesSelected,setLabelCategoriesSelected] = useState<any>([])

  const { workOrderFlags: flagDropdownData, workOrderLabel: labelDropdownData } = useSelector((state : any) => state.workOrder)
    
  useEffect(() => {
    dispatch(ACTION_getUsers());
    dispatch(ACTION_getPropertiesAPI());
    dispatch(ACTION_getClients());
    dispatch(ACTION_getLocationList())
    dispatch(ACTION_getWorkOrdersFlags())
    dispatch(ACTION_getWorkOrdersLabels())
  }, []);

  const estId : string = window.location.pathname.split("/")[3];
  useEffect(() => {
    if(estId){
      dispatch(ACTION_getEstimateById(estId));
    }
  }, []);
 
  const currentEstimate : any = useSelector(
    (state: any) => state.estimate.estimateDetail
  );
  useEffect(() => {
    if(Object.keys(currentEstimate).length) {
    const client = clientsList?.find(
      (client: any) => client._id === currentEstimate?.client?._id
    );
    setCurrentClient(client)

  }
  }, [currentEstimate]);

  useEffect(()=> {
    const activeUsers = usersList?.filter((user)=> user.status === 'ACTIVE')
    setActiveUserList(activeUsers)
  },[usersList])

  useEffect(() => {
   const locationData = locationList?.filter(loc => { 
    if(loc?.Address) return Object.keys(loc?.Address).length > 0 })
    setLocations(locationData)
  }, [locationList]);

  const fileUploadHandler =async (files) => {
    const file = files;
    setShowFileModal(false)
    const form = new FormData();
    file.map(file => {
      form.append("files", file)
    })
    setFormData(form);
  }

  useEffect(() => {
    let parentArray: any[] = [];
    assetList &&
      assetList.map((asset: any) => {
        if (asset?.Data?.Distance === 1) {
          if (
            asset.Data.Id === ShortLocation?.value &&
            asset.Data.Child.Name === ShortLocation?.label
          ) {
            let parent: {
              label: string;
              value: string;
              checked: boolean;
              children: any[];
            } = {
              label: asset?.Data?.Child?.Name,
              value: asset?.Data?.Id,
              checked: true,
              children: [],
            };
            parentArray.push(parent);
          } else {
            let parent: {
              label: string;
              value: string;
              children: any[];
            } = {
              label: asset?.Data?.Child?.Name,
              value: asset?.Data?.Id,
              children: [],
            };
            parentArray.push(parent);
          }
        }
      });

    let childrenArray: any[] = [];
    parentArray?.length !== 0 &&
      parentArray.map((parent) => {
        assetList.map((asset) => {
          if (
            asset?.Data?.Distance === 2 &&
            asset?.Data?.ParentId === parent?.value
          ) {
            if (
              asset.Data.Child.Id === ShortLocation?.value &&
              asset.Data.Child.Name === ShortLocation?.label
            ) {
              let children: {
                label: string;
                value: string;
                checked: boolean;
              } = {
                label: asset?.Data?.Child?.Name,
                value: asset?.Data?.Child?.Id,
                checked: true,
              };
              childrenArray.push(children);
            } else {
              let children: {
                label: string;
                value: string;
              } = {
                label: asset?.Data?.Child?.Name,
                value: asset?.Data?.Child?.Id,
              };
              childrenArray.push(children);
            }
          }
        });
        parent.children = _.uniqBy(childrenArray, "value");
      });

    setAssetData(parentArray);
  }, [assetList, ShortLocation]);

  useEffect(() => {
    let array: any[] = [];
    taskList &&
      taskList.map((task: any) => {
        let obj = {
          label: task?.Data.DisplayAs,
          value: task?.Data?.Id,
        };
        array.push(obj);
      });
    setTaskData(array);
  }, [taskList]);
  const initialValues = {
    StatusId: "New",
      wo: "",
      po: "",
      scheduleTo: "",
      workStart : "",
      workStop  : "",
      ShortLocation: currentEstimate?.locationId && currentEstimateId ? currentEstimate?.locationId?.locationName : "",
      Priority:  {
        label: "Regular",
        Id: 2,
      },
      Customer: currentEstimate?.client?._id && currentEstimateId ? currentEstimate?.client?._id : "",
      Flag: [],
      TaskRefinement: currentEstimate?.referenceNumber && currentEstimateId
      ? currentEstimate?.referenceNumber
      : "",
      ContactName: currentEstimate?.contactIds ? currentEstimate?.contactIds  : [],
      ContactAddress: "",
      employee: [],
      billTo : "",
      tasks: currentEstimate?.lineItems?.length > 0 ? currentEstimate?.lineItems.map(item => ({ name: item.referenceNumber, description: item?.terms, status: "New", assignedTo: [], workStart: "", workStop: "", scheduledStart: "", dueDate: "", })) : [],
    }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: editWorkOrdersSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmitWorkOrderForm();
    },
  });

  const handleSubmitWorkOrderForm = async () => {
    const Numberformat =
    currentClient?.prefix?.split(/[\s,-]+/)[0].toUpperCase()
      const spaceFormat = currentClient?.Name + "\\" + formik?.values.ShortLocation
    const userId = user._id;
    const StatusId = formik.values.StatusId;
    const Number = Numberformat;
    const customer = formik.values.Customer;
    const poNumber = formik.values.po;
    const ShortLocation = spaceFormat;
    const ScheduledStartUtc = moment.tz(formik.values.scheduleTo, user.userTimezone).tz('UTC');
    const Priority = formik.values.Priority;
    // @ts-ignore
    const Flag = formik.values.Flag.map(item => item?.data);
    const TaskRefinement = formik.values.TaskRefinement;
    const Contact = formik.values.ContactName.map(item => item._id);
    const employee = formik.values.employee ? formik.values.employee.map((item : any) => item?.value) : [];
    const ContactAddress = formik.values.ContactAddress;
    const startDtUtc  = moment.tz(formik.values.workStart, user.userTimezone).tz('UTC');
    const endDtUtc  = moment.tz(formik.values.workStop, user.userTimezone).tz('UTC');
    const EstimateId = estId ? estId : null
    const BillTo = formik.values.billTo ? formik.values.billTo : null
    // @ts-ignore
    const filteFlag = flagDropdownData?.filter(item =>  formik.values?.Flag?.map(flag => flag.value).includes(item.value))
    const Tasks = formik?.values?.tasks?.map((item: any) => ({ ...item, ["assignedTo"]: item?.assignedTo?.map(item => item?.value) }))

    let reqData = {
      userId,
      StatusId,
      Number,
      PoNumber: poNumber,
      customer,
      // ShortLocation,
      startDtUtc,
      endDtUtc,
      ShortLocation,
      ScheduledStartUtc,
      Priority,
      Labels : woLabels,
      Flag : filteFlag,
      TaskRefinement,
      Contact,
      ContactAddress,
      employee,
      EstimateId,
      BillTo,
      Tasks,
      LabelCategories: labelCategoriesSelected
    };  
    console.log({ reqData });
    dispatch(ACTION_createHFWorkOrder(reqData, formData, navigate));
    dispatch(ACTION_clearEstimate());
    navigate('/order/list')
  };

  const inputHandler = (event: any, editor: any) => {
    formik.setFieldValue("TaskRefinement", editor.getData());
  }; 

  const assignObjectPaths = (obj: any, stack: any) => {
    Object.keys(obj).forEach((k) => {
      const node = obj[k];
      if (typeof node === "object") {
        node.path = stack ? `${stack}.${k}` : k;
        assignObjectPaths(node, node.path);
      }
    });
  };
  const onChange = (currentNode, selectedNodes) => {
    console.info("----------------------------");
    console.log("path::", currentNode.path, selectedNodes);
    console.info("----------------------------");
    dispatch(ACTION_getTaskAPI("1260"));
    setShortLocation({
      label: selectedNodes[0]?.label,
      value: selectedNodes[0]?.value,
    });
    formik.setFieldValue("ShortLocation", selectedNodes[0]?.label);
  };

  const handleLabels = (checked: boolean, value: string,categories: any,indexNo : number) => {
    var updatedList = [...woLabels];
    if (checked) {
      updatedList = [...woLabels, value];
      if (categories.length > 0) setLabelCategories([...labelCategories, { [`${indexNo}`]: categories }])
    } else {
      setLabelCategoriesSelected([])
      updatedList.splice(woLabels.indexOf(value), 1);
      const FilterlabelCategories = labelCategories.filter(item => !(indexNo in item))
      setLabelCategories([...FilterlabelCategories])
    }
      setWoLabels(updatedList);
  }
 
  const handleLabelCategories = (checked,value : string) => {
    var updatedList = [...labelCategoriesSelected]
    if (checked) updatedList = [...labelCategoriesSelected, value];
    else   updatedList.splice(woLabels.indexOf(value), 1);
    setLabelCategoriesSelected(updatedList)
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

  return (
    <>
      {
        showFileModal &&
         <FileUploadModal 
         show={showFileModal}
         handleClose={() => setShowFileModal(false)}
          fileUploadHandler={fileUploadHandler}
        />
      }
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmitWorkOrderForm}
      validationSchema={editWorkOrdersSchema}
    >
        <form className="form" onSubmit={formik.handleSubmit}>
          <div className="fv-row mb-7">
            <Row>
              <div className="fv-row mb-7">
                <label className=" fw-bold fs-6 mb-4">Label</label>
                <Form>
                  {labelDropdownData.map(({label,Categories},index) => (
                    <div key={`inline-${label}`} className="my-3 d-inline-block">
                      <Form.Check
                        inline
                        label={label}
                        name={label}
                        id={`inline-${label}`}
                        onChange={e => handleLabels(e.target.checked, label,Categories,index)}
                      />
                    </div>
                  ))}
                </Form>
                <Form>
                  {labelCategories?.map((item: any) => Object.entries(item)?.map(([k, v]) => v)?.flat())?.flat()?.map((item, index) => {
                  return(
                    <div key={`inline-${item.label+index}`} className="my-3 d-inline-block">
                      <Form.Check
                        inline
                        label={item.label}
                        name={item.label}
                        id={`inline-${item.label+index}`}
                        checked={labelCategoriesSelected.includes(item?.label)}
                      onChange={e => handleLabelCategories(e.target.checked, item?.label)}
                      />
                    </div>
                  )})}
                </Form>
              </div>
            </Row>
            <Row>
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Task</label>
                <input
                  style={{
                    backgroundColor: "#F5F8FA",
                    border: "0",
                    outline: "none",
                    height: "43px",
                    borderRadius: "0.475rem",
                    fontWeight: "500",
                    fontSize: "1.1rem",
                    color: "#5E6278",
                    width: "100%",
                  }}
                  {...formik.getFieldProps("TaskRefinement")}
                  name="TaskRefinement"
                  className=""
                  // value={TaskRefinement}
                  type="text"
                  onChange={(e) => {
                    setTask(e);
                    formik.setFieldValue("TaskRefinement", e.target.value);
                  }}
                />
                {formik.touched.TaskRefinement && typeof formik.errors.TaskRefinement === "string" && formik.errors.TaskRefinement && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.TaskRefinement}</span>
                    </div>
                  </div>
                )}
              </div>
            </Row>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="required fw-bold fs-6 mb-2">Client</label>
                  <CustomDropdown
                    {...formik.getFieldProps("Customer")}
                    name="Customer"
                    className=""
                    // sortedBy={'label'}
                    options={clientsList?.map((item: any) => {
                      return {
                        label: item?.DisplayAs,
                        value: item?._id,
                      };
                    })}
                    value={
                      {
                        label: currentEstimate?.client?.DisplayAs,
                        value: currentEstimate?.client?._id
                      }
                    }
                    onChange={(e) => {
                      const client = clientsList.find(client => client._id === e.value)
                      setCurrentClient(client)
                      formik.setFieldValue("Customer", e.value);
                      formik.setFieldValue("ContactName",[]); 
                    }}
                  />
                  {/* {formik.touched.Customer && typeof formik.errors.Customer === "string" && && formik.errors.Customer && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.Customer}</span>
                      </div>
                    </div>
                  )} */}
                </div>
                </Col>
                <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Priority</label>
                  <CustomDropdown
                    {...formik.getFieldProps("Priority")}
                    name="Priority"
                    className=""
                    value={{
                      label: "Regular",
                      value: 2,
                    }}
                    options={(PriorityDropdownData as any).map((item: any) => {
                      return {
                        data: item,
                        label: item?.label,
                        value: item?.Id,
                      };
                    })}
                    onChange={(e) => {
                      setPriority(e.label);
                      formik.setFieldValue("Priority", e.data);
                    }}
                  />
                </div>
            
              </Col>
            </Row>
            <Row> 
              <Col> 
                <div className="fv-row mb-7">
                  <label className="required fw-bold fs-6 mb-2">Location</label>
                  <CustomDropdown
                    {...formik.getFieldProps("ShortLocation")}
                    name="ShortLocation"
                    className=""
                    value={
                      {
                        label : currentEstimate?.locationId?.locationName,
                        value : currentEstimate?.locationId?._id,
                      }
                    }
                    options={currentClient?.Spaces?.map((item: any) => {
                      return {
                        value: item._id,
                        label: item?.locationName,
                      };
                    })}
                    onChange={(e) => {
                      formik.setFieldValue("ShortLocation", e.label);
                    }}
                  />
                  {/* {formik.touched.ShortLocation && formik.errors.ShortLocation && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.ShortLocation}</span>
                      </div>
                    </div>
                  )} */}
                </div>
                </Col>
                <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Flag</label>
                  <CustomDropdownMultipleValues
                    {...formik.getFieldProps("Flag")}
                    // @ts-ignore
                    value={formik.values?.Flag?.length > 0 ? (
                      formik.values.Flag?.map((item : any) => ({
                        value: item?.value,
                        label: item?.label
                      }))
                    ) : flag?.label ? [{ label: flag?.label, value: flag?.value }] : []}
                    name="Flag"
                    options={flagDropdownData?.map((item: any) => {
                      return {
                        data: item,
                        label: item?.DisplayAs,
                        value: item?.value,
                      };
                    })}
                    onChange={(e) => {
                      const flag = e.reduce((acc,cur) => {
                        if(cur?.value && cur?.value != "0"){
                          acc.push(cur)
                        }
                        else{
                          setFlag(cur)
                        }
                        return acc
                      },[])
                      formik.setFieldValue("Flag", flag);
                    }}
                  />
                  {formik.touched.Flag && formik.errors.Flag && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.Flag}</span>
                      </div>
                    </div>
                  )}
                </div>
                </Col>
            </Row>
            <Row>
              <Col>
              <div className="fv-row mb-7">
                  <label className="required fw-bold fs-6 mb-2">Contact Name</label>
                  <CustomDropdownMultipleValues
                    {...formik.getFieldProps("ContactName")}
                    name="ContactName"
                    className=""
                    value={
                      Object.keys(formik.values.ContactName).length > 0 ? 
                       formik.values.ContactName?.map(_item => ({
                       label: _item?.fullName ? _item?.fullName : '',
                       value: _item
                     }))
                     : []
                   }
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
                      formik.setFieldValue("ContactName", [...selectedContacts]);
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
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">File</label>
                  <Button onClick={() => setShowFileModal(true)} className="form-control mb-3 mb-lg-0" ><i className="fa fa-cloud-upload" aria-hidden="true"></i> Upload File</Button>
                  {error && <p style={{ fontSize: "lg", color: "red", marginTop: "10px" }} >{error}</p> }
                </div>
                </Col>
            </Row>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Bill To</label>
                  <CustomDropdown
                    {...formik.getFieldProps("billTo")}
                    name="billTo"
                    className=""
                    options={clientsList?.map(item => (
                      {
                        value: item?._id,
                        label: item?.DisplayAs
                      }
                    ))}
                    onChange={(e) => {
                      formik.setFieldValue("billTo", e.value);
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold fs-6 mb-2">Work Start</label>
                    <input
                      {...formik.getFieldProps("workStart")}
                      type="datetime-local"
                      name="workStart"
                      className={clsx(
                        "form-control form-control-solid mb-3 mb-lg-0",
                        {
                          "is-invalid":
                            formik.touched.workStart && formik.errors.workStart,
                        },
                        {
                          "is-valid":
                            formik.touched.workStart && !formik.errors.workStart,
                        }
                      )}
                      autoComplete="off"
                    />
                    {formik.touched.workStart && formik.errors.workStart && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.workStart}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
                <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Work Stop</label>
                  <input
                    {...formik.getFieldProps("workStop")}
                    type="datetime-local"
                    name="workStop"
                    className={clsx(
                      "form-control form-control-solid mb-3 mb-lg-0",
                      {
                        "is-invalid":
                          formik.touched.workStop && formik.errors.workStop,
                      },
                      {
                        "is-valid":
                          formik.touched.workStop && !formik.errors.workStop,
                      }
                    )}
                    autoComplete="off"
                  />
                  {formik.touched.workStop && formik.errors.workStop && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.workStop}</span>
                      </div>
                    </div>
                  )}
                </div>
                </Col>
            </Row>
            <Row> 
                <Col> 
                
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">PO#</label>
                  <input
                    {...formik.getFieldProps("po")}
                    type="text"
                    placeholder="Enter po number"
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
                  {formik.touched.po && formik.errors.po && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.po}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Schedule To</label>
                  <input
                    {...formik.getFieldProps("scheduleTo")}
                    type="datetime-local"
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
                  />
                  {formik.touched.scheduleTo && formik.errors.scheduleTo && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.scheduleTo}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Assign To</label>
                  <CustomDropdownMultipleValues
                    {...formik.getFieldProps("employee")}
                    name="employee"
                    options={activeUserList?.map((item: any) => {
                      return {
                        label: item?.FirstName,
                        value: item?._id,
                      };
                    })}
                    onChange={(e) => {
                      formik.setFieldValue("employee", e);
                    }}
                  />
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
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
                    usersList.filter(item => formik.values?.employee?.map((val: any) => val?._id ? val?._id : val?.value)?.includes(item?._id))?.map(user => (
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
            <FieldArray name="tasks">
              {() => formik.values.tasks?.map((_, i) => {
                const ticketErrors: any =
                  (formik.errors.tasks?.length &&
                    formik.errors.tasks[i]) ||
                  {};
                const ticketTouched: any =
                  //  @ts-ignore                
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
                          "form-control form-control-solid mb-3 mb-lg-0 ",
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
                        <label className="fw-bold fs-6 mb-2 required">Status</label>
                        <CustomCreateAbleDropdown
                          {...formik.getFieldProps(
                            `tasks.${i}.status`
                          )}
                          value={{
                           label: formik.values.tasks[i].status,
                           value: formik.values.tasks[i].status
                          }}
                          name={`tasks.${i}.status`}
                          options={["New", "In Progress", "Completed", "Deleted"]?.map(item => (
                            {
                              value: item,
                              label: item
                            }
                          ))}
                          onChange={e => {
                            formik.setFieldValue(`tasks.${i}.status`,e.value)}}
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
                      <label className="fw-bold fs-6 mb-2">Due Date</label>
                      <input
                        {...formik.getFieldProps(
                          `tasks.${i}.dueDate`
                        )}
                        type="datetime-local"
                        name={`tasks.${i}.dueDate`}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                        )}
                        autoComplete="off"
                      />
                    </div>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2">Scheduled Start</label>
                      <input
                        {...formik.getFieldProps(
                          `tasks.${i}.scheduledStart`
                        )}
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
                          options={activeUserList?.map((item: any) => {
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
            </FieldArray>
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
                dispatch(ACTION_clearEstimate());
                navigate("/order/list");
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

export default WorkOrderForm;