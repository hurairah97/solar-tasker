const express=require("express");
const router=express.Router();
const tableName=require("../../Utils/allTableNames");
const {GlobalUpdate}=require("../../GlobalFunctions/GlobalUpdate");
const RESPONSE=require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");


router.post("/",(req,res)=>{
    const{
        id,
        member1,
        member2,
        member3,
        teamname,
    }=req.body;
    if(!id || !member1 ||!member2){
        return res.status(400).send(RESPONSE(false,"Please Fill All Fields",{}));
    }
    let payload={
        id:id,
        tableName:tableName.team,
        table:"Teams",
        databaseFields:{
            member1_id:member1,
            member2_id:member2,
            member3_id:member3,
            team_name:teamname,
        },
    };
    logWithOptionalBroadcast('info',"Payload for update:", payload);

    GlobalUpdate(payload,res);
});

module.exports=router;