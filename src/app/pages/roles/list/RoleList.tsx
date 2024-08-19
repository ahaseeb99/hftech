import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import _ from "lodash";
import RoleTable from "../list/table/RoleTable";
import { ACTION_getRoles } from  "../../../../store/roles/actions";

export const RoleList: React.FC = () => {
    const dispatch: any = useDispatch();
    const { rolesData } = useSelector((state: any) => state.roles);

    console.log('rolesData', rolesData);
    useEffect(() => {
        const getRolesList = async () => {
          await dispatch(ACTION_getRoles());
        };
        getRolesList();
      }, []);
    return (
        <div>
            <RoleTable
                rolesData={rolesData}
            />
        </div>
    )
}
