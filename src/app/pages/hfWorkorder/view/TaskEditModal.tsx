/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import CustomDropdownMultipleValues from "../../../../components/CustomDropDownMultipleValues/CustomDropDownMultipleValues";
import CustomCreateAbleDropdown from "../../../../components/CreateAbleDropDown";
import { timeZoneConvertForInput } from "../../../../utils/helpers";

const editTaskSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  dueDate: Yup.string(),
  status: Yup.string().required("Status is required") || "",
  assignedTo: Yup.array(),
  scheduledStart: Yup.string(),
  workStart: Yup.string(),
  workStop: Yup.string(),
});

type Props = {
  show: boolean;
  handleClose: () => void;
  handleUpdateTask: any;
  task: any;
};

const TaskEditModal: React.FC<Props> = ({
  show,
  handleClose,
  handleUpdateTask,
  task,
}) => {
  const usersList = useSelector((state: any) => state.users.usersList)?.filter(
    (user) => user.status === "ACTIVE"
  );
  const { user } = useSelector((state: any) => state.auth);

  const initialValues = {
    name: task?.name || "",
    description: task?.description.replace(/<\/?[^>]+(>|$)/g, "") || "",
    dueDate: task?.dueDate || "",
    status: task.status || "",
    assignedTo: task?.assignedTo?.length > 0 ? task?.assignedTo?.map(item => ({label : item?.FirstName,value: item?._id})) : [],
    scheduledStart: task?.scheduledStart || "",
    workStart: task?.workStart || "",
    workStop: task?.workStop || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: editTaskSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmit();
    },
  });

  const handleSubmit = () => {
    const reqData = {
      name: formik.values.name,
      description: formik.values.description,
      dueDate: formik.values.dueDate,
      status: formik.values.status,
      assignedTo: formik.values.assignedTo?.map((item: any) => item?.value),
      scheduledStart: formik.values.scheduledStart,
      workStop: formik.values.workStop,
      workStart: formik.values.workStart,
      _id: task?._id
    };
    handleUpdateTask(reqData);
  };

  console.log("formik.values?.status", formik.values);
  console.log(formik.values?.scheduledStart, "formik.values?.scheduledStart");
  return (
    <Modal
      className="modal fade show d-block"
      id="kt_header_search_modal"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered modal-md"
      show={show}
    >
      <div className="modal-content shadow-none">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={editTaskSchema}
        >
          <form onSubmit={formik.handleSubmit} className="p-10">
            <Row className="my-10 pt-2">
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2 required">Task Name</label>
                <input
                  {...formik.getFieldProps("name")}
                  type="text"
                  placeholder="Enter Task Name"
                  name="name"
                  className="form-control form-control-solid mb-3 mb-lg-0 "
                  autoComplete="off"
                />
                {formik.touched.name &&
                  typeof formik.errors.name === "string" &&
                  formik.errors.name && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.name}</span>
                      </div>
                    </div>
                  )}
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Description</label>
                <input
                  {...formik.getFieldProps("description")}
                  type="text"
                  placeholder="Description"
                  name="description"
                  className="form-control form-control-solid mb-3 mb-lg-0"
                  autoComplete="off"
                />
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2 required">Status</label>
                <CustomCreateAbleDropdown
                  {...formik.getFieldProps("status")}
                  name="status"
                  value={{
                    label: formik.values?.status,
                    value: formik.values?.status,
                  }}
                  options={["New", "In Progress", "Completed", "Deleted"]?.map(
                    (item) => ({
                      value: item,
                      label: item,
                    })
                  )}
                  onChange={(e) => {
                    formik.setFieldValue("status", e.value);
                  }}
                />
                {formik.touched.status &&
                  typeof formik.errors.status === "string" &&
                  formik.errors.status && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.status}</span>
                      </div>
                    </div>
                  )}
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Due Date</label>
                <input
                  {...formik.getFieldProps("dueDate")}
                  value={timeZoneConvertForInput(
                    formik.values?.dueDate,
                    user?.userTimezone
                  )}
                  type="datetime-local"
                  name="dueDate"
                  className="form-control form-control-solid mb-3 mb-lg-0"
                />
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Scheduled Start</label>
                <input
                  {...formik.getFieldProps("scheduledStart")}
                  type="datetime-local"
                  name={`scheduledStart`}
                  value={timeZoneConvertForInput(
                    formik.values?.scheduledStart,
                    user?.userTimezone
                  )}
                  className={"form-control form-control-solid mb-3 mb-lg-0"}
                />
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Work Start</label>
                <input
                  {...formik.getFieldProps("workStart")}
                  type="datetime-local"
                  name={`workStart`}
                  value={timeZoneConvertForInput(
                    formik.values?.workStart,
                    user?.userTimezone
                  )}
                  className={"form-control form-control-solid mb-3 mb-lg-0"}
                />
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Work Stop</label>
                <input
                  {...formik.getFieldProps("workStop")}
                  type="datetime-local"
                  value={timeZoneConvertForInput(
                    formik.values?.workStop,
                    user?.userTimezone
                  )}
                  name={`workStop`}
                  className={"form-control form-control-solid mb-3 mb-lg-0"}
                  autoComplete="off"
                />
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Assigned To</label>
                <CustomDropdownMultipleValues
                  {...formik.getFieldProps("assignedTo")}
                  name="assignedTo"
                  options={usersList?.map((item: any) => {
                    return {
                      label: item?.FirstName,
                      value: item?._id,
                    };
                  })}
                  onChange={(e) => {
                    formik.setFieldValue("assignedTo", e);
                  }}
                />
              </div>
            </Row>
            <div className="text-end">
              <button
                onClick={() => handleClose()}
                className="btn btn-light me-3"
                type="button"
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
    </Modal>
  );
};

export default TaskEditModal;
