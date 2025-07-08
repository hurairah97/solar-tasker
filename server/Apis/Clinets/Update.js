const express=require("express");
const router=express.Router();
const tableName=require("../../Utils/allTableNames");
const {GlobalUpdate}=require("../../GlobalFunctions/GlobalUpdate");
const RESPONSE=require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");


router.post("/",(req,res)=>{
    if (!req.body.id||!req.body.name || !req.body.email || !req.body.number || !req.body.address || !req.body.area_region_id || !req.body.service_plan_duration){
        return res.status(400).send(RESPONSE(false,"Please Fill All Fields",{}));
    }
    let payload={
        id:req.body.id,
        tableName:tableName.clients,
        table:"Clients",
        databaseFields:{
            name:req.body.name,
            number:req.body.number,
            email:req.body.email,
            address:req.body.address,
            area_region_id:req.body.area_region_id,
            amount:req.body.amount,
            service_plan_duration:req.body.service_plan_duration,
            plan:req.body.plan,
            last_service_date:req.body.service_plan_duration,
            upcoming_service_date:req.body.upcoming_service_date,
            region_preference:req.body.region_preference,
        }
    }
    logWithOptionalBroadcast('info',"Payload for update:", payload);
    
        GlobalUpdate(payload,res);
    });
    
module.exports = router;
