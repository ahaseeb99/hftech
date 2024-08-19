import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import { useNavigate } from "react-router-dom";
// import { ACTION_postWorkOrder } from "../../../../store/workOrder/actions"
import { Col, Row } from "react-bootstrap";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";

const editWorkOrdersSchema = Yup.object().shape({
  status: Yup.string().required("Status is required"),
  wo: Yup.string().required("WO# is required"),
  po: Yup.string().required("PO# is required"),
  space: Yup.string().required("Space is required"),
  scheduleTo: Yup.date().required("Date is required"),
  priority: Yup.string().required("Priority is required"),
  flag: Yup.string().required("Flag is required"),
  description: Yup.string().required("Description is required"),
  assignTo: Yup.string().required("Assign Employee name is required"),
});

const EditWorkOrderForm: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const { user } = useSelector((state: any) => state.auth);
  const [status, setStatus] = useState();
  const [priority, setPriority] = useState();
  const [flag, setFlag] = useState();

  const formik = useFormik({
    initialValues: {
      status: "",
      wo: "",
      po: "",
      space: "",
      scheduleTo: "",
      priority: "",
      flag: "",
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
    let reqData = {
      userId: user._id,
      status: formik.values.status,
      woNumber: formik.values.wo,
      poNumber: formik.values.po,
      space: formik.values.space,
      scheduleTo: new Date(formik.values.scheduleTo),
      priority: formik.values.priority,
      flag: formik.values.flag,
      description: formik.values.description,
      contactName: formik.values.contactName,
      assignTo: formik.values.assignTo,
    };

    console.log(reqData);
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

  const statusDropdownData = [
    {
      label: "Completed",
      value: "completed",
    },
    {
      label: "Cancelled",
      value: "cancelled",
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

  const flagDropdownData = [
    {
      label: "True",
      value: "true",
    },
    {
      label: "False",
      value: "false",
    },
  ];

  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <div className="fv-row mb-7">
        <Row>
          <Col>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Status</label>
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
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">PO#</label>
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
              <label className="required fw-bold fs-6 mb-2">Space</label>
              <input
                {...formik.getFieldProps("space")}
                type="text"
                placeholder="Enter space number"
                name="space"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.space && formik.errors.space,
                  },
                  {
                    "is-valid": formik.touched.space && !formik.errors.space,
                  }
                )}
                autoComplete="off"
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
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Assign To</label>
              <input
                {...formik.getFieldProps("assignTo")}
                type="text"
                placeholder="Enter assign employee name"
                name="assignTo"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.assignTo && formik.errors.assignTo,
                  },
                  {
                    "is-valid":
                      formik.touched.assignTo && !formik.errors.assignTo,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.assignTo && formik.errors.assignTo && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.assignTo}</span>
                  </div>
                </div>
              )}
            </div>
          </Col>

          <Col>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Priority</label>
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
              <label className="required fw-bold fs-6 mb-2">Flag</label>
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
              <label className="required fw-bold fs-6 mb-2">Description</label>
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
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Contact Name</label>
              <input
                {...formik.getFieldProps("contactName")}
                type="text"
                placeholder="Enter contactName"
                name="contactName"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.contactName && formik.errors.contactName,
                  },
                  {
                    "is-valid":
                      formik.touched.contactName && !formik.errors.contactName,
                  }
                )}
                autoComplete="off"
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
        </Row>

        <div className="text-end pt-15">
          <button
            type="reset"
            className="btn btn-light me-3"
            data-kt-users-modal-action="cancel"
            onClick={() => {
              navigate("/workOrder/list");
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
  );
};

export default EditWorkOrderForm;
