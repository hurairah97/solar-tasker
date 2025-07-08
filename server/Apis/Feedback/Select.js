const express=require("express");
const router=express.Router();
const tableName=require("../../Utils/allTableNames");
const { logWithOptionalBroadcast }=require("../../logger");
const RESPONSE=require("../../GlobalResponse/RESPONSE");
const pool = require("../../Utils/db");


router.get("/",(req,res)=>{
    try{
        const selectquery=`SELECT f.id,c.name,c.number,ta.service_date,tm.team_name,f.rating,f.created_at 
                        AS created_in_feedback FROM ${tableName.feedback} f INNER JOIN ${tableName.tasks}
                        ta on f.task_id=ta.id INNER JOIN ${tableName.clients} c on ta.client_id=c.id INNER
                        JOIN ${tableName.team} tm on tm.id=ta.team_id ORDER BY f.id DESC`

        pool.query( selectquery,(err,result)=>{
            if(err){
                logWithOptionalBroadcast('info',`Error in fetching records from feedbacks ${err.message}`);
                return res.status(500).send(RESPONSE(false, "Database error while checking references", err));    
            }else{
                return res.status(200).send(RESPONSE(true,"Successfully Fetched Record From Feedback",{result}));
            }
        });   
    }catch(error){
        logWithOptionalBroadcast('info',`Error Fetching Feedbacks ${error.message}`)
        res.status(400).send(RESPONSE(false,"Error Fetching Feedbacks",{}))
    };
    
});

module.exports=router;