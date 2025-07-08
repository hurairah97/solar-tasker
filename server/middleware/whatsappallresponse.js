const express = require("express");
const router = express.Router();
const tableName = require("../Utils/allTableNames");
const cronpool = require("../Utils/crondb");
const { logWithOptionalBroadcast } = require("../logger");
const { performQuery } = require("../Utils/performQuery");
const axios = require("axios");
const moment=require("moment-timezone");
const dotenv = require("dotenv");

dotenv.config();

const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const API_URL = process.env.WHATSAPP_API_URL;

async function sendMessageOfComing(clientNumberOrTeamId, name) {
  if (!clientNumberOrTeamId || !name) {
    logWithOptionalBroadcast('error',"Invalid parameters: clientNumberOrTeamId or name is missing.");
    return;
  }

  const payload = {
    messaging_product: "whatsapp",
    to: clientNumberOrTeamId,
    type: "text",
    header: {
      type: "text", // You can also use "image" or "document" for other types
      text: `Service Arrival Notification - Team ${name}`, // Header content
    },
    text: {
      body: `Team ${name} is on the way to you and will arrive in approximately 15 minutes to 1 hour.`,
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
      `Message sent to ${clientNumberOrTeamId}. Response status: ${response.status}`,true
    );
  } catch (error) {
    logWithOptionalBroadcast('error',
      `Error sending message to ${clientNumberOrTeamId}: ${error.response?.data || error.message}`
    );
  }
}

async function sendMessageOfFeedback(clientNumberOrTeamId, name, team_id) {
  if (!clientNumberOrTeamId || !name) {
    logWithOptionalBroadcast('error',"Invalid parameters: clientNumberOrTeamId or name is missing.");
    return;
  }

  const payload = {
    messaging_product: "whatsapp",
    to: clientNumberOrTeamId,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text", // You can also use "image" or "document" for other types
        text: `Feedback Request - Team ${name}`, // Header content
      },
      body: {
        text: `Dear,
Please rate the service provided by our team ${name} at your house. This will help us maintain better service for you.
Click one of the buttons below to rate the service from 1 to 3:
1 - Very Poor
2 - Average
3 - Excellent
Thank you for your valuable feedback. Your response helps us improve!`
      },
      footer: {
        text: "System By Abdul Rafay", 
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: `1 - Very Poor${team_id}`,
              title: "1 - Very Poor",
            },
          },
          {
            type: "reply",
            reply: {
              id: `2 - Average${team_id}`,
              title: "2 - Average",
            },
          },
          {
            type: "reply",
            reply: {
              id: `3 - Excellent${team_id}`,
              title: "3 - Excellent",
            },
          },
        ],
      },
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
      `Message sent to ${clientNumberOrTeamId}. Response status: ${response.status}`,true
    );
  } catch (error) {
    logWithOptionalBroadcast('error',
      `Error sending message to ${clientNumberOrTeamId}: ${
        error.response?.data || error.message
      }`
    );
  }
}



