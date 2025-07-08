import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Buttons from "../button/Button";
import { handleSanitizeInput } from "../../utils/SanitizeInput";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { fetchWorkers } from "../../store/ActionApis/workerApi";
import {
  createTeam,
  fetchTeams,
  updateTeam,
} from "../../store/ActionApis/teamApi";

const membersFields = [
  { label: "Team Lead" },
  { label: "First Member" },
  { label: "Second Member" },
];

const TeamForm = ({ close, setClose, handleDialogClose, editRecord }) => {
  const isMobile = useMediaQuery("(max-width:500px)");
  console.log(editRecord);

  // state to stored input data
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState(["", "", ""]); // Array to store all members field value

  // state to avoid special character (for text field only)
  const [isTeamNameValid, setIsTeamNameValid] = useState(true);

  // state to show loader on submit button after submit clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  // get member data from worker api
  const { workers } = useSelector((state) => state.worker);

  // function for submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const dataToSend = {
      teamname: teamName,
      member1: members[0],
      member2: members[1],
      member3: members[2] || null, // this field is allow to go with null as well
    };

    let response;
    let module;
    // Check if editRecord exists to determine whether it's an update or create
    if (editRecord) {
      response = await dispatch(
        updateTeam({ id: editRecord?.id, ...dataToSend })
      ); // for update
      module = "Updated";
    } else {
      response = await dispatch(createTeam(dataToSend)); // for create
      module = "Added";
    }

    if (response.payload.success) {
      await dispatch(fetchTeams());
      notification.success({
        message: `Team ${module}!`,
        description: response?.payload?.message,
        placement: "topRight",
      });
      handleDialogClose();
      emptyStates();
    } else {
      notification.error({
        message: `Team Not ${module}!`,
        description: response?.payload?.message || `Team Not ${module}`,
        placement: "topRight",
      });
    }
    setIsSubmitting(false);
  };

  // function to empty all states
  const emptyStates = () => {
    if (!editRecord) {
      setTeamName("");
      setMembers(["", "", ""]);
    }
    setIsTeamNameValid(true);
  };

  // function to check input field is valid
  const handleInputChange = (e) => {
    setTeamName(e.target.value);
    const isDataSafe = handleSanitizeInput(e.target.value);
    setIsTeamNameValid(isDataSafe);
  };

  // effect to call worker api to show in member's select field
  useEffect(() => {
    dispatch(fetchWorkers());
  }, []);

  // effect to empty all state whenever dialog is closed
  useEffect(() => {
    if (close) {
      emptyStates();
      setClose(false);
    }
  }, [close]);

  // effect to fill data in field when edit
  useEffect(() => {
    if (editRecord) {
      setTeamName(editRecord?.team_name);
      const members = [
        editRecord?.member1_id,
        editRecord?.member2_id,
        editRecord?.member3_id || "",
      ];
      setMembers(members);
    }
  }, [editRecord]);

  return (
    <div className="my-5" style={{ maxWidth: isMobile ? 270 : 420 }}>
      <Box sx={{ minWidth: isMobile ? 270 : 420 }}>
        {/* teamName field */}
        <FormControl fullWidth sx={{ mb: isTeamNameValid ? 3 : 2 }}>
          <TextField
            label="Enter Team Name"
            variant="outlined"
            value={teamName}
            onChange={(e) => handleInputChange(e)}
            error={!isTeamNameValid}
            helperText={!isTeamNameValid && "This character is prohibited"}
          />
        </FormControl>

        {/* all three members fields */}
        {membersFields.map(({ label }, index) => (
          <FormControl fullWidth sx={{ mb: 3 }} key={index}>
            <InputLabel id={`member${index}`}>Select {label}</InputLabel>
            <Select
              labelId={`member${index}`}
              value={members[index]}
              onChange={(e) => {
                const updatedMembers = [...members];
                updatedMembers[index] = e.target.value;
                setMembers(updatedMembers);
              }}
              label={`Select ${label}`}
            >
              {workers.map((memb, idx) => (
                <MenuItem key={idx} value={memb.id}>
                  {memb.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
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
          disabled={
            isSubmitting ||
            !(isTeamNameValid && teamName && members[0] && members[1])
          } // disabled untill all fields filled (except third member) and textfield is valid
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
};

export default TeamForm;
