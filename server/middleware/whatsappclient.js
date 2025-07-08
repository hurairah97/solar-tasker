const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const { logWithOptionalBroadcast } = require("../logger");
const axios = require("axios");
const moment = require("moment-timezone");
const dotenv = require("dotenv");

dotenv.config();

const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const API_URL = process.env.WHATSAPP_API_URL;

const sendMessage = async (pool) => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logWithOptionalBroadcast('info',`today==>, ${todayDate}`);

    // Query to get clients with upcoming services in 2 days
    const selectQuery = `
      SELECT c.name, c.number, c.address, t.service_date
      FROM ${tableName.clients} c
      INNER JOIN ${tableName.tasks} t ON c.id = t.client_id
      WHERE DATEDIFF(t.service_date, ?) = 2 ;
    `;

    const results = await performQuery({
      sql: selectQuery,
      params: [todayDate],
      pool: pool,
    });

    if (results.length > 0) {
      logWithOptionalBroadcast('info',`Found ${results.length} clients with services in coming 2 days so sending messages to clients.`);
    } else {
      logWithOptionalBroadcast('info',"No clients with upcoming services n 2 days.");
      return;
    }
    logWithOptionalBroadcast('info',`Query Results:, ${results}`);
    // Iterate over results and send WhatsApp messages
    for (const item of results) {
      const payload = {
        "messaging_product": "whatsapp",
        "to": item.number, // Use `item` here
        "type": "template",
        "template": {
          "name": "service_message",
          "language": { "code": "en" },
          "components": [
            {
              "type": "body",
              "parameters": [
                { "type": "text", "text": item.name }, // Use `item` here
                { "type": "text", "text": moment(item.service_date).format("YYYY-MM-DD") }, // Format date
                { "type": "text", "text": item.address } // Use `item` here
              ]
            }
          ]
        }
      };


      try {
        const response = await axios.post(API_URL, payload, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        });
        logWithOptionalBroadcast('info',`Message sent to ${item.name} (${item.number}) successfully.`,true);
      } catch (error) {
        logWithOptionalBroadcast('error',`Error sending message to ${item.name} (${item.number}):, ${error.response?.data || error.message}`);
      }      
    }
  } catch (error) {
    logWithOptionalBroadcast('error',`Error in WhatsApp message send cron job: ${error.message}`);
  }
};


module.exports = {sendMessage };
