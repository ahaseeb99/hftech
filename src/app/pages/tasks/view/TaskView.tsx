import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ACTION_deleteNoteTask,
  ACTION_deleteTask,
  ACTION_getTaskDetail,
  ACTION_UpdateTask,
} from "../../../../store/task/action";
import { timezoneConverter } from "../../../../utils/helpers";
import {
  uploadFileToS3,
  uploadFileToS3Task,
} from "../../../../utils/uploadFileToS3";
import { KTSVG } from "../../../../_metronic/helpers";
import DocumentEditModal from "../../hfWorkorder/view/DocumentEditModal";
import DeleteDocumentModal from "./DeleteDocumentModal";
import DocumentEditModalTask from "./DocumentEditModal";
import DocumentUploadModal from "./DocumentUploadModal";
import DeleteNoteModal from "./NoteDeleteModal";
import NotesModal from "./TaskNotesModal";

const TaskView = () => {
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectNote, setSelectedNote] = useState({});
  const [noteIsUpdate, setNoteIsUpdate] = useState(false);
  const [showNoteDeleteModal, setShowNoteDeleteModal] = useState(false);
  const [showDocumentAddModal, setShowDocumentAddModal] = useState(false);
  const [showDocumentDeleteModal, setShowDocumentDeleteModal] = useState(false);
  const [selecteDocument, setSelectedDocument] = useState({});
  const [showDocumentEditModal,setShowDocumentEditModal] = useState(false)
  const [selectedDoc,setSeletedDoc] = useState({})

  const _id = window.location.pathname.split("/")[3];

  useEffect(() => {
    dispatch(ACTION_getTaskDetail(_id));
  }, []);

  const handleDelete = (_id) => {
    dispatch(ACTION_deleteTask(_id, navigate));
  };

  const taskDetail = useSelector((state: any) => state.task.taskDetail);
  const user = useSelector((state: any) => state.auth.user);

  const handleAddNote = () => {
    setShowNoteModal(true);
    setNoteIsUpdate(false);
    setSelectedNote({});
  };

  const handleEditNotes = (body) => {
    setShowNoteModal(true);
    setNoteIsUpdate(true);
    setSelectedNote(body);
  };

  const handleDeleteNote = (note) => {
    setSelectedNote(note);
    setShowNoteDeleteModal(true);
  };

  const handleAddDocument = () => {
    setShowDocumentAddModal(true);
  };

  const handleUploadDocument = async (file, docType) => {
    const files = file;
    const form = new FormData();
    files?.map((file) => {
      form.append("files", file);
    });
    form.append("documentType", docType);
    await uploadFileToS3Task(form, taskDetail?._id);
    setShowDocumentAddModal(false);
    dispatch(ACTION_getTaskDetail(_id))
  };

  const handleDeleteDocument = (doc) => {
    setShowDocumentDeleteModal(true);
    setSelectedDocument(doc);
  };

  const closeDeleteDocumentModalHandler = () => {
    setShowDocumentDeleteModal(false);
    setSelectedDocument({});
  };

  const handleShowDocumentModal = (doc) => {
    setShowDocumentEditModal(true)
    setSeletedDoc(doc)
  }

  const handleEditDocument = (doc) => {
   dispatch(ACTION_UpdateTask(_id,doc))
  }

  return (
    <>
      {showNoteModal && (
        <NotesModal
          taskId={taskDetail?._id}
          note={selectNote}
          updateNote={noteIsUpdate}
          show={showNoteModal}
          handleClose={() => setShowNoteModal(false)}
        />
      )}
      {showNoteDeleteModal && (
        <DeleteNoteModal
          taskId={taskDetail?._id}
          note={selectNote}
          closeDeleteNoteModalHandler={() => setShowNoteDeleteModal(false)}
        />
      )}
      {showDocumentAddModal && (
        <DocumentUploadModal
          handleClose={() => setShowDocumentAddModal(false)}
          show={showDocumentAddModal}
          fileUploadHandler={handleUploadDocument}
        />
      )}
      {showDocumentDeleteModal && (
        <DeleteDocumentModal
          document={selecteDocument}
          closeDeleteDocumentModalHandler={closeDeleteDocumentModalHandler}
          taskId={taskDetail?._id}
        />
      )}
      {
        showDocumentEditModal &&
        <DocumentEditModalTask show={showDocumentEditModal} handleCloseModal={() => setShowDocumentEditModal(false)} currentDoc={selectedDoc} handleDocumentEdit={handleEditDocument}  />
      }
      <div className="row gy-5 g-xl-8">
        <div className="col-xxl-6">
          <div className="card card-xl-stretch mb-xl-8">
            <div className="card-body px-2 py-10">
              <Container fluid className="pt-4">
                <Row>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">Name</label>
                      <p>{taskDetail?.name}</p>
                    </div>
                  </Col>
                  <Col>
                    <div className="fv-row mb-7">
                      <label className="fw-bold fs-3 mb-2">CLIENT</label>
                      <p>{taskDetail?.client?.DisplayAs}</p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <h2 className="fs-4 mb-5 mt-5">ASSIGNED TO</h2>
                  <Table bordered responsive className="workorder-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Title</th>
                        <th>Email</th>
                        <th>PhoneNumber</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskDetail?.assignedTo?.length > 0 ? (
                        taskDetail.assignedTo?.map((assignedTo, index) => (
                          <tr key={index}>
                            <td>{assignedTo?.FirstName}</td>
                            <td>{assignedTo?.title}</td>
                            <td>
                              <a href={`mailto:${assignedTo?.email}`}>
                                {assignedTo?.email}
                              </a>
                            </td>
                            <td>
                              <a href={`tel:${assignedTo.personalContact}`}>
                                {assignedTo?.personalContact}
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td>No Records Found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Row>
                <Row>
                  <h2 className="fs-4 mb-5 mt-5">CONTACTS</h2>
                  <Table bordered responsive className="workorder-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>PhoneNumber</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskDetail?.contacts?.length > 0 ? (
                        taskDetail.contacts?.map((contacts, index) => (
                          <tr key={index}>
                            <td>{contacts?.fullName}</td>
                            <td>
                              <a href={`mailto:${contacts?.emailAddress}`}>
                                {contacts?.emailAddress}
                              </a>
                            </td>
                            <td>
                              <a href={`tel:${contacts.phoneNumber}`}>
                                {contacts?.phoneNumber}
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td>No Records Found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Row>
                <Row>
                  <h2 className="fs-4 mb-5 mt-5">NOTES</h2>
                  <Table bordered responsive className="workorder-table">
                    <thead>
                      <tr>
                        <th>
                          DATE{" "}
                          <span
                            className="cursor-pointer text-dark"
                            data-toggle="tooltip"
                            data-placement="top"
                            title={
                              user.userTimezone
                                ? user.userTimezone
                                : "America/Phoenix"
                            }
                          >
                            <KTSVG path="/media/svg/shapes/global.svg" />
                          </span>
                        </th>
                        <th>BY</th>
                        <th>TYPE</th>
                        <th>NOTE</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskDetail?.notes?.length > 0 ? (
                        taskDetail?.notes?.map((note, index) => (
                          <>
                            {
                             ((note?.notesType != "Financial") || (user?.role?.name == 'ADMIN') || (user?.role?.permissions?.tasks?.includes('financial documents'))) &&
                            <tr
                              key={index}
                              style={{ borderBottom: "0.5pt solid lightgray" }}
                            >
                              <td>
                                {timezoneConverter(
                                  note?.createdAt,
                                  user.userTimezone
                                )}
                              </td>
                              <td>{note?.createdBy?.displayAs}</td>
                              <td>{note?.notesType}</td>
                              <td>{note?.body}</td>
                              <td>
                                {
                               ((user?._id == note?.createdBy?._id && note.notesType !== "Financial" || user?.role?.name == 'ADMIN')) && (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-primary p-2 me-5"
                                    onClick={() => {
                                      handleEditNotes(note);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn btn-danger p-2"
                                    onClick={() => {
                                      handleDeleteNote(note);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </>
                                 )}
                              </td>
                            </tr>
                          }
                          </>
                        ))
                      ) : (
                        <tr>
                          <td>No Records Found</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={12} className="text-end">
                          <button
                            type="button"
                            className="btn btn btn-primary"
                            onClick={handleAddNote}
                          >
                            Add new note
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </Row>
                <div className="fv-row mb-7">
                  <h2 className="fs-4 mb-5 mt-5">DOCUMENTS</h2>
                  <Table bordered responsive className="workorder-table">
                    <thead>
                      <tr>
                        <th>TITLE</th>
                        <th>TYPE</th>
                        <th>BY</th>
                        <th>CREATED ON</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskDetail?.documents?.length > 0 ? (
                        taskDetail?.documents
                          ?.filter((doc) => doc?.isDeleted !== true)
                          ?.map((doc, index) => {
                            return (
                              <>
                                {((doc.documentType != "Financial") || (user?.role?.name == 'ADMIN') || (user?.role?.permissions?.tasks?.includes('financial documents')) ) && (
                                <tr
                                  key={index}
                                  style={{
                                    borderBottom: "0.5pt solid lightgray",
                                  }}
                                >
                                  <td className="w-50">
                                    <a
                                      target="_blank"
                                      href={doc?.docUrl}
                                      rel="noreferrer"
                                    >
                                      {doc?.title}
                                    </a>
                                  </td>
                                  <td>
                                    {doc?.documentType !== "undefined"
                                      ? doc?.documentType
                                      : ""}
                                  </td>
                                  <td>
                                    {doc?.createdBy?.displayAs
                                      ? doc?.createdBy?.displayAs
                                      : ""}
                                  </td>
                                  <td>
                                    {timezoneConverter(
                                      doc?.createdAt,
                                      user.userTimezone
                                    )}
                                  </td>
                                  <td>
                                    {((doc.hasOwnProperty('craetedBy') && user?._id == doc?.CreatedBy?._id) || user?.role?.name == 'ADMIN') && (
                                      <>
                                        <button
                                          type="button"
                                          className="btn btn-danger"
                                          style={{
                                            padding: "5px",
                                            fontSize: "14px",
                                          }}
                                          onClick={() => handleDeleteDocument(doc)}
                                        >
                                          Delete
                                        </button>
                                        <button type="button" className="btn btn btn-primary p-2 m-2" onClick={() => handleShowDocumentModal(doc)}>Edit</button>
                                      </>
                                       )}
                                  </td>
                                </tr>
                                 )} 
                              </>
                            );
                          })
                      ) : (
                        <tr>
                          <td>No Records Found</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={12} className="text-end">
                          <button
                            type="button"
                            className="btn btn btn-primary"
                            onClick={handleAddDocument}
                          >
                            <span>
                              <i
                                className="fa fa-cloud-upload"
                                aria-hidden="true"
                              ></i>{" "}
                              Upload Docuemnts
                            </span>
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
                <Row className="d-flex align-items-end">
                  <div>
                    <div className="d-flex">
                      {(user?.role?.permissions?.tasks?.includes('update')) && (
                        <button
                          type="button"
                          className="btn btn-primary w-100 flex-grow-1 me-2"
                          onClick={() =>
                            navigate("/task/update/" + taskDetail?._id)
                          }
                        >
                          Edit
                        </button>
                      )}
                      {(user?.role?.permissions?.tasks?.includes('delete')) && (
                        <button
                          type="button"
                          className="btn btn-danger w-100 flex-grow-1 me-2"
                          onClick={() => handleDelete(taskDetail?._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </Row>
              </Container>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskView;
