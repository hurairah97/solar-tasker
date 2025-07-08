const express = require("express");
const router = express.Router();

const userAuth = require("../middleware/userauth.js");
const authentication = require("../Apis/Users/login");

const createUser = require("../Apis/Users/Create");
const deleteUser=require("../Apis/Users/Delete.js");
const selectUser=require("../Apis/Users/Select.js");
const passwordReset=require("../Apis/Users/PasswordReset.js");

const createclients=require("../Apis/Clinets/Create");
const updateclients=require("../Apis/Clinets/Update");
const deleteclients=require("../Apis/Clinets/Delete");
const selectclients=require("../Apis/Clinets/Select");

const createarea_region=require("../Apis/Area_Region/Create");
const updatearea_region=require("../Apis/Area_Region/Update");
const deletearea_region=require("../Apis/Area_Region/Delete");
const selectarea_region=require("../Apis/Area_Region/Select");

const createworkers=require("../Apis/Workers/Create");
const updateworkers=require("../Apis/Workers/Update");
const deleteworkers=require("../Apis/Workers/Delete");
const selectworkers=require("../Apis/Workers/Select");

const createteams=require("../Apis/Teams/Create.js");
const updateteams=require("../Apis/Teams/Update.js");
const deleteteams=require("../Apis/Teams/Delete.js");
const selectteams=require("../Apis/Teams/Select.js");

const selectupcomingtasks=require("../Apis/UpcomingTasks/Select.js");
const deleteupcomingtasks=require("../Apis/UpcomingTasks/Delete.js");
const updateupcomingtasks=require("../Apis/UpcomingTasks/Update.js");

const selecttasks=require("../Apis/Tasks/Select.js");

const selectmissedtasks=require("../Apis/MIssedTasks/Select.js");
const deletemissedtasks=require("../Apis/MIssedTasks/Delete.js");
const updatemissedtasks=require("../Apis/MIssedTasks/Update.js");

const selectfeedbacks=require("../Apis/Feedback/Select.js");
const selectlivetracking=require("../Apis/LiveTracking/Select.js");

const whatsappallresponse = require("../middleware/whatsappallresponse.js"); // Adjust the path as needed

const logs=require("../Utils/logs.js");

router.use("/webhook",whatsappallresponse);

// Public route (no userAuth)
router.use("/login", authentication);

// Protected routes (with userAuth)
router.use(userAuth);
router.use("/createUser",createUser);
router.use("/deleteUser",deleteUser);
router.use("/selectUser",selectUser);
router.use("/passwordReset",passwordReset);

router.use("/createarea_region",createarea_region);
router.use("/updatearea_region",updatearea_region);
router.use("/deletearea_region",deletearea_region);
router.use("/selectarea_region",selectarea_region);

router.use("/createclients",createclients);
router.use("/updateclients",updateclients);
router.use("/deleteclients",deleteclients);
router.use("/selectclients",selectclients);

router.use("/createworkers",createworkers);
router.use("/updateworkers",updateworkers);
router.use("/deleteworkers",deleteworkers);
router.use("/selectworker",selectworkers);

router.use("/createteams",createteams);
router.use("/updateteams",updateteams);
router.use("/deleteteams",deleteteams);
router.use("/selectteams",selectteams);

router.use("/selectupcomingtasks",selectupcomingtasks);
router.use("/deletetupcomingasks",deleteupcomingtasks);
router.use("/updateupcomingtasks",updateupcomingtasks);

router.use("/selecttasks",selecttasks);

router.use("/selectmissedtasks",selectmissedtasks);
router.use("/deletetmissedtasks",deletemissedtasks);
router.use("/updatetmissedtasks",updatemissedtasks);

router.use("/selectfeedbacks",selectfeedbacks);
router.use("/selectlivetracking",selectlivetracking);

router.use("/logs",logs);

module.exports = router;