import React, { useEffect } from "react"
import EstimateDetailLineItem from "../../../../components/Estimate/EstimateDetailLineItem"
import EstimateDetailPage from "../../../../components/Estimate/EstimateDetailPage"
import PdfViewerModalHeader from "./PdfViewerModalHeader"

const PdfViewerModal = (props: any) => {
	useEffect(() => {
		document.body.classList.add("modal-open")
		return () => {
			document.body.classList.remove("modal-open")
		}
	}, [])

	return (
		<>
			<div
				className="modal fade show d-block"
				id="kt_modal_add_user"
				role="dialog"
				tabIndex={-1}
				aria-modal="true"
			>
				{/* begin::Modal dialog */}
				<div
					className="modal-dialog modal-dialog-centered modal-xl"
					style={{ width: "950px !important" }}
				>
					{/* begin::Modal content */}
					<div className="modal-content">
						<PdfViewerModalHeader closePdfHandler={props.closePdfHandler} />
						{/* begin::Modal body */}
						<div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
							<div style={{ display: "block", padding: "3px 0 40px 0" }}>
								<EstimateDetailPage estimateData={props.estimateData} />
							</div>
							<div style={{ display: "block", padding: "3px 0" }}>
								<EstimateDetailLineItem estimateData={props.estimateData} />
							</div>
						</div>
						{/* end::Modal body */}
					</div>
					{/* end::Modal content */}
				</div>
				{/* end::Modal dialog */}
			</div>
			{/* begin::Modal Backdrop */}
			<div className="modal-backdrop fade show"></div>
			{/* end::Modal Backdrop */}
		</>
	)
}

export default PdfViewerModal
