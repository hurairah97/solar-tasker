const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const { GlobalInsert } = require("../../GlobalFunctions/GlobalCreate");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");

router.post("/", (req, res) => {
  const {
    area,
    region,
  } = req.body;

  // Validate required fields
  if (!region||!area) {
    return res.status(400).send(RESPONSE(false, "Missing required fields such as area or region", {}));
  }

  // Create payload
  let payload = {
    tableName: tableName.area_region,
    table:"Area Region Table",
    databaseFields: {
      area,
      region
    },
  };

  logWithOptionalBroadcast('info',"Payload for insertion:", payload);

  // Perform database insertion
  GlobalInsert(payload, res);
});

module.exports = router;
