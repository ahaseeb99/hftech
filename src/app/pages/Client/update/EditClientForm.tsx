import React, { useEffect, useState } from "react";
import { object, string } from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import _remove from "lodash/remove";

import { useNavigate } from "react-router-dom";

import _ from "lodash";
import { Col, Row } from "react-bootstrap";
import {
  ACTION_getClientById,
  ACTION_getClients,
  ACTION_updateClient,
} from "../../../../store/client/actions";
import { ACTION_getLocationList } from "../../../../store/location/actions";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import { ACTION_createContact } from "../../../../store/contact/actions";

const phoneRegExp =
  /^(\+[0-9])?[ ]?[(]?[0-9]{3}[)]?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

const editClientSchema = object().shape({
  fullName: string().required("Full name is required"),
  prefix: string().required("Prefix is required"),
  phoneNumber: string()
    .matches(phoneRegExp, "Invalid phone number"),
  email: string().max(320, "Invalid").email(),
  description: string(),
});

const addContactScheme = object().shape({
  fullName: string().required("Full name is required"),
  phoneNumber: string()
    .matches(phoneRegExp, "Invalid phone number")
    .required("Phone number is required"),
  email: string().max(320, "Invalid").email().required("Email is required"),
});

export const clientStatusData = [
  {
    label: "ACTIVE",
    value: "1",
  },
  {
    label: "INACTIVE",
    value: "2",
  },
];

