import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkers } from "../../store/ActionApis/workerApi";
import SearchAndFilterTable from "../../components/filterTable/SearchAndFilterTable";
import { workerColumns } from "../../components/columns/Columns";
import Header from "../../components/Header/Header";

const Workers = () => {
  const dispatch = useDispatch();

  const { workers } = useSelector((state) => state.worker);

  useEffect(() => {
    dispatch(fetchWorkers());
  }, []);

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="">
        <SearchAndFilterTable
          data={workers}
          columns={workerColumns}
          tableType="workers"
        />
      </div>
    </>
  );
};

export default Workers;
