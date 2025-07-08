const express=require("express");
const router=express.Router();
const tableName=require("../../Utils/allTableNames");
const {GlobalUpdate}=require("../../GlobalFunctions/GlobalUpdate");
const RESPONSE=require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");


router.post("/",(req,res)=>{
    const{
        id,
        name,
        number,
        address,
        cnic
    }=req.body;
    if(!id || !name ||!number){
        return res.status(400).send(RESPONSE(false,"Please Fill All Fields",{}));
    }
    let payload={
        id:id,
        tableName:tableName.workers,
        table:"Workers",
        databaseFields:{
            name:name,
            number:number,
            address:address,
            cnic_number:cnic,
        },
    };
    logWithOptionalBroadcast('info',"Payload for update:", payload);

    GlobalUpdate(payload,res);
});

module.exports=router;