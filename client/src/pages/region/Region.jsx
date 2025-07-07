import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegions } from "../../store/ActionApis/regionApi";
import SearchAndFilterTable from "../../components/filterTable/SearchAndFilterTable";
import { regionColumns } from "../../components/columns/Columns";
import Header from "../../components/Header/Header";

const Region = () => {
  const dispatch = useDispatch();

  const { regions } = useSelector((state) => state.region);

  useEffect(() => {
    dispatch(fetchRegions());
  }, []);

  return (
    <>
      <div>
        <Header />
      </div>

      <SearchAndFilterTable
        data={regions}
        columns={regionColumns}
        tableType="regions"
      />
    </>
  );
};

export default Region;
