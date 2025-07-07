import {
  Box,
  CircularProgress,
  FormControl,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Buttons from "../button/Button";
import { handleSanitizeInput } from "../../utils/SanitizeInput";
import { useDispatch } from "react-redux";
import { notification } from "antd";
import {
  createWorker,
  fetchWorkers,
  updateWorker,
} from "../../store/ActionApis/workerApi";

const WorkerForm = ({ close, setClose, handleDialogClose, editRecord }) => {
  const isMobile = useMediaQuery("(max-width:500px)");

  // state to stored input data
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [nic, setNic] = useState("");
  const [address, setAddress] = useState("");

  // state to avoid special character (for text field only)
  const [isNameValid, setIsNameValid] = useState(true);
  const [isAddressValid, setIsAddressValid] = useState(true);

  // state to show loader on submit button after submit clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  // function for submit
  const handleSubmit = async () => {
    if (number?.length === 10) {
      setIsSubmitting(true);
      const dataToSend = {
        name: name,
        // number: number,
        number: Number(`92${number}`),
        cnic: nic,
        address: address,
      };
      let response;
      let module;
      // Check if editRecord exists to determine whether it's an update or create
      if (editRecord) {
        response = await dispatch(
          updateWorker({ id: editRecord?.id, ...dataToSend })
        ); // for update
        module = "Updated";
      } else {
        response = await dispatch(createWorker(dataToSend)); // for create
        module = "Added";
      }

      if (response.payload.success) {
        await dispatch(fetchWorkers());
        notification.success({
          message: `Worker ${module}!`,
          description: response?.payload?.message,
          placement: "topRight",
        });
        handleDialogClose();
        emptyStates();
      } else {
        notification.error({
          message: `Worker Not ${module}!`,
          description: response?.payload?.message || `Worker Not ${module}`,
          placement: "topRight",
        });
      }
      setIsSubmitting(false);
    } else {
      notification.error({
        message: `Number Field Incorrect`,
        description: "Number should not start with 0. Only 10 digits allow.",
        placement: "topRight",
      });
    }
  };

  // function to empty all states
  const emptyStates = () => {
    if (!editRecord) {
      setName("");
      setNumber("");
      setNic("");
      setAddress("");
    }
    setIsNameValid(true);
    setIsAddressValid(true);
  };

  // function to check input field is valid
  const handleInputChange = (e) => {
    const isDataSafe = handleSanitizeInput(e.target.value);
    if (e.target.name === "name") {
      // for name field
      setName(e.target.value);
      setIsNameValid(isDataSafe);
    } else {
      // for address field
      setAddress(e.target.value);
      setIsAddressValid(isDataSafe);
    }
  };

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
      setName(editRecord?.name);
      setNumber(editRecord?.number);
      setNic(editRecord?.cnic_number);
      setAddress(editRecord?.address);
    }
  }, [editRecord]);

  return (
    <div className="my-5">
      <Box sx={{ minWidth: isMobile ? 270 : 420 }}>
        {/* area field */}
        <FormControl fullWidth sx={{ mb: isNameValid ? 3 : 2 }}>
          <TextField
            name="name"
            label="Enter Name"
            variant="outlined"
            value={name}
            onChange={(e) => handleInputChange(e)}
            error={!isNameValid}
            helperText={!isNameValid && "This character is prohibited"}
          />
        </FormControl>
        {/* number field */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            type="number"
            label="Enter Number After 0"
            variant="outlined"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </FormControl>
        {/* cnic field */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            type="number"
            label="Enter CNIC"
            variant="outlined"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
          />
        </FormControl>
        {/* addres field */}
        <FormControl fullWidth sx={{ mb: isAddressValid ? 3 : 2 }}>
          <TextField
            name="address"
            label="Enter Address"
            variant="outlined"
            value={address}
            onChange={(e) => handleInputChange(e)}
            error={!isAddressValid}
            helperText={!isAddressValid && "This character is prohibited"}
          />
        </FormControl>
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
            !(isNameValid && isAddressValid && name && number && nic && address)
          } // disabled untill all fields filled and textfield is valid
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
};

export default WorkerForm;
