import React, { useEffect } from 'react'
import {Col, Row} from 'react-bootstrap'
import { useDispatch } from "react-redux"
import { ACTION_deleteNote } from '../../../../store/estimate/actions'

type Props = {
    closeDeleteNoteModalHandler: () => void
    note: Object
    wid: string
  }

const DeleteNoteModal: React.FC<Props> = (props: Props  ) => {
    const dispatch: any = useDispatch();

	useEffect(() => {
		document.body.classList.add("modal-open")
		return () => {
			document.body.classList.remove("modal-open")
		}
	}, [])

    const handleDeleteNote= () => {
		const id = props.note['_id'] ? props.note['_id'] : props.note['Id']
		dispatch(ACTION_deleteNote(props.wid, id))
		props.closeDeleteNoteModalHandler()
	}

    return (
        <>
            <div
				className="modal fade show d-block"
				id="kt_modal_add_user"
				role="dialog"
				tabIndex={-1}
				aria-modal="true"
			>
              <div
					className="modal-dialog modal-dialog-centered modal-md"
					style={{ width: "950px !important" }}
				>
					<div className="modal-content">
						<div
							className="modal-body scroll-y mx-5 mx-xl-15 my-7"
							style={{ textAlign: "center" }}
						>
							<i
								className="bi bi-x-circle"
								style={{ color: "#ff1744", fontSize: "6rem" }}
							></i>
							<div
								style={{
									display: "block",
									fontSize: "20px",
									paddingTop: "5px",
								}}
							>
								Are you sure?
							</div>
							<div style={{ marginTop: "15px" }}>
								<span>Do you really want to delete this Note?</span>
								<p>This process cannot be undone.</p>
								<div className="d flex">
									<Row>
										<Col>
											<div className="text-end pt-5">
												<button
													className="btn btn-danger"
													style={{
														width: "100%",
														background: "#ff1744",
													}}
													onClick={() => handleDeleteNote()}
												>
													<i className="bi bi-trash"></i>
													Delete
												</button>
											</div>
										</Col>
										<Col xs={6} md={6} lg={6}>
											<div className="text-end pt-5">
												<button
													style={{
														width: "100%",
													}}
													type="submit"
													className="btn btn-secondary"
													onClick={() => props.closeDeleteNoteModalHandler() }
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
				</div>
            </div>
        </>
    )

}

export default DeleteNoteModal;
