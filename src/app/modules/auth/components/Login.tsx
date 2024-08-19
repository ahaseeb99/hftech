/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_login, ACTION_signatureImageSave } from "../../../../store/auth/actions";
import { useNavigate } from "react-router-dom";
import TextSignature from "text-signature";
import { getOptionsParameter } from "../../../../utils/helpers";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/
function b64toBlob(b64Data, contentType, sliceSize = 512) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  const byteCharacters = atob(b64Data);
  const byteArrays: any = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export function Login() {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state: any) => state.auth);

  const createSignature = async (signUpData) => {
    const params = getOptionsParameter(signUpData?.FirstName, signUpData?.LastName);
    console.log(params);
    const textSignature = new TextSignature(params);
    textSignature.generateImage(params);
    const signatureImage = textSignature.getImageData();
    const block = signatureImage.split(";");
// Get the content type of the image
    const contentType = block[0].split(":")[1];// In this case "image/gif"
// get the real base64 content of the file
    const realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

    console.log("image-realData", realData);

// Convert it to a blob to upload
    const blob = b64toBlob(realData, contentType);

    let bodyFormData = new FormData();
    bodyFormData.append("image", blob);

    dispatch(ACTION_signatureImageSave(bodyFormData, signUpData));
  }

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      try {
        dispatch(ACTION_login(values, navigate, createSignature));
      } catch (error) {
        console.error(error);
        setStatus("The login detail is incorrect");
        setSubmitting(false);
      }
    },
  });

  return (
    <form
      className="form w-100"
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      {/* begin::Heading */}
      <div className="text-center mb-10">
        <h1 className="text-dark mb-3">Sign In to HF TECH</h1>
        {/*<div className="text-gray-400 fw-bold fs-4">*/}
        {/*  New Here?{" "}*/}
        {/*  <Link to="/auth/registration" className="link-primary fw-bolder">*/}
        {/*    Create an Account*/}
        {/*  </Link>*/}
        {/*</div>*/}
      </div>
      {/* begin::Heading */}

      {formik.status ? (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold">{formik.status}</div>
        </div>
      ) : null}

      {/* begin::Form group */}
      <div className="fv-row mb-10">
        <label className="form-label fs-6 fw-bolder text-dark">Email</label>
        <input
          placeholder="Email"
          {...formik.getFieldProps("email")}
          className={clsx(
            "form-control form-control-lg form-control-solid",
            { "is-invalid": formik.touched.email && formik.errors.email },
            {
              "is-valid": formik.touched.email && !formik.errors.email,
            }
          )}
          type="email"
          name="email"
          autoComplete="off"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="fv-plugins-message-container">
            <span role="alert">{formik.errors.email}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="fv-row mb-10">
        <div className="d-flex justify-content-between mt-n5">
          <div className="d-flex flex-stack mb-2">
            {/* begin::Label */}
            <label className="form-label fw-bolder text-dark fs-6 mb-0">
              Password
            </label>
            {/* end::Label */}
            {/* begin::Link */}
            <Link
              to="/auth/forgot-password"
              className="link-primary fs-6 fw-bolder"
              style={{ marginLeft: "5px" }}
            >
              Forgot Password ?
            </Link>
            {/* end::Link */}
          </div>
        </div>
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

      {/* begin::Action */}
      <div className="text-center">
        <button
          type="submit"
          id="kt_sign_in_submit"
          className="btn btn-lg btn-primary w-100 mb-5"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className="indicator-label">Continue</span>}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>

        {/* begin::Separator */}
        {/* <div className="text-center text-muted text-uppercase fw-bolder mb-5">
          or
        </div> */}
        {/* end::Separator */}

        {/* begin::Google link */}
        {/* <a
          href="#"
          className="btn btn-flex flex-center btn-light btn-lg w-100 mb-5"
        >
          <img
            alt="Logo"
            src={toAbsoluteUrl("/media/svg/brand-logos/google-icon.svg")}
            className="h-20px me-3"
          />
          Continue with Google
        </a> */}
        {/* end::Google link */}

        {/* begin::Google link */}
        {/* <a
          href="#"
          className="btn btn-flex flex-center btn-light btn-lg w-100 mb-5"
        >
          <img
            alt="Logo"
            src={toAbsoluteUrl("/media/svg/brand-logos/facebook-4.svg")}
            className="h-20px me-3"
          />
          Continue with Facebook
        </a> */}
        {/* end::Google link */}

        {/* begin::Google link */}
        {/* <a href="#" className="btn btn-flex flex-center btn-light btn-lg w-100">
          <img
            alt="Logo"
            src={toAbsoluteUrl("/media/svg/brand-logos/apple-black.svg")}
            className="h-20px me-3"
          />
          Continue with Apple
        </a> */}
        {/* end::Google link */}
      </div>
      {/* end::Action */}
    </form>
  );
}
