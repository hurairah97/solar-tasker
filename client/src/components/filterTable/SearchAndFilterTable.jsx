import React, { useEffect, useState } from "react";
import { DatePicker, Input, Select } from "antd";
import ReusableTable from "../reusebaleTable/ReuseableTable";

const { Search } = Input;
const { Option } = Select;

const SearchAndFilterTable = ({
  data = [], // Default to an empty array if data is undefined
  columns,
  tableType,
}) => {
  // Table States
  const [tableData, setTableData] = useState([]);
  console.log(tableData)
  // console.log("Table Type =>", tableType);
  // console.log("Data as props =>", data);

  // Client States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermName, setSearchTermName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState();
  console.log(selectedPlan)

  // Region States
  const [searchTermByArea, setSearchTermByArea] = useState("");
  const [searchTermByRegion, setSearchTermByRegion] = useState("");

  // Workers States
  const [searchTermByWorkerName, setSearchTermByWrokerName] = useState("");
  const [searchTermByWorkerCNIC, setSearchTermByWorkerCNIC] = useState("");

  // Team States
  const [searchTeamByName, setSearchTeamByName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  //User States

  const [searchByName, setSearchByName] = useState("");
  const [searchByEmail, setSearchByEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // Tasks Status
  const [searchByTaskName, setSearchByTaskName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Upcomming Task Status
  const [searchByUpcommingTaskName, setSearchByUpcommingTaskName] =
    useState("");
  // const [selectedDate, setSelectedDate ]= useState("")

  // Date format in the data
  const dateFormat = "DD/MM/YYYY";
  const onDateChange = (date, dateString) => {
    // console.log( dateString);
    setSelectedDate(dateString);
  };

  // Filter data based on search inputs
  useEffect(() => {
    // Ensure data is an array
    let filteredData = Array.isArray(data) ? data : [];
    // console.log(filteredData)

    if (tableType === "clients") {
      filteredData = filteredData.filter((item) => {
        console.log(item);
    
        const matchesSearch = item.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesSearchName = item.name
          ?.toLowerCase()
          .includes(searchTermName.toLowerCase());
    
        // Handle selectedPlan explicitly, including 0
        const matchesPlan =
          selectedPlan !== null && selectedPlan !== undefined
            ? item.plan === selectedPlan
            : true;
    
        console.log(matchesPlan);
        return matchesPlan && matchesSearch && matchesSearchName;
      });
    
    } else if (tableType === "regions") {
      filteredData = filteredData.filter((item) => {
        const matchesSearchArea = item.area
          ?.toLowerCase()
          .includes(searchTermByArea.toLowerCase());
        const matchesSearchRegion = item.region
          ?.toLowerCase()
          .includes(searchTermByRegion.toLowerCase());
        return matchesSearchArea && matchesSearchRegion;
      });
    } else if (tableType === "workers") {
      filteredData = filteredData.filter((item) => {
        const matchesSearchWorkerName = item.name
          ?.toLowerCase()
          .includes(searchTermByWorkerName.toLowerCase());
        const matchesSearchByWorkerCNIC = String(item.cnic_number || "")
          .toLowerCase()
          .includes(searchTermByWorkerCNIC.toLowerCase());
        return matchesSearchWorkerName && matchesSearchByWorkerCNIC;
      });
    } else if (tableType === "teams") {
      filteredData = filteredData.filter((item) => {
        const matchesTeam = item.team_name
          ?.toLowerCase()
          .includes(searchTeamByName.toLowerCase());
        const matchesStatus = selectedStatus
          ? item.isactive === selectedStatus
          : true;
        return matchesStatus && matchesTeam;
      });
    } else if (tableType === "Users") {
      filteredData = filteredData.filter((item) => {
        const matchesUserName = item.user_name
          ?.toLowerCase()
          .includes(searchByName.toLowerCase());
        const matcheEmail = item.email
          ?.toLowerCase()
          .includes(searchByEmail.toLowerCase());
        const matchesUserRole = selectedRole
          ? item.role === selectedRole
          : true;
        return matchesUserName && matcheEmail && matchesUserRole;
      });
    } else if (tableType === "tasks") {
      filteredData = filteredData.filter((item) => {
        const matchesTaskName = item.name
          ?.toLowerCase()
          .includes(searchByTaskName.toLowerCase());
        const matchesTaskDate = selectedDate
          ? item.created_at === selectedDate
          : true;
        // console.log(matchesTaskDate)
        return matchesTaskName && matchesTaskDate;
      });
    } else if (tableType === "UpcommingTask" || tableType === "MissedTask") {
      filteredData = filteredData.filter((item) => {
        const matchesUpcommingTaskName = item.name
          ?.toLowerCase()
          .includes(searchByUpcommingTaskName.toLowerCase());
        const matchesUpcommingTaskDate = selectedDate
          ? item.created_at === selectedDate
          : true;
        // console.log(matchesTaskDate)
        return matchesUpcommingTaskName && matchesUpcommingTaskDate;
      });
    }

    setTableData(filteredData);
  }, [
    data,
    tableType,
    searchTerm,
    searchTermName,
    selectedPlan,
    searchTermByArea,
    searchTermByRegion,
    searchTermByWorkerCNIC,
    searchTermByWorkerName,
    searchTeamByName,
    selectedStatus,
    searchByEmail,
    searchByName,
    selectedRole,
    searchByTaskName,
    selectedDate,
    searchByUpcommingTaskName,
  ]);

  return (
    <div className="shadow-md p-6 bg-gray-50 rounded mt-2 ">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {tableType === "clients" ? (
          <>
            <Search
              placeholder="Search By Name"
              onChange={(e) => setSearchTermName(e.target.value)}
              style={{ width: "200px" }}
              allowClear
            />

            <Search
              placeholder="Search By Email"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "200px" }}
              allowClear
            />

            <Select
              placeholder="Select Plan"
              onChange={(value) => setSelectedPlan(value)}
              style={{ width: "150px" }}
              allowClear
            >
              <Option value={0}>Basic</Option>
              <Option value={1}>Premium</Option>
            </Select>
          </>
        ) : tableType === "regions" ? (
          <>
            <Search
              placeholder="Search By Area"
              onChange={(e) => setSearchTermByArea(e.target.value)}
              style={{ width: "200px" }}
              allowClear
            />

            <Search
              placeholder="Search By Region"
              onChange={(e) => setSearchTermByRegion(e.target.value)}
              style={{ width: "200px" }}
              allowClear
            />
          </>
        ) : tableType === "workers" ? (
          <>
            <Search
              placeholder="Search By Name"
              onChange={(e) => setSearchTermByWrokerName(e.target.value)}
              style={{ width: "200px" }}
              allowClear
            />

            <Input
              placeholder="Search By CNIC"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setSearchTermByWorkerCNIC(value); // Only set numeric values
                }
              }}
              style={{ width: "200px" }}
              maxLength={13}
              allowClear
            />
          </>
        ) : tableType === "teams" ? (
          <>
            <Search
              placeholder="Search By Team Name"
              onChange={(e) => setSearchTeamByName(e.target.value)}
              style={{ width: "200px" }}
              allowClear
            />

            {/* <Select
              placeholder="Select Status"
              onChange={(value) => setSelectedStatus(value)}
              style={{ width: "150px" }}
              allowClear
            >
              <Option value={1}>Active</Option>
              <Option value={0}>Offline</Option>
            </Select> */}
          </>
        ) : tableType === "Users" ? (
          <>
            <Search
              placeholder="Search By Name"
              onChange={(e) => setSearchByName(e.target.value)}
              style={{ width: "200px" }}
              allowClear
            />

            <Search
              placeholder="Search By Email"
              onChange={(e) => setSearchByEmail(e.target.value)}
              style={{ width: "200px" }}
              allowClear
            />

            <Select
              placeholder="Select Role"
              onChange={(value) => setSelectedRole(value)}
              style={{ width: "150px" }}
              allowClear
            >
              <Option value="Super Admin">Super Admin</Option>
              <Option value="Admin">Admin</Option>
            </Select>
          </>
        ) : tableType === "tasks" ? (
          <>
            <Search
              placeholder="Search By Name"
              onChange={(e) => setSearchByTaskName(e.target.value)}
              style={{ width: "200px" }}
              allowClear
            />
            <DatePicker
              placeholder="Created Date"
              format={dateFormat} // Match the format of your data
              //  onChange={(date) => setTaskDate(date)}
              onChange={onDateChange}
              style={{ width: "200px" }}
            />
          </>
        ) : tableType === "UpcommingTask" || tableType === "MissedTask" ? (
          <>
            <Search
              placeholder="Search By Name"
              onChange={(e) => setSearchByUpcommingTaskName(e.target.value)}
              style={{ width: "200px" }}
              allowClear
            />
            <DatePicker
              placeholder="Created Date"
              format={dateFormat} // Match the format of your data
              //  onChange={(date) => setTaskDate(date)}
              onChange={onDateChange}
              style={{ width: "200px" }}
            />
          </>
        ) : (
          ""
        )}
      </div>

      <ReusableTable columns={columns} data={tableData} />
    </div>
  );
};

export default SearchAndFilterTable;
