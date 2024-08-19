import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_getClients } from "../../../../store/client/actions";
import { ACTION_getUsersDocuments } from "../../../../store/users/actions";
import DocumentFilterModal from "../documentsFilterModal/DocumentFilterModal";
import DocumentTable from "./table/DocumentTable";

export const DocumentList: React.FC = () => {
  const dispatch: any = useDispatch();
  const { userDocument, userDocumentLoading } = useSelector(
    (state: any) => state.users
  );
  const { user } = useSelector((state: any) => state.auth);
  const clientList: any = useSelector(
    (state: any) => state.client.clientsData.clients
  );

  const [showDocumentFilterModal, setShowDocumentFilterModal] =
    useState<boolean>(false);
  const [value, setValues] = useState<any>({
    documentName: {},
    documentType: {},
    client: {},
  });

  useEffect(() => {
    dispatch(ACTION_getUsersDocuments({}));
    dispatch(ACTION_getClients());
  }, []);

  const handleDocumentFilter = (reqData) => {
    dispatch(ACTION_getUsersDocuments(reqData));
    setShowDocumentFilterModal(false);
  };

  const handleClearDocumentFilter = () => {
    dispatch(ACTION_getUsersDocuments({}));
    setValues({
      documentName: {},
      documentType: {},
      client: {},
    });
  };

  return (
    <div>
      {showDocumentFilterModal && (
        <DocumentFilterModal
          clientsList={clientList}
          show={showDocumentFilterModal}
          handleClose={() => setShowDocumentFilterModal(false)}
          handleDocumentFilter={handleDocumentFilter}
          value={value}
          setValues={setValues}
        />
      )}
      <DocumentTable
        loading={userDocumentLoading}
        setShowDocumentFilterModal={setShowDocumentFilterModal}
        userDocument={userDocument}
        handleClearFilter={handleClearDocumentFilter}
        user={user}
      />
    </div>
  );
};
