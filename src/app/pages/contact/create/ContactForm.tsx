import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import _uniq from "lodash/uniq";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import {
  ACTION_createLocation,
  ACTION_getCountries,
  ACTION_getLocationDetail,
} from "../../../../store/location/actions";
import { ACTION_getLocationList } from "../../../../store/location/actions";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import { ACTION_createContact } from "../../../../store/contact/actions";
import { ACTION_getClients } from "../../../../store/client/actions";

const phoneRegExp =
  /^(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/;

const editLocationSchema = Yup.object().shape({
  fullName: Yup.string().required("Name is required"),
  phoneNumber: Yup.string()
    // .required("Phone number is required")
    .matches(phoneRegExp, "Phone number is not valid"),
  emailAddress: Yup.string()
    // .required("Email address is required")
    .email("Please enter valid email address!"),
});

const ContactForm: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const clientsList = useSelector(
    (state: any) => state.client.clientsData.clients
  );
  const { user } = useSelector((state: any) => state.auth);


  useEffect(() => {
    dispatch(ACTION_getCountries());
    dispatch(ACTION_getLocationList());
    dispatch(ACTION_getClients());
  }, []);

 
  const { countriesData, locationDetail } = useSelector(
    (state: any) => state.location
  );

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      emailAddress: "",
      clientId: ""
    },
    validationSchema: editLocationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmitContactForm();
    },
  });

  const handleSubmitContactForm = async () => {
    console.log("Create conatct is called");
    let reqData = {
      fullName: formik.values.fullName,
      phoneNumber: formik.values.phoneNumber,
      emailAddress: formik.values.emailAddress,
      clientId: formik.values.clientId,
      updatedBy: user?._id 
    };
    console.log("create contact playload : ", reqData);
    dispatch(ACTION_createContact(reqData, navigate));
  };

  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <div className="fv-row mb-7">
        <Row>
          <Col>
          <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Client</label>
              <CustomDropdown
                {...formik.getFieldProps("clientId")}
                name="clientId"
                className=""
                options={clientsList?.map((item: any) => {
                  return {
                    data: item,
                    label: item?.DisplayAs,
                    value: item?._id,
                  };
                })}
                onChange={(e) => {
                  formik.setFieldValue("clientId", e.value);
                }}
              />
              {formik.touched.clientId && formik.errors.clientId && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.clientId}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Name</label>
              <input
                {...formik.getFieldProps("fullName")}
                type="text"
                name="fullName"
                placeholder="Name..."
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.fullName && formik.errors.fullName,
                  },
                  {
                    "is-valid": formik.touched.fullName && !formik.errors.fullName,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.fullName}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Phone Number</label>
              <input
                {...formik.getFieldProps("phoneNumber")}
                type={"text"}
                name="phoneNumber"
                placeholder="Phone Number..."
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.phoneNumber && formik.errors.phoneNumber,
                  },
                  {
                    "is-valid":
                      formik.touched.phoneNumber && !formik.errors.phoneNumber,
                  }
                )}
                autoComplete="off"
                onKeyPress={(e) => { 
                  if(! /([0-9- ]+)/.test(e.key)) { e.preventDefault(); }
                }}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik?.errors?.phoneNumber}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Email</label>
              <input
                {...formik.getFieldProps("emailAddress")}
                type={"text"}
                name="emailAddress"
                placeholder="Email..."
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.emailAddress && formik.errors.emailAddress,
                  },
                  {
                    "is-valid":
                      formik.touched.emailAddress &&
                      !formik.errors.emailAddress,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.emailAddress && formik.errors.emailAddress && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.emailAddress}</span>
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
              navigate("/contact/list");
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

export default ContactForm;
