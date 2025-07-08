const pool = require("../Utils/db");
const response = require("../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../logger");

// this function is for create global

const GlobalInsert = (payload, res) => {
  try {
    pool.getConnection(async (err, connection) => {
      if (err) {
        logWithOptionalBroadcast('error',`eror while creating connection, err`);
        return res.status(500).send(response(false, "Error While Connecting With Database", {}));
      }
      connection.query(
        `INSERT INTO ${payload.tableName} SET ?`,
        payload.databaseFields,

        (err, result) => {
          connection.release();

          if (err) {
            // // logWithOptionalBroadcast('info',"database");
            logWithOptionalBroadcast('info',err);
            return res.status(500).send(response(false, `Error While Inserting Data In ${payload.table}`, {}));
          } else {
            // // logWithOptionalBroadcast('info',"result");

            return res.status(200).send(response(true, `Data Has Been Successfully Created in ${payload.table}`, result));
          }
        }
      );
    });
  } catch (err) {
    return res.status(401).send(response(false, err.message, err));
  }
};

module.exports = { GlobalInsert };
