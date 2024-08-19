import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import { useNavigate } from "react-router-dom";

import _ from "lodash";
import { Col, FormControl, Row } from "react-bootstrap";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import {
  ACTION_getClients,
} from "../../../../store/client/actions";
import { ACTION_getContactById, ACTION_updateContact } from "../../../../store/contact/actions";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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

  const [country, setCountry] = useState<string>("United States");

  const { user } = useSelector((state: any) => state.auth);

  const { locationsData } = useSelector((state: any) => state.location);
  const [locationById, setLocationById] = useState<any>({});
  const [contactId, setContactId] = useState<string>();
  const [state, setState] = useState<any>("");
  const [city, setCity] = useState<any>("");
  const [selectedClient, secSelectedClient] = useState({});

  const currentContact = useSelector(
    (state: any) => state.contacts.contactDetail
  );
  const clientData = useSelector((state: any) => state.client.clientDetail);
  const clientsList = useSelector(
    (state: any) => state.client.clientsData.clients
  );

  useEffect(() => {
    const id = window.location.pathname.split("/")[3];
    setContactId(id);
    dispatch(ACTION_getContactById(id));
    dispatch(ACTION_getClients());
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: currentContact?.fullName ? currentContact?.fullName : "",
      emailAddress: currentContact?.emailAddress
        ? currentContact.emailAddress
        : "",
        phoneNumber: currentContact?.phoneNumber ? currentContact.phoneNumber : "",
      clientId: currentContact?.clientId?._id ? currentContact?.clientId?._id : "",
    },
    enableReinitialize: true,
    validationSchema: editLocationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmitContactForm();
    },
  });

  console.log({currentContact})

  const handleSubmitContactForm = async () => {
    console.log("FORM IS SUBMITTED");
    let reqData = {
      _id: contactId, // id
      fullName: formik.values.fullName,
      emailAddress: formik.values.emailAddress,
      phoneNumber: formik.values.phoneNumber,
      clientId: formik.values.clientId,
    };
    console.log({reqData})
    dispatch(ACTION_updateContact(reqData, navigate));
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
                value={
                  {
                    label: currentContact?.clientId?.DisplayAs,
                    value: currentContact?.clientId?._id
                  }
                }
                className=""
                options={clientsList?.map((item: any) => {
                  return {
                    label: item?.DisplayAs,
                    value: item?._id,
                  };
                })}
                onChange={(e) => {
                  secSelectedClient(e)
                  formik.setFieldValue("clientId", e.value);
                }}
              />
              {formik.touched.clientId && formik.errors.clientId && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{`${formik.errors.clientId}`}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Name</label>
              <input
                {...formik.getFieldProps("fullName")}
                type="text"
                placeholder="Name...."
                defaultValue={currentContact?.fullName}
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
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Phone</label>
              <input
                {...formik.getFieldProps("phoneNumber")}
                type={"text"}
                name="phoneNumber"
                placeholder="Phone Number..."
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.phoneNumber && formik.errors.phoneNumber,
                  },
                  {
                    "is-valid": formik.touched.phoneNumber && !formik.errors.phoneNumber,
                  }
                )}
                autoComplete="off"
                onKeyPress={(e) => { 
                  if(! /([0-9-]+)/.test(e.key)) { e.preventDefault(); }
                }}
              />
            
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
