const { logWithOptionalBroadcast } = require("../logger");

// Wraps the pool.getConnection() function
function getConnection({ pool }) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(connection);
    });
  });
}

// Performs a database query using a connection from the pool
/*async function performQuery({ sql, params, pool }) {
  const connection = await getConnection({ pool });

  try {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  } finally {
    connection.release();
  }
}*/
async function performQuery({ sql, params, pool, retries = 3 }) {
  let attempt = 0;
  while (attempt < retries) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [results] = await connection.query(sql, params);
      return results;
    } catch (error) {
      if (error.code === 'ECONNRESET' && attempt < retries - 1) {
        logWithOptionalBroadcast('warn', `ECONNRESET encountered. Retrying... (${attempt + 1}/${retries})`);
        attempt++;
        await new Promise(res => setTimeout(res, 1000 * attempt)); // Exponential backoff
      } else {
        logWithOptionalBroadcast('error',`Error in perform query function, ${error.message}`);
        throw error;
      }
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = { getConnection, performQuery };
