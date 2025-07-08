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
import { fetchRegions } from "../../store/ActionApis/regionApi";
import {
  createClient,
  fetchClients,
  updateClient,
} from "../../store/ActionApis/clientApi";

const fields = [
  { name: "name", label: "Name", type: "input" },
  { name: "number", label: "Number After 0", type: "input" },
  { name: "email", label: "Email", type: "input" },
  { name: "address", label: "Address", type: "input" },
  { name: "region", label: "Region", type: "select" },
  { name: "area", label: "Area", type: "select" },
  { name: "amount", label: "Amount", type: "input" },
  { name: "plan", label: "Plan", type: "select" },
  { name: "planDuration", label: "Plan Duration", type: "select" },
];

// for plan field
const plans = [
  { id: "0", name: "Basic" },
  { id: 1, name: "Premium" },
];
// for planDur field
const planDur = [
  { id: 15, name: "15 Days" },
  { id: 30, name: "30 Days" },
];

const ClientForm = ({ close, setClose, handleDialogClose, editRecord }) => {
  const isMobile = useMediaQuery("(max-width:500px)");

  // state to stored input data
  const [field, setField] = useState({
    name: "",
    number: "",
    email: "",
    address: "",
    region: "",
    areas: [], // stored area as per selected region
    area: "",
    amount: "",
    plan: 0,
    planDuration: "",
  });

  // state to avoid special character (for text field only)
  const [isValid, setIsValid] = useState({
    name: true,
    email: true,
    address: true,
  });

  // state to show loader on submit button after submit clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  // store region to display areas in area field as per selected region
  const [groupedByRegions, setgroupedByRegions] = useState([]);

  const dispatch = useDispatch();
  // get member data from region api to show in region field
  const { regions } = useSelector((state) => state.region);

  useEffect(() => {
    const grouped = regions?.reduce((acc, curr) => {
      const regionIndex = acc.findIndex((item) => item.region === curr.region);

      if (regionIndex !== -1) {
        acc[regionIndex].areas.push({ id: curr.id, name: curr.area });
      } else {
        acc.push({
          region: curr.region,
          areas: [{ id: curr.id, name: curr.area }],
        });
      }

      return acc;
    }, []);

    setgroupedByRegions(grouped); // Update state with grouped data
  }, [regions]); // Empty dependency array means it runs once on mount

  // function for submit
  const handleSubmit = async () => {
    if (field.number?.length === 10) {
      setIsSubmitting(true);
      const dataToSend = {
        name: field.name,
        // number: field.number,
        number: Number(`92${field.number}`),
        email: field.email,
        address: field.address,
        area_region_id: field.area,
        amount: field.amount,
        service_plan_duration: field.planDuration,
        plan: field.plan === "0" ? 0 : field.plan, // send 0 if value is not 1
        region_preference: Number(field.region.region.match(/\d+/)[0]),
      };

      let response;
      let module;
      // Check if editRecord exists to determine whether it's an update or create
      if (editRecord) {
        response = await dispatch(
          updateClient({ id: editRecord?.id, ...dataToSend })
        ); // for update
        module = "Updated";
      } else {
        response = await dispatch(createClient(dataToSend)); // for create
        module = "Added";
      }

      if (response.payload.success) {
        await dispatch(fetchClients());
        notification.success({
          message: `Client ${module}!`,
          description: response?.payload?.message,
          placement: "topRight",
        });
        handleDialogClose();
        emptyStates();
      } else {
        notification.error({
          message: `Client Not ${module}!`,
          description: response?.payload?.message || `Client Not ${module}`,
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
      setField({
        name: "",
        number: "",
        email: "",
        address: "",
        region: "",
        areas: [],
        area: "",
        amount: "",
        plan: "",
        planDuration: "",
      });
    }
    setIsValid({
      name: true,
      email: true,
      address: true,
    });
  };

  // function to stored data and check input field is valid
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure to get the name and value from the target

    setField((prev) => ({
      ...prev, // Spread the previous state
      [name]: value, // Store the value
    }));

    // Special handling for region to update areas
    if (name === "region") {
      setField((prev) => ({
        ...prev,
        areas: value ? value.areas : [], // If a region is selected, update areas based on that region
        area: "",
      }));
    }
    // only apply on input text fields
    if (["name", "email", "address"].includes(name)) {
      const isDataSafe = handleSanitizeInput(value);
      setIsValid((prev) => ({
        ...prev, // Spread the previous state
        [name]: isDataSafe, // Use dynamic key to update the correct field based on the input name
      }));
    }
  };

  // effect to call worker api to show in member's select field
  useEffect(() => {
    dispatch(fetchRegions());
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
      const regions = groupedByRegions?.find(
        (item) => item.region === editRecord?.region_name
      );
      setField({
        name: editRecord?.name,
        number: editRecord?.number,
        email: editRecord?.email,
        address: editRecord?.address,
        region: regions, // object to store in regions
        areas: regions?.areas, // array to store i areas
        area: editRecord?.area_region_id,
        amount: editRecord?.amount,
        plan: editRecord?.plan || "0",
        planDuration: editRecord?.service_plan_duration,
      });
    }
  }, [editRecord]);

  // Function to check if any field in 'field' is empty
  const isAnyFieldEmpty = () => {
    return Object.values(field).some((value) => {
      // Check for empty strings
      return value == "";
    });
  };

  // Function to check if any field in 'isValid' is false
  const isAnyInvalid = () => {
    return Object.values(isValid).includes(false);
  };

  // Button should be disabled if any field is empty or any isValid field is false
  const isButtonDisabled = isAnyFieldEmpty() || isAnyInvalid();
  // const isButtonDisabled = false;

  return (
    <div className="my-5" style={{ maxWidth: isMobile ? 270 : 420 }}>
      <Box sx={{ minWidth: isMobile ? 270 : 420 }}>
        {/* all fields */}
        {fields.map(({ name, label, type }, index) =>
          type === "input" ? (
            <FormControl fullWidth sx={{ mb: 3 }} key={index}>
              <TextField
                name={name}
                label={label}
                type={
                  ["number", "amount"].includes(name)
                    ? "number"
                    : name === "email"
                    ? "email"
                    : "string"
                }
                variant="outlined"
                value={field[name]}
                onChange={(e) => handleInputChange(e)}
                error={!["number", "amount"].includes(name) && !isValid[name]}
                helperText={
                  !["number", "amount"].includes(name) && !isValid[name]
                    ? "This character is prohibited"
                    : ""
                }
              />
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
                {(name === "region"
                  ? groupedByRegions // groups by region
                  : name === "area"
                  ? field.areas // areas under the selected region
                  : name === "plan"
                  ? plans // plans
                  : planDur
                )?.map((item, idx) => (
                  <MenuItem
                    key={idx}
                    value={
                      name === "region"
                        ? item // store the entire object for region
                        : item.id
                    }
                  >
                    {name === "region"
                      ? item.region // display region name
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
          disabled={isSubmitting || isButtonDisabled} // disabled untill all fields filled and textfield is valid
          onClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
};

export default ClientForm;
