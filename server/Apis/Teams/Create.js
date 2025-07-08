const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const { GlobalInsert } = require("../../GlobalFunctions/GlobalCreate");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");


router.post("/",(req,res)=>{
    const{
        member1,
        member2,
        member3,
        teamname,
    }=req.body;
    if(!member1 || !member2){
        return res.status(400).send(RESPONSE(false, "Missing required fields", {}));
    }
    console.log("body",req.body);
    
    let payload={
        tableName:tableName.team,
        table:"Teams",
        databaseFields:{
            member1_id:member1,
            member2_id: member2,
            member3_id: member3,
            team_name:teamname
        },
        
    };
    logWithOptionalBroadcast('info',"Payload for insertion:", payload);
    
    GlobalInsert(payload,res);
});
module.exports=router;