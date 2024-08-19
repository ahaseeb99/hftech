import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import _find from "lodash/find";
import { useNavigate } from "react-router-dom";
import {
  ACTION_getCountries,
  ACTION_getLocationDetail,
  ACTION_getLocationList,
  ACTION_updateLocation
} from "../../../../store/location/actions";


import _ from "lodash";
import { Col, FormControl, Row } from "react-bootstrap";
import { stringOrDate } from "react-big-calendar";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";
import { ACTION_getClients } from "../../../../store/client/actions";
import CustomDropdownMultipleValues from "../../../../components/CustomDropDownMultipleValues/CustomDropDownMultipleValues";

const editLocationSchema = Yup.object().shape({
  locationName: Yup.string().required("Full name is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  address: Yup.string().required("Address is required"),
  contacts: Yup.array()
});

const LocationForm: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();
  const clientsList = useSelector(
    (state: any) => state.client.clientsData.clients?.filter(x => x.status == "ACTIVE")
  );
  const [country, setCountry] = useState<string>("United States");

  const { user } = useSelector((state: any) => state.auth);

  const { countriesData } = useSelector(
    (state: any) => state.location
  );
  const currentLocation = useSelector(
    (state: any) => state.location.locationDetail
  );

  const [city, setCity] = useState<any>("");
  const [client,setClient] = useState<any>({})

  useEffect(() => {
    const selectedClient = clientsList?.find(item => item?._id == currentLocation?.clientId?._id)
    setClient(selectedClient)
  }, [currentLocation])

  useEffect(() => {
    dispatch(ACTION_getCountries());
    dispatch(ACTION_getLocationList());
    dispatch(ACTION_getClients());

    const id = window.location.pathname.split("/")[3];
    dispatch(ACTION_getLocationDetail(id));
  }, []);


  const formik = useFormik({
    initialValues: {
      locationName: currentLocation?.locationName
        ? currentLocation?.locationName
        : "",
      country: currentLocation?.country ? currentLocation?.country : country,
      state: currentLocation?.state ? currentLocation?.state : "",
      city: currentLocation?.city ? currentLocation?.city : "",
      address: currentLocation?.street ? currentLocation?.street : "",
      clientId: currentLocation?.clientId ? currentLocation?.clientId._id : "",
      contacts: currentLocation.contacts?.length > 0 ? currentLocation?.contacts?.map(item => ({label: item?.fullName, value: item?._id})) : []
    },
    enableReinitialize: true,
    validationSchema: editLocationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmitLocationForm();
    },
  });

  const handleSubmitLocationForm = async () => {
    let reqData = {
      _id: currentLocation._id, // id
      userId: user._id,
      locationName: formik.values.locationName,
      country: formik.values.country,
      state: formik.values.state,
      city: formik.values.city,
      street: formik.values.address,
      clientId: formik.values.clientId,
      longitude: -75,
      latitude: 43,
      contacts: formik.values.contacts.map((item: any) => item?.value)
    };
    dispatch(ACTION_updateLocation(reqData, navigate));
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
                value={
                  {
                    label: currentLocation?.clientId?.DisplayAs,
                    value: currentLocation?.clientId?._id
                  }
                }
                options={clientsList?.map((item: any) => {
                  return {
                    data: item,
                    label: item?.DisplayAs,
                    value: item?._id,
                  };
                })}
                onChange={(e) => {
                  setClient(e?.data)
                  formik.setFieldValue("clientId", e.value);
                  formik.setFieldValue("contacts", []);
                }}
              />
              
              {formik.touched.clientId && formik.errors.clientId && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
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
                value={formik.values.contacts}
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
                placeholder="Location Name"
                defaultValue={currentLocation?.locationName}
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
            </div>
            {/* <div className="fv-row mb-7">
							<label className="required fw-bold fs-6 mb-2">Country Name</label>
							<input
								{...formik.getFieldProps("country")}
								type="text"
								readOnly
								name="country"
								placeholder="Country Name"
								defaultValue={countriesData.name}
								className={clsx(
									"form-control form-control-solid mb-3 mb-lg-0",
									{
										"is-invalid":
											formik.touched.country && formik.errors.country,
									},
									{
										"is-valid":
											formik.touched.country && !formik.errors.country,
									}
								)}
								autoComplete="off"
							/>
						</div> */}
            <div className="fv-row mb-7">
              <label className="required fw-bold fs-6 mb-2">Address</label>
              <input
                {...formik.getFieldProps("address")}
                type={"text"}
                name="address"
                placeholder="Address"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.address && formik.errors.address,
                  },
                  {
                    "is-valid":
                      formik.touched.address && !formik.errors.address,
                  }
                )}
                autoComplete="off"
              />
            </div>
            <div className="fv-row mb-7">
              {/* <label className="required fw-bold fs-6 mb-2">State</label>
              <select
                {...formik.getFieldProps("state")}
                className="form-select form-select-solid"
                name="state"
                // defaultValue={state}
                onChange={(e) => {
                  setState(e.target.value);
                  formik.setFieldValue("state", e.target.value);
                }}
              >
                <option value="">Select</option>
                {countriesData?.states &&
                  Object.keys(countriesData?.states)?.map(
                    (_state: any, index: number) => (
                      <option key={index} value={_state}>
                        {_state}
                      </option>
                    )
                  )}
              </select> */}

              {/* //// */}
              <label className="required fw-bold fs-6 mb-2">State</label>
              <select
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
              </select>

              {/* <CustomDropdown
                {...formik.getFieldProps("state")}
                name="state"
                className=""
                value={formik?.getFieldProps("state")?.value}
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
                value={
                  {
                    label: currentLocation?.city,
                    value: currentLocation?._id
                  }
                }
                options={
                  countriesData?.states &&
                  countriesData?.states[formik.values.state]?.map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })
                }
                onChange={(e) => {
                  setCity(e);
                  formik.setFieldValue("city", e.label);
                }}
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
