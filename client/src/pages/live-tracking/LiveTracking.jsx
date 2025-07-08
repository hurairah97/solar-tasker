import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchLiveTrackings } from "../../store/ActionApis/liveTrackingApi";
import SearchAndFilterTable from "../../components/filterTable/SearchAndFilterTable";
import { liveTrackingColumn } from "../../components/columns/Columns";

const LiveTracking = () => {
  const dispatch = useDispatch();
  const { liveTrackings } = useSelector((state) => state.liveTracking);
  console.log(liveTrackings);

  useEffect(() => {
    dispatch(fetchLiveTrackings());
  }, []);
  return (
    <>
      <div>
        <Header />
      </div>
      <SearchAndFilterTable
        data={liveTrackings}
        columns={liveTrackingColumn}
        tableType="liveTracking"
      />
    </>
  );
};

export default LiveTracking;
