/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { getUserByToken, register } from "../core/_requests";
import { Link, useNavigate } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { PasswordMeterComponent } from "../../../../_metronic/assets/ts/components";
import { useAuth } from "../core/Auth";
import { useDispatch } from "react-redux";
import {
  ACTION_registerUser,
  ACTION_signatureImageSave,
} from "../../../../store/auth/actions";
import { getOptionsParameter } from "../../../../utils/helpers";
import TextSignature from "text-signature";
import useStateRef from "react-usestateref";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import moment from "moment";

const initialValues = {
  FirstName: "",
  LastName: "",
  contact: "",
  personalContact:"",
  emergency:false,
  intelId: "",
  email: "",
  password: "",
  changepassword: "",
  acceptTerms: false,
  IsRemoved : false,
  userTimezone: ""
};

const registrationSchema = Yup.object().shape({
  FirstName: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("First name is required"),
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  LastName: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Last name is required"),
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
  changepassword: Yup.string()
    .required("Password confirmation is required")
    .when("password", {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("password")],
        "Password and Confirm Password didn't match"
      ),
    }),
  acceptTerms: Yup.bool().required("You must accept the terms and conditions"),
});

const timeZones = moment.tz.zonesForCountry('US');
const timeZoneOptions = timeZones?.map(x => ({DisplayAs: x, value: x}));


