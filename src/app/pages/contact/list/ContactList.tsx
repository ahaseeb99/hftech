import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_getClients } from "../../../../store/client/actions";
import { ACTION_getContacts } from "../../../../store/contact/actions";
import DeleteContactModal from "../delete/DeleteContactModal";
import DeleteLocationModal from "../delete/DeleteContactModal";
import ContactTable from "./table/ContactTable";
// import DeleteLocationModal from "../delete/DeleteLocationModal"

export const ContactList: React.FC = () => {
  const dispatch: any = useDispatch();
  const clientContactList = useSelector(
    (state: any) => state.contacts.contactsData.contacts
  );
  const { clientsData } = useSelector((state: any) => state.client);

  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [activeLocation, setActiveLocation] = useState<any>(null);
  const [clientId,setClientId] = useState<string>('')

  const showDeleteModalHandler = (_location: any) => {
    console.log("checking _location: ", _location);
    setActiveLocation(_location);
    setShowDeleteModal(true);
  };

  const closeDeleteModalHandler = () => {
    setActiveLocation(null);
    setShowDeleteModal(false);
  };

  useEffect(() => {
  //  @ts-ignore
    const client = clientId?.value ? clientId?.value : '';
    dispatch(ACTION_getContacts(client));
  }, [clientId]);

  // useEffect(() => {
  //   setContactList(clientContactList);
  // }, [clientContactList]);
  // useEffect(() => {
  //   setContactList(_.get(locationsData, "locations", []));
  // }, [locationsData?.locations]);

  console.log({ clientContactList });

  return (
    <div>
      {showDeleteModal && (
        <DeleteContactModal
          closeDeleteModalHandler={closeDeleteModalHandler}
          contactData={activeLocation}
        />
      )}
      <ContactTable
        contactData={clientContactList}
        clientsData={clientsData}
        clientId={clientId}
        setClientId={setClientId}
        showDeleteModalHandler={showDeleteModalHandler}
      />
    </div>
  );
};
