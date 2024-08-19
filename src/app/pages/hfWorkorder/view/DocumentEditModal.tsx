import React, { useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";

interface IDocumentEditModal {
  show: boolean;
  handleCloseModal: () => void;
  handleDocumentEdit: any;
  currentDoc: any;
}

const DocumentEditModal = ({
  show,
  handleDocumentEdit,
  handleCloseModal,
  currentDoc,
}: IDocumentEditModal) => {

  const { user } = useSelector((state: any) => state.auth);
  const [docType, setDocType] = useState("");
  const documentTypes = ["Financial", "Project", "Safety"];

  useEffect(() => {
    setDocType(currentDoc?.DocumentType);
  }, [currentDoc]);
 
  const handleEditSubmit = (e) => {
    e.preventDefault()
    currentDoc['DocumentType'] = docType;
    console.log(currentDoc)
    handleDocumentEdit(currentDoc)
    handleCloseModal()
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
        <form onSubmit={handleEditSubmit}>
          <div className="modal-body scroll-y mx-5 my-7">
            <h3 className="text-center mb-4">Edit Document</h3>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Document Name</label>
              <p>{currentDoc.Title}</p>
            </div>
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-2">Document Type</label>
              <CustomDropdown
                name="Document Type"
                className=""
                value={{
                  label: currentDoc?.DocumentType,
                  value: currentDoc?.DocumentType,
                }}
                options={documentTypes
                  .filter(
                    (val) => val !== "Financial" || user.role.name == "ADMIN"
                  )
                  .map((item) => ({
                    value: item,
                    label: item,
                  }))}
                onChange={(e) => {
                  setDocType(e.value);
                }}
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
        </form>
      </div>
    </Modal>
  );
};

export default DocumentEditModal;
