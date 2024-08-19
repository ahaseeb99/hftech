
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { ACTION_resetPassword } from "../../../../store/auth/actions";


const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(3, "Minimum 3 symbols")
        .max(50, "Maximum 50 symbols")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .min(3, "Minimum 3 symbols")
        .max(50, "Maximum 50 symbols")
        .required("Confirm Password is required")
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        
});

const initialValues = {
    password: "",
    confirmPassword: "",
};
export function ResetPassword() {
    const navigate = useNavigate();
    const dispatch: any = useDispatch();
    const hash = new URLSearchParams(useLocation().search).get("hash");
    const token = new URLSearchParams(useLocation().search).get("token");
    localStorage.setItem("authToken", token ? token : '');

    const formik = useFormik({
        initialValues,
        validationSchema: resetPasswordSchema,
        onSubmit: (values) => {
            const reqPacket = {
                password: values.password,
                hash
            }
            dispatch(ACTION_resetPassword(reqPacket, navigate));
        }
    })

    return (
        <>
            <form
                className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
                noValidate
                id="kt_login_reset_password_form"
                onSubmit={formik.handleSubmit}
            >
                <div className="text-center mb-10">
                    {/* begin::Title */}
                    <h1 className="text-dark mb-3">Reset Password</h1>
                    {/* end::Title */}

                    {/* begin::Link */}
                    <div className="text-gray-400 fw-bold fs-4">
                        Reset your password.
                    </div>
                    {/* end::Link */}
                </div>

                {/* begin::Form group */}
                <div className="fv-row mb-10">
                    <input
                        placeholder="Password"
                        type="password"
                        autoComplete="off"
                        {...formik.getFieldProps("password")}
                        className={clsx(
                            "form-control form-control-lg form-control-solid",
                            {
                                "is-invalid": formik.touched.password && formik.errors.password,
                            },
                            {
                                "is-valid": formik.touched.password && !formik.errors.password,
                            }
                        )}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                                <span role="alert">{formik.errors.password}</span>
                            </div>
                        </div>
                    )}
                </div>
                {/* end::Form group */}

                {/* begin::Form group */}
                <div className="fv-row mb-10">
                    <input
                        placeholder="confirm password"
                        type="password"
                        autoComplete="off"
                        {...formik.getFieldProps("confirmPassword")}
                        className={clsx(
                            "form-control form-control-lg form-control-solid",
                            {
                                "is-invalid": formik.touched.confirmPassword && formik.errors.confirmPassword,
                            },
                            {
                                "is-valid": formik.touched.confirmPassword && !formik.errors.confirmPassword,
                            }
                        )}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                                <span role="alert">{formik.errors.confirmPassword}</span>
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
    )
}