import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import { useNavigate } from "react-router-dom";
import "react-dropdown-tree-select/dist/styles.css";

// import { ACTION_postWorkOrder } from "../../../../store/workOrder/actions"
import { Col, Row } from "react-bootstrap";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import {
  ACTION_assetsListAPI,
  ACTION_createWorkOrder,
  ACTION_getContactListAPI,
  ACTION_getEmployeeAPI,
  ACTION_getPropertiesAPI,
  ACTION_getTaskAPI,
} from "../../../../store/workorder/actions";
import DropdownTreeSelect from "react-dropdown-tree-select";
import _ from "lodash";
import "../index.css";

const editWorkOrdersSchema = Yup.object().shape({
  // status: Yup.string().required("Status is required"),
  // wo: Yup.string().required("WO# is required"),
  // po: Yup.string().required("PO# is required"),
  space: Yup.string().required("Space is required"),
  // scheduleTo: Yup.date().required("Date is required"),
  serviceLocation: Yup.string().required("Service Location is required"),
  task: Yup.string().required("Task is required"),

  // description: Yup.string().required("Description is required"),
  // assignTo: Yup.string().required("Assign Employee name is required"),
});

const WorkOrderForm: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const { propertyList, assetList, taskList, employeeList, contactList } =
    useSelector((state: any) => state.workOrder);
  const { user } = useSelector((state: any) => state.auth);
  const [status, setStatus] = useState("New");
  const [priority, setPriority] = useState("1");
  const [space, setSpace] = useState<any>();
  const [task, setTask] = useState<any>();
  const [taskData, setTaskData] = useState<any>();

  const [contact, setContact] = useState();
  const [assignment, setAssignment] = useState();
  const [flag, setFlag] = useState();
  const [assetData, setAssetData] = useState<any[]>([]);
  const [serviceLocation, setServiceLocation] = useState<any>();

  useEffect(() => {
    dispatch(ACTION_getEmployeeAPI());
    dispatch(ACTION_getPropertiesAPI());
  }, []);

  useEffect(() => {
    space &&
      dispatch(
        ACTION_assetsListAPI({ propertyId: space?.data?.Data?.Asset?.Id })
      );
  }, [space]);

  console.log({ employeeList });

  useEffect(() => {
    let parentArray: any[] = [];
    assetList &&
      assetList.map((asset: any) => {
        if (asset?.Data?.Distance == 1) {
          if (
            asset.Data.Id == serviceLocation?.value &&
            asset.Data.Child.Name == serviceLocation?.label
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
            asset?.Data?.Distance == 2 &&
            asset?.Data?.ParentId == parent?.value
          ) {
            if (
              asset.Data.Child.Id == serviceLocation?.value &&
              asset.Data.Child.Name == serviceLocation?.label
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
  }, [assetList, serviceLocation]);

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

  const formik = useFormik({
    initialValues: {
      status: "New",
      wo: "",
      po: "",
      space: "",
      scheduleTo: "",
      serviceLocation: "",
      task: "",
      priority: "1",
      flag: null,
      description: "",
      contactName: "",
      assignTo: "",
    },
    validationSchema: editWorkOrdersSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmitWorkOrderForm();
    },
  });

  const handleSubmitWorkOrderForm = async () => {
    const userId = user._id;
    const status = formik.values.status;
    const woNumber = formik.values.wo;
    const poNumber = formik.values.po;
    const space = formik.values.space;
    const serviceLocation = formik.values.serviceLocation;
    const task = formik.values.task;
    const scheduleTo = new Date(formik.values.scheduleTo);
    const priority = formik.values.priority;
    const flag = formik.values.flag;
    const description = formik.values.description;
    const contactName = formik.values.contactName;
    const assignTo = formik.values.assignTo;

    let reqData = {
      userId,
      status,
      woNumber,
      poNumber,
      space,
      serviceLocation,
      task,
      scheduleTo,
      priority,
      flag,
      description,
      contactName,
      assignTo,
    };

    console.log(reqData);

    let reqPacker = {
      Command: {
        WorkOrder: {
          PoNumber: poNumber,
          Items: [
            {
              Asset: {
                Id: serviceLocation,
              },
              Task: {
                Id: task,
              },
            },
          ],
          TypeCategory: "BASIC",
          Priority: {
            Id: 1,
          },

          WorkZone: {
            Id: space,
          },
          SubType: {
            Id: 256,
          },
          Customer: {
            Id: contactName,
          },
        },
        ComputeSchedule: true,
        ComputeAssignment: true,
        EmergencyDisabled: false,
        Comment: description,
      },
      RequestId: 1234,
    };

    dispatch(ACTION_createWorkOrder(reqPacker, navigate));
  };

  const inputHandler = (event: any, editor: any) => {
    formik.setFieldValue("description", editor.getData());
  };

  const statusDropdownData = [
    {
      label: "New",
      value: "New",
    },
    {
      label: "OnHold",
      value: "OnHold",
    },
    {
      label: "InProgress",
      value: "InProgress",
    },
    {
      label: "Completed",
      value: "Completed",
    },
    {
      label: "Attention",
      value: "Attention",
    },
    {
      label: "Unknown",
      value: "Unknown",
    },
    {
      label: "Open",
      value: "Open",
    },
    {
      label: "Paused",
      value: "Paused",
    },
    {
      label: "Cancelled",
      value: "Cancelled",
    },
    {
      label: "Closed",
      value: "Closed",
    },
  ];

  const priorityDropdownData = [
    {
      label: "1",
      value: "1",
    },
    {
      label: "2",
      value: "2",
    },
    {
      label: "3",
      value: "3",
    },
    {
      label: "4",
      value: "4",
    },
    {
      label: "5",
      value: "5",
    },
  ];

  const flagDropdownData = [];

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
    dispatch(ACTION_getTaskAPI(selectedNodes[0]?.value));
    setServiceLocation({
      label: selectedNodes[0]?.label,
      value: selectedNodes[0]?.value,
    });
    formik.setFieldValue("serviceLocation", selectedNodes[0]?.value);
  };

  const DropDownTree = () => {
    assignObjectPaths(assetData, null);

    return (
      <DropdownTreeSelect
        className="bootstrap-demo"
        mode="radioSelect"
        data={assetData}
        onChange={onChange}
      />
    );
  };

  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <div className="fv-row mb-7">
        <Row>
          <Col>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Status</label>
              <CustomDropdown
                {...formik.getFieldProps("status")}
                name="status"
                className=""
                value={status}
                options={(statusDropdownData as any).map((item: any) => {
                  return {
                    data: item,
                    label: item?.label,
                    value: item?.value,
                  };
                })}
                onChange={(e) => {
                  setStatus(e);
                  formik.setFieldValue("status", e.value);
                }}
              />
              {formik.touched.status && formik.errors.status && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.status}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Space</label>
              <CustomDropdown
                {...formik.getFieldProps("space")}
                name="space"
                className=""
                value={space}
                options={propertyList.map((item: any) => {
                  return {
                    data: item,
                    label: item?.Data?.DisplayAs,
                    value: item?.Data?.Id,
                  };
                })}
                onChange={(e) => {
                  setSpace(e);
                  dispatch(ACTION_getContactListAPI(e.value));
                  formik.setFieldValue("space", e.value);
                }}
              />
              {formik.touched.space && formik.errors.space && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.space}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Service Location
              </label>
              <DropDownTree />
              {formik.touched.serviceLocation && formik.errors.serviceLocation && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.serviceLocation}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Task</label>
              <CustomDropdown
                {...formik.getFieldProps("task")}
                name="task"
                className=""
                value={task}
                options={(taskData as any)?.map((item: any) => {
                  return {
                    data: item,
                    label: item?.label,
                    value: item?.value,
                  };
                })}
                onChange={(e) => {
                  setTask(e);
                  formik.setFieldValue("task", e.value);
                }}
              />
              {formik.touched.task && formik.errors.task && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.task}</span>
                  </div>
                </div>
              )}
            </div>
            {/* <div className="fv-row mb-7">
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
              {formik.touched.wo && formik.errors.wo && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.wo}</span>
                  </div>
                </div>
              )}
            </div> */}
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

            {/* <div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">Schedule To</label>
							<input
								{...formik.getFieldProps("scheduleTo")}
								type="date"
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
						</div> */}

            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Assign To</label>
              <CustomDropdown
                {...formik.getFieldProps("assignTo")}
                name="assignTo"
                className=""
                value={assignment}
                options={employeeList.map((item: any) => {
                  return {
                    data: item,
                    label: item?.Data?.DisplayAs,
                    value: item?.Data?.Id,
                  };
                })}
                onChange={(e) => {
                  setAssignment(e);
                  formik.setFieldValue("assignTo", e.value);
                }}
              />
              {formik.touched.assignTo && formik.errors.assignTo && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.assignTo}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Contact Name</label>
              <CustomDropdown
                {...formik.getFieldProps("contactName")}
                name="contactName"
                className=""
                value={contact}
                options={contactList.map((item: any) => {
                  return {
                    data: item,
                    label: item?.Data?.DisplayAs,
                    value: item?.Data?.Id,
                  };
                })}
                onChange={(e) => {
                  setContact(e);
                  formik.setFieldValue("contactName", e.value);
                }}
              />
              {formik.touched.contactName && formik.errors.contactName && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.contactName}</span>
                  </div>
                </div>
              )}
            </div>
          </Col>

          <Col>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Priority</label>
              <CustomDropdown
                {...formik.getFieldProps("priority")}
                name="priority"
                className=""
                value={priority}
                options={(priorityDropdownData as any).map((item: any) => {
                  return {
                    data: item,
                    label: item?.label,
                    value: item?.value,
                  };
                })}
                onChange={(e) => {
                  console.log(e);
                  setPriority(e);
                  formik.setFieldValue("priority", e.value);
                }}
              />
              {formik.touched.priority && formik.errors.priority && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.priority}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Flag</label>
              <CustomDropdown
                {...formik.getFieldProps("flag")}
                name="flag"
                className=""
                value={flag}
                options={(flagDropdownData as any).map((item: any) => {
                  return {
                    data: item,
                    label: item?.label,
                    value: item?.value,
                  };
                })}
                onChange={(e) => {
                  setFlag(e);
                  formik.setFieldValue("flag", e.value);
                }}
              />
              {formik.touched.flag && formik.errors.flag && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.flag}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Description</label>
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

              {formik.touched.description && formik.errors.description && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.description}</span>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <div className="text-end pt-15">
          <button
            type="reset"
            className="btn btn-light me-3"
            data-kt-users-modal-action="cancel"
          >
            Discard
          </button>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default WorkOrderForm;
