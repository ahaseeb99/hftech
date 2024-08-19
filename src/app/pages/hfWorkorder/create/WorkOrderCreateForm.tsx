import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import { useNavigate } from "react-router-dom";

import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";

// import { ACTION_postWorkOrder } from "../../../../store/workOrder/actions"
import { Col, Row } from "react-bootstrap";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import WorkOrderCreate from "./WorkOrderCreate";

import "../index.css";
import {
  ACTION_assetsListAPI,
  ACTION_getPropertiesAPI,
  ACTION_getTaskAPI,
} from "../../../../store/workorder/actions";
import _ from "lodash";

const createWorkOrdersSchema = Yup.object().shape({
  property: Yup.string().required("Property is required"),
  serviceLocation: Yup.string().required("Service Location is required"),
  task: Yup.string().required("Task is required"),
  description: Yup.string().required("Description is required"),
});

interface IMyProps {
  setNext: any;
}

const WorkOrderCreateForm: React.FC<IMyProps> = (props: IMyProps) => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const { propertyList, assetList, taskList } = useSelector(
    (state: any) => state.workOrder
  );

  const { user } = useSelector((state: any) => state.auth);
  const [property, setProperty] = useState<any>();
  const [task, setTask] = useState<any>();
  const [propertyData, setPropertyData] = useState<any>();
  const [taskData, setTaskData] = useState<any>();
  const [assetData, setAssetData] = useState<any[]>([]);
  const [modalId, setModalId] = useState<any>();

  useEffect(() => {
    dispatch(ACTION_getPropertiesAPI());
  }, []);

  useEffect(() => {
    property && dispatch(ACTION_assetsListAPI({ propertyId: property?.value }));
  }, [property]);

  useEffect(() => {
    let array: any[] = [];
    propertyList &&
      propertyList.map((property: any) => {
        let obj = {
          label: property.Data.DisplayAs,
          value: property.Data.Asset.Id,
        };
        array.push(obj);
      });
    setPropertyData(array);
  }, [propertyList]);

  useEffect(() => {
    let parentArray: any[] = [];
    assetList &&
      assetList.map((asset) => {
        if (asset?.Data?.Distance === 1) {
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
      });

    let childrenArray: any[] = [];
    parentArray?.length !== 0 &&
      parentArray.map((parent) => {
        assetList.map((asset) => {
          if (
            asset?.Data?.Distance === 2 &&
            asset?.Data?.ParentId === parent?.value
          ) {
            let children: {
              label: string;
              value: string;
            } = {
              label: asset?.Data?.Child?.Name,
              value: asset?.Data?.Child?.Id,
            };
            childrenArray.push(children);
          }
        });
        parent.children = _.uniqBy(childrenArray, "value");
      });

    setAssetData(parentArray);
  }, [assetList]);

  useEffect(() => {
    modalId && dispatch(ACTION_getTaskAPI(modalId));
  }, [modalId]);

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
      property: "",
      serviceLocation: "",
      task: "",
      description: "",
    },
    validationSchema: createWorkOrdersSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmitWorkOrderCreateForm();
    },
  });

  const handleSubmitWorkOrderCreateForm = async () => {
    let reqData = {
      userId: user._id,
      property: formik.values.property,
      serviceLocation: formik.values.serviceLocation,
      task: formik.values.task,
      description: formik.values.description,
    };
    console.info("----------------------------");
    console.info("reqData => ", reqData);
    console.info("----------------------------");

    props.setNext(true);

    // dispatch(ACTION_postWorkOrder(reqData, navigate))
  };

  const inputHandler = (event: any, editor: any) => {
    formik.setFieldValue("description", editor.getData());

    console.info("----------------------------");
    console.info("data =>", editor.getData().replace(/<[^>]*>/g, ""));
    console.info("data =>", editor.getData());
    console.info("----------------------------");
  };

  return (
    <>
      <form className="form" onSubmit={formik.handleSubmit}>
        <div className="fv-row mb-7">
          <Row>
            <Col>
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Property</label>
                <CustomDropdown
                  {...formik.getFieldProps("property")}
                  name="property"
                  className=""
                  value={property}
                  options={(propertyData as any)?.map((item: any) => {
                    return {
                      data: item,
                      label: item?.label,
                      value: item?.value,
                    };
                  })}
                  onChange={(e) => {
                    setProperty(e);
                    formik.setFieldValue("property", e.value);
                  }}
                />
                {formik.touched.property && formik.errors.property && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.property}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">
                  Service Location
                </label>
                <DropdownTreeSelect
                  className="bootstrap-demo"
                  data={assetData}
                  onChange={(e) => {
                    console.info("----------------------------");
                    console.info("e =>", e);
                    console.info("----------------------------");
                    setModalId(e.value);
                    formik.setFieldValue("serviceLocation", e.value);
                  }}
                />
                {formik.touched.serviceLocation &&
                  formik.errors.serviceLocation && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">
                          {formik.errors.serviceLocation}
                        </span>
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
            </Col>

            <Col>
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">
                  Description
                </label>
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
                        formik.touched.description &&
                        !formik.errors.description,
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
              Next
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default WorkOrderCreateForm;