export function Registration() {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const [loading, setLoading] = useState(false);
  const [optionalParams, setOptionalParams, optionalParamsRef] = useStateRef(
    {}
  );
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      if (formik.isValid) {
        handleSubmitRegisterForm();
      } else {
        setLoading(false);
      }
      try {
      } catch (error) {
        console.error(error);

        setStatus("The registration details is incorrect");
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

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

  const createSignature = async (signUpData) => {
    const textSignature = new TextSignature(optionalParamsRef.current);
    textSignature.generateImage(optionalParamsRef.current);
    const signatureImage = textSignature.getImageData();
    const block = signatureImage.split(";");
    // Get the content type of the image
    const contentType = block[0].split(":")[1]; // In this case "image/gif"
    // get the real base64 content of the file
    const realData = block[1].split(",")[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."

    // Convert it to a blob to upload
    const blob = b64toBlob(realData, contentType);

    let bodyFormData = new FormData();
    bodyFormData.append("image", blob);

    dispatch(ACTION_signatureImageSave(bodyFormData, signUpData));
  };

  const handleSubmitRegisterForm = async () => {
    const params = getOptionsParameter(
      formik.values.FirstName,
      formik.values.LastName
    );
    setOptionalParams(params);
    const reqData = {
      email: formik.values.email,
      FirstName: formik.values.FirstName,
      LastName: formik.values.LastName,
      password: formik.values.password,
      contact: formik.values.contact,
      personalContact: formik.values.personalContact,
      intelId: formik.values.intelId,
      emergency: formik.values.emergency,
      userTimezone: formik.values.userTimezone,
    };
    dispatch(ACTION_registerUser(reqData, navigate, createSignature));
  };

  return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      noValidate
      id="kt_login_signup_form"
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className="mb-10 text-center">
        {/* begin::Title */}
        <h1 className="text-dark mb-3">Create an Account</h1>
        {/* end::Title */}

        {/* begin::Link */}
        {/* <div className="text-gray-400 fw-bold fs-4">
          Already have an account?
          <Link
            to="/auth/forgot-password"
            className="link-primary fw-bolder"
            style={{ marginLeft: "5px" }}
          >
            Forgot Password ?
          </Link>
        </div> */}
        {/* end::Link */}
      </div>
      {/* end::Heading */}

      {/* begin::Action */}
      {/* <button type='button' className='btn btn-light-primary fw-bolder w-100 mb-10'>
        <img
          alt='Logo'
          src={toAbsoluteUrl('/media/svg/brand-logos/google-icon.svg')}
          className='h-20px me-3'
        />
        Sign in with Google
      </button> */}
      {/* end::Action */}

      {/* <div className="d-flex align-items-center mb-10">
        <div className="border-bottom border-gray-300 mw-50 w-100"></div>
        <span className="fw-bold text-gray-400 fs-7 mx-2">OR</span>
        <div className="border-bottom border-gray-300 mw-50 w-100"></div>
      </div> */}

      {formik.status && (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold">{formik.status}</div>
        </div>
      )}

      {/* begin::Form group Firstname */}
      <div className="row fv-row mb-7">
        <div className="col-xl-6">
          <label className='class="form-label fw-bolder text-dark fs-6'>
            First name
          </label>
          <input
            placeholder="First name"
            type="text"
            autoComplete="off"
            {...formik.getFieldProps("FirstName")}
            className={clsx(
              "form-control form-control-lg form-control-solid",
              {
                "is-invalid":
                  formik.touched.FirstName && formik.errors.FirstName,
              },
              {
                "is-valid":
                  formik.touched.FirstName && !formik.errors.FirstName,
              }
            )}
          />
          {formik.touched.FirstName && formik.errors.FirstName && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.FirstName}</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-xl-6">
          {/* begin::Form group Lastname */}
          <div className="fv-row mb-5">
            <label className="form-label fw-bolder text-dark fs-6">
              Last name
            </label>
            <input
              placeholder="Last name"
              type="text"
              autoComplete="off"
              {...formik.getFieldProps("LastName")}
              className={clsx(
                "form-control form-control-lg form-control-solid",
                {
                  "is-invalid":
                    formik.touched.LastName && formik.errors.LastName,
                },
                {
                  "is-valid":
                    formik.touched.LastName && !formik.errors.LastName,
                }
              )}
            />
            {formik.touched.LastName && formik.errors.LastName && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.LastName}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>
      </div>
      {/* end::Form group */}
      {/* begin::Form group Email */}
      <div className="fv-row mb-7">
        <label className="form-label fw-bolder text-dark fs-6">Email</label>
        <input
          placeholder="Email"
          type="email"
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

      {/* begin::Form group Password */}
      <div className="mb-10 fv-row" data-kt-password-meter="true">
        <div className="mb-1">
          <label className="form-label fw-bolder text-dark fs-6">
            Password
          </label>
          <div className="position-relative mb-3">
            <input
              type="password"
              placeholder="Password"
              autoComplete="off"
              {...formik.getFieldProps("password")}
              className={clsx(
                "form-control form-control-lg form-control-solid",
                {
                  "is-invalid":
                    formik.touched.password && formik.errors.password,
                },
                {
                  "is-valid":
                    formik.touched.password && !formik.errors.password,
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
          {/* begin::Meter */}
          {/* <div
            className="d-flex align-items-center mb-3"
            data-kt-password-meter-control="highlight"
          >
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
          </div> */}
          {/* end::Meter */}
        </div>
        {/* <div className="text-muted">
          Use 8 or more characters with a mix of letters, numbers & symbols.
        </div> */}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className="fv-row mb-5">
        <label className="form-label fw-bolder text-dark fs-6">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Password confirmation"
          autoComplete="off"
          {...formik.getFieldProps("changepassword")}
          className={clsx(
            "form-control form-control-lg form-control-solid",
            {
              "is-invalid":
                formik.touched.changepassword && formik.errors.changepassword,
            },
            {
              "is-valid":
                formik.touched.changepassword && !formik.errors.changepassword,
            }
          )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.changepassword}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group contact */}
      <div className="fv-row mb-7">
        <label className="form-label fw-bolder text-dark fs-6">Intel ID</label>
        <input
          placeholder="Intel Id..."
          type="text"
          autoComplete="off"
          {...formik.getFieldProps("intelId")}
          className={clsx(
            "form-control form-control-lg form-control-solid",
            { "is-invalid": formik.touched.intelId && formik.errors.intelId },
            {
              "is-valid": formik.touched.intelId && !formik.errors.intelId,
            }
          )}
        />
      </div>
      {/* end::Form group */}

      {/* begin::Form group contact */}
      <div className="fv-row mb-7">
        <label className="form-label fw-bolder text-dark fs-6">Phone</label>
        <input
          placeholder="Phone..."
          type="text"
          autoComplete="off"
          {...formik.getFieldProps("contact")}
          className={clsx(
            "form-control form-control-lg form-control-solid",
            { "is-invalid": formik.touched.contact && formik.errors.contact },
            {
              "is-valid": formik.touched.contact && !formik.errors.contact,
            }
          )}
        />
      </div>
      {/* end::Form group */}
      {/* begin::Form group personal contact */}
      <div className="fv-row mb-7">
        <label className="form-label fw-bolder text-dark fs-6">Personal Phone</label>
        <input
          placeholder="Personal Phone..."
          type="text"
          autoComplete="off"
          {...formik.getFieldProps("personalContact")}
          className={clsx(
            "form-control form-control-lg form-control-solid",
            { "is-invalid": formik.touched.personalContact && formik.errors.personalContact },
            {
              "is-valid": formik.touched.personalContact && !formik.errors.personalContact,
            }
          )}
        />
      </div>
      {/* end::Form group */}

      <div className="fv-row mb-7">
        <label className="fw-bold fs-6 mb-2">Time zone</label>
        <CustomDropdown
          {...formik.getFieldProps("userTimezone")}
          name="userTimezone"
          className=""
          // value={flag}
          options={(timeZoneOptions as any).map((item: any) => {
            return {
              data: item,
              label: item?.DisplayAs,
              value: item?.value,
            };
          })}
          onChange={(e) => {
            // setFlag(e.label);
            formik.setFieldValue("userTimezone", e.value);
          }}
        />
        {formik.touched.userTimezone && formik.errors.userTimezone && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.userTimezone}</span>
            </div>
          </div>
        )}
      </div>
      {/* begin::Form group */}
      <div className="fv-row mb-10">
        <div className="form-check form-check-custom form-check-solid cursor-pointer">
          <input
            className="form-check-input"
            type="checkbox"
            id="emergency"
            {...formik.getFieldProps("emergency")}
          />
          <label
            className="form-check-label fw-bold text-gray-700 fs-6"
            htmlFor="emergency"
          >
            Emergency
          </label>
          {formik.touched.emergency && formik.errors.emergency && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.emergency}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="fv-row mb-10">
        <div className="form-check form-check-custom form-check-solid">
          <input
            className="form-check-input"
            type="checkbox"
            id="kt_login_toc_agree"
            {...formik.getFieldProps("acceptTerms")}
          />
          <label
            className="form-check-label fw-bold text-gray-700 fs-6"
            htmlFor="kt_login_toc_agree"
          >
            I Agree the{" "}
            <Link to="/auth/terms" className="ms-1 link-primary">
              terms and conditions
            </Link>
            .
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.acceptTerms}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="text-center">
        <button
          type="submit"
          id="kt_sign_up_submit"
          className="btn btn-lg btn-primary w-100 mb-5"
          disabled={
            formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms
          }
        >
          {!loading && <span className="indicator-label">Submit</span>}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              Please wait...{" "}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
        <Link to="/users/list">
          <button
            type="button"
            id="kt_login_signup_form_cancel_button"
            className="btn btn-lg btn-light-primary w-100 mb-5"
          >
            Cancel
          </button>
        </Link>
      </div>
      {/* end::Form group */}
    </form>
  );
}
