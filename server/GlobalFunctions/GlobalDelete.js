const pool = require("../Utils/db");
const response = require("../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../logger");


const GlobalDelete = (payload, res) => {
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        // // logWithOptionalBroadcast('info',"eror while creating connection", err);
        return res.status(500).send(response(false, "Error While Connecting With Database", {}));
      }
      connection.query(
        `DELETE FROM ${payload.tableName} WHERE id =${payload.databaseFields.id}`,
        (err, result) => {
          connection.release();

          if (err) {
            // // logWithOptionalBroadcast('info',err);
            return res.status(500).send(response(false, `Error While Deleting Data In ${payload.table}`, err));
          } else {

            // // // logWithOptionalBroadcast('info',result);
            return res.status(200).send(response(true, `Data Has Been Successfully Deleted From ${payload.table}`, {}));
          }
        }
      );
    });
  } catch (err) {
    return res.status(401).send(response(false, err.message, err));
  }
};

module.exports = { GlobalDelete };
