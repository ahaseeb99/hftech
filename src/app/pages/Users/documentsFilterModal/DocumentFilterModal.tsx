import React from "react";
import { Col, Modal, Row } from "react-bootstrap";
import CustomDropdownValue from "../../../../components/CustomDropDrownValue/CustomDropDrownValue";
import {
  documentTypes,
  documentName,
} from "../userDocumentUploadModal/userDocumentUploadModal";

type Props = {
  show: boolean;
  handleClose: () => void;
  clientsList: Array<Object>;
  handleDocumentFilter: any;
  setValues: any,
  value: any
};

const DocumentFilterModal: React.FC<Props> = ({
  show,
  handleClose,
  clientsList,
  handleDocumentFilter,
  value,
  setValues
}) => {


  const handleSubmit = (e) => {
    e.preventDefault();
      const reqData = {
          documentName: value.documentName.value || "",
          documentType: value.documentType.value || "",
          client: value.client.value || "",
      }
    handleDocumentFilter(reqData);
  };

  const handleCloseModal = () => {
    handleClose();
  };

  return (
    <Modal
      className="modal fade show d-block"
      id="kt_header_search_modal"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered modal-md"
      show={show}
    >
      <div className="modal-content shadow-none">
        <form onSubmit={handleSubmit}>
          <div className="modal-body scroll-y mx-5 my-7">
            <div className="fv-row mb-7">
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Client</label>
                <CustomDropdownValue
                  value={value.client}
                  name="client"
                  options={clientsList?.map((client: any) => {
                    return {
                      label: client?.DisplayAs,
                      value: client._id,
                    };
                  })}
                  onChange={(e) => setValues({ ...value, ["client"]: e })}
                />
                <div></div>
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Document Type</label>
                <CustomDropdownValue
                  value={value.documentType}
                  name="Document type"
                  options={documentTypes.map((types) => {
                    return {
                      label: types,
                      value: types,
                    };
                  })}
                  onChange={(e) =>
                    setValues({ ...value, ["documentType"]: e })
                  }
                />
                <div></div>
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Document Name</label>
                <CustomDropdownValue
                  name="Document Name"
                  value={value.documentName}
                  options={[
                    ...documentName.Safety,
                    ...documentName.HumanResources,
                  ].map((types) => {
                    return {
                      label: types,
                      value: types,
                    };
                  })}
                  onChange={(e) =>
                    setValues({ ...value, ["documentName"]: e })
                  }
                />
              </div>
              <div style={{ marginTop: "15px" }}>
                <div className="d flex">
                  <Row>
                    <Col>
                      <div className="text-end pt-5">
                        <button
                          className="btn btn-primary"
                          style={{
                            width: "100%",
                          }}
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </Col>
                    <Col xs={6} md={6} lg={6}>
                      <div className="text-end pt-5">
                        <button
                          type="button"
                          style={{
                            width: "100%",
                          }}
                          className="btn btn-secondary"
                          onClick={() => handleCloseModal()}
                        >
                          Cancel
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DocumentFilterModal;
