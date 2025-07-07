const mysql = require("mysql2/promise");
// const { logWithOptionalBroadcast } = require("../logger");
const dotenv = require("dotenv");

dotenv.config();

const cronpool = mysql.createPool({
  host:process.env.DB_HOST, //"s13.hosterpk.com", // Shared IP from cPanel"148.163.69.162" || 
  user:process.env.DB_USER, //"digita87_muddassir", // Your database username "solarcle_shahroz" || 
  password:process.env.DB_PASSWORD, //"Developers000$$$", // Your database password "Shahroz$$$000" || 
  database:process.env.DB_NAME, //"digita87_SolarTasker", "solarcle_SolarTasker" || 
  connectionLimit:10, // Maximum number of connections in the pool
  waitForConnections:true, // Wait for available connections in the pool
  queueLimit:0, // No limit on the number of queued requests

});
cronpool.getConnection((err, connection) => {
  if (err) {
    console.log('error',`Database connection error in cron pool:, err`);
    return; // Remove any attempt to use `res` here
  }
  console.log('info',"Database connection successful of cronpool");
  connection.release(); // Always release the connection back to the pool
});
module.exports = cronpool;
