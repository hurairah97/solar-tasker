const express=require("express");
const router=express.Router();
const tableName=require("../../Utils/allTableNames");
const {GlobalUpdate}=require("../../GlobalFunctions/GlobalUpdate");
const RESPONSE=require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");


router.post("/",(req,res)=>{
    if(!req.body.id||!req.body.area||!req.body.region){
        return res.status(400).send(RESPONSE(false,"Please Fill All Fields",{}));
    }
    let payload={
        id:req.body.id,
        tableName:tableName.area_region,
        table:"Area Region Table",
        databaseFields:{
            area:req.body.area,
            region:req.body.region,
        },
    };
    logWithOptionalBroadcast('info',"Payload for update:", payload);

    GlobalUpdate(payload,res);
});

module.exports = router;