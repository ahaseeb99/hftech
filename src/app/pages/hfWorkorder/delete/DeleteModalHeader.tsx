import { KTSVG } from "../../../../_metronic/helpers"

const DeleteEstimateModalHeader = (props: any) => {
	return (
		<>
			<h2 className="fw-bolder"></h2>
			<div
				className="btn btn-icon btn-sm btn-active-icon-primary"
				data-kt-users-modal-action="close"
				onClick={() => props.closeDeleteModalHandler()}
				style={{ cursor: "pointer" }}
			>
				<KTSVG
					path="/media/icons/duotune/arrows/arr061.svg"
					className="svg-icon-1"
				/>
			</div>
		</>
	)
}

export default DeleteEstimateModalHeader
