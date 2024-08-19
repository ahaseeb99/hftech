import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import TaskCreate from "./create/TaskCreate";
import TaskList from "./list/TaskList";
import TaskUpdate from "./update/TaskUpdate";
import TaskView from "./view/TaskView";

const TaskPages: React.FC = () => {
  return (
    <Routes>
      <Route
        element={
          <>
            <Outlet />
          </>
        }
      >
        <Route
          path="create"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Create Task</PageTitle>
              <TaskCreate />
            </>
          }
        />
        <Route
          path="view/:taskId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Task View</PageTitle>
              <TaskView  />
            </>
          }
        />
        <Route
          path="list"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Task List</PageTitle>
              <TaskList />
            </>
          }
        />
        <Route
          path="update/:taskId"
          element={
            <>
              <PageTitle breadcrumbs={[]}>Task Update</PageTitle>
              <TaskUpdate />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default TaskPages;
