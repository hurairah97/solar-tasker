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
  createUser,
  fetchUsers,
  passwordReset,
} from "../../store/ActionApis/userApi";

const emailRegex = /@/;

const UserForm = ({ close, setClose, handleDialogClose, editRecord }) => {
  const isMobile = useMediaQuery("(max-width:500px)");

  // state to stored input data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // state to avoid special character (for text field only)
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  // state to check email format
  const [isEmailFormatted, setIsEmailFormatted] = useState(true);

  // state to show loader on submit button after submit clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  // function for submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const dataToSend = {
      username: username,
      email: email,
      password: password,
    };
    let response;
    let module;
    // Check if editRecord exists to determine whether it's an update or create
    if (editRecord) {
      response = await dispatch(
        passwordReset({ id: editRecord?.id, password: password })
      ); // for update
      module = "Password Reset";
    } else {
      response = await dispatch(createUser(dataToSend)); // for create
      module = "Added";
    }

    if (response.payload.success) {
      await dispatch(fetchUsers());
      notification.success({
        message: editRecord ? module : `User ${module}!`,
        description: response?.payload?.message,
        placement: "topRight",
      });
      handleDialogClose();
      emptyStates();
    } else {
      notification.error({
        message: editRecord ? `Password Not Reset` : `User Not ${module}!`,
        description: response?.payload?.message || `User Not Updated`,
        placement: "topRight",
      });
    }
    setIsSubmitting(false);
  };

  // function to empty all states
  const emptyStates = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setIsUsernameValid(true);
    setIsEmailValid(true);
    setIsEmailFormatted(true);
  };

  // function to check input field is valid
  const handleInputChange = (e) => {
    const value = e.target.value;
    const isDataSafe = handleSanitizeInput(value);
    if (e.target.name === "username") {
      // for username field
      setUsername(value);
      setIsUsernameValid(isDataSafe);
    } else {
      // for email field
      setEmail(value);
      setIsEmailValid(isDataSafe);
      // Ensure email is valid
      if (!emailRegex.test(value)) {
        setIsEmailFormatted(false);
      } else {
        setIsEmailFormatted(true);
      }
    }
  };

  // effect to empty all state whenever dialog is closed
  useEffect(() => {
    if (close) {
      emptyStates();
      setClose(false);
    }
  }, [close]);

  return (
    <div className="my-5">
      <Box sx={{ minWidth: isMobile ? 270 : 420 }}>
        {/* username and email field only display at the time of create */}
        {!editRecord && (
          <>
            {/* username field */}
            <FormControl fullWidth sx={{ mb: isUsernameValid ? 3 : 2 }}>
              <TextField
                name="username"
                label="Enter Username"
                variant="outlined"
                value={username}
                onChange={(e) => handleInputChange(e)}
                error={!isUsernameValid}
                helperText={!isUsernameValid && "This character is prohibited"}
              />
            </FormControl>
            {/* email field */}
            <FormControl fullWidth sx={{ mb: isEmailValid ? 3 : 2 }}>
              <TextField
                name="email"
                type="email"
                label="Enter Email"
                variant="outlined"
                value={email}
                onChange={(e) => handleInputChange(e)}
                error={!isEmailValid || !isEmailFormatted}
                helperText={
                  (!isEmailValid && "This character is prohibited") ||
                  (!isEmailFormatted && "Please Include @ in email")
                }
              />
            </FormControl>
          </>
        )}
        {/* password field */}
        <FormControl fullWidth sx={{ mb: isEmailValid ? 3 : 2 }}>
          <TextField
            name="password"
            type="password"
            label="Enter Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            isSubmitting || // Button is disabled while form is submitting
            !(
              (
                isUsernameValid && // Ensure the username is valid
                isEmailValid && // Ensure the email is valid
                isEmailFormatted && // Ensure email is formatted
                (!editRecord ? username && email : true) && // If not editing, both username and email must be filled in
                password
              ) // Ensure the password is filled in
            )
          }
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
};

export default UserForm;
