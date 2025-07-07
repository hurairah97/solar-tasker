const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const { GlobalDelete } = require("../../GlobalFunctions/GlobalDelete");
const {GlobalUpdate}=require("../../GlobalFunctions/GlobalUpdate");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const pool = require("../../Utils/db"); 
const { logWithOptionalBroadcast } = require("../../logger");


router.post("/", (req, res) => {
    const { id } = req.body;

    // Validate the required field
    if (!id) {
        return res.status(400).send(RESPONSE(false, "Missing required 'id' field", {}));
    }

    // Query to check if the ID is referenced in the team table
    const query = `
        SELECT COUNT(*) AS count 
        FROM ${tableName.tasks} 
        WHERE team_id = ?
    `;

    // Check for references in the team table
    pool.query(query, [id], (err, results) => {
        if (err) {
            logWithOptionalBroadcast('error',"Error checking ID in task table:", err);
            return res.status(500).send(RESPONSE(false, "Database error while checking references", err));
        }

        const { count } = results[0];
        if (count > 0) {
            // If ID is in use, return an error
            return res
                .status(400)
                .send(RESPONSE(false, "Cannot delete: ID is in use in the task table", {}));
        }

        // Prepare payload for deletion
        let payload={
            id:id,
            tableName:tableName.team,
            table:"Teams",
            databaseFields:{
                isactive:1,
            },
        };
        logWithOptionalBroadcast('info',"Payload for update:", payload);
    
        GlobalUpdate(payload,res);
    });
});

module.exports = router;
