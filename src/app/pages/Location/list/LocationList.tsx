import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_getClients } from "../../../../store/client/actions";
import { ACTION_getLocationList } from "../../../../store/location/actions";
import DeleteLocationModal from "../delete/DeleteLocationModal";
// import DeleteLocationModal from "../delete/DeleteLocationModal"
import LocationTable from "./table/LocationTable";

export const LocationList: React.FC = () => {
  const dispatch: any = useDispatch();
  const { locationsData } = useSelector((state: any) => state.location);

  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [activeLocation, setActiveLocation] = useState<any>(null);

  const showDeleteModalHandler = (_location: any) => {
    setActiveLocation(_location);
    setShowDeleteModal(true);
  };

  const closeDeleteModalHandler = () => {
    setActiveLocation(null);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    const getLocationList = async () => {
      await dispatch(ACTION_getLocationList());
      await dispatch(ACTION_getClients());
    };
    getLocationList();
  }, []);

  console.log({ locationsData });

  return (
    <div>
      {showDeleteModal && (
        <DeleteLocationModal
          closeDeleteModalHandler={closeDeleteModalHandler}
          locationData={activeLocation}
        />
      )}
      <LocationTable
        locationData={locationsData}
        showDeleteModalHandler={showDeleteModalHandler}
      />
    </div>
  );
};
