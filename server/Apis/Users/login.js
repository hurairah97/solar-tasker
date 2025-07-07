const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const tableNames = require("../../Utils/allTableNames");
const pool = require("../../Utils/db");
const { logWithOptionalBroadcast } = require("../../logger");

router.post("/", (req, res) => {
  let user_name = req.body.username;
  let password = req.body.password;

  if (!user_name || !password) {
    return res.status(400).send(RESPONSE(false, "Username and password are required", {}));
  }

  let payload = {
    tableName: tableNames.owners,
    select: "*",
    key: "user_name",
    value: user_name,
  };

  try {
    //console.log("Going for pool connection...");
    pool.getConnection((err, connection) => {
      if (err) {
        //console.error("Database connection error:", err);
        logWithOptionalBroadcast('error',"Database connection error:", err);
        return res.status(500).send(RESPONSE(false, "Database connection error", {}));
      }

      const query = `SELECT ${payload.select} FROM ${payload.tableName} WHERE ${payload.key}="${payload.value}"`;
      //console.log("Executing query:", query);

      connection.query(query, (err, data) => {
        connection.release();

        if (err) {
          //console.error("Query execution error:", err);
          logWithOptionalBroadcast('error',"Query execution error:", err);
          return res.status(500).send(RESPONSE(false, "Error while selecting", err));
        }

        if (data.length < 1) {
          return res.status(404).send(RESPONSE(false, "User not found", {}));
        }

        //console.log("Fetched hashed password from DB:", data[0].password);
        bcrypt.compare(password, data[0].password, (error, result) => {
          if (error) {
            //console.error("Bcrypt comparison error:", error);
            return res.status(401).send(RESPONSE(false, "Authentication failed", {}));
          }

          if (!result) {
            //console.log("Incorrect password");
            return res.status(401).send(RESPONSE(false, "Incorrect password", {}));
          }

          const token = jwt.sign(
            {
              id: data[0].id,
              username: data[0].user_name,
              email: data[0].email,
            },
            process.env.SECRET_KEY,
            { expiresIn: "3h" }
          );

          logWithOptionalBroadcast('info',`User ${user_name} logged in successfully`);
          res.status(200).json({
            message: "Login Successful",
            token,
            user: data,
          });
        });
      });
    });
  } catch (err) {
    //console.error("Unexpected error:", err);
    logWithOptionalBroadcast('error',"Unexpected error:", err);
    return res.status(500).send(RESPONSE(false, "Unexpected error", err));
  }
});

module.exports = router;
