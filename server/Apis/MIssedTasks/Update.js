const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");
const { pool } = require("../../Utils/crondb");
const moment = require("moment-timezone");

router.post("/", (req, res) => {
  try {
    // Validate required fields
    const {
      id,
      client_id,
      team_id,
      response,
      task_status,
      name,
      number,
      service_date,
    } = req.body;

    if (
      !id ||
      !client_id ||
      !team_id ||
      response === undefined || // Allow `0` as valid response
      task_status === undefined || // Allow `0` as valid task_status
      !service_date
    ) {
      return res
        .status(400)
        .send(RESPONSE(false, "Please fill all required fields", {}));
    }

    // Establish a connection
    pool.getConnection((err, connection) => {
      if (err) {
        logWithOptionalBroadcast('error',"Error while creating database connection:", err);
        return res
          .status(500)
          .send(RESPONSE(false, "Database connection error", {}));
      }

      // Insert new task
      const insertQuery = `
        INSERT INTO ${tableName.tasks} 
        (client_id, service_date, team_id, response, task_status) 
        VALUES (?, ?, ?, ?, ?)
      `;

      const payload = [
        client_id,
        moment(service_date).format("YYYY-MM-DD"),
        team_id,
        response,
        task_status,
      ];
      //console.log("payload===>",payload);
      connection.query(insertQuery, payload, (insertErr, insertResult) => {
        if (insertErr) {
          connection.release();
          logWithOptionalBroadcast('error',`Error while executing insert query:, insertErr`);
          return res
            .status(500)
            .send(RESPONSE(false, "Error while inserting new task", insertErr));
        }

        // Update the `re_task_done` status
        const updateQuery = `
          UPDATE ${tableName.tasks} 
          SET re_task_done = 1 
          WHERE id = ?
        `;

        connection.query(updateQuery, [id], (updateErr, updateResult) => {
          connection.release(); // Release connection after the final query
          if (updateErr) {
            logWithOptionalBroadcast('error',`Error while executing update query:, updateErr`);
            return res
              .status(500)
              .send(
                RESPONSE(
                  false,
                  "Error while updating re_task_done for missed task",
                  updateErr
                )
              );
          }

          // Log success and send response
          logWithOptionalBroadcast('info',"Successfully retasked missed task:", {
            insertResult,
            updateResult}
          );
          return res.send(
            RESPONSE(
              true,
              "Successfully retasked missed task  ",
              { insertResult, updateResult }
            )
          );
        });
      });
    });
  } catch (err) {
    logWithOptionalBroadcast('error',`Enexpected error in retask route: err`);
    return res
      .status(500)
      .send(RESPONSE(false, "Unexpected error occurred", err));
  }
});

module.exports = router;
