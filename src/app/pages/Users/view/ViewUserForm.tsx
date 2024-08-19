import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row, Table } from "react-bootstrap";
import DeleteUserModal from "../delete/DeleteUserModal";
import { ACTION_deleteUserDocument, ACTION_getUserById } from "../../../../store/users/actions";
import UserDocumentUploadModal from "../userDocumentUploadModal/userDocumentUploadModal";
import { uploadFileToS3Users } from "../../../../utils/uploadFileToS3";
import moment from "moment";
import { DeleteUserDocumentModal } from "../delete/DeleteUserDocumentModal";
import { KTSVG } from "../../../../_metronic/helpers";
import { timezoneConverter } from "../../../../utils/helpers";
import { ACTION_getClients } from "../../../../store/client/actions";

const UserView: React.FC = () => {
  const dispatch: any = useDispatch();
  const navigate: any = useNavigate();

  const loggedInUser = useSelector((state: any) => state.auth.user);

  let currentUser = useSelector((state: any) => state.users.userDetail);
   
  const [activeEstimate, setActiveEstimate] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [showDocumentModal,setShowDocumentModal] = useState(false)
  const [documentDeleteModal,setDocumentDeleteModal] = useState<boolean>(false) 
  const [currentDocuement,setCurrentDocument] = useState<Object>({})

  useEffect(() => {
    const id = window.location.pathname.split("/")[3];
    dispatch(ACTION_getUserById(id));
    dispatch(ACTION_getClients())
  }, []);
  const { user } = useSelector((state: any) => state.auth);
  const uploadBtnText = <span><i className="fa fa-cloud-upload" aria-hidden="true"></i> Upload File</span>
  const clientsList = useSelector(
    (state: any) => state.client.clientsData.clients?.filter(x => x.status == "ACTIVE")
  );

  const showDeleteModalHandler = (user: any) => {

    setShowDeleteModal(true);
  };

  const closeDeleteModalHandler = () => {
    setShowDeleteModal(false);
  };

  const handleDocumentDeleteModal = (doc : any) => {
    setCurrentDocument(doc)
    setDocumentDeleteModal(true)
  }

  const handleDocumentDelete = (doc) => {
    setDocumentDeleteModal(false)
    const id = window.location.pathname.split("/")[3];
    dispatch(ACTION_deleteUserDocument(id,doc))
  }

  const handleCloseDocumentDeleteModal = () => {
    setDocumentDeleteModal(false)
  }
  
  const fileUploadHandler = async(files,values) => {
    setShowDocumentModal(false)
    const file = files;
    const form = new FormData();
    file.map(file => {
      form.append("files", file)
    })    
    form.append('documentName', values.documentName)
    form.append('documentType', values.documentType)
    form.append('documentExpire', values.documentExpire)
    form.append('client', JSON.stringify(values.client))
    const id = window.location.pathname.split("/")[3];
    await  uploadFileToS3Users(form,id)
    dispatch(ACTION_getUserById(id));
  }
   
  return (
    <>
      {showDocumentModal && 
        <UserDocumentUploadModal 
          show={showDocumentModal}
          clientsList={clientsList}
          handleClose={() => setShowDocumentModal(false)}
          fileUploadHandler={fileUploadHandler}
         />}
      {showDeleteModal && (
        <DeleteUserModal
          closeDeleteModalHandler={closeDeleteModalHandler}
          currentUser={currentUser}
        />
      )}
      {documentDeleteModal &&
        <DeleteUserDocumentModal
          doc={currentDocuement}
          handleCloseDocumentDeleteModal={handleCloseDocumentDeleteModal}
          handleDocumentDelete={handleDocumentDelete}
        />
      }
      <>
        <form className="form">
          <div className="fv-row mb-7" style={{ marginBottom: "50px" }}>
            <Row >
              <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">First Name</label>
                  <p>{currentUser?.FirstName}</p>
                </div>
                </Col>
                <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Last Name</label>
                  <p>{currentUser?.LastName}</p>
                </div>
                </Col>
               
              </Row>
              <Row>
                 <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Role</label>
                  <p>{currentUser?.role?.name}</p>
                </div>
              </Col>
                <Col>
                <div className="fv-row mb-7">
                  <label className="fw-bold fs-6 mb-2">Email</label>
                  <p>{currentUser?.email}</p>
                </div>
              </Col>
              </Row>
              <Row>
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold fs-6 mb-2">Phone</label>
                    <p>{currentUser?.contact}</p>
                  </div>
                  </Col>
                  <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold fs-6 mb-2">Personal Phone</label>
                    <p>{currentUser?.personalContact}</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold fs-6 mb-2">Intel ID</label>
                    <p>{currentUser?.intelId}</p>
                  </div>
                  </Col>
                  <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold fs-6 mb-2">Title</label>
                    <p>{currentUser?.title}</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold fs-6 mb-2">Status</label>
                    <p>{currentUser?.status}</p>
                  </div>
                </Col>
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold fs-6 mb-2">Timezone</label>
                    <p>{currentUser?.userTimezone}</p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold fs-6 mb-2">Corrigo Id</label>
                    {currentUser?.corrigoId?.length > 0 ? (
                      <p>{currentUser?.corrigoId}</p>
                    ) : (
                    <p>Null</p>
                    )}
                  </div>
                </Col>
                <Col>
                  <div className="fv-row mb-7">
                    <label className="fw-bold fs-6 mb-2">Emergency</label>
                    <div className="ms-2">
                    <span
                      className={`badge badge-lg badge-${ currentUser?.emergency
                        ? "danger"
                        : "secondary"
                        }`}
                    >
                      {'EMR'}
                    </span>
                    </div>
                  </div>
                </Col>
              </Row>
                <div>
                  <h2 className="fs-4 mb-5 mt-5">DOCUMENTS</h2>
              <Table bordered responsive className="workorder-table">
                <thead>
                  <tr>
                    <th>TITLE</th>
                    <th>TYPE</th>
                    <th>NAME</th>
                    <th>EXPIRE</th>
                    <th>CREATED BY</th>
                    <th>CREATED Date <span className="cursor-pointer text-dark" data-toggle="tooltip" data-placement="top" title={user.userTimezone ? user.userTimezone : 'America/Phoenix'} >
                      <KTSVG path="/media/svg/shapes/global.svg" />
                    </span></th>
                    <th>Actions</th>
                    <th>
                      <div>
                        <Button onClick={() => setShowDocumentModal(true)} style={{ padding: "5px", fontSize: "14px" }}>{uploadBtnText}</Button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUser?.Documents?.length > 0 ? (
                    currentUser.Documents.filter(doc => !doc.isDeleted).map((item, index) => (
                      <tr
                        key={index}
                        style={{ borderBottom: "0.5pt solid lightgray" }}
                      >
                        <td>
                          <a href={item?.DocUrl} rel="noreferrer" target="_blank">
                            {item?.Title}
                          </a>
                        </td>
                        <td>{item?.documentType}</td>
                        <td>{item?.documentName}</td>
                        <td>
                          {moment
                            .tz(item?.documentExpire, user?.userTimezone ? user?.userTimezone : 'UTC')
                            .format("MM/DD/YYYY")}
                        </td>
                        <td>{item?.CreatedBy?.DisplayAs}</td>
                        <td>{timezoneConverter(item.UpdatedDate, user.user?.userTimezone)}</td>
                        <td>{((item.hasOwnProperty('CreatedBy') && user?._id == item?.CreatedBy?.Id) || user?.role?.name == 'ADMIN') && (
                          <button type="button" className="btn btn-danger" style={{ padding: "5px", fontSize: "14px" }} onClick={() => handleDocumentDeleteModal(item)}>Delete</button>)}
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
                </div>
            <Row>
              {(loggedInUser?._id === currentUser?._id ||
                loggedInUser?.role?.name === "ADMIN") && (
                <Col xs={3} md={3} lg={3}>
                  <div className="text-end pt-15">
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{
                        width: "100%",
                      }}
                      onClick={() => showDeleteModalHandler(currentUser)}
                    >
                      Delete
                    </button>
                  </div>
                </Col>
              )}
              {(loggedInUser?._id === currentUser?._id ||
                loggedInUser?.role?.name === "ADMIN") && (
                <Col xs={3} md={3} lg={3}>
                  <div className="text-end pt-15">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{
                        width: "100%",
                      }}
                      onClick={() =>
                        navigate(`/users/update/${currentUser?._id}`)
                      }
                    >
                      Edit
                    </button>
                  </div>
                </Col>
              )}
              {/* {(loggedInUser.role === "ADMIN") && (
                <Col xs={3} md={3} lg={3}>
                  <div className="text-end pt-15">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{
                        width: "100%",
                      }}
                      onClick={() =>
                        navigate(`/permissions/view/${currentUser?._id}`)
                      }
                    >
                      User Management
                    </button>
                  </div>
                </Col>
              )} */}
            </Row>
          </div>
        </form>
      </>

      {/* //// */}
    </>
  );
};

export default UserView;
