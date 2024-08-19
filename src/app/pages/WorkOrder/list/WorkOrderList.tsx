import axios from "axios";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_getAllWorkOrders } from "../../../../store/workorder/actions";
import WorkOrderTable from "./table/WorkOrderTable";
// import { ACTION_getWorkOrderList } from "../../../../store/WorkOrder/actions"
// import DeleteWorkOrderModal from "../delete/DeleteWorkOrderModal"
// import DeleteWorkOrderModal from "../delete/DeleteWorkOrderModal"

export const WorkOrderList: React.FC = () => {
  const dispatch: any = useDispatch();
  const { allWorkordersList } = useSelector((state: any) => state.workOrder);

  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);
  const [activeWorkOrder, setActiveWorkOrder] = useState<any>(null);

  const showDeleteModalHandler = (_WorkOrder: any) => {
    setActiveWorkOrder(_WorkOrder);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    dispatch(ACTION_getAllWorkOrders());
  }, []);

  const closeDeleteModalHandler = () => {
    setActiveWorkOrder(null);
    setShowDeleteModal(false);
  };

  console.log({ allWorkordersList });

  return (
    <div>
      <WorkOrderTable
        WorkOrderData={allWorkordersList}
        showDeleteModalHandler={showDeleteModalHandler}
      />
    </div>
  );
};