const ClientForm: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const { clientsData } = useSelector((state: any) => state.client);

  const { locationsData } = useSelector((state: any) => state.location);
  const locations = locationsData;

  const [search, setSearch] = useState<any>("");
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const { clientDetail } = useSelector((state: any) => state.client);

  const { user } = useSelector((state: any) => state.auth);

  const [modal, setModal] = useState<boolean>(false);
  const [contactInformation, setContactInformation] = useState<any>([]);

  useEffect(() => {
    dispatch(ACTION_getLocationList());
    const id = window.location.pathname.split("/")[3];
    console.log("id : ", id);
    dispatch(ACTION_getClientById(id));
  }, []);

  console.log({ clientDetail });

  useEffect(() => {
    let locationIds: string[] = [];
    clientDetail.location?.length > 0 ? 
      clientDetail?.location?.map((location: any) => {
        locationIds.push(location._id);
      }) : clientDetail?.Spaces?.map((location: any) => {
        locationIds.push(location._id);
      });
    setSelectedLocationIds(locationIds);
    setContactInformation(clientDetail?.Contacts);
  }, [clientDetail]);
 
  

  let formik = useFormik({
    initialValues: {
      fullName: clientDetail?.DisplayAs ? clientDetail?.DisplayAs : "",
      prefix: clientDetail?.prefix ? clientDetail?.prefix : "",
      phoneNumber: clientDetail?.phoneNumber ? clientDetail?.phoneNumber : "",
      email: clientDetail?.emailAddress ? clientDetail?.emailAddress : "",
      description: clientDetail?.description ? clientDetail?.description : "",
      status: clientDetail?.status ? clientDetail.status : "ACTIVE",
    },
    enableReinitialize: true,
    validationSchema: editClientSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmitClientForm();
    },
  });

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

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

  const handleSubmitClientForm = async () => {
    let reqData = {
      _id: clientDetail._id, // id
      userId: user._id,
      Name: formik.values.fullName,
      DisplayAs: formik.values.fullName,
      prefix: formik.values.prefix,
      phoneNumber: formik.values.phoneNumber,
      emailAddress: formik.values.email,
      description: formik.values.description,
      Spaces: selectedLocationIds,
      status: formik.values.status,
      Contacts : contactInformation.filter(contact => contact._id)
    };
    console.log(reqData);
    dispatch(ACTION_updateClient(reqData, navigate));
    contactInformation.length > 0 &&
    contactInformation.filter(item => !item._id).forEach((contact) =>
      dispatch(
        ACTION_createContact(
          {
            ...contact,
            clientId: clientDetail._id
          },
          navigate,
          "/client/list"
        )
      )
    );
  };


  console.log("Status : ",formik.getFieldProps("status").value)

  const AddContactsModal = () => {
    const contactFormik = useFormik({
      initialValues: {
        fullName: "",
        phoneNumber: "",
        email: "",
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
          emailAddress: contactFormik.values.email,
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
                        autoComplete="off"
                        // required
                        // onChange={(e) => {
                        // 	setAddContactFullName(e.target.value)
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
                      <input
                        {...contactFormik.getFieldProps("phoneNumber")}
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        autoComplete="off"
                        // required
                        // value={addContactPhone}
                        // onChange={(e) => {
                        // 	setAddContactPhone(e.target.value)
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
                      <input
                        {...contactFormik.getFieldProps("email")}
                        type="text"
                        name="email"
                        placeholder="Email"
                        autoComplete="off"
                        // required
                        // onChange={(e) => {
                        // 	setAddContactEmail(e.target.value)
                        // }}
                        className={clsx(
                          "form-control form-control-solid mb-3 mb-lg-0",
                          {
                            "is-invalid":
                              contactFormik.touched.email &&
                              contactFormik.errors.email,
                          },
                          {
                            "is-valid":
                              contactFormik.touched.email &&
                              !contactFormik.errors.email,
                          }
                        )}
                      />
                      {contactFormik.touched.email &&
                        contactFormik.errors.email && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">
                                {contactFormik.errors.email}
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
                              onClick={() => handleAddContacts()}
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
                  Client Full Name
                </label>
                <input
                  {...formik.getFieldProps("fullName")}
                  type="text"
                  name="fullName"
                  placeholder="Client Full Name"
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    {
                      "is-invalid":
                        formik.touched.fullName && formik.errors.fullName,
                    },
                    {
                      "is-valid":
                        formik.touched.fullName && !formik.errors.fullName,
                    }
                  )}
                  autoComplete="off"
                />
                {formik.touched.fullName &&
                  typeof formik.errors.fullName === "string" &&
                  formik.errors.fullName && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.fullName}</span>
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
                      "is-invalid":
                        formik.touched.prefix && formik.errors.prefix,
                    },
                    {
                      "is-valid":
                        formik.touched.prefix && !formik.errors.prefix,
                    }
                  )}
                  autoComplete="off"
                />
                {formik.touched.prefix &&
                  typeof formik.errors.prefix === "string" &&
                  formik.errors.prefix && (
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
                {formik.touched.phoneNumber &&
                  typeof formik.errors.phoneNumber === "string" &&
                  formik.errors.phoneNumber && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.phoneNumber}</span>
                      </div>
                    </div>
                  )}
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Email</label>
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
                {formik.touched.email &&
                  typeof formik.errors.email === "string" &&
                  formik.errors.email && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.email}</span>
                      </div>
                    </div>
                  )}
              </div>
              <div className="fv-row mb-7">
                      <label className="fw-bold fs-6 mb-2">Status</label>
                      <CustomDropdown
                        {...formik.getFieldProps("status")}
                        name="status"
                        value={{ label: formik.getFieldProps("status").value }}
                        className=""
                        options={(clientStatusData as any).map((item: any) => {
                          return {
                            label: item?.label,
                            value: item?.value,
                          };
                        })}
                        onChange={(e) => {
                          formik.setFieldValue("status", e.label);
                        }}
                      />
                    </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">
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
                {formik.touched.description &&
                  typeof formik.errors.description === "string" &&
                  formik.errors.description && (
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
                                  <div
                                    key={location._id}
                                    className="form-control fv-row mb-2"
                                  >
                                      <div>
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={location._id}
                                          checked={selectedLocationIds?.includes(location._id)}
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
                                  <>
                                    <li
                                      className="form-control d-flex justify-content-between align-items-center"
                                      style={{ padding: "10px 6px" }}
                                    >
                                      <span
                                        style={{
                                          cursor: "pointer",
                                          fontSize: "10px",
                                        }}
                                        onClick={() =>
                                          onHandleDeleteContact(key)
                                        }
                                      >
                                        <i
                                          className="bi bi-trash-fill"
                                          style={{
                                            color: "#ff1744",
                                            fontSize: "1.2rem",
                                          }}
                                        ></i>
                                      </span>
                                      <span>{contact.fullName}</span>|
                                      <span>{contact.phoneNumber}</span>|
                                      <span>{contact.emailAddress}</span>
                                    </li>
                                    <br />
                                  </>
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
