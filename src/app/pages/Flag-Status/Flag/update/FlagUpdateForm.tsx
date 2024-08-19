import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
import CustomDropdown from "../../../../../components/CustomDropdown/CustomDropdown";
import { ACTION_getFlagDetailAPI, ACTION_updateFlagAPI } from "../../../../../store/status-flag/action";
import { useEffect } from "react";

const StatusCreateSchema = Yup.object().shape({
  displayAs: Yup.string().required("Name is required"),
  status: Yup.string().required("Status is required"),
});

const FlagUpdateForm = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const {id = ""} = useParams()
  const state : any = useSelector((state : any) => state.flagStatus.flagDetail)

  const initialValues = {
    displayAs: state?.DisplayAs,
    status: state?.Status  ? "Active" : "In Active",
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
      DisplayAs: formik.values?.displayAs,
      Status: formik.values?.status == "Active",
    };
    dispatch(ACTION_updateFlagAPI(state?._id, reqData, navigate));
  }; 


  useEffect(() => {
    dispatch(ACTION_getFlagDetailAPI(id))
  },[id])

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
                    {...formik.getFieldProps("displayAs")}
                    type="text"
                    name="displayAs"
                    placeholder="Flag Name..."
                    className="form-control form-control-solid mb-3 mb-lg-0"
                    autoComplete="off"
                  />
                  {formik.touched.displayAs && formik.errors.displayAs && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">
                          {formik.errors.displayAs as string}
                        </span>
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
                      state.Status 
                        ? { label: "Active", value: "Active" }
                        : { label: "In Active", value: "In Active" }
                    }
                    options={statusOptions?.map((item: any) => {
                      return {
                        label: item,
                        value: item,
                      };
                    })}
                    onChange={(e) => formik.setFieldValue("status",e.value)}
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
            </div>
          </form>
        </Formik>
      </div>
    </>
  );
};

export default FlagUpdateForm;
