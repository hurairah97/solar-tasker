import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../../store/ActionApis/taskApi";
import SearchAndFilterTable from "../../components/filterTable/SearchAndFilterTable";
import { taskColumn } from "../../components/columns/Columns";

const Tasks = () => {
  const dispatch = useDispatch();

  const { tasks } = useSelector((state) => state.task);

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  return (
    <>
      <div>
        <Header />
      </div>
      <SearchAndFilterTable
        data={tasks}
        columns={taskColumn}
        tableType="tasks"
      />
    </>
  );
};

export default Tasks;
