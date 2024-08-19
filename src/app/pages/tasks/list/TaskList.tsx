import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_getAllTask } from "../../../../store/task/action";
import TaskTable from "./table/TaskTable";

export const TaskList: React.FC = () => {
  const dispatch: any = useDispatch();
  useEffect(() => {
    dispatch(ACTION_getAllTask());
  }, []);

  const { isLoading, allTaskData } = useSelector((state: any) => state.task);

  return (
    <div>
      <TaskTable isLoading={isLoading} taskData={allTaskData} />
    </div>
  );
};

export default TaskList;