async function updateTaskResponse(teamRes, clientNumberOrTeamId, teamId, from) {
  try {
    // Update the task status
    const updateQuery = `
      UPDATE ${tableName.tasks} t 
      INNER JOIN ${tableName.clients} c ON t.client_id = c.id
      SET t.task_status = ?
      WHERE t.isactive = 0 AND t.team_id = ? AND c.number = ?;
    `;

    const updateRes = await performQuery({
      sql: updateQuery,
      params: [teamRes, teamId, clientNumberOrTeamId],
      pool: cronpool,
    });

    // Retrieve the task ID for tracking
    const getQuery = `
      SELECT t.id 
      FROM ${tableName.tasks} t 
      INNER JOIN ${tableName.clients} c ON t.client_id = c.id
      WHERE t.isactive = 0 AND t.team_id = ? AND c.number = ?;
    `;

    const getRes = await performQuery({
      sql: getQuery,
      params: [teamId, clientNumberOrTeamId],
      pool: cronpool,
    });

    if (getRes.length > 0) {
      const task_id = getRes[0].id;
      const time_stamp = moment().tz("Asia/Karachi").format("YYYY-MM-DD HH:mm:ss");

      // Insert tracking information
      const insertQuery = `
        INSERT INTO ${tableName.tracking} (task_id, status, time_stamp)
        VALUES (?, ?, ?);
      `;

      const insertRes = await performQuery({
        sql: insertQuery,
        params: [task_id, teamRes, time_stamp],
        pool: cronpool,
      });

      logWithOptionalBroadcast('info',`Tracking entry created for task ID ${task_id} with status ${teamRes}.`,true);
    } else {
      logWithOptionalBroadcast('warn', `No task found for team ID ${teamId} and client number ${clientNumberOrTeamId}.`);
    }

    logWithOptionalBroadcast('info',`Updated task response for client ${clientNumberOrTeamId} with task status ${teamRes}`,true);
  } catch (queryError) {
    logWithOptionalBroadcast('error',`Database query error in updateTaskResponse: ${queryError.message}`);
  }
}

async function recordFeedback(clientId, teamId, clientRes) {
  try {
    const taskQuery = `SELECT id FROM ${tableName.tasks} WHERE client_id = ? AND team_id = ?;`;
    const taskResults = await performQuery({
      sql: taskQuery,
      params: [clientId, teamId],
      pool: cronpool,
    });

    if (taskResults.length > 0) {
      const taskId = taskResults[0].id;

      const feedbackQuery = `INSERT INTO ${tableName.feedback} (task_id, rating) VALUES (?, ?);`;
      await performQuery({
        sql: feedbackQuery,
        params: [taskId, clientRes],
        pool: cronpool,
      });

      logWithOptionalBroadcast('info',`Feedback recorded for Task ID: ${taskId} with rating: ${clientRes}`,true);
    } else {
      logWithOptionalBroadcast('warn', `No task found for Client ID: ${clientId} and Team ID: ${teamId}`);
    }
  } catch (queryError) {
    logWithOptionalBroadcast('error',`Database query error in recordFeedback: ${queryError.message}`);
  }
}

router.post("/", async (req, res) => {
    try {
      const data = req.body;
      logWithOptionalBroadcast('info',"Webhook received data:", JSON.stringify(data, null, 2));
  
      if (data.object !== "whatsapp_business_account") {
        logWithOptionalBroadcast('info',"Not a WhatsApp business account webhook.");
        return res.status(200).send("EVENT_RECEIVED");
      }
  
      const messages = data.entry?.[0]?.changes?.[0]?.value?.messages;
  
      if (messages && messages.length > 0) {
        for (const message of messages) {
          // Check for "Yes" or "No" button responses
          if (message.type === "button") {
            const buttonResponse = message.button?.text; // 'Yes' or 'No'
            const from = message.from; // Client's phone number
            let client_res = null;
            
            if (buttonResponse === "Yes") {
              logWithOptionalBroadcast('info',`Client ${from} agreed to the service.`,true);
              client_res = 1;
            } else if (buttonResponse === "No") {
              logWithOptionalBroadcast('info',`Client ${from} declined the service.`,true);
              client_res = 2;
            }
  
            if (client_res !== null) {
              try {
                // Query to find client by phone number
                const getQuery = `SELECT id, name FROM ${tableName.clients} WHERE number = ?;`;
                const results = await performQuery({
                  sql: getQuery,
                  params: [from],
                  pool: cronpool,
                });
  
                if (results.length > 0) {
                  const client = results[0];
                  logWithOptionalBroadcast('info',`Found client: ${client.name} with ID: ${client.id}`);
  
                  // Update task response
                  const updateQuery = `
                    UPDATE ${tableName.tasks}
                    SET response = ?, whats_client_res = 1w
                    WHERE isactive = 0 AND client_id = ? AND whats_client_res = 0;
                  `;
                  const updateRes = await performQuery({
                    sql: updateQuery,
                    params: [client_res, client.id],
                    pool: cronpool,
                  });
  
                  logWithOptionalBroadcast('info',
                    `Updated task response for client ${client.name} with ID: ${client.id}`
                  );
                } else {
                  logWithOptionalBroadcast('warn', `No client found with phone number: ${from}`);
                }
              } catch (queryError) {
                logWithOptionalBroadcast('error',`Database query error: ${queryError.message}`);
              }
            }
          }
  
          // Process interactive button responses (existing logic)
          if (message.interactive?.type === "button_reply") {
            const buttonReply = message.interactive.button_reply;
            const buttonTitle = buttonReply.title;
            const from = message.from;
  
            logWithOptionalBroadcast('info',`Button response from ${from}: ${buttonTitle}`);
            const clientNumberOrTeamId = buttonReply.id.replace(buttonTitle, "").trim();
  
            let teamRes = null;
            let clientRes = null;
  
            // Handle team actions
            if (["On the way", "Start working", "Completed"].includes(buttonTitle)) {
              teamRes = ["On the way", "Start working", "Completed"].indexOf(buttonTitle) + 1;
            
              // Fetch team details
              const teamQuery = `
                SELECT t.id AS team_id, t.team_name AS name 
                FROM ${tableName.team} t 
                INNER JOIN ${tableName.workers} w ON t.member1_id = w.id 
                WHERE w.number = ?;
              `;
              const teamResults = await performQuery({
                sql: teamQuery,
                params: [from],
                pool: cronpool,
              });
  
              if (teamResults.length > 0) {
                const team = teamResults[0];
                logWithOptionalBroadcast('info',`Found team ${team.name} with ID: ${team.team_id}`);
                await updateTaskResponse(teamRes, clientNumberOrTeamId, team.team_id, from);
  
                // Send feedback or notify client
                if (teamRes === 1) {
                  await sendMessageOfComing(clientNumberOrTeamId, team.name);
                } else if (teamRes === 3) {
                  await sendMessageOfFeedback(clientNumberOrTeamId, team.name, team.team_id);
                }
              } else {
                logWithOptionalBroadcast('warn', `No team found for phone number: ${from}`);
              }
            }
  
            // Handle client feedback
            if (!teamRes && ["1 - Very Poor", "2 - Average","3 - Excellent"].includes(buttonTitle)) {
              clientRes = parseInt(buttonTitle.split(" ")[0], 10);
  
              const clientQuery = `SELECT id, name FROM ${tableName.clients} WHERE number = ?;`;
              const clientResults = await performQuery({
                sql: clientQuery,
                params: [from],
                pool: cronpool,
              });
  
              if (clientResults.length > 0) {
                const client = clientResults[0];
                logWithOptionalBroadcast('info',`Found client ${client.name} with ID: ${client.id}`);
                await recordFeedback(client.id, clientNumberOrTeamId, clientRes);
              } else {
                logWithOptionalBroadcast('warn', `No client found for phone number: ${from}`);
              }
            }
          }
        }
      } else {
        logWithOptionalBroadcast('info',"No messages found in webhook data.");
      }
  
      res.status(200).send("EVENT_RECEIVED");
    } catch (error) {
      logWithOptionalBroadcast('error',"Error processing webhook data:", error.message);
      res.status(500).send("Internal Server Error");
    }
  });  

router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_RESPONSE_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  logWithOptionalBroadcast('info',`Webhook verification received: mode=${mode}, token=${token}, challenge=${challenge}`);

  if (mode && token === VERIFY_TOKEN) {
    logWithOptionalBroadcast('info',"Webhook verified successfully");
    res.status(200).send(challenge);
  } else {
    logWithOptionalBroadcast('error',"Webhook verification failed");
    res.status(403).send("Forbidden");
  }
});

module.exports = router;
