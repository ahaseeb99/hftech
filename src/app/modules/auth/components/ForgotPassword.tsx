import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { ACTION_forgotPassword } from "../../../../store/auth/actions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const initialValues = {
  email: "",
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
});

export function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      dispatch(ACTION_forgotPassword({email: values.email}, navigate))
    },
  });

  return (
    <>
      <form
        className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
        noValidate
        id="kt_login_password_reset_form"
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center mb-10">
          {/* begin::Title */}
          <h1 className="text-dark mb-3">Forgot Password ?</h1>
          {/* end::Title */}

          {/* begin::Link */}
          <div className="text-gray-400 fw-bold fs-4">
            Enter your email to reset your password.
          </div>
          {/* end::Link */}
        </div>

        {/* begin::Form group */}
        <div className="fv-row mb-10">
          <label className="form-label fw-bolder text-gray-900 fs-6">
            Email
          </label>
          <input
            type="email"
            placeholder=""
            autoComplete="off"
            {...formik.getFieldProps("email")}
            className={clsx(
              "form-control form-control-lg form-control-solid",
              { "is-invalid": formik.touched.email && formik.errors.email },
              {
                "is-valid": formik.touched.email && !formik.errors.email,
              }
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.email}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className="d-flex flex-wrap justify-content-center pb-lg-0">
          <button
            type="submit"
            id="kt_password_reset_submit"
            className="btn btn-lg btn-primary fw-bolder me-4"
          >
            <span className="indicator-label">Submit</span>
          </button>
          <Link to="/auth/login">
            <button
              type="button"
              id="kt_login_password_reset_form_cancel_button"
              className="btn btn-lg btn-light-primary fw-bolder"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              Cancel
            </button>
          </Link>{" "}
        </div>
        {/* end::Form group */}
      </form>
    </>
  );
}
