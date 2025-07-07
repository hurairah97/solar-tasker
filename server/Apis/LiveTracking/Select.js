const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const { logWithOptionalBroadcast } = require("../../logger");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const pool = require("../../Utils/db");

router.get("/", (req, res) => {
  try {
    const getQuery = `
      SELECT 
        tk.id,
        c.name, 
        c.number, 
        tm.team_name, 
        t.service_date, 
        tk.status, 
        tk.time_stamp
      FROM 
        ${tableName.tracking} tk 
      INNER JOIN 
        ${tableName.tasks} t 
        ON tk.task_id = t.id 
      INNER JOIN 
        ${tableName.team} tm 
        ON t.team_id = tm.id 
      INNER JOIN 
        ${tableName.clients} c 
        ON t.client_id = c.id 
      ORDER BY 
        tk.id DESC;
    `;

    pool.query(getQuery, (err, result) => {
      if (err) {
        logWithOptionalBroadcast('info',`Error in fetching records from tracking: ${err.message}`);
        return res
          .status(500)
          .send(RESPONSE(false, "Database error while fetching tracking records", err));
      } else {
        logWithOptionalBroadcast('info',"Successfully fetched records from tracking.");
        return res
          .status(200)
          .send(RESPONSE(true, "Successfully fetched records from tracking", { result }));
      }
    });
  } catch (error) {
    logWithOptionalBroadcast('info',`Error Fetching Live Tracking: ${error.message}`);
    res.status(400).send(RESPONSE(false, "Error Fetching Live Tracking", {}));
  }
});

module.exports = router;
