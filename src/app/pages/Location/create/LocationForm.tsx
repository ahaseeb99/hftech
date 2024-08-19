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
import { ACTION_getClients } from "../../../../store/client/actions";
import CustomDropdownMultipleValues from "../../../../components/CustomDropDownMultipleValues/CustomDropDownMultipleValues";

const editLocationSchema = Yup.object().shape({
  locationName: Yup.string().required("Location is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  street: Yup.string().required("Street is required"),
  contacts: Yup.array()
});

const LocationForm: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const clientsList = useSelector(
    (state: any) => state.client.clientsData.clients?.filter(x => x.status == "ACTIVE")
  );

  useEffect(() => {
    dispatch(ACTION_getCountries());
    dispatch(ACTION_getLocationList());
    dispatch(ACTION_getClients());
  }, []);

  const { countriesData } = useSelector(
    (state: any) => state.location
  );

  const [state, setState] = useState<any>("");
  const [city, setCity] = useState<any>("");
  const [status, setStatus] = useState<any>("ACTIVE");
  const [client,setClient] = useState<any>({})

  const formik = useFormik({
    initialValues: {
      locationName: "",
      country: "United States",
      state: "",
      city: "",
      street: "",
      clientId: "",
      status: "",
      contacts: []
    },
    validationSchema: editLocationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmitLocationForm();
    },
  });

  const handleSubmitLocationForm = async () => {
    let reqData = {
      locationName: formik.values.locationName,
      country: formik.values.country,
      state: formik.values.state,
      city: formik.values.city,
      street: formik.values.street,
      clientId: formik.values.clientId,
      longitude: -75,
      latitude: 43,
      status: formik.values.status,
      contacts: formik.values.contacts.map((item: any) => item?.value)
    };
    dispatch(ACTION_createLocation(reqData, navigate));
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
                  setClient(e.data)
                  formik.setFieldValue("contacts", []);
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
              <label className="fw-bold fs-6 mb-2">Contact</label>
              <CustomDropdownMultipleValues
                {...formik.getFieldProps("contacts")}
                name="contacts"
                options={client?.Contacts?.map((item: any) => {
                  return {
                    label: item?.fullName,
                    value: item?._id,
                  };
                })}
                onChange={(e) => {
                  formik.setFieldValue("contacts", e);
                }}
              />
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">
                Location Name
              </label>
              <input
                {...formik.getFieldProps("locationName")}
                type="text"
                name="locationName"
                placeholder="Location Name"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.locationName && formik.errors.locationName,
                  },
                  {
                    "is-valid":
                      formik.touched.locationName &&
                      !formik.errors.locationName,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.locationName && formik.errors.locationName && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.locationName}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Street</label>
              <input
                {...formik.getFieldProps("street")}
                type={"text"}
                name="street"
                placeholder="street"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.street && formik.errors.street,
                  },
                  {
                    "is-valid":
                      formik.touched.street && !formik.errors.street,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.street && formik.errors.street && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.street}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">State</label>
              {/* <select
								{...formik.getFieldProps("state")}
								className="form-select form-select-solid"
								name="state"
							>
								<option value="">Select</option>
								{countriesData?.states
									? Object.keys(countriesData?.states)?.map(
											(_state: any, index: number) => (
												<option key={index} value={_state}>
													{_state}
												</option>
											)
									  )
									: ""}
							</select> */}

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

              {/* <CustomDropdown
								{...formik.getFieldProps("state")}
								name="state"
								className=""
								value={state}
								options={
									countriesData?.states
										? Object.keys(countriesData?.states)?.map((item: any) => {
												return {
													data: item | "",
													label: item || "",
													value: item || "",
												}
										  })
										: ""
								}
								onChange={(e) => {
									setState(e)
									formik.setFieldValue("state", e.value)
								}}
							/> */}
            </div>
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">City</label>
              {/* <select
								{...formik.getFieldProps("city")}
								className="form-select form-select-solid"
								name="city"
							>
								<option value="">Select</option>
								{countriesData.states &&
									countriesData.states[formik.values.state]?.map(
										(_city: any, index: number) => (
											<option key={index} value={_city.name}>
												{_city.name}
											</option>
										)
									)}
							</select> */}

              <CustomDropdown
                {...formik.getFieldProps("city")}
                name="city"
                className=""
                value={city}
                options={
                  countriesData?.states &&
                  countriesData?.states[formik.values.state]?.map((item) => {
                    return {
                      data: item,
                      label: item?.name,
                      value: item?.name,
                    };
                  })
                }
                onChange={(e) => {
                  setCity(e);
                  formik.setFieldValue("city", e.value);
                }}
              />
              {formik.touched.city && formik.errors.city && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.city}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Status</label>
              <CustomDropdown
                {...formik.getFieldProps("status")}
                name="status"
                className=""
                options={
                  [{label: 'ACTIVE', value: 'ACTIVE'}, {label: 'INACTIVE', value: 'INACTIVE'}]
                }
                onChange={(e) => {
                  setStatus(e);
                  formik.setFieldValue("status", e.value);
                }}
              />
              {formik.touched.status && formik.errors.status && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.status}</span>
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
              navigate("/location/list");
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

export default LocationForm;
