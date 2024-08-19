import Img_PdfView from "../../../../../assets/icons/ic_pdf.svg"

const PDFActions = ({
	showPdfHandler,
	showSendEstimateModalHandler,
	onDownloadBtnHandler,
	estimateData,
}: any) => {
	return (
		<>
			{/* <button
				className="border-0 ml-2"
				data-kt-menu-trigger="click"
				type="button"
				data-kt-menu-placement="bottom-end"
				onClick={() => showPdfHandler()}
				style={{background: "none"}}
			>
				<i
					className="bi bi-filetype-pdf p-0 fs-2x"
				/>
			</button> */}
			
                <button
                  type="button"
                  className="btn btn-primary flex-grow-1 me-2"
                  data-kt-menu-placement="bottom-end"
				  onClick={() => onDownloadBtnHandler(estimateData?._id)}
				  data-kt-menu-trigger="click"
                >
                  PDF
                </button>
			
                <button
                  type="button"
                  className="btn btn-primary flex-grow-1"
                  data-kt-menu-placement="bottom-end"
				  onClick={() => showSendEstimateModalHandler(estimateData?._id)}
				  data-kt-menu-trigger="click"
                >
                  Email
                </button>
		</>
	)
}

export default PDFActions
