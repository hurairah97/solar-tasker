import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams } from "../../store/ActionApis/teamApi";
import SearchAndFilterTable from "../../components/filterTable/SearchAndFilterTable";
import { teamColumn } from "../../components/columns/Columns";
import Header from "../../components/Header/Header";

const Team = () => {
  const dispatch = useDispatch();

  const { teams } = useSelector((state) => state.team);

  useEffect(() => {
    dispatch(fetchTeams());
  }, []);

  return (
    <>
      <div>
        <Header />
      </div>
      <SearchAndFilterTable
        data={teams}
        columns={teamColumn}
        tableType="teams"
      />
    </>
  );
};

export default Team;
