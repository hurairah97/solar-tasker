import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import SearchAndFilterTable from "../../components/filterTable/SearchAndFilterTable";
import { fetchMissedTasks } from "../../store/ActionApis/missedTasksApi";
import { missedTaskColumn } from "../../components/columns/Columns";

const MissedTasks = () => {
  const dispatch = useDispatch();
  const { missedTasks } = useSelector((state) => state.missedTask);
  console.log(missedTasks);

  useEffect(() => {
    dispatch(fetchMissedTasks());
  }, []);
  return (
    <>
      <div>
        <Header />
      </div>
      <SearchAndFilterTable
        data={missedTasks}
        columns={missedTaskColumn}
        tableType="MissedTask"
      />
    </>
  );
};

export default MissedTasks;
