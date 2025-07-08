const express=require("express");
const router=express.Router();
const tableName = require("../../Utils/allTableNames");
const { GlobalDelete } = require("../../GlobalFunctions/GlobalDelete");
const RESPONSE = require("../../GlobalResponse/RESPONSE");
const { logWithOptionalBroadcast } = require("../../logger");


router.post("/",(req,res)=>{
    const{id}=req.body;

    if(!id){
        return res.status(400).send(RESPONSE(false, "Missing required 'id' field", {}));
    }

    let payload={
        tableName:tableName.clients,
        table:"Clients",
        databaseFields:{
            id:id,
        },
    };
    logWithOptionalBroadcast('info',"Payload for deletion:", payload);

  // Call the global delete function
  GlobalDelete(payload, res);
})
module.exports=router;