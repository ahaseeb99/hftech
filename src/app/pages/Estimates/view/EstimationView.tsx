import React from "react"
import ViewEstimationEmail from "./ViewEstimationEmailForm"
import EstimationForm from "./ViewEstimationForm"

const EstimationView: React.FC = () => {
	return (
		<>
			<div className="row gy-5 g-xl-8">
				<div className="col-xxl-6">
					<div className="card card-xl-stretch mb-xl-8">
						<div className="card-body pt-5">
							<EstimationForm />
						</div>
					</div>
				</div>
			</div>
				<div className="col-xxl-6">
					<div className="card card-xl-stretch mb-xl-8">
						<div className="card-body pt-5">
							<ViewEstimationEmail />
						</div>
					</div>
			</div>
		</>
	)
}

export default EstimationView
