import React, { useEffect, useState } from "react";
import { object, string } from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import * as Yup from "yup";
import _find from "lodash/find";
import _uniq from "lodash/uniq";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { ACTION_createClient } from "../../../../store/client/actions";
import {
  ACTION_getCountries,
  ACTION_getLocationList,
} from "../../../../store/location/actions";
import { ACTION_createContact } from "../../../../store/contact/actions";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import { toastify } from "../../../../components/toastify/toastify";

const phoneRegExp =
  /^(\+[0-9])?[ ]?[(]?[0-9]{3}[)]?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
// const phoneRegExp = /^(\+[0-9])?[ ]?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

const editClientSchema = object().shape({
  Name: string().required("Full name is required"),
  prefix: string().required("Prefix is required"),
  phoneNumber: string()
    .matches(phoneRegExp, "Invalid phone number")
    ,
  email: string().max(320, "Invalid").email(),
  description: string(),
});

const addContactScheme = object().shape({
  fullName: string().required("Full name is required"),
  phoneNumber: string().matches(phoneRegExp, "Invalid phone number").required("Phone number is required"),
  emailAddress: string().max(320, "Invalid").email().required("Email is required"),
});

const addLocationSchema = Yup.object().shape({
  locationName: Yup.string().required("Full name is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  street: Yup.string().required("Street is required"),
});

const ClientForm: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const { locationsData } = useSelector((state: any) => state.location);
  const { user } = useSelector((state: any) => state.auth);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [locationModal, setLocationModal] = useState<boolean>(false)
  const [contactInformation, setContactInformation] = useState<any>([]);
  const [locationInformation, setLocationInformation] = useState<any>([]);
  const [contact, setContact] = useState<any>([]);
  const locations = locationsData;

  const { countriesData } = useSelector((state: any) => state.location);

  const [search, setSearch] = useState<any>("");


  useEffect(() => {
    dispatch(ACTION_getLocationList());
    dispatch(ACTION_getCountries());
  }, []);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleLocationIds = (e: any, id: string[] = []) => {
    let array: any[] = [...selectedLocationIds];

    if (e.target.checked) {
      array.push(id);
      setSelectedLocationIds(array);
    } else {
      array = array.filter((element) => element !== id);
      setSelectedLocationIds(array);
    }
  };

  const handleOpenModal = () => {
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  const onHandleDeleteContact = (index: any) => {
    let array: any[] = [];
    contactInformation.map((contact: any, key: any) => {
      if (index !== key) {
        array.push(contact);
      }
    });

    setContactInformation(array);
  };

  const formik = useFormik({
    initialValues: {
      Name: "",
      DisplayAs: "",
      prefix: "",
      phoneNumber: "",
      email: "",
      description: "",
      IsRemoved: false,
      status: "ACTIVE",
    },
    validationSchema: editClientSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmitClientForm();
    },
  });

  const handleSubmitClientForm = async () => {
    let reqData = {
      userId: user._id,
      Name: formik.values.Name,
      prefix: formik.values.prefix,
      phoneNumber: formik.values.phoneNumber,
      emailAddress: formik.values.email,
      DisplayAs: formik.values.Name,
      description: formik.values.description,
      IsRemoved: formik.values.IsRemoved,
      status: formik.values.status,
      Spaces: selectedLocationIds,
    };
    const newClient = await ACTION_createClient(reqData, navigate);
    
    contactInformation.length > 0 &&
      contactInformation.forEach((contact) =>
        dispatch(
          ACTION_createContact(
            {
              ...contact,
              clientId: newClient?.data?.data?._id
            },
            navigate,
            "/client/list"
          )
        )
      );
      if(newClient?.status === 201){
        toastify.Success(newClient.data.message);
        navigate('/client/list')
      }
  };

  const AddContactsModal = () => {
    const contactFormik = useFormik({
      initialValues: {
        fullName: "",
        phoneNumber: "",
        emailAddress: "",
      },
      validationSchema: addContactScheme,
      onSubmit: async (values, { setSubmitting }) => {
        setSubmitting(true);
        handleAddContacts();
      },
    });
    const handleAddContacts = () => {
      setContactInformation([
        ...contactInformation,
        {
          fullName: contactFormik.values.fullName,
          phoneNumber: contactFormik.values.phoneNumber,
          emailAddress: contactFormik.values.emailAddress,
        },
      ]);
      handleCloseModal();
    };

    return (
      <>
        <div
          className="modal fade show d-block"
          id="kt_modal_add_user"
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-md"
            style={{ width: "90px !important" }}
          >
            <div className="modal-content">
              <div
                className="modal-body scroll-y mx-5 mx-xl-15 my-7"
                // style={{ textAlign: "center" }}
              >
                <div
                  style={{
                    display: "block",
                    fontSize: "20px",
                    paddingTop: "5px",
                  }}
                ></div>
                <form className="form" onSubmit={contactFormik.handleSubmit}>
                  <div>
                    <div className="fv-row mb-5">
                      <label className="required fw-bold fs-6 mb-2 d-flex justify-content-lg-start">
                        Full Name
                      </label>
                      <input
                        {...contactFormik.getFieldProps("fullName")}
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        // onChange={(e) => {
                        //   setAddContactDisplayAs(e.target.value);
                        // }}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                          {
                            "is-invalid":
                              contactFormik.touched.fullName &&
                              contactFormik.errors.fullName,
                          },
                          {
                            "is-valid":
                              contactFormik.touched.fullName &&
                              !contactFormik.errors.fullName,
                          }
                        )}
                        autoComplete="off"
                      />
                      {contactFormik.touched.fullName &&
                        contactFormik.errors.fullName && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">
                                {contactFormik.errors.fullName}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="fv-row mb-5">
                      <label className="fw-bold fs-6 mb-2 d-flex justify-content-lg-start">
                        Phone Number
                      </label>
                      {/*<input*/}
                      {/*  type="text"*/}
                      {/*  name="phoneNumber"*/}
                      {/*  placeholder="Phone Number"*/}
                      {/*  className="form-control form-control-solid mb-3 mb-lg-0"*/}
                      {/*  autoComplete="off"*/}
                      {/*  required*/}
                      {/*  value={addContactPhone}*/}
                      {/*  onChange={(e) => {*/}
                      {/*    setAddContactPhone(e.target.value);*/}
                      {/*  }}*/}
                      {/*/>*/}
                      <input
                        {...contactFormik.getFieldProps("phoneNumber")}
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        // onChange={(e) => {
                        //   setAddContactPhone(e.target.value);
                        // }}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                          {
                            "is-invalid":
                              contactFormik.touched.phoneNumber &&
                              contactFormik.errors.phoneNumber,
                          },
                          {
                            "is-valid":
                              contactFormik.touched.phoneNumber &&
                              !contactFormik.errors.phoneNumber,
                          }
                        )}
                        autoComplete="off"
                      />
                      {contactFormik.touched.phoneNumber &&
                        contactFormik.errors.phoneNumber && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">
                                {contactFormik.errors.phoneNumber}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2 d-flex justify-content-lg-start">
                        Email
                      </label>
                      {/*<input*/}
                      {/*  type="text"*/}
                      {/*  name="email"*/}
                      {/*  placeholder="Email"*/}
                      {/*  className="form-control form-control-solid mb-3 mb-lg-0"*/}
                      {/*  autoComplete="off"*/}
                      {/*  required*/}
                      {/*  onChange={(e) => {*/}
                      {/*    setAddContactEmail(e.target.value);*/}
                      {/*  }}*/}
                      {/*/>*/}
                      <input
                        {...contactFormik.getFieldProps("emailAddress")}
                        type="text"
                        name="emailAddress"
                        placeholder="Email"
                        // onChange={(e) => {
                        //   setAddContactEmail(e.target.value);
                        // }}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                          {
                            "is-invalid":
                              contactFormik.touched.emailAddress &&
                              contactFormik.errors.emailAddress,
                          },
                          {
                            "is-valid":
                              contactFormik.touched.emailAddress &&
                              !contactFormik.errors.emailAddress,
                          }
                        )}
                        autoComplete="off"
                      />
                      {contactFormik.touched.emailAddress &&
                        contactFormik.errors.emailAddress && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">
                                {contactFormik.errors.emailAddress}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="d flex">
                      <Row>
                        <Col>
                          <div className="text-end pt-5">
                            <button
                              type="submit"
                              style={{ width: "100%" }}
                              className="btn btn-primary d-flex justify-content-center"
                              // onClick={() => handleAddContacts()}
                            >
                              Submit
                            </button>
                          </div>
                        </Col>
                        <Col>
                          <div className="text-end pt-5">
                            <button
                              style={{ width: "100%" }}
                              type="reset"
                              className="btn btn-secondary"
                              onClick={() => handleCloseModal()}
                            >
                              Cancel
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </>
    );
  };

  const AddLocationsModal = () => {
    const [state, setState] = useState<any>("");
    const [city, setCity] = useState<any>("");
    const locationFormik = useFormik({
      initialValues: {
        locationName: "",
        country: "United States",
        state: "",
        city: "",
        street: "",
        clientId: "",
      },
      validationSchema: addLocationSchema,
      onSubmit: async (values, { setSubmitting }) => {
        setSubmitting(true);
        handleAddLocations();
      },
    });
    const handleAddLocations = () => {
      setLocationInformation([
        ...locationInformation,
        {
          locationName: locationFormik.values.locationName,
          country: locationFormik.values.country,
          state: locationFormik.values.state,
          city: locationFormik.values.city,
          street: locationFormik.values.street,
          longitude: -75,
          latitude: 43,
        },
      ]);
      handleCloseModal();
    };

    return (
      <>
        <div
          className="modal fade show d-block"
          id="kt_modal_add_user"
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-md"
            style={{ width: "90px !important" }}
          >
            <div className="modal-content">
              <div
                className="modal-body scroll-y mx-5 mx-xl-15 my-7"
                // style={{ textAlign: "center" }}
              >
                <div
                  style={{
                    display: "block",
                    fontSize: "20px",
                    paddingTop: "5px",
                  }}
                ></div>
                <form className="form" onSubmit={locationFormik.handleSubmit}>
                  <div>
                    <div className="fv-row mb-5">
                      <label className="required fw-bold fs-6 mb-2 d-flex justify-content-lg-start">
                        Location Name
                      </label>
                      {/*<input*/}
                      {/*  type="text"*/}
                      {/*  name="phoneNumber"*/}
                      {/*  placeholder="Phone Number"*/}
                      {/*  className="form-control form-control-solid mb-3 mb-lg-0"*/}
                      {/*  autoComplete="off"*/}
                      {/*  required*/}
                      {/*  value={addContactPhone}*/}
                      {/*  onChange={(e) => {*/}
                      {/*    setAddContactPhone(e.target.value);*/}
                      {/*  }}*/}
                      {/*/>*/}
                      <input
                        {...locationFormik.getFieldProps("locationName")}
                        type="text"
                        name="locationName"
                        placeholder="Location Name"
                        // onChange={(e) => {
                        //   setAddContactPhone(e.target.value);
                        // }}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                          {
                            "is-invalid":
                              locationFormik.touched.locationName &&
                              locationFormik.errors.locationName,
                          },
                          {
                            "is-valid":
                              locationFormik.touched.locationName &&
                              !locationFormik.errors.locationName,
                          }
                        )}
                        autoComplete="off"
                      />
                      {locationFormik.touched.locationName &&
                        locationFormik.errors.locationName && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">
                                {locationFormik.errors.locationName}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="fv-row mb-5">
                      <label className="required fw-bold fs-6 mb-2 d-flex justify-content-lg-start">
                        Street
                      </label>
                      {/*<input*/}
                      {/*  type="text"*/}
                      {/*  name="phoneNumber"*/}
                      {/*  placeholder="Phone Number"*/}
                      {/*  className="form-control form-control-solid mb-3 mb-lg-0"*/}
                      {/*  autoComplete="off"*/}
                      {/*  required*/}
                      {/*  value={addContactPhone}*/}
                      {/*  onChange={(e) => {*/}
                      {/*    setAddContactPhone(e.target.value);*/}
                      {/*  }}*/}
                      {/*/>*/}
                      <input
                        {...locationFormik.getFieldProps("street")}
                        type="text"
                        name="street"
                        placeholder="Phone Number"
                        // onChange={(e) => {
                        //   setAddContactPhone(e.target.value);
                        // }}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                          {
                            "is-invalid":
                              locationFormik.touched.street &&
                              locationFormik.errors.street,
                          },
                          {
                            "is-valid":
                              locationFormik.touched.street &&
                              !locationFormik.errors.street,
                          }
                        )}
                        autoComplete="off"
                      />
                      {locationFormik.touched.street &&
                        locationFormik.errors.street && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">
                                {locationFormik.errors.street}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2 d-flex justify-content-lg-start">
                        State
                      </label>
                      {/*<input*/}
                      {/*  type="text"*/}
                      {/*  name="email"*/}
                      {/*  placeholder="Email"*/}
                      {/*  className="form-control form-control-solid mb-3 mb-lg-0"*/}
                      {/*  autoComplete="off"*/}
                      {/*  required*/}
                      {/*  onChange={(e) => {*/}
                      {/*    setAddContactEmail(e.target.value);*/}
                      {/*  }}*/}
                      {/*/>*/}
                      <CustomDropdown
                        {...formik.getFieldProps("state")}
                        name="state"
                        className=""
                        value={state}
                        options={
                          countriesData?.states &&
                          (Object.keys(countriesData?.states) as any).map(
                            (item: any) => {
                              return {
                                data: item,
                                label: item,
                                value: item,
                              };
                            }
                          )
                        }
                        onChange={(e) => {
                          setState(e);
                          formik.setFieldValue("state", e.value);
                        }}
                      />
                      {locationFormik.touched.state &&
                        locationFormik.errors.state && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">
                                {locationFormik.errors.state}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="fv-row mb-7">
                      <label className="required fw-bold fs-6 mb-2 d-flex justify-content-lg-start">
                        City
                      </label>
                      {/*<input*/}
                      {/*  type="text"*/}
                      {/*  name="email"*/}
                      {/*  placeholder="Email"*/}
                      {/*  className="form-control form-control-solid mb-3 mb-lg-0"*/}
                      {/*  autoComplete="off"*/}
                      {/*  required*/}
                      {/*  onChange={(e) => {*/}
                      {/*    setAddContactEmail(e.target.value);*/}
                      {/*  }}*/}
                      {/*/>*/}
                      <CustomDropdown
                        {...formik.getFieldProps("city")}
                        name="city"
                        className=""
                        value={city}
                        options={
                          countriesData?.states &&
                          countriesData?.states[locationFormik.values.state]?.map(
                            (item) => {
                              return {
                                data: item,
                                label: item?.name,
                                value: item?.name,
                              };
                            }
                          )
                        }
                        onChange={(e) => {
                          setCity(e);
                          formik.setFieldValue("city", e.value);
                        }}
                      />
                      {locationFormik.touched.city &&
                        locationFormik.errors.city && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">
                                {locationFormik.errors.city}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="d flex">
                      <Row>
                        <Col>
                          <div className="text-end pt-5">
                            <button
                              type="submit"
                              style={{ width: "100%" }}
                              className="btn btn-primary d-flex justify-content-center"
                              // onClick={() => handleAddContacts()}
                            >
                              Submit
                            </button>
                          </div>
                        </Col>
                        <Col>
                          <div className="text-end pt-5">
                            <button
                              style={{ width: "100%" }}
                              type="reset"
                              className="btn btn-secondary"
                              onClick={() => handleCloseModal()}
                            >
                              Cancel
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show"></div>
      </>
    );
  };

  return (
    <>
      {modal && <AddContactsModal />}
      <form className="form" onSubmit={formik.handleSubmit}>
        <div className="fv-row mb-7">
          <Row>
            <Col>
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">
                  Company Name
                </label>
                <input
                  {...formik.getFieldProps("Name")}
                  type="text"
                  name="Name"
                  placeholder="Company Name"
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    {
                      "is-invalid": formik.touched.Name && formik.errors.Name,
                    },
                    {
                      "is-valid": formik.touched.Name && !formik.errors.Name,
                    }
                  )}
                  autoComplete="off"
                />
                {formik.touched.Name && formik.errors.Name && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.Name}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">
                  Prefix
                </label>
                <input
                  {...formik.getFieldProps("prefix")}
                  type="text"
                  name="prefix"
                  placeholder="prefix"
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    {
                      "is-invalid": formik.touched.prefix && formik.errors.prefix,
                    },
                    {
                      "is-valid": formik.touched.prefix && !formik.errors.prefix,
                    }
                  )}
                  autoComplete="off"
                />
                {formik.touched.prefix && formik.errors.prefix && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.prefix}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">
                  Phone Number
                </label>
                <input
                  {...formik.getFieldProps("phoneNumber")}
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    {
                      "is-invalid":
                        formik.touched.phoneNumber && formik.errors.phoneNumber,
                    },
                    {
                      "is-valid":
                        formik.touched.phoneNumber &&
                        !formik.errors.phoneNumber,
                    }
                  )}
                  autoComplete="off"
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.phoneNumber}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="fv-row mb-7">
                <label className=" fw-bold fs-6 mb-2">Email</label>
                <input
                  {...formik.getFieldProps("email")}
                  type="text"
                  name="email"
                  placeholder="Email"
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    {
                      "is-invalid": formik.touched.email && formik.errors.email,
                    },
                    {
                      "is-valid": formik.touched.email && !formik.errors.email,
                    }
                  )}
                  autoComplete="off"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.email}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="fv-row mb-7">
                <label className=" fw-bold fs-6 mb-2">
                  Description
                </label>
                <textarea
                  {...formik.getFieldProps("description")}
                  name="description"
                  rows={3}
                  style={{ height: 200 }}
                  placeholder="Description"
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    {
                      "is-invalid":
                        formik.touched.description && formik.errors.description,
                    },
                    {
                      "is-valid":
                        formik.touched.description &&
                        !formik.errors.description,
                    }
                  )}
                  autoComplete="off"
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{formik.errors.description}</span>
                    </div>
                  </div>
                )}
              </div>
            </Col>

            <Col>
              <div className="card card-custom gutter-b">
                <div className="card-toolbar">
                  <ul className="nav nav-tabs nav-bold nav-tabs-line">
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#kt_tab_pane_1_4"
                      >
                        <span className="nav-text">
                          <label className="fw-bold fs-6 mb-2">Locations</label>
                        </span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#kt_tab_pane_2_4"
                      >
                        <span className="nav-text">
                          <label className="fw-bold fs-6 mb-2">Contacts</label>
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="card-body">
                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="kt_tab_pane_1_4"
                      role="tabpanel"
                      aria-labelledby="kt_tab_pane_1_4"
                    >
                      <div className="fv-row mb-7">
                        <input
                          type="text"
                          className="form-control form-control-solid mb-3"
                          name="search"
                          placeholder="Search Location"
                          autoComplete="off"
                          onChange={(e) =>
                            setSearch(e.target.value.toLowerCase())
                          }
                        />
                        <div style={{
                          maxHeight: '445px',
                          overflow: 'auto',
                          padding: '5px 0'
                        }}>
                          {locations?.length &&
                            locations.map((location: any) => {
                              if (
                                location.locationName
                                  .toString()
                                  .toLowerCase()
                                  .includes(search)
                              ) {
                                return (
                                  <div className="form-control fv-row mb-2">
                                    {selectedLocationIds.includes(
                                      location._id
                                    ) ? (
                                      <div>
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          value=""
                                          id={location._id}
                                          onChange={(e) =>
                                            handleLocationIds(e, location._id)
                                          }
                                          checked={true}
                                        />
                                        <label
                                          id={location._id}
                                          style={{ paddingLeft: "10px" }}
                                          className="form-check-label"
                                          htmlFor="flexCheckDefault"
                                        >
                                          {location.locationName}
                                        </label>
                                      </div>
                                    ) : (
                                      <div>
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          value=""
                                          id={location._id}
                                          onChange={(e) =>
                                            handleLocationIds(e, location._id)
                                          }
                                        />
                                        <label
                                          id={location._id}
                                          style={{ paddingLeft: "10px" }}
                                          className="form-check-label"
                                          htmlFor="flexCheckDefault"
                                        >
                                          {location.locationName}
                                        </label>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            })}
                          </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="kt_tab_pane_2_4"
                      role="tabpanel"
                      aria-labelledby="kt_tab_pane_2_4"
                    >
                      <div className="fv-row mb-7">
                        <button
                          type="button"
                          onClick={() => handleOpenModal()}
                          className="btn btn-primary mb-5"
                          style={{ width: "100%" }}
                        >
                          + Add Contacts
                        </button>

                        <ul className="list-group">
                          {contactInformation?.length !== 0 &&
                            contactInformation?.map(
                              (contact: any, key: number) => {
                                return (
                                  <li className="form-control d-flex justify-content-between align-items-center">
                                    <span
                                      style={{ cursor: "pointer" }}
                                      onClick={() => onHandleDeleteContact(key)}
                                    >
                                      <i
                                        className="bi bi-trash-fill"
                                        style={{
                                          color: "#ff1744",
                                          fontSize: "1.5rem",
                                        }}
                                      ></i>
                                    </span>
                                    <span>{contact.phoneNumber}</span>
                                    <span>{contact.fullName}</span>
                                  </li>
                                );
                              }
                            )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <div className="text-end pt-15">
            <button
              type="reset"
              className="btn btn-light me-3"
              data-kt-users-modal-action="cancel"
              onClick={() => {
                navigate("/client/list");
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
    </>
  );
};

export default ClientForm;
