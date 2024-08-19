import React, { useEffect, useState } from "react";
import { RoleForm } from './RoleForm'

export const RoleCreate: React.FC = () => {

    return (
        <div className="row gy-5 g-xl-8">
            <div className="col-xxl-6">
            <div className="card card-xl-stretch mb-xl-8">
                <div className="card-body pt-5">
                    <RoleForm />
                </div>
            </div>
            </div>
        </div>
        );
}