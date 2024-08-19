import { useMemo } from "react";
import { timezoneConverter } from "../../../../../utils/helpers";
import { KTCard, KTCardBody } from "../../../../../_metronic/helpers";
import DocumentTableContainer from "./DocumentTableContainer";

const DocumentTable = ({
  userDocument = [],
  setShowDocumentFilterModal,
  loading,
  handleClearFilter,
  user,
}: any) => {
  const DocumentColumns: any = [
    {
      Header: "TITLE",
      accessor: (props) => ({ Title: props?.Title, DocUrl: props?.DocUrl }),
      Cell: ({ value, row }) => {
        return (
          <a href={value?.DocUrl} rel="noreferrer" target="_blank">
            {value?.Title}
          </a>
        );
      },
    },
    {
      Header: "TYPE",
      accessor: "documentType",
    },
    {
      Header: "Name",
      accessor: "documentName",
    },
    {
      Header: "Created By",
      accessor: "CreatedBy.DisplayAs",
    },
    {
      Header: "CLIENT",
      accessor: "client.DisplayAs",
    },
    {
      Header: "EXPIRE",
      accessor: "documentExpire",
      Cell: ({ value }) => timezoneConverter(value, user?.userTimezone),
    },
  ];

  const columns: any = useMemo(() => DocumentColumns, []);

  return (
    <KTCard>
      <KTCardBody className="py-4">
        <div className="table-responsive">
          {
            <DocumentTableContainer
              handleClearFilter={handleClearFilter}
              loading={loading}
              columns={columns}
              data={userDocument}
              setShowDocumentFilterModal={setShowDocumentFilterModal}
            />
          }
        </div>
      </KTCardBody>
    </KTCard>
  );
};

export default DocumentTable;
