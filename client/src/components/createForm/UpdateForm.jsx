import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useState, useEffect } from "react";
import Buttons from "../button/Button";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { fetchClients } from "../../store/ActionApis/clientApi";
import { fetchTeams } from "../../store/ActionApis/teamApi";
import {
  fetchUpcommingTasks,
  updateUpcomingTask,
} from "../../store/ActionApis/upcommingTaskApi";
import {
  fetchMissedTasks,
  updateMissedTask,
} from "../../store/ActionApis/missedTasksApi";

// fields for upcomming task page
const upcomingTaskFields = [
  { name: "team_id", label: "Team", type: "select" },
  { name: "response", label: "Response", type: "select" },
  { name: "task_status", label: "Task Status", type: "select" },
];

// fields for missed task page
const missedTaskFields = [
  { name: "client_id", label: "Client", type: "select" },
  { name: "team_id", label: "Team", type: "select" },
  { name: "response", label: "Response", type: "select" },
  { name: "task_status", label: "Task Status", type: "select" },
  // { name: "name", label: "Name", type: "input" },
  { name: "number", label: "Number", type: "input" },
  { name: "service_date", label: "Service Date", type: "date" },
];

// for response field
const response = [
  { id: "0", name: "Pending" },
  { id: 1, name: "Yes" },
  { id: 2, name: "No" },
];

// for taskStatus field
const taskStatus = [
  { id: "0", name: "Pending" },
  { id: 1, name: "On The Way" },
  { id: 2, name: "Working" },
  { id: 3, name: "Completed" },
];

const UpdateForm = ({
  close,
  setClose,
  handleDialogClose,
  editRecord,
  path,
}) => {
  const isMobile = useMediaQuery("(max-width:500px)");

  // state to stored input data
  const [field, setField] = useState({
    client_id: "",
    team_id: "",
    response: "",
    task_status: "",
    // name: "",
    number: "",
    service_date: "",
  });

  // console.log(field);

  // state to show loader on submit button after submit clicked
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  // get client and team data
  const { clients } = useSelector((state) => state.client);
  const { teams } = useSelector((state) => state.team);

  // function for submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const upcommingTaskData = {
      id: editRecord?.task_id,
      team_id: field.team_id,
      response: field.response === "0" ? 0 : field.response,
      task_status: field.task_status === "0" ? 0 : field.task_status,
    };

    let response;
    let module;
    // Check if editRecord exists to determine whether it's an update or create
    if (path === "/upcoming-task") {
      response = await dispatch(updateUpcomingTask(upcommingTaskData)); // for upcomming task
      module = "Upcomming Task";
    } else {
      const missedTaskData = {
        ...upcommingTaskData,
        client_id: field.client_id,
        // name: field.name,
        number: field.number,
        service_date: field.service_date?.format("DD/MM/YYYY"),
      };
      response = await dispatch(updateMissedTask(missedTaskData)); // for missed task
      module = "Missed Task";
    }
    // console.log(response);

    if (response.payload.success) {
      if (path === "/upcoming-task") {
        await dispatch(fetchUpcommingTasks()); // for upcomming task
      } else {
        await dispatch(fetchMissedTasks()); // for missed task
      }
      notification.success({
        message: `${module} Updated!`,
        description: response?.payload?.message,
        placement: "topRight",
      });
      handleDialogClose();
    } else {
      notification.error({
        message: `${module} Not Updated!`,
        description: response?.payload?.message || `${module} Not Updated`,
        placement: "topRight",
      });
    }
    setIsSubmitting(false);
  };

  // function to stored data and check input field is valid
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure to get the name and value from the target

    setField((prev) => ({
      ...prev, // Spread the previous state
      [name]: name === "service_date" ? dayjs(value) : value, // Store the value
    }));
  };

  // effect to call worker api to show in member's select field
  useEffect(() => {
    if (path === "/missed-task") {
      dispatch(fetchClients());
    }
    dispatch(fetchTeams());
  }, []);

  // effect to empty all state whenever dialog is closed
  useEffect(() => {
    if (close) {
      setClose(false);
    }
  }, [close]);

  // effect to fill data in field when edit
  useEffect(() => {
    if (editRecord) {
      setField({
        client_id: editRecord?.client_id || "",
        team_id: editRecord?.team_id,
        response: editRecord?.response || "0",
        task_status: editRecord?.task_status || "0",
        // name: editRecord?.name || "",
        number: Number(editRecord?.number) || "",
        service_date: editRecord?.service_date
        ? dayjs(editRecord?.service_date, "DD/MM/YYYY") // Parse as DD/MM/YYYY
          : null, // Handle null or undefined
      });
    }
  }, [editRecord]);

  return (
    <div className="my-5" style={{ maxWidth: isMobile ? 270 : 420 }}>
      <Box sx={{ minWidth: isMobile ? 270 : 420 }}>
        {/* all fields */}
        {(path === "/upcoming-task"
          ? upcomingTaskFields
          : missedTaskFields
        ).map(({ name, label, type }, index) =>
          type === "input" ? (
            <FormControl fullWidth sx={{ mb: 3 }} key={index}>
              <TextField
                name={name}
                label={label}
                type={name === "number" ? "number" : "string"}
                variant="outlined"
                value={field[name]}
                onChange={(e) => handleInputChange(e)}
              />
            </FormControl>
          ) : type === "date" ? (
            <FormControl fullWidth sx={{ mb: 3 }} key={index}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name={name}
                  label={label}
                  variant="outlined"
                  inputFormat="DD/MM/YY" // Specify the desired format
                  value={field[name] || null} // Ensure it's a dayjs object or null
                  onChange={(e) =>
                    handleInputChange({ target: { name, value: e } })
                  }
                />
              </LocalizationProvider>
            </FormControl>
          ) : (
            <FormControl fullWidth sx={{ mb: 3 }} key={index}>
              <InputLabel id={`select${index}`}>{label}</InputLabel>
              <Select
                labelId={`select${index}`}
                name={name}
                value={field[name] || ""} // Ensure the value is set to field[name], fallback to empty string
                onChange={(e) => handleInputChange(e)}
                label={label}
              >
                {(name === "client_id"
                  ? clients // for client
                  : name === "team_id"
                  ? teams // for teams
                  : name === "response"
                  ? response // for response
                  : taskStatus
                )?.map((item, idx) => (
                  <MenuItem key={idx} value={item.id}>
                    {name === "team_id"
                      ? item.team_name // display team name
                      : item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        )}
      </Box>
      {/* Submit button */}
      <div className="flex justify-end my-3">
        <Buttons
          text={
            isSubmitting ? (
              <span>
                Loading <CircularProgress size="15px" color="inherit" />
              </span>
            ) : (
              "Submit"
            )
          }
          type="primary"
          size="large"
          styling={"linearGradient"}
          disabled={isSubmitting} // disabled when submit button clicked
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
};

export default UpdateForm;
