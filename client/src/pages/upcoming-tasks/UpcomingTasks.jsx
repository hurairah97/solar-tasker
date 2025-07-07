import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpcommingTasks } from "../../store/ActionApis/upcommingTaskApi";
import SearchAndFilterTable from "../../components/filterTable/SearchAndFilterTable";
import {
  taskColumn,
  upcommingTaskColumn,
} from "../../components/columns/Columns";

const UpcomingTasks = () => {
  const dispatch = useDispatch();
  const { upcommingTasks } = useSelector((state) => state.upcommingTask);
  console.log(upcommingTasks);

  useEffect(() => {
    dispatch(fetchUpcommingTasks());
  }, []);
  return (
    <>
      <div>
        <Header />
      </div>
      <SearchAndFilterTable
        data={upcommingTasks}
        columns={upcommingTaskColumn}
        tableType="UpcommingTask"
      />
    </>
  );
};

export default UpcomingTasks;
