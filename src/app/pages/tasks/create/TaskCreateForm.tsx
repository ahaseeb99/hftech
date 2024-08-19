import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import { Col, Row, Table } from "react-bootstrap";
import { ACTION_getClients } from "../../../../store/client/actions";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import { ACTION_getContacts } from "../../../../store/contact/actions";
import CustomDropdownMultipleValues from "../../../../components/CustomDropDownMultipleValues/CustomDropDownMultipleValues";
import { ACTION_getUsers } from "../../../../store/users/actions";
import { ACTION_addTask } from "../../../../store/task/action";
import JoditEditor from "jodit-react";

const taskCreateSchema = Yup.object().shape({
  name: Yup.string().required("Task name is required"),
});

const TaskCreateForm = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const editor = useRef(null);

  const usersList = useSelector((state: any) => state.users.usersList);
  const clientsList: any = useSelector((state: any) =>
    state.client.clientsData.clients?.filter((x) => x.status == "ACTIVE")
  );
  const [currentClient, setCurrentClient] = useState<any>({});
  const [activeUserList, setActiveUserList] = useState<any>([]);

  useEffect(() => {
    dispatch(ACTION_getClients());
    dispatch(ACTION_getContacts());
    dispatch(ACTION_getUsers());
  }, []);

  useEffect(() => {
    const activeUsers = usersList?.filter((user) => user.status === "ACTIVE");
    setActiveUserList(activeUsers);
  }, [usersList]);

  const config: any = useMemo(
    (): any => ({
      zIndex: 0,
      readonly: false,
      theme: 'default',
      enableDragAndDropFileToEditor: true,
      editorCssClass: false,
      height: 400,
      language: 'en',
      debugLanguage: false,
      i18n: 'en',
      tabIndex: -1,
      toolbar: true,
      colorPickerDefaultTab: 'background',
      imageDefaultWidth: 100,
      uploader: {
        insertImageAsBase64URI: true
      },
      placeholder: 'Description...',
      showXPathInStatusbar: false
    }),
    []
  );


  const initialValues = {
    client: "",
    contact: [],
    name: "",
    employee: [],
    description: ""
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: taskCreateSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleCreateTask();
    },
  });

  const handleCreateTask = () => {
    const reqData = {
      contacts: formik.values.contact?.map((item: any) => item?.value),
      client: formik.values.client || null,
      name: formik.values.name,
      assignedTo: formik.values.employee?.map((item: any) => item?.value),
      description: `${formik.values.description}`
    };
    dispatch(ACTION_addTask(reqData, navigate));
  };

  const handleClientChange = (e) => {
    setCurrentClient(e.data);
    formik.setFieldValue("client", e.value);
    formik.setFieldValue("contact", []);
  };

  return (
    <>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={(e) => console.log(e)}
          validationSchema={taskCreateSchema}
        >
          <form className="pt-4" onSubmit={formik.handleSubmit}>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2 required">Name</label>
                  <input
                    {...formik.getFieldProps("name")}
                    type="text"
                    name="name"
                    placeholder="Name..."
                    className="form-control form-control-solid mb-3 mb-lg-0"
                    autoComplete="off"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.name as string}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2 ">Client</label>
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
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Contact</label>
                  <CustomDropdownMultipleValues
                    {...formik.getFieldProps("contact")}
                    name="contact"
                    options={currentClient?.Contacts?.map((item: any) => {
                      return {
                        label: item?.fullName,
                        value: item?._id,
                      };
                    })}
                    onChange={(e) => formik.setFieldValue("contact", e)}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
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
                  {formik.values.employee.length > 0
                    ? usersList
                        .filter((item) =>
                          formik.values?.employee
                            ?.map((val: any) =>
                              val?._id ? val?._id : val?.value
                            )
                            ?.includes(item?._id)
                        )
                        ?.map((user) => (
                          <tr>
                            <td>{user?.FirstName + " " + user?.LastName}</td>
                            <td>{user?.title}</td>
                            <td>
                              <a href={`tel:${user?.contact}`}>
                                {user?.contact}
                              </a>
                            </td>
                            <td>
                              <a href={`mailto:${user?.email}`}>
                                {user?.email}
                              </a>
                            </td>
                          </tr>
                        ))
                    : ""}
                </tbody>
              </Table>
            </Row>
            <Row>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Description</label>
                <JoditEditor
                  ref={editor}
                  value={formik.values.description}
                  config={config}
                  onBlur={newContent => formik.setFieldValue("description",newContent)}
                />
              </div>
            </Row>
            <div className="text-end pt-15">
              <button
                type="reset"
                className="btn btn-light me-3"
                data-kt-users-modal-action="cancel"
                onClick={() => navigate("/task/list")}
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

export default TaskCreateForm;
