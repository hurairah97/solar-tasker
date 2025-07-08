const express = require("express");
const router = express.Router();
const tableName = require("../../Utils/allTableNames");
const {GlobalSelect}=require("../../GlobalFunctions/GlobalSelect");
const RESPONSE=require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");


router.get("/",(req,res)=>{
    let payload={
        tableName:tableName.area_region,
        table:"Area Region Table",
    };
    GlobalSelect(payload,res);
});

module.exports=router;