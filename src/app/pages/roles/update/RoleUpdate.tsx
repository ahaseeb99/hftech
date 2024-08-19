import React, { useEffect, useState } from "react";
import { EditRoleForm } from './EditRoleForm';

export const RoleUpdate: React.FC = () => {

    return (
        <div className="row gy-5 g-xl-8">
			<div className="col-xxl-6">
				<div className="card card-xl-stretch mb-xl-8">
					<div className="card-body pt-5">
						<EditRoleForm />
					</div>
				</div>
			</div>
		</div>
    )
}