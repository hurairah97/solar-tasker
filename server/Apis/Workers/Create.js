const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const { GlobalInsert } = require("../../GlobalFunctions/GlobalCreate");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");

router.post("/",(req,res)=>{
    const{
        name,
        number,
        address,
        cnic,
    }=req.body;
    if(!name || !number){
        return res.status(400).send(RESPONSE(false, "Missing required fields", {}));
    }

    let payload={
        tableName:tableName.workers,
        table:"Workers",
        databaseFields:{
            name,
            number,
            address,
            cnic_number:cnic,
        },
        
    };
    logWithOptionalBroadcast('info',"Payload for insertion:", payload);
    
    GlobalInsert(payload,res);
});
module.exports=router;