const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");
const pool = require("../../Utils/db");
const moment=require("moment-timezone");

router.get("/", (req, res) => {
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        // Log the error and send a proper response
        logWithOptionalBroadcast('error',"Error While Creating Database Connection:", err);
        return res.status(500).send(RESPONSE(false, "Database connection error", {}));
      }

      const query = `
  SELECT 
      t.id AS task_id,
      t.service_date,
      t.created_at,
      te.team_name,
      t.response,
      t.isactive,
      t.task_status,
      t.re_task_done,
      t.team_id,
      c.id As client_id,
      c.name,
      c.number,
      c.upcoming_service_date,
      c.last_service_date
  FROM ${tableName.tasks} t
  INNER JOIN ${tableName.clients} c ON c.id = t.client_id INNER JOIN ${tableName.team} te on te.id=t.team_id
  WHERE t.isactive = 1 AND response=2
  ORDER BY t.id DESC;
`;

      connection.query(query, (err, result) => {
        connection.release(); // Ensure the connection is released

        if (err) {
          // Log the error and send a proper response
          logWithOptionalBroadcast('error',"Error while executing query:", err);
          return res.status(400).send(RESPONSE(false, "Error While Selecting Data From Tasks", err));
        }

        // Log the result and send a success response
        logWithOptionalBroadcast('info',"Successfully Fetched Missed Tasks:", result);
        result.forEach(item=>{
          item.service_date=moment(item.service_date).format('DD/MM/YYYY');
          item.created_at=moment(item.created_at).format("DD/MM/YYYY");
          item.upcoming_service_date=moment(item.upcoming_service_date).format("DD/MM/YYYY");
          item.last_service_date=moment(item.last_service_date).format("DD/MM/YYYY");
        });

        return res.status(200).send(RESPONSE(true, "Successfully Selected Record From Tasks", result));
      });
    });
  } catch (err) {
    // Log any unexpected errors
    logWithOptionalBroadcast('error',"Unexpected error in route handler:", err);
    return res.status(400).send(RESPONSE(false, err.message, err));
  }
});

module.exports = router;
