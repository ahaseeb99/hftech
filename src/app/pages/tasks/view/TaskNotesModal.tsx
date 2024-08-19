/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import CustomDropdown from '../../../../components/CustomDropdown/CustomDropdown'
import { ACTION_postNoteTask } from '../../../../store/task/action'

type Props = {
  show: boolean
  updateNote: boolean,
  handleClose: () => void
  taskId: string
  note: object
}

const NotesModal: React.FC<Props> = ({ show, updateNote, handleClose, taskId, note = { "body": "" } }) => {
  const dispatch: any = useDispatch();
  const [noteBody, setNoteBody] = useState(note["Body"]);
  const [noteDocumentType, setNotesDocumentType] = useState<string>("")

  const { user } = useSelector((state: any) => state.auth);
  useEffect(() => {
    setNoteBody(note["body"]);
  }, [note]);

  const handleForm = (e) => {
    e.preventDefault();
    handleSubmitNoteForm();
    handleClose();

  };
  const handleSubmitNoteForm = async () => {
    let reqData;
    if (note && note['_id']) {
      reqData = {
        noteTypeId: "Private",
        _id: note['_id'],
        body: noteBody,
        notesType : noteDocumentType ? noteDocumentType : note['notesType']
      };

    } else {
      reqData = {
        noteTypeId: "Private",
        body: noteBody,
        notesType : noteDocumentType
      };
    }
    dispatch(ACTION_postNoteTask(taskId, reqData));
    handleClose();
  };

  const documentTypes = ['Financial', 'Project', 'Safety'];


  return (
    <Modal
      className='modal fade show d-block'
      id='kt_header_search_modal'
      aria-hidden='true'
      dialogClassName='modal-dialog modal-dialog-centered modal-md'
      show={show}
    >
      <div className='modal-content shadow-none'>
        <form onSubmit={handleForm}>
          <div
            className="modal-body scroll-y mx-5 my-7"
          >
            <div className="fv-row mb-7 ">
              <label className="required fw-bold fs-6 mb-2  d-flex justify-content-start">
                Note
              </label>

              <textarea
                required
                placeholder="Note"
                name="Body"
                className={"form-control form-control-solid mb-3 mb-lg-0"}
                autoComplete="off"
                defaultValue={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                rows={5}
              />
            </div>
            <div className="mb-7">
              <label className="fw-bold fs-6 mb-2  d-flex justify-content-start">
                Document Type
              </label>
              <CustomDropdown
                name="Document Type"
                className=""
                options={
                  documentTypes.filter((type) => type != "Financial" || user.role.name == "ADMIN")?.map(item => {
                    console.log(item)
                    return {
                      label: item,
                      value: item
                    }
                  })
                }
                value={{
                  value : note["notesType"],
                  label : note["notesType"]
                }}
                onChange={(e) =>
                  setNotesDocumentType(e.value)
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
                        {updateNote ? 'Update Note' : 'Create Note'}
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
                        onClick={handleClose}
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
  )
}

export default NotesModal;

