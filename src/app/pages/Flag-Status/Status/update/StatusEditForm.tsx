import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
import CustomDropdown from "../../../../../components/CustomDropdown/CustomDropdown";
import { ACTION_createStatusAPI, ACTION_getStatusDetailAPI, ACTION_updateStatusAPI } from "../../../../../store/status-flag/action";
import { useEffect } from "react";

const StatusCreateSchema = Yup.object().shape({
  name: Yup.string().required("Name Order Number is required"),
  status: Yup.string().required("Status is required"),
});

const StatusEditForm = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  let { id = "" } = useParams();
  const state : any = useSelector((state : any) => state.flagStatus.statusDetail)
  const user = useSelector((state: any) => state.auth.user);
  
  useEffect(() => {
    dispatch(ACTION_getStatusDetailAPI(id))
  },[id])

  const initialValues = {
    name: state?.label,
    status: state?.Status ? "Active" : "In Active",
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: StatusCreateSchema,
    enableReinitialize : true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmit();
    },
  });

  const handleSubmit = () => {
    const reqData = {
      value: formik.values?.name,
      label: formik.values?.name,
      Status: formik.values?.status === "Active",
    };
    dispatch(ACTION_updateStatusAPI(state?._id,reqData,navigate));
  };

  const statusOptions = ["Active", "In Active"];
  return (
    <>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={(e) => console.log(e)}
          validationSchema={StatusCreateSchema}
        >
          <form className="pt-4" onSubmit={formik.handleSubmit}>
            <Row>
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Name</label>
                  <input
                    {...formik.getFieldProps("name")}
                    type="text"
                    name="name"
                    placeholder="Status Name..."
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
                  <label className="fw-bold fs-6 mb-2 required">Status</label>
                  <CustomDropdown
                    {...formik.getFieldProps("status")}
                    name="status"
                    value={
                      formik.values.status == "Active"
                        ? { label: "Active", value: "Active" }
                        : { label: "In Active", value: "In Active" }
                    }
                    options={statusOptions?.map((item: any) => {
                      return {
                        label: item,
                        value: item,
                      };
                    })}
                    onChange={(e) => formik.setFieldValue("status", e.value)}
                  />
                  {formik.touched.status && formik.errors.status && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">
                          {formik.errors.status as string}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <div className="text-end pt-15">
              {user.role.name == "ADMIN" &&
                <>
                  <button
                    type="reset"
                    className="btn btn-light me-3"
                    data-kt-users-modal-action="cancel"
                    onClick={() => navigate("/status-flag/list")}
                  >
                    Discard
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </>
              }
            </div>
          </form>
        </Formik>
      </div>
    </>
  );
};

export default StatusEditForm;
