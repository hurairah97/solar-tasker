const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const tableNames = require("../../Utils/allTableNames");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const pool = require("../../Utils/db");
const sendUserCredentials = require("../../middleware/sendmail"); // Assuming you have this function for sending emails
const { logWithOptionalBroadcast } = require("../../logger");


router.post("/", (req, res) => {
  const user_id = req.body.id;
  const newPassword = req.body.password;
  //logWithOptionalBroadcast('info',user_id,newPassword);
  // Hash the new password
  bcrypt.hash(newPassword, 14, function (err, hash) {
    if (err) {
      res.status(409).send(RESPONSE(false, "Error while hashing", err));
    } else {
      // Query to update the password
      const updateQuery = `UPDATE ${tableNames.owners} SET password='${hash}' WHERE id=${user_id}`;
      // Query to get the user's email and username
      const selectQuery = `SELECT email,user_name FROM ${tableNames.owners} WHERE id=${user_id}`;

      try {
        pool.getConnection((err, connection) => {
          if (err) {
            return res.send(RESPONSE(false, "Database connection error", {}));
          }

          // Execute the update query
          connection.query(updateQuery, (err, result) => {
            if (err) {
              connection.release();
              return res.status(400).send(RESPONSE(false, "Error while updating password", {}));
            }

            // Execute the select query to fetch email and username
            connection.query(selectQuery, (err, userResult) => {
              connection.release();
              if (err) {
                return res.status(400).send(RESPONSE(false, "Error while fetching user details", {}));
              }

              if (userResult.length > 0) {
                const { email, user_name } = userResult[0];

                // Send the reset password email
                sendUserCredentials(email, user_name, newPassword,"reset", req, res);

                return res.status(200).send(RESPONSE(true, "Password reset successfully", result));
              } else {
                return res.status(404).send(RESPONSE(false, "User not found", {}));
              }
            });
          });
        });
      } catch (err) {
        return res.status(400).send(RESPONSE(false, err.message, err));
      }
    }
  });
});

module.exports = router;
