import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { FieldArray, Formik, useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
import CustomDropdown from "../../../../../components/CustomDropdown/CustomDropdown";
import {  ACTION_getLabelDetailAPI, ACTION_updateLabelAPI } from "../../../../../store/status-flag/action";
import { useEffect } from "react";
import clsx from "clsx";
import CustomCreateAbleDropdown from "../../../../../components/CreateAbleDropDown";

const LabelCreateSchema = Yup.object().shape({
  name: Yup.string().required("Name Order Number is required"),
  status: Yup.string().required("Status is required"),
  categories: Yup.array().of(
    Yup.object().shape({
      label: Yup.string().required("Name is required"),
      status: Yup.string().required("Status is required"),
    })
  ) 
});

const LabelEditForm = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  let { id = "" } = useParams();
  const state : any = useSelector((state : any) => state.flagStatus.labelDetail)
  const user = useSelector((state: any) => state.auth.user);
  
  useEffect(() => {
    dispatch(ACTION_getLabelDetailAPI(id))
  },[id])

  const initialValues = {
    name: state?.label,
    status: state?.Status ? "Active" : "In Active",
    categories: state.Categories || []
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: LabelCreateSchema,
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
      Categories: formik.values.categories
    };
    dispatch(ACTION_updateLabelAPI(state?._id,reqData,navigate));
  };

  const handleAddSubCategory = (values, setValues) => {
    const categories = [...values.categories];
    categories.push({ label: "", status: ""});
    setValues({ ...values, categories });
  } 

  const handleRemoveCategory = (values: any, setValues: any, index: any) => {
    const categories = [...values.categories];
    categories.splice(index, 1);
    setValues({ ...values, categories });
  }

  const statusOptions = ["Active", "In Active"];
  return (
    <>
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={(e) => console.log(e)}
          validationSchema={LabelCreateSchema}
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
            <FieldArray name="categories">
            {() => formik.values.categories?.map((_, i) => {
                const ticketErrors: any =
                  (formik.errors.categories?.length &&
                    formik.errors.categories[i]) ||
                  {};
                const ticketTouched: any =
                  //  @ts-ignore                
                  (formik?.touched?.categories?.length &&
                    formik.touched.categories[i]) ||
                  {};
                return(
                <div key={`categories ${i}`}>
                <hr />
                  <Row className="my-10 pt-2">
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2 required">Name</label>
                      <input
                        {...formik.getFieldProps(
                          `categories.${i}.label`,
                        )}
                        type="text"
                        placeholder="Name"
                        name={`categories.${i}.label`}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0 ",
                        )}
                        autoComplete="off"
                      />
                        {ticketErrors?.label &&
                          ticketTouched?.label && (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                <span role="alert">
                                  {ticketErrors?.label}
                                </span>
                              </div>
                            </div>
                          )}
                    </div>
                    <div className="fv-row mb-7">
                        <label className="fw-bold fs-6 mb-2 required">Status</label>
                        <CustomCreateAbleDropdown
                          {...formik.getFieldProps(
                            `categories.${i}.status`
                          )}
                          value={{
                            // @ts-ignore
                            label: formik.values.categories[i]?.status,
                            // @ts-ignore
                            value: formik.values.categories[i].status
                           }}
                          name={`categories.${i}.status`}
                          options={["Active","In Active"]?.map(item => (
                            {
                              value: item,
                              label: item
                            }
                          ))}
                          onChange={e => {
                            formik.setFieldValue(`categories.${i}.status`,e.value)}}
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
                    <div className="text-end">
                      <button type="button" onClick={e => { handleRemoveCategory(formik.values, formik.setValues, i) }} className="btn btn-primary">Delete</button>
                    </div>
                  </Row>
                </div>
              )})}
            </FieldArray>
            <div className="d-flex justify-content-end">
              <button className="btn btn-primary" type="button" onClick={() => handleAddSubCategory(formik.values, formik.setValues)}>
                Add Category
              </button>
            </div> 
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

export default LabelEditForm;
