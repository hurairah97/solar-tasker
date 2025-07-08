const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const tableNames = require("../../Utils/allTableNames");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const pool = require("../../Utils/db");
const sendUserCredentials = require("../../middleware/sendmail");
const { logWithOptionalBroadcast } = require("../../logger");


router.post("/", (req, res) => {
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;

  bcrypt.hash(password, 14, function (err, hash) {
    if (err) {
      return res.status(409).send(RESPONSE(false, "Error while hashing", err));
    }
    else {
      pool.getConnection(async (err, connection) => {
        if (err) {
          logWithOptionalBroadcast('info',"eror while creating connection", err);
          return res.send(RESPONSE(false, "database error", {}));
        }
        let payload = {
          tableName: tableNames.owners,
          databaseFields: {
            email: email,
            user_name: username,
            password: hash,
            role:"Admin"
          },
        };
        connection.query(
          `INSERT INTO ${payload.tableName} SET ?`,
          payload.databaseFields,

          (err, result) => {
            connection.release();
            
            if (err) {
              if (err.code === "ENOTFOUND") {
                return res
                  .status(404)
                  .send(RESPONSE(false, "Internet Connection Failed", err));
              } else if (err.code === "ER_DUP_ENTRY") {
                return res
                  .status(409)
                  .send(RESPONSE(false, "Duplicate user name,user exist with this user name", err));
              } else {
                return res
                  .status(401)
                  .send(RESPONSE(false, "User creation failed", err));
              }
            } else {
              sendUserCredentials(email, username, password, "create" , req, res);
              return res.send(RESPONSE(true, "User Succesfully Created", result));
            }
          }
        );
      });
    }
  });
});
module.exports = router;
