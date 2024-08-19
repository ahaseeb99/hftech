import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_getClients } from "../../../../store/client/actions";
import DeleteClientModal from "../delete/DeleteClientModal";
import ClientTable from "./table/ClientTable";

export const ClientList: React.FC = () => {
  const dispatch: any = useDispatch();
  const { clientsData } = useSelector((state: any) => state.client);
  const [clientList, setClientList] = useState([]);
  const { user } = useSelector((state: any) => state.auth);

  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [activeClient, setActiveClient] = useState<any>(null);

  const showDeleteModalHandler = (_client: any) => {
    setActiveClient(_client);
    setShowDeleteModal(true);
  };

  const closeDeleteModalHandler = () => {
    setActiveClient(null);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    dispatch(ACTION_getClients());
  }, []);

  useEffect(() => {
    setClientList(_.get(clientsData, "clients", []));
  }, [clientsData?.clients]);

  return (
    <div>
      {showDeleteModal && (
        <DeleteClientModal
          closeDeleteModalHandler={closeDeleteModalHandler}
          clientData={activeClient}
        />
      )}
      <ClientTable
        clientData={clientList}
        showDeleteModalHandler={showDeleteModalHandler}
        user={user}
      />
    </div>
  );
};
