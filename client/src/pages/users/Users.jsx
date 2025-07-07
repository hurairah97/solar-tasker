import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../store/ActionApis/userApi";
import SearchAndFilterTable from "../../components/filterTable/SearchAndFilterTable";
import { userColumn } from "../../components/columns/Columns";

const Users = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <>
      <div>
        <Header />
      </div>
      <SearchAndFilterTable
        data={users}
        columns={userColumn}
        tableType="Users"
      />
    </>
  );
};

export default Users;
