import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_getAllFlagAPI, ACTION_getAllLabelAPI, ACTION_getAllStatusAPI } from "../../../../store/status-flag/action";
import FlagStatusTable from "./table/FlagStatusTable";

export const FlagStatusList: React.FC = () => {
  const dispatch: any = useDispatch();
  const { isLoadingFlag, allFlagData: flagData, isLoading, allStatusData: statusData,allLabels : labelData, isLoadingLabel } = useSelector((state: any) => state.flagStatus)
   console.log(labelData,"labelData")
  useEffect(() => {
    dispatch(ACTION_getAllStatusAPI());
    dispatch(ACTION_getAllFlagAPI())
    dispatch(ACTION_getAllLabelAPI())
  }, []);

  return (
    <div>
      <FlagStatusTable isLoading={isLoading} statusData={statusData} flagData={flagData} isLoadingFlag={isLoadingFlag} isLoadingLabel={isLoadingLabel} labelData={labelData}  />
    </div>
  );
};

export default FlagStatusList;
