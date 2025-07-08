const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const { GlobalDelete } = require("../../GlobalFunctions/GlobalDelete");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const pool = require("../../Utils/db"); 
const { logWithOptionalBroadcast } = require("../../logger");


router.post("/", (req, res) => {
  const { id } = req.body;

  // Validate required fields
  if (!id) {
    return res.status(400).send(RESPONSE(false, "Missing required 'id' field for deletion", {}));
  }
  const query = `SELECT COUNT(*) AS count FROM ${tableName.clients} WHERE area_region_id = ?`;

  pool.query(query, [id], (err, results) => {
    if (err) {
      logWithOptionalBroadcast('error',"Error checking ID in clients table:", err);
      return res.status(500).send(RESPONSE(false, "Database error while checking references", err));
    }

    const { count } = results[0];
    if (count > 0) {
      // ID is in use in the clients table
      return res
        .status(400)
        .send(RESPONSE(false, "Cannot delete: ID is in use in the clients table", {}));
    }
    
  // Create payload
    let payload = {
      tableName: tableName.area_region,
      table:"Area Region Table",// Corrected to singular
      databaseFields: {
        id: id, // ID to be deleted
    },
  };

  logWithOptionalBroadcast('info',"Payload for deletion:", payload);

  // Call the global delete function
  GlobalDelete(payload, res);
});
});
module.exports = router;
