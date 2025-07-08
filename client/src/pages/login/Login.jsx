import {
  Box,
  CircularProgress,
  FormControl,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { notification } from "antd";
import Buttons from "../../components/button/Button";
import { handleSanitizeInput } from "../../utils/SanitizeInput";
import loginBg from "../../assets/loginBg.jpg";
import { login } from "../../store/ActionApis/userApi";

const Login = ({ setIsAuthenticated }) => {
  // state to store input data
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // state to avoid special characters (for text field only)
  const [isNameValid, setIsNameValid] = useState(true);

  // state to show loader on submit button after submit clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  // function for submit
  const handleLogin = async () => {
    setIsSubmitting(true);
    const dataToSend = {
      username: name,
      password: password,
    };

    const response = await dispatch(login(dataToSend)); // for login

    console.log(response);

    if (response.meta.requestStatus === "fulfilled") {
      const token = response.payload.token;
      localStorage.setItem("token", token);
      setIsAuthenticated(true); // redirect to home page
      notification.success({
        message: `Login Successfully!`,
        description: response?.payload?.message,
        placement: "topRight",
      });
      emptyStates();
    } else {
      notification.error({
        message: `Login failed!`,
        description: response?.payload?.message || `Login failed`,
        placement: "topRight",
      });
    }
    setIsSubmitting(false);
  };

  // function to empty all states
  const emptyStates = () => {
    setName("");
    setPassword("");
    setIsNameValid(true);
  };

  // function to check input field is valid
  const handleInputChange = (e) => {
    const value = e.target.value;
    const isDataSafe = handleSanitizeInput(value);
    setIsNameValid(isDataSafe);
    setName(value);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", // Full height of the page
        backgroundImage: `url(${loginBg})`, // Correct way to use the imported image
        backgroundSize: "cover", // Ensure the image covers the entire screen
        backgroundPosition: "center", // Center the image
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: "450px", // Fixed width
          backgroundColor: "#ffffff", // White background for the login section
          borderRadius: "12px", // Increased border radius for a smooth curve
          padding: 4, // Padding for inner spacing
          boxShadow: 6, // Deeper box shadow for a floating effect
          textAlign: "center", // Centering text inside the box
          // opacity: 4,
        }}
      >
        {/* Title Section */}
        <Box sx={{ mb: 4 }}>
          <h2
            style={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: "bold",
              color: "#1976d2",
              fontSize: "36px"
            }}
          >
            Welcome Back!
          </h2>
          <p
            style={{
              color: "#1976d2",
              fontSize: "14px",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            Please log in to your account
          </p>
        </Box>

        {/* name field */}
        <FormControl fullWidth sx={{ mb: isNameValid ? 3 : 2 }}>
          <TextField
            label="Enter Username"
            variant="outlined"
            value={name}
            onChange={(e) => handleInputChange(e)}
            error={!isNameValid}
            helperText={!isNameValid && "This character is prohibited"}
          />
        </FormControl>

        {/* password field */}
        <FormControl fullWidth sx={{ mb: 4 }}>
          <TextField
            type="password"
            label="Enter Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        {/* Submit button */}
        <div className="flex justify-center my-3">
          <Buttons
            text={
              isSubmitting ? (
                <span>
                  Loading <CircularProgress size="15px" color="inherit" />
                </span>
              ) : (
                "Login"
              )
            }
            type="primary"
            size="large"
            styling="linearGradient"
            disabled={isSubmitting || !(isNameValid && name && password)} // disabled until all fields are filled and textfield is valid
            onClick={() => handleLogin()}
          />
        </div>
      </Box>
    </Box>
  );
};

export default Login;
