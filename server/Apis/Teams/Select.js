const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const {GlobalSelect}=require("../../GlobalFunctions/GlobalSelect");
const RESPONSE=require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");
const pool=require("../../Utils/db");


router.get("/",(req,res)=>{
    try {
        pool.getConnection((err, connection) => {
          if (err) {
            // Log the error and send a proper response
            logWithOptionalBroadcast('error',"Error while creating database connection:", err);
            return res.status(500).send(RESPONSE(false, "Database connection error", {}));
          }
    
          const query = `
      SELECT 
          t.*,
          w.name As team_lead,
          w1.name AS member1,
          w2.name As member2,
          t.team_name
      FROM ${tableName.team} t
      LEFT JOIN ${tableName.workers} w ON w.id = t.member1_id LEFT JOIN ${tableName.workers} w1 ON w1.id=t.member2_id LEFT JOIN ${tableName.workers} w2 ON w2.id=t.member3_id  
      WHERE t.isactive = 0
      ORDER BY t.id DESC;
    `;
    
    connection.query(query, (err, result) => {
    connection.release(); // Ensure the connection is released
    
    if (err) {
      // Log the error and send a proper response
      logWithOptionalBroadcast('error',"Error while executing query:", err);
      return res.status(400).send(RESPONSE(false, "Error while selecting data from Teams", err));
    }
    
    // Log the result and send a success response
        logWithOptionalBroadcast('info',"Successfully Fetched Team:", result);
        return res.status(200).send(RESPONSE(true, "Successfully selected record from Teams", result));
        });
    });
    }catch (err) {
        // Log any unexpected errors
        logWithOptionalBroadcast('error',"Unexpected error in route handler:", err);
        return res.status(400).send(RESPONSE(false, err.message, err));
    }
});
    

module.exports=router;