/*const pool = require("../Utils/db");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");

const rescheduling = async () => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logWithOptionalBroadcast('info',"today==>", todayDate);

    const query = `
      SELECT * 
      FROM ${tableName.tasks} 
      WHERE Response = 2
        AND SERVICE_DATE = ?
        AND isactive = 0;
    `;

    pool.query(query, [todayDate], (err, results) => {
      if (err) {
        logWithOptionalBroadcast('error',"Error fetching data from tasks table:", err);
        return;
      }

      if (results.length > 0) {
        logWithOptionalBroadcast('info',`Found ${results.length} tasks to be rescheduled.`);

        results.forEach((item) => {
          const rescheduledate = moment(item.service_date).add(7, "days").format("YYYY-MM-DD");
          logWithOptionalBroadcast('info',`Task ${item.id} rescheduled to ${rescheduledate}`);

          const updateQuery = `
            UPDATE ${tableName.clients} 
            SET UPCOMING_SERVICE_DATE = ? 
            WHERE id = ?;
          `;

          const updateTaskQuery = `
            UPDATE ${tableName.tasks}
            SET isactive = 1
            WHERE id = ?;
          `;

          pool.query(updateQuery, [rescheduledate, item.client_id], (updateErr) => {
            if (updateErr) {
              logWithOptionalBroadcast('error',`Error updating client ${item.client_id}:`, updateErr);
            } else {
              logWithOptionalBroadcast('info',`Client ${item.client_id} successfully rescheduled.`);
            }
          });

          pool.query(updateTaskQuery, [item.id], (taskUpdateErr) => {
            if (taskUpdateErr) {
              logWithOptionalBroadcast('error',`Error updating task ${item.id} to inactive:`, taskUpdateErr);
            } else {
              logWithOptionalBroadcast('info',`Task ${item.id} marked as inactive.`);
            }
          });
        });
      } else {
        logWithOptionalBroadcast('info',"No tasks to be rescheduled.");
      }
    });
  } catch (error) {
    logWithOptionalBroadcast('error',"Error in rescheduling function:", error.message);
  }
};

module.exports = { rescheduling };*/

const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");
const { logWithOptionalBroadcast } = require("../logger");
const dotenv = require("dotenv");

dotenv.config();

const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const API_URL = process.env.WHATSAPP_API_URL;

async function sendreshulingmessage(client_id,pool){
  try{
    const selectQuery=
    `SELECT name,number,UPCOMING_SERVICE_DATE From 
    ${tableName.clients} WHERE id = ?;`

    const results=await performQuery({
      sql:selectQuery,
      params:[client_id],
      pool:pool
    });

    if(results.length>0){
      logWithOptionalBroadcast('info',`Found ${results.length} client to message.`);

      const payload = { 
        messaging_product: "whatsapp",
        to: results[0].number, // Recipient's phone number
        type: "text",
        header: {
          type: "text", // You can also use "image" or "document" for other types
          text: `Service Reschedule Notification`, // Header content
        },
        text: {
          body: `Dear ${results[0].name},\n\nYour Service is reshedule to ${results[0].upcoming_service_date}.\n\nFor any updates connect we us.\n\nThank you.\n\n`
        },
        footer: {
          text: "System By Abdul Rafay", 
        },
      };
    
      try {
        const response = await axios.post(API_URL, payload, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        });
    
        logWithOptionalBroadcast('info',
          `Message sent to ${client_id} whose name is ${results[0].name},true`
        );
      } catch (error) {
        logWithOptionalBroadcast('error',
          `Error sending message to ${client_id} whose name is ${results[0].name}: ${error.response?.data || error.message}`
        );
    }
  }
  }catch(queryError){
    logWithOptionalBroadcast('error',`Database query error in resheduling messages: ${queryError.message}`);
  }
}  

const rescheduling = async (pool) => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logWithOptionalBroadcast('info',"today==>", todayDate);

    const selectQuery = `
      SELECT * 
      FROM ${tableName.tasks} 
      WHERE Response = 2
        AND SERVICE_DATE = ?
        AND isactive = 0;
    `;

    // Fetch tasks to be rescheduled
    const results = await performQuery({
      sql: selectQuery,
      params: [todayDate],
      pool
    });

    if (results.length > 0) {
      logWithOptionalBroadcast('info',`Found ${results.length} tasks to be rescheduled.`);

      for (const item of results) {
        const rescheduledate = moment(item.service_date)
          .add(7, "days")
          .format("YYYY-MM-DD");
          logWithOptionalBroadcast('info',`Task ${item.id} rescheduled to ${rescheduledate}`);

        // Update client's upcoming service date
        const updateClientQuery = `
          UPDATE ${tableName.clients} 
          SET UPCOMING_SERVICE_DATE = ? 
          WHERE id = ?;
        `;
        await performQuery({
          sql: updateClientQuery,
          params: [rescheduledate, item.client_id],
          pool,
        });
        logWithOptionalBroadcast('info',`Client ${item.client_id} successfully rescheduled.`,true);

        // Mark task as inactive
        const updateTaskQuery = `
          UPDATE ${tableName.tasks}
          SET isactive = 1
          WHERE id = ?;
        `;
        await performQuery({
          sql: updateTaskQuery,
          params: [item.id],
          pool,
        });
        logWithOptionalBroadcast('info',`Task ${item.id} marked as inactive.`);

        await sendreshulingmessage(item.client_id,pool);
      }
    } else {
      logWithOptionalBroadcast('info',"No tasks to be rescheduled.");
    }
  } catch (error) {
    logWithOptionalBroadcast('error',`Error in mytask cron job:, ${error.message, error.stack || error}`);
  }
};

module.exports = { rescheduling };

