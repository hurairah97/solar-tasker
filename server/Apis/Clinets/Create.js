const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const { GlobalInsert } = require("../../GlobalFunctions/GlobalCreate");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const moment = require("moment-timezone");
const { logWithOptionalBroadcast } = require("../../logger");


// Define region-day mapping
const REGION_DAY_MAPPING = {
  1: 1, // Region 1 → Monday
  2: 2, // Region 2 → Tuesday
  3: 3, // Region 3 → Wednesday
  4: 4, // Region 4 → Thursday
  5: 5, // Region 5 → Friday
  6: 6, // Region 6 → Saturday
  7: 7, // Region 7 → Sunday
};

// Function to calculate the next scheduled day
function calculateNextScheduledDay(date, regionDay, servicePlanDuration = 0) {
  // Ensure date is a moment object
  let newDate = moment.tz(date, "Asia/Karachi").add(servicePlanDuration, "days");

  // Calculate days to add to reach the next region day
  const currentDay = newDate.day(); // Current day of the week
  const daysToAdd = (regionDay - currentDay + 7) % 7; // Days to next occurrence of the region day
  newDate = newDate.add(daysToAdd || 7, "days"); // Move to the next week if needed

  // Format the final date in PST
  return newDate.format("YYYY-MM-DD");
}

// POST route for client creation
router.post("/", (req, res) => {
  const {
    name,
    number,
    email,
    address,
    area_region_id,
    amount,
    service_plan_duration,
    plan,
    region_preference,
  } = req.body;

  // Validate required fields
  if (!name || !email || !number || !address || !area_region_id || !service_plan_duration) {
    return res.status(400).send(RESPONSE(false, "Missing required fields", {}));
  }

  const currentDate = moment.tz("Asia/Karachi").format("YYYY-MM-DD HH:mm:ss"); // Get current date-time in Karachi
  const regionDay = REGION_DAY_MAPPING[region_preference]; // Get the assigned day for the region
  const upcoming_service_date = calculateNextScheduledDay(currentDate, regionDay, service_plan_duration); // Calculate next service date

  // Create payload
  let payload = {
    tableName: tableName.clients,
    table:"Clients",
    databaseFields: {
      name,
      number,
      email,
      address,
      area_region_id,
      amount: amount || 0,
      service_plan_duration,
      plan,
      created_at: currentDate ,// Current date
      last_service_date: null,
      upcoming_service_date, // Formatted service date
      region_preference:region_preference,
    },
  };

  logWithOptionalBroadcast('info',"Payload for insertion:", payload);

  // Perform database insertion
  GlobalInsert(payload, res);
});

module.exports = router;
