const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const { GlobalUpdate } = require("../../GlobalFunctions/GlobalUpdate");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");

router.post("/", (req, res) => {
  if (
    !req.body.id ||
    !req.body.team_id ||
    req.body.task_status === undefined || // Allow `0` as valid task_status
    req.body.response === undefined // Allow `0` as valid response
  ) {
    return res.status(400).send(RESPONSE(false, "Please Fill All Fields", {}));
  }
  let payload = {
    id: req.body.id,
    tableName: tableName.tasks,
    table: "Tasks",
    databaseFields: {
      team_id: req.body.team_id,
      response: req.body.response,
      task_status: req.body.task_status,
    },
  };
  logWithOptionalBroadcast('info',"Payload for update:", payload);

  GlobalUpdate(payload, res);
});

module.exports = router;
