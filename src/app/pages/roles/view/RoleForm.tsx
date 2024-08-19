import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  ACTION_getRoleDetail,
} from "../../../../store/roles/actions";
import { useNavigate } from "react-router-dom";


const RoleForm: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const { roleDetail } = useSelector((state: any) => state.roles)
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      const id = window.location.pathname.split("/")[3];
      // debugger
      dispatch(ACTION_getRoleDetail(id));
    }, []);
    const initialValues = roleDetail.permissions
    let formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
          setLoading(true);
          // handleSubmitPermissionForm();
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

  return (
    <>
    <div className="fv-row mb-7">
          <label className="fw-bold fs-6 mb-2">Role</label>
          <p>{roleDetail?.name}</p>
    </div>
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      noValidate
      id="kt_login_signup_form"
      onSubmit={formik.handleSubmit}
    >  
      {
        roleDetail?.permissions && Object.keys(roleDetail?.permissions).map(permission => {
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
                            disabled
                            checked={formik.values?.[`${permission.toLowerCase()}`]?.length ? formik.values?.[`${permission.toLowerCase()}`]?.includes('list') : false }
                            // onChange={e => {handleAccessChange(permission.toLowerCase(), 'list', e)}}
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
                            disabled
                            //@ts-ignore
                            checked={formik.values?.[`${permission.toLowerCase()}`]?.length ? formik.values?.[`${permission.toLowerCase()}`]?.includes('view') : false }
                            // onChange={e => {handleAccessChange(permission.toLowerCase(), 'view', e)}}
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
                            disabled
                            //@ts-ignore
                            checked={formik.values?.[`${permission.toLowerCase()}`]?.length ? formik.values?.[`${permission.toLowerCase()}`]?.includes('create') : false }
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
                            disabled
                            //@ts-ignore
                            checked={formik.values?.[`${permission.toLowerCase()}`]?.length ? formik.values?.[`${permission.toLowerCase()}`]?.includes('update') : false }
                            // onChange={e => {handleAccessChange(permission.toLowerCase(), 'update', e)}}
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
                            disabled
                            //@ts-ignore
                            checked={formik.values?.[`${permission.toLowerCase()}`]?.length ? formik.values?.[`${permission.toLowerCase()}`]?.includes('delete') : false }
                            // onChange={e => {handleAccessChange(permission.toLowerCase(), 'update', e)}}
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
                  {permission == "workorders" || permission == "estimates" || permission == "locations" || permission == "tasks" ?
                      <Col>
                        <div className="form-check form-check-custom form-check-solid cursor-pointer">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            disabled
                            //@ts-ignore
                            checked={formik.values?.[`${permission.toLowerCase()}`]?.length ? formik.values?.[`${permission.toLowerCase()}`]?.includes('financial documents') : false}
                          // onChange={e => {handleAccessChange(permission.toLowerCase(), 'update', e)}}
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
                        </Col>)
                  }
                  </Row>
              </div>
            </div>
          )
        })
      }
      <Row>
        {
          !(roleDetail.name == 'ADMIN') && (
            <Col xs={6} md={6} lg={6}>
              <div className="text-end pt-15">
                <button
                  disabled={roleDetail.name == 'ADMIN'}
                  type="button"
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                  }}
                  onClick={() =>
                    navigate(`/role/update/${roleDetail?._id}`)
                  }
                >
                  Edit
                </button>
              </div>
            </Col>
          )
        }
        </Row>
    </form>
    </>
    );
};

export default RoleForm;
