import React, { useEffect, useState } from "react";
import { message } from "antd";
import { clientColumns } from "../../components/columns/Columns";
import SearchAndFilterTable from "../../components/filterTable/SearchAndFilterTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients } from "../../store/ActionApis/clientApi";
import Header from "../../components/Header/Header";

const Clients = () => {
  const dispatch = useDispatch();

  const { clients } = useSelector((state) => state.client);

  useEffect(() => {
    dispatch(fetchClients());
  }, []);

  return (
    <>
      <div>
        <Header />
      </div>
      <SearchAndFilterTable
        data={clients}
        columns={clientColumns}
        tableType="clients"
      />
    </>
  );
};

export default Clients;
