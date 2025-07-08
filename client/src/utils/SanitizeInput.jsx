// Function to validate input (Allow alphanumeric, spaces, and -_/.,#)
const validateInput = (input) => {
  const regex = /^[a-zA-Z0-9 \-_/.,#@]*$/; // Allow only alphanumeric characters, spaces, and (-_/.,#@)
  return regex.test(input);
};

export const handleSanitizeInput = (rawValue) => {
  if (validateInput(rawValue)) {
    return true;
  } else {
    return false;
  }
};
