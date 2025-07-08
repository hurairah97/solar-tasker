const mysql = require("mysql2");
const { logWithOptionalBroadcast } = require("../logger");
const RESPONSE=require("../GlobalResponse/RESPONSE");
const dotenv = require("dotenv");
//const moment=require("moment-timezone");

dotenv.config();

const pool = mysql.createPool({
  host:process.env.DB_HOST, //"s13.hosterpk.com", // Shared IP from cPanel"148.163.69.162" || 
  user:process.env.DB_USER, //"digita87_muddassir", // Your database username "solarcle_shahroz" || 
  password:process.env.DB_PASSWORD, //"Developers000$$$", // Your database password "Shahroz$$$000" || 
  database:process.env.DB_NAME, //"digita87_SolarTasker", "solarcle_SolarTasker" || 
});
pool.getConnection((err, connection) => {
  if (err) {
    // console.log("ENV",process.env.DB_HOST,process.env.DB_USER,process.env.DB_PASSWORD,process.env.DB_NAME);
    logWithOptionalBroadcast('error',`Database connection error:, err`);
    return; // Remove any attempt to use `res` here
  }
  logWithOptionalBroadcast('info',"Database connection successful");
  connection.release(); // Always release the connection back to the pool
});
module.exports = pool;
