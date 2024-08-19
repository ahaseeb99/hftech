import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { Col, Row } from "react-bootstrap";

import {
  ACTION_getUserById,
  ACTION_updateUser,
} from "../../../../store/users/actions";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import moment from "moment";
import { current } from "@reduxjs/toolkit";
import { ACTION_getRolesNames } from "../../../../store/roles/actions";

const editLocationSchema = Yup.object().shape({
  FirstName: Yup.string().optional(),
  LastName: Yup.string().optional(),
  phone: Yup.string().optional(),
  status: Yup.string().optional(),
  email: Yup.string().optional().email(),
  title: Yup.string().optional(),
  // role: Yup.string().optional(),
  corrigoId: Yup.string().optional(),
});

export const userStatusData = [
  {
    label: "ACTIVE",
    value: "1"
  },
  {
    label: "INACTIVE",
    value: "2"
  },
  {
    label: "SUSPENDED",
    value: "3"
  }
]


const timeZones = moment.tz.zonesForCountry('US');
const timeZoneOptions = timeZones?.map(x => ({DisplayAs: x, value: x}));

console.log(timeZones);


const UserForm: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const currentUser = useSelector((state: any) => state.users.userDetail);
  const userRole = useSelector((state: any) => state.roles.rolesNameList);
  

  useEffect(() => {
    const id = window.location.pathname.split("/")[3];
    dispatch(ACTION_getUserById(id));
    dispatch(ACTION_getRolesNames())
  }, []);
 

  const formik = useFormik({
    initialValues: {
      FirstName: currentUser?.FirstName ? currentUser.FirstName : "",
      LastName: currentUser?.LastName ? currentUser.LastName : "",
      phone: currentUser?.contact ? currentUser.contact : "",
      personalContact: currentUser?.personalContact ? currentUser.personalContact : "",
      intelId: currentUser?.intelId ? currentUser.intelId : "",
      emergency: currentUser?.emergency ? currentUser.emergency : false,
      status: currentUser?.status ? currentUser.status : "",
      email: currentUser?.email ? currentUser.email : "",
      title: currentUser?.title ? currentUser.title : "",
      role: currentUser?.role ? currentUser.role : "",
      corrigoId: currentUser?.corrigoId ? currentUser.corrigoId : "",
      userTimezone: currentUser?.userTimezone ,
    },
    enableReinitialize: true,
    validationSchema: editLocationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmitUserForm();
    },
  });

  const handleSubmitUserForm = async () => {
    console.log("FORM IS SUBMITTED");
    let reqData = {
      _id: currentUser._id,
      FirstName: formik.values.FirstName,
      LastName: formik.values.LastName,
      contact: formik.values.phone,
      personalContact: formik.values.personalContact,
      intelId: formik.values.intelId,
      emergency: formik.values.emergency,
      title: formik.values.title,
      email: formik.values.email,
      role: formik.values.role,
      status: formik.values.status,
      corrigoId: formik.values.corrigoId,
      userTimezone: formik.values.userTimezone
    };
    dispatch(ACTION_updateUser(reqData, navigate));
  };

  console.log({currentUser})

  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <div className="fv-row mb-7">
        <Row>
          <Col>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">First Name</label>
              <input
                {...formik.getFieldProps("FirstName")}
                type="text"
                placeholder="First Name...."
                defaultValue={currentUser?.FirstName}
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.FirstName && formik.errors.FirstName,
                  },
                  {
                    "is-valid":
                      formik.touched.FirstName && !formik.errors.FirstName,
                  }
                )}
                autoComplete="off"
              />
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Last Name</label>
              <input
                {...formik.getFieldProps("LastName")}
                type="text"
                placeholder="Last Name...."
                defaultValue={currentUser?.LastName}
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.LastName && formik.errors.LastName,
                  },
                  {
                    "is-valid":
                      formik.touched.LastName && !formik.errors.LastName,
                  }
                )}
                autoComplete="off"
              />
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Email</label>
              <input
                {...formik.getFieldProps("email")}
                type={"text"}
                name="email"
                defaultValue={currentUser?.email}
                placeholder="Email..."
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
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Phone</label>
              <input
                {...formik.getFieldProps("phone")}
                type={"text"}
                name="phone"
                defaultValue={currentUser?.contact}
                placeholder="Phone..."
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.phone && formik.errors.phone,
                  },
                  {
                    "is-valid": formik.touched.phone && !formik.errors.phone,
                  }
                )}
                autoComplete="off"
              />
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Personal Phone</label>
              <input
                {...formik.getFieldProps("personalContact")}
                type={"text"}
                name="personalContact"
                defaultValue={currentUser?.personalContact}
                placeholder="Personal Phone..."
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.personalContact && formik.errors.personalContact,
                  },
                  {
                    "is-valid": formik.touched.personalContact && !formik.errors.personalContact,
                  }
                )}
                autoComplete="off"
              />
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Intel ID</label>
              <input
                {...formik.getFieldProps("intelId")}
                type={"text"}
                name="intelId"
                defaultValue={currentUser?.intelId}
                placeholder="Intel Id..."
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.intelId && formik.errors.intelId,
                  },
                  {
                    "is-valid": formik.touched.intelId && !formik.errors.intelId,
                  }
                )}
                autoComplete="off"
              />
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Corrigo Id</label>
              <input
                {...formik.getFieldProps("corrigoId")}
                type={"text"}
                name="corrigoId"
                defaultValue={currentUser?.corrigoId}
                placeholder="Corrigo Id..."
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.corrigoId && formik.errors.corrigoId,
                  },
                  {
                    "is-valid":
                      formik.touched.corrigoId && !formik.errors.corrigoId,
                  }
                )}
                autoComplete="off"
              />
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Title</label>
              <input
                {...formik.getFieldProps("title")}
                type={"text"}
                name="title"
                defaultValue={currentUser?.title}
                placeholder="Title..."
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.title && formik.errors.title,
                  },
                  {
                    "is-valid": formik.touched.title && !formik.errors.title,
                  }
                )}
                autoComplete="off"
              />
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Status</label>
              <CustomDropdown
                {...formik.getFieldProps("status")}
                name="status"
                value={{label : currentUser?.status}}
                className=""
                options={(userStatusData as any).map((item: any) => {
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
              <label className="fw-bold fs-6 mb-2">Role</label>
              <CustomDropdown
                {...formik.getFieldProps("role")}
                name="role"
                value={{label : currentUser?.role?.name}}
                className=""
                options={(userRole as any).map((item: any) => {
                  return {
                    label: item?.name,
                    value: item?._id,
                  };
                })}
                onChange={(e) => {
                  formik.setFieldValue("role", e.value);
                }}
              />
            </div>

            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Time zone</label>
              <CustomDropdown
                {...formik.getFieldProps("userTimezone")}
                name="userTimezone"
                className=""
                value={{label: currentUser?.userTimezone}}
                options={(timeZoneOptions as any).map((item: any) => {
                  return {
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
                    {/* <span role="alert">{formik.errors.userTimezone}</span> */}
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
          <div className="fv-row mb-10">
        <div className="form-check form-check-custom form-check-solid cursor-pointer">
          <input
            className="form-check-input"
            type="checkbox"
            checked={formik?.values?.emergency}
            id="emergency"
            onChange={(e) => {
              formik.setFieldValue("emergency", e.target.checked);
            }}
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
                {/* <span role="alert">{formik.errors.emergency}</span> */}
              </div>
            </div>
          )}
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
              navigate(
                `${
                  currentUser?.role.name === "ADMIN"
                    ? "/users/list"
                    : `/users/view/${currentUser?._id}`
                }`
              );
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

export default UserForm;
