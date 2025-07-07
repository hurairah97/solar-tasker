const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const pool = require("../../Utils/db");
const { logWithOptionalBroadcast } = require("../../logger");


router.get("/", (req, res) => {
  // SQL query to join clients and area_region tables
  const query = `
    SELECT 
      c.*, 
      a.id As area_region_id,
      a.area AS area_name, 
      a.region AS region_name 
    FROM ${tableName.clients} AS c 
    LEFT JOIN ${tableName.area_region} AS a 
      ON c.area_region_id = a.id
    ORDER BY c.id DESC;  
  `;

  // Execute the query
  pool.query(query, (err, results) => {
    if (err) {
      logWithOptionalBroadcast('error',"Error while fetching data from clients table:", err);
      return res
        .status(500)
        .send(RESPONSE(false, "Database error while fetching data", err));
    }

    // Send the successful response
    return res.status(200).send(RESPONSE(true, "Data fetched successfully form Clients", results));
  });
});

module.exports = router;
