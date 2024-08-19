import moment from "moment";
import React, { useRef, useState } from "react";
import { Col, Modal, Row, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomDropdown from "../../../../components/CustomDropdown/CustomDropdown";

export const documentTypes = ["Human Resources", "Safety"];
export const documentName = {
  Safety: [
    "Confined Space - Attendant",
    "Confined Space - Entrant",
    "Confined Space - Non-Entry Rescue",
    "Confined Space - Supervisor",
    "Industry / Task Specific - Aerial Lift",
    "Industry / Task Specific - Bloodborne Pathogen",
    "Industry / Task Specific - Bonding & Grounding",
    "Industry / Task Specific - CPR ",
    "Industry / Task Specific - Cold Stress",
    "Industry / Task Specific - Elevated Work ",
    "Industry / Task Specific - Fall Protection ",
    "Industry / Task Specific - First Aid ",
    "Industry / Task Specific - Hearing Conservation",
    "Industry / Task Specific - Heat Stress ",
    "Industry / Task Specific - Hot Work ",
    "Industry / Task Specific - LO/TO ",
    "Industry / Task Specific - Ladder Safety",
    "Industry / Task Specific - Powered Industrial Truck",
    "OSHA / Hazmat - 40Hr HAZWOPER Annual Refresher",
    "OSHA / Hazmat - Blood Borne ",
    "OSHA / Hazmat - DOT General Awareness",
    "OSHA / Hazmat - Decon ",
    "OSHA / Hazmat - Drum & Material Handling",
    "OSHA / Hazmat - Emergency Response Protocols",
    "OSHA / Hazmat - HAZCOM ",
    "OSHA / Hazmat - PPE / Hearing",
    "OSHA / Hazmat - RCRA Hazardous Waste",
    "OSHA / Hazmat - Resp Protection"
  ],
  HumanResources: ["Background Check", "Employment Application"],
};

type Props = {
  show: boolean;
  handleClose: () => void;
  fileUploadHandler: any;
  clientsList: Array<Object>
};

const UserDocumentUploadModal: React.FC<Props> = ({
  show,
  handleClose,
  fileUploadHandler,
  clientsList
}) => {
  const { user } = useSelector((state: any) => state.auth);
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<any>([]);
  const [value, setValues] = useState({
    documentName: "",
    documentType: "",
    documentExpire: moment().tz(user?.userTimezone).tz("UTC"),
    client: "",
  });
  const maxSize = 104857600;

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

 

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const filters = Array.from(e.dataTransfer.files).filter(
      (file: any) =>
        JSON.stringify(file) ==
        JSON.stringify(
          files.find((currentFile: any) => currentFile.name == file.name)
        )
    );
    let currentFiles = Array.from(e.dataTransfer.files).filter(
      (file: any) => file.name !== "application/x-ms-dos-executable"
    );
    currentFiles = currentFiles.filter(
      (file: any) =>
        JSON.stringify(file) !==
        JSON.stringify(
          files.find((currentFile: any) => currentFile.name == file.name)
        )
    );
    currentFiles = currentFiles.filter((file: any) => file.size <= maxSize);
    if (filters.length > 0) {
      toast.error("file already exist");
      return;
    } else {
      setFiles([...files, ...currentFiles]);
    }
  };

  const handleFileUpload = (e) => {
    const filters = Array.from(e.target.files).filter(
      (file: any) =>
        JSON.stringify(file) ==
        JSON.stringify(
          files.find((currentFile: any) => currentFile.name == file.name)
        )
    );
    let currentFiles = Array.from(e.target.files).filter(
      (file: any) => file.name !== "application/x-ms-dos-executable"
    );
    currentFiles = currentFiles.filter(
      (file: any) =>
        JSON.stringify(file) !==
        JSON.stringify(
          files.find((currentFile: any) => currentFile.name == file.name)
        )
    );
    currentFiles = currentFiles.filter((file: any) => file.size <= maxSize);
    if (filters.length > 0) {
      toast.error("file already exist");
      return;
    } else {
      setFiles([...files, ...currentFiles]);
    }
  };

  const handleCloseFile = (index: number) => {
    files.splice(index, 1);
    setFiles([...files]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const allowedTypes = ["application/x-ms-dos-executable"];
    const invalidFiles = files.filter((file) =>
      allowedTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      toast.error("Invalid file type");
      return;
    }

    fileUploadHandler(files, value);
  };

  const handleCloseModal = () => {
    handleClose();
    setFiles([]);
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
            <div className="fv-row mb-7 ">
              <label className="required fw-bold fs-6 mb-3  d-flex justify-content-start">
                Upload Documents
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: dragging ? "2px dashed #000" : "2px dashed gray",
                }}
                className={
                  "form-control form-control-solid mb-3 mb-lg-0 h-300px mt-2 d-flex justify-content-center align-items-center"
                }
                onClick={() =>
                  //@ts-ignore
                  inputRef.current && inputRef.current.click()
                }
              >
                <input
                  ref={inputRef}
                  multiple
                  type="file"
                  accept=".gif,.jpg,.jpeg,.png,.doc,.pdf,.docx"
                  id="fileUpload"
                  hidden
                  onChange={(e) => handleFileUpload(e)}
                />
                <button
                  type="button"
                  className={`${dragging ? "btn btn-secondary" : "btn btn-primary"
                    }`}
                >
                  Drag & Drop or Select
                </button>
              </div>
            </div>
            <div className="d-flex flex-row flex-wrap">
              {files.map((_item, index) => (
                <Card
                  key={index}
                  className="d-flex justify-content-between border m-2 position-relative"
                >
                  <Card.Body>
                    <div
                      className="d-flex justify-content-between align-items-center"
                      key={index}
                    >
                      <p>{_item.name}</p>
                      <i
                        className="bi bi-x text-black fs-2 cursor-pointer position-absolute top-0 end-0 p-3"
                        onClick={() => handleCloseFile(index)}
                      ></i>
                    </div>
                    <Card.Text>Size: {_item.size} bytes</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <div className="fv-row mb-7">
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Client</label>
                <CustomDropdown
                  name="client"
                  options={clientsList?.map((client: any) => {
                    return {
                      label: client?.DisplayAs,
                      value: client._id,
                    };
                  })}
                  onChange={(e) =>
                    setValues({ ...value, ["client"]: e.value })
                  }
                />
                <div></div>
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Document Type</label>
                <CustomDropdown
                  name="Document type"
                  options={documentTypes.map((types) => {
                    return {
                      label: types,
                      value: types,
                    };
                  })}
                  onChange={(e) =>
                    setValues({ ...value, ["documentType"]: e.value })
                  }
                />
                <div></div>
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">Document Name</label>
                <CustomDropdown
                  name="Document Name"
                  options={
                    value.documentType
                      ? documentName[value.documentType.replace(/\s/g, "")].map(
                        (types) => {
                          return {
                            label: types,
                            value: types,
                          };
                        }
                      )
                      : []
                  }
                  onChange={(e) =>
                    setValues({ ...value, ["documentName"]: e.value })
                  }
                />
              </div>
              <div className="fv-row mb-7">
                <label className="fw-bold fs-6 mb-2">
                  Document Expire Date
                </label>
                <input
                  type="date"
                  name="date"
                  className={"form-control form-control-solid mb-3 mb-lg-0"}
                  autoComplete="off"
                  onChange={(e) =>
                    setValues({
                      ...value,
                      ["documentExpire"]: moment
                        .tz(e.target.value, user?.userTimezone)
                        .tz("UTC"),
                    })
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
                          disabled={!(files.length > 0)}
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

export default UserDocumentUploadModal;
