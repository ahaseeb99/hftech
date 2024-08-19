import Img_PdfView from "../../../../../assets/icons/ic_pdf.svg"

const PDFActions = ({
	showPdfHandler,
	showSendEstimateModalHandler,
	onDownloadBtnHandler,
	estimateData,
}: any) => {
	return (
		<>
			

			<button
				className="btn btn-light btn-active-light-primary btn-sm me-2"
				data-kt-menu-trigger="click"
				data-kt-menu-placement="bottom-end"
				onClick={() => showPdfHandler()}
			>
				<i
					className="bi bi-filetype-pdf p-0"
					style={{ fontSize: "20px", color: "#000" }}
				></i>
				{/* <img src={Img_PdfView} alt="pdf-img" height={"18px"} /> */}
			</button>
			<button
				className="btn btn-light btn-active-light-primary btn-sm me-2"
				data-kt-menu-trigger="click"
				data-kt-menu-placement="bottom-end"
				onClick={() => onDownloadBtnHandler(estimateData?._id)}
			>
				{/* <img src={Img_PdfView} alt="pdf-img" height={"18px"} /> */}
				<i
					className="bi bi-file-earmark-arrow-down p-0"
					style={{ fontSize: "20px", color: "#000" }}
				></i>
			</button>
			<button
				className="btn btn-light btn-active-light-primary btn-sm me-2"
				data-kt-menu-trigger="click"
				data-kt-menu-placement="bottom-end"
				onClick={() => showSendEstimateModalHandler(estimateData?._id)}
			>
				{/* <img src={Img_PdfView} alt="pdf-img" height={"18px"} /> */}
				<i
					className="bi bi-envelope-fill p-0"
					style={{ fontSize: "20px", color: "#000" }}
				></i>
			</button>
		</>
	)
}

export default PDFActions
