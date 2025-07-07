const pool = require("../Utils/db");
const reponse = require("../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../logger");


const GlobalSelect = (payload, res) => {
  try {
    // logWithOptionalBroadcast('info',payload);
    pool.getConnection((err, connection) => {
      if (err) {
        // logWithOptionalBroadcast('info',"eror while creating connection", err);
        res.send(reponse(false, "database error", {}));
        throw err;
        // return
      }
      connection.query(
        `SELECT * FROM ${payload.tableName} ORDER BY id DESC`,
        (err, result) => {
          connection.release();

          if (err) {
            // logWithOptionalBroadcast('info',err);
            return res.send(reponse(false, `error while selecting in ${payload.table}`, err));
          } else {
            // logWithOptionalBroadcast('info',result);
            return res.send(reponse(true, `succesfully selected from ${payload.table}`, result));
          }
        }
      );
    });
  } catch (err) {
    return res.send(reponse(false, err.message, err));
  }
};
const GlobalSelectWithWhereClause = (payload, res) => {
  // logWithOptionalBroadcast('info',"payload",payload);
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        // logWithOptionalBroadcast('info',"eror while creating connection", err);
        return res.send(reponse(false, "database error", {}));
      }
      connection.query(
        `SELECT ${payload.select} FROM ${payload.tableName} WHERE ${payload.key} = ? ORDER BY id DESC;`,[payload.value],
        (err, result) => {
          connection.release();
          console.log(payload.select,payload.tableName,payload.key,payload.value,result);
          if (err) {
            // logWithOptionalBroadcast('info',err);
            return res.send(reponse(false, `error while selecting from ${payload.table}`, err));
          } else {
            // logWithOptionalBroadcast('info',result);
            return res.send(reponse(true, `succesfully selected from ${payload.table}`, result));
          }
        }
      );
    });
  } catch (err) {
    return res.send(reponse(false, err.message, err));
  }
};
const GlobalSelecthWhereCondition = (payload, res) => {
  try {
    // logWithOptionalBroadcast('info',"payload >>>>", payload);
    pool.getConnection((err, connection) => {
      if (err) {
        // // logWithOptionalBroadcast('info',"eror while creating connection", err);
        return res.send(reponse(false, "database error", {}));
      }
      
      connection.query(
        `SELECT ${payload.select} FROM ${payload.tableName} where ${payload.key}=${payload.value}`,
        (err, result) => {
          connection.release();
          
          if (err) {
            // // logWithOptionalBroadcast('info',err);
            return res.send(reponse(false, `error while selecting from ${payload.table}`, err));
          } else {
            // // // logWithOptionalBroadcast('info',result);
            return res.send(reponse(true, `succesfully selected from ${payload.table}`, result));
          }
        }
      );
    });
  } catch (err) {
    return res.send(reponse(false, err.message, err));
  }
};

module.exports = {
  GlobalSelect,
  GlobalSelectWithWhereClause,
  GlobalSelecthWhereCondition,
};
