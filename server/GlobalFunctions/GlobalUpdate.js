const pool = require("../Utils/db.js");
const response = require("../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../logger");


const GlobalUpdate = (payload, res) => {
  let keys = Object.keys(payload.databaseFields);
  let values = Object.values(payload.databaseFields);
  
  try {
    pool.getConnection(async (err, connection) => {
      if (err) {
        // // logWithOptionalBroadcast('info',"eror while creating connection", err);
        return res.status(500).send(response(false, "Error While Connecting With Database", {}));
      }
      let query = `UPDATE ${payload.tableName} SET  ${keys.join(
        " = ? ,"
      )} = ? where id = ${payload.id}`;
      //   let params=[keys,values,payload.id]
      connection.query(query, values, (err, result) => {
        connection.release();

        if (err) {
          // // logWithOptionalBroadcast('info',err);
          return res.status(500).send(response(false, `Error While Updating Data In ${payload.table}`, err));
        } else {
          return res
            .status(200)
            .send(response(true, `Data Has Been Successfully Updated In ${payload.table}`, result));
        }
      });
    });
  } catch (err) {
    return res.status(401).send(response(false, err.message, err));
  }
};
module.exports = { GlobalUpdate };
