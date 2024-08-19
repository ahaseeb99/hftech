/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState } from 'react'
import { Col, Modal, Row, Card } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import CustomDropdown from '../../../../components/CustomDropdown/CustomDropdown'

type Props = {
    show: boolean
    handleClose: () => void,
    fileUploadHandler: any
}

const DocumentUploadModal: React.FC<Props> = ({ show, handleClose, fileUploadHandler }) => {
    const inputRef = useRef(null)
    const [dragging, setDragging] = useState<boolean>(false);
    const [files, setFiles] = useState<any>([]);
    const [woDocumentType,setWoDocumentType] = useState<string>("") 
    const maxSize = 104857600; 
    const { user } = useSelector((state: any) => state.auth);
    
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
        const filters =  Array.from(e.dataTransfer.files).filter((file: any) => JSON.stringify(file) == JSON.stringify( files.find((currentFile:any) => currentFile.name == file.name)));
        let currentFiles = Array.from(e.dataTransfer.files).filter((file: any) => file.name !== 'application/x-ms-dos-executable')
        currentFiles = currentFiles.filter((file: any) => JSON.stringify(file) !== JSON.stringify( files.find((currentFile:any) => currentFile.name == file.name)))
        currentFiles = currentFiles.filter((file: any) => file.size <= maxSize)
        if (filters.length > 0) {
            toast.error('file already exist')
            return
        }
        else {
            setFiles([...files,...currentFiles])
        }
    };
     
    const handleFileUpload = (e) => {
        const filters =  Array.from(e.target.files).filter((file: any) => JSON.stringify(file) == JSON.stringify( files.find((currentFile:any) => currentFile.name == file.name)));
        let currentFiles = Array.from(e.target.files).filter((file: any) => file.name !== 'application/x-ms-dos-executable')
        currentFiles= currentFiles.filter((file: any) => JSON.stringify(file) !== JSON.stringify( files.find((currentFile:any) => currentFile.name == file.name)))
        currentFiles = currentFiles.filter((file: any) => file.size <= maxSize)
        if(filters.length > 0){
            toast.error('file already exist')
            return
        }
        else{
            setFiles([...files,...currentFiles])
        }
    }

    const handleCloseFile = (index: number) => {
        files.splice(index, 1)
        setFiles([...files])
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const allowedTypes = ['application/x-ms-dos-executable'];
        const invalidFiles = files.filter((file) => allowedTypes.includes(file.type));
        console.log(invalidFiles)
        if (invalidFiles.length > 0) {
            toast.error('Invalid file type')
            return;
        }

        fileUploadHandler(files,woDocumentType)
    }

    const handleCloseModal = () => {
        handleClose();
        setFiles([])
    } 
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
                <form onSubmit={handleSubmit}>
                    <div
                        className="modal-body scroll-y mx-5 my-7"
                    >
                        <div className="fv-row mb-7 ">
                            <label className="required fw-bold fs-6 mb-3  d-flex justify-content-start">
                                Upload Files
                            </label>
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                style={{ border: dragging ? '2px dashed #000' : '2px dashed gray' }}
                                className={"form-control form-control-solid mb-3 mb-lg-0 h-300px mt-2 d-flex justify-content-center align-items-center"} onClick={() =>
                                    //@ts-ignore
                                    inputRef.current && inputRef.current.click()}>
                                <input ref={inputRef} multiple type="file" accept=".gif,.jpg,.jpeg,.png,.doc,.pdf,.docx" id="fileUpload" hidden onChange={(e) => handleFileUpload(e)} />
                                <button type="button" className={`${dragging ? 'btn btn-secondary': 'btn btn-primary' }`}>Drag & Drop or Select</button>
                            </div>
                        </div>
                        <div className='d-flex flex-row flex-wrap'>
                            {files.map((_item, index) => (
                                <Card key={index} className="d-flex justify-content-between border m-2 position-relative">
                                    <Card.Body>
                                        <div className='d-flex justify-content-between align-items-center' key={index}>
                                            <p>{_item.name}</p>
                                            <i className="bi bi-x text-black fs-2 cursor-pointer position-absolute top-0 end-0 p-3" onClick={() => handleCloseFile(index)}></i>
                                        </div>
                                        <Card.Text>
                                            Size: {_item.size} bytes
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                        <div className="fv-row mb-7">
                            <label className="fw-bold fs-6 mb-2">Document Type</label>
                            <CustomDropdown
                                name="Document Type"
                                className=""
                                options={
                                    documentTypes.filter((type) => {
                                    return    (user.role.name !== "ADMIN" && type == "Financial") ? false : true
                                    }).map(item => {
                                      return{
                                        label : item,
                                        value : item
                                      }
                                    })
                                }
                                onChange={(e) =>
                                    setWoDocumentType(e.value)
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
                                                disabled={files.length <= 0}
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
    )
}

export default DocumentUploadModal;

