import React, {useState} from "react";
import { useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import * as Yup from "yup";
import { ACTION_createRole } from "../../../../store/roles/actions";

const roleSchema = Yup.object().shape({
    name: Yup.string().required("Role Name is required"),
  });

export const RoleForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const dispatch: any = useDispatch();
    const navigate: any = useNavigate();
    // const initialValues = roleDetail.permissions
    let formik = useFormik({
        initialValues: {
            name: "",
            permissions: {
                estimates: [],
                locations: [],
                contacts: [],
                workorders: [],
                users: [],
                calendar: [],
                clients: [],
                tasks: []
            }
        },
        validationSchema: roleSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
          setLoading(true);
          handleSubmitRoleForm();
        if (formik.isValid) {
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

      const handleAccessChange = (feature, access, e ) => {
        if (!e.target.checked) {
          let featureValue = formik.values.permissions[`${feature}`]
          let permissions = formik.values.permissions;
          const index = featureValue.indexOf(access)
          if (index > -1) { // only splice array when item is found
            featureValue.splice(index, 1); // 2nd parameter means remove one item only
          }
          permissions[`${feature}`] = featureValue
          formik.setFieldValue("permissions", permissions );
      } else {
        let permissions = formik.values.permissions;
        let featureValue = formik.values.permissions[feature]
        featureValue.push(access)
        permissions[`${feature}`] = featureValue
        formik.setFieldValue("permissions", permissions );
        }
      }

      const handleSubmitRoleForm = () => {
        let reqData = {
            name: formik.values.name.toUpperCase(),
            permissions: formik.values.permissions
        }
        dispatch(ACTION_createRole(reqData, navigate));
      }
   
    return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      noValidate
      id="kt_login_signup_form"
      onSubmit={formik.handleSubmit}
    >
        {/* <div className="mb-10 text-center">
            <h1 className="text-dark mb-3"> </h1>
      </div> */}
      <div className="fv-row mb-7">
        <label className="required fw-bold fs-6 mb-2">Role Name</label>
        <input
        {...formik.getFieldProps("name")}
        type="text"
        name="name"
        placeholder="Name..."
        className={clsx(
            "form-control form-control-solid mb-3 mb-lg-0",
            {
            "is-invalid": formik.touched.name && formik.errors.name,
            },
            {
            "is-valid": formik.touched.name && !formik.errors.name,
            }
        )}
        autoComplete="off"
        />
        {formik.touched.name && formik.errors.name && (
        <div className="fv-plugins-message-container">
            <div className="fv-help-block">
            <span role="alert">{formik.errors.name}</span>
            </div>
        </div>
        )}
    </div>
      {
        Object.keys(formik.values.permissions).map(permission => {
          return (
            <div className="fv-row mb-7">
              <div>
                  <label className="required fw-bold fs-6 mb-2">{permission}</label>
                  <Row className="m-5">
                    <Col>
                      <div className="form-check form-check-custom form-check-solid cursor-pointer">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            //@ts-ignore
                            checked={formik.values?.permissions?.[`${permission.toLowerCase()}`].length ? formik.values?.[`${permission.toLowerCase()}`]?.includes('list') : false }
                            onChange={e => {handleAccessChange(permission.toLowerCase(), 'list', e)}}
                            // {...formik.getFieldProps("emergency")}
                        />
                        <label
                            className="form-check-label fw-bold text-gray-700 fs-6"
                            htmlFor="emergency"
                        >
                            Listing
                        </label>
                      </div>
                    </Col>
                    <Col>
                      <div className="form-check form-check-custom form-check-solid cursor-pointer">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            //@ts-ignore
                            checked={formik.values?.permissions?.[`${permission.toLowerCase()}`].length ? formik.values?.[`${permission.toLowerCase()}`]?.includes('view') : false }
                            onChange={e => {handleAccessChange(permission.toLowerCase(), 'view', e)}}
                            // {...formik.getFieldProps("emergency")}
                        />
                        <label
                            className="form-check-label fw-bold text-gray-700 fs-6"
                            htmlFor="emergency"
                        >
                            view
                        </label>
                      </div>
                    </Col>
                    <Col>
                      <div className="form-check form-check-custom form-check-solid cursor-pointer">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            //@ts-ignore
                            checked={formik.values?.permissions?.[`${permission.toLowerCase()}`].length ? formik.values?.[`${permission.toLowerCase()}`]?.includes('create') : false }
                            onChange={e => {handleAccessChange(permission.toLowerCase(), 'create', e)}}
                            // {...formik.getFieldProps("emergency")}
                        />
                        <label
                            className="form-check-label fw-bold text-gray-700 fs-6"
                            htmlFor="emergency"
                        >
                            create
                        </label>
                      </div>
                    </Col>
                  </Row>
                  <Row className="m-5">
                    <Col>
                      <div className="form-check form-check-custom form-check-solid cursor-pointer">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            //@ts-ignore
                            checked={formik.values?.permissions?.[`${permission.toLowerCase()}`].length ? formik.values?.[`${permission.toLowerCase()}`]?.includes('update') : false }
                            onChange={e => {handleAccessChange(permission.toLowerCase(), 'update', e)}}
                            // {...formik.getFieldProps("emergency")}
                        />
                        <label
                            className="form-check-label fw-bold text-gray-700 fs-6"
                            htmlFor="emergency"
                        >
                            update
                        </label>
                      </div>
                    </Col>
                    <Col>
                      <div className="form-check form-check-custom form-check-solid cursor-pointer">
                        <input
                            className="form-check-input"
                            type="checkbox"
                          //@ts-ignore
                          checked={formik.values?.permissions?.[`${permission.toLowerCase()}`].length ? formik.values?.[`${permission.toLowerCase()}`]?.includes('delete') : false }
                          onChange={e => {handleAccessChange(permission.toLowerCase(), 'delete', e)}}
                        />
                        <label
                            className="form-check-label fw-bold text-gray-700 fs-6"
                            htmlFor="emergency"
                        >
                            delete
                        </label>
                      </div>
                    </Col>
                  {permission == 'workorders'  || permission == "estimates" || permission == "locations" || permission == "tasks" ?
                    <Col>
                      <div className="form-check form-check-custom form-check-solid cursor-pointer">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          //@ts-ignore
                          checked={formik.values?.permissions?.[`${permission.toLowerCase()}`].length ? formik.values?.[`${permission.toLowerCase()}`]?.includes('delete') : false}
                          onChange={e => { handleAccessChange(permission.toLowerCase(), 'financial documents', e) }}
                        // {...formik.getFieldProps("emergency")}
                        />
                        <label
                          className="form-check-label fw-bold text-gray-700 fs-6"
                          htmlFor="emergency"
                        >
                          View Financial Documents
                        </label>
                      </div>
                    </Col> : (
                      <Col>
                      </Col>
                    )
                  }
                  </Row>
              </div>
            </div>
          )
        })
      }
      <div className="text-end pt-15">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
    </form>
    )
}