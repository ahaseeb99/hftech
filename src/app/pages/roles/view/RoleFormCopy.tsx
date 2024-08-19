import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  ACTION_getUserById,
  ACTION_updateUser,
} from "../../../../store/users/actions";
import { useNavigate } from "react-router-dom";

const initialValues = {
    estimates: [],
    locations: [],
    contacts: [],
    workorders: []
  };

const featuresList = [
  'Estimates',
  'Contacts',
  'Clients',
  'Locations',
  'Workorders',
]


const RoleFormCopy: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const currentUser = useSelector((state: any) => state.users.userDetail);
    const permissons = currentUser.permissions;
    console.log('permissons', permissons)
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      const id = window.location.pathname.split("/")[3];
      dispatch(ACTION_getUserById(id));
    }, []);
    const initialValues = permissons
    let formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
          setLoading(true);
          handleSubmitPermissionForm();
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
    console.log('formik', formik.values)


    const handleFeatureChange = (feature: any, e:any) => {
        if (e.target.checked) {
            let featureValue = formik.values['feature']
            featureValue = ['list', 'view', 'update', 'create', 'delete']
            formik.setFieldValue(`${feature}`, featureValue );
        } else {
          formik.setFieldValue(`${feature}`, [] );
        }
    }

    const handleAccessChange = (feature, access, e ) => {
      // debugger
      if (!e.target.checked) {
        let featureValue = formik.values[`${feature}`]
        const index = featureValue.indexOf(access)
        if (index > -1) { // only splice array when item is found
          featureValue.splice(index, 1); // 2nd parameter means remove one item only
        }
        formik.setFieldValue(`${feature}`, featureValue );
    } else {
      let featureValue = formik.values[feature]
      featureValue.push(access)
      formik.setFieldValue(`${feature}`, featureValue );
      }
    }

    

    const handleSubmitPermissionForm = ( ) => {
      console.log('formik.values', formik.values);
      let reqData = {
        _id: currentUser._id,
        permissions: formik.values
      };
      dispatch(ACTION_updateUser(reqData, navigate));
    }

  return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      noValidate
      id="kt_login_signup_form"
      onSubmit={formik.handleSubmit}
    >
        <div className="mb-10 text-center">
            <h1 className="text-dark mb-3">User Management Roles for {`${currentUser.FirstName} ${currentUser.LastName}`}</h1>
      </div>
      {
        featuresList.map(fature => {
          return (
            <div className="fv-row mb-7">
              <div>
                  <label className="required fw-bold fs-6 mb-2">{fature}</label>
                  <Row className="m-5">
                    <Col>
                      <div className="form-check form-check-custom form-check-solid cursor-pointer">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            //@ts-ignore
                            checked={formik.values?.[`${fature.toLowerCase()}`].length ? formik.values?.[`${fature.toLowerCase()}`]?.includes('list') : false }
                            onChange={e => {handleAccessChange(fature.toLowerCase(), 'list', e)}}
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
                            checked={formik.values?.[`${fature.toLowerCase()}`].length ? formik.values?.[`${fature.toLowerCase()}`]?.includes('view') : false }
                            onChange={e => {handleAccessChange(fature.toLowerCase(), 'view', e)}}
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
                            checked={formik.values?.[`${fature.toLowerCase()}`].length ? formik.values?.[`${fature.toLowerCase()}`]?.includes('create') : false }
                            onChange={e => {handleAccessChange(fature.toLowerCase(), 'create', e)}}
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
                            checked={formik.values?.[`${fature.toLowerCase()}`].length ? formik.values?.[`${fature.toLowerCase()}`]?.includes('update') : false }
                            onChange={e => {handleAccessChange(fature.toLowerCase(), 'update', e)}}
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
                          checked={formik.values?.[`${fature.toLowerCase()}`].length ? formik.values?.[`${fature.toLowerCase()}`]?.includes('delete') : false }
                          onChange={e => {handleAccessChange(fature.toLowerCase(), 'delete', e)}}
                            // {...formik.getFieldProps("emergency")}
                        />
                        <label
                            className="form-check-label fw-bold text-gray-700 fs-6"
                            htmlFor="emergency"
                        >
                            delete
                        </label>
                      </div>
                    </Col>
                    <Col>
                    </Col>
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
    );
};

export default RoleFormCopy;
