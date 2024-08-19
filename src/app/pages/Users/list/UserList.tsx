import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_getClients } from "../../../../store/client/actions";
import { ACTION_getUsers, ACTION_generatePhoneList, ACTION_getUsersDocuments } from "../../../../store/users/actions";
import DeleteContactModal from "../delete/DeleteUserModal";
import UserFilterModal from "../userFilterModal/UserFilterModal";
import UserTable from "./table/UserTable";


export const UserList: React.FC = () => {
  const dispatch: any = useDispatch();
  const { usersList } = useSelector((state: any) => state.users);
  const loading = useSelector((state: any) => state.users.loading);
  const clientList : any = useSelector(
    (state: any) => state.client.clientsData.clients
  );

  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [activeLocation, setActiveLocation] = useState<any>(null);
  const [showFilterModal,setShowFilterModal] = useState<boolean>(false)
  const [checkBoxData,setCheckBoxData] = useState<string[]>([])

  useEffect(() => {
    dispatch(ACTION_getUsers());
    dispatch(ACTION_getUsersDocuments({}))
    dispatch(ACTION_getClients());
  }, []);

  const showDeleteModalHandler = (_location: any) => {
    setActiveLocation(_location);
    setShowDeleteModal(true);
  };

  const closeDeleteModalHandler = () => {
    setActiveLocation(null);
    setShowDeleteModal(false);
  };

  const onDownloadBtnHandler = () => {
    dispatch(ACTION_generatePhoneList());
  }

  const handleRoleFilter = (roles) => {
    dispatch(ACTION_getUsers(roles));
    setShowFilterModal(false)
  }
  const handleClearFilter = () => {
    dispatch(ACTION_getUsers())
    setCheckBoxData([])
  }

  return (
    <div>
      {showDeleteModal && (
        <DeleteContactModal
          closeDeleteModalHandler={closeDeleteModalHandler}
          locationData={activeLocation}
        />
      )}
      {showFilterModal &&
        <UserFilterModal checkBoxData={checkBoxData} setCheckBoxData={setCheckBoxData} handleSubmit={handleRoleFilter} show={showFilterModal} handleClose={() => setShowFilterModal(false)} />
      }  
      <UserTable
        loading={loading}
        setShowFilterModal={setShowFilterModal}
        usersList={usersList}
        onDownloadBtnHandler={onDownloadBtnHandler}
        showDeleteModalHandler={showDeleteModalHandler}
        handleClearFilter={handleClearFilter}
        clientList={clientList}
      />
    </div>
  );
};
