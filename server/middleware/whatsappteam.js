const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const { logWithOptionalBroadcast } = require("../logger");
const axios = require("axios");
const moment = require("moment-timezone");
const dotenv = require("dotenv");

dotenv.config();

const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const API_URL = process.env.WHATSAPP_API_URL;

const sendMessagetoteams = async (pool) => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logWithOptionalBroadcast('info',`Today: ${todayDate}`);

    // Query to get clients with services today
    const selectQuery = `
      SELECT 
          t.team_id,
          t.client_id,
          c.name AS client_name,
          c.address,
          c.number AS client_contact,
          IF(c.plan = 0, 'Basic', 'Premium') AS plan_type
      FROM 
          ${tableName.tasks} t
      INNER JOIN 
          ${tableName.clients} c 
      ON 
          c.id = t.client_id
      WHERE 
          t.service_date = ? AND
          t.response = 1;
    `;

    const clientResults = await performQuery({
      sql: selectQuery,
      params: [todayDate],
      pool: pool,
    });

    if (clientResults.length === 0) {
      logWithOptionalBroadcast('info',"No clients with today services.");
      return;
    }

    logWithOptionalBroadcast('info',`Found ${clientResults.length} clients with services today. Extracting unique team IDs...`);

    // Extract unique team IDs
    const uniqueTeamIds = [...new Set(clientResults.map((item) => item.team_id))];
    logWithOptionalBroadcast('info',`Unique Team IDs: ${uniqueTeamIds}`);

    if (uniqueTeamIds.length === 0) {
      logWithOptionalBroadcast('info',"No unique team IDs found. Skipping message sending.");
      return;
    }

    const teamMemberQuery = `
      SELECT 
          t.id AS team_id, 
          t.team_name AS team_name, 
          w.name AS team_lead, 
          w.number AS team_contact
      FROM 
          ${tableName.team} t 
      INNER JOIN 
          ${tableName.workers} w 
      ON 
          t.member1_id = w.id
      WHERE 
          t.id IN (${uniqueTeamIds.map(() => "?").join(",")});
    `;

    //logWithOptionalBroadcast('info',`Executing teamMemberQuery: ${teamMemberQuery}`);
    logWithOptionalBroadcast('info',`Query parameters: ${uniqueTeamIds}`);

    let teamMembers;
    try {
      teamMembers = await performQuery({
        sql: teamMemberQuery,
        params: uniqueTeamIds,
        pool: pool,
      });

      if (teamMembers.length === 0) {
        logWithOptionalBroadcast('info',"No team members found for the given team IDs.");
        return;
      }

      logWithOptionalBroadcast('info',`Found ${teamMembers.length} team members. Proceeding with message sending.`);
    } catch (error) {
      logWithOptionalBroadcast('error',`Error executing teamMemberQuery: ${error.message}`, error);
      return;
    }

    // Combine clients and team members based on `team_id`
    const combinedResults = uniqueTeamIds.map((teamId) => {
      const teamInfo = teamMembers.find((member) => member.team_id === teamId);
      const clients = clientResults.filter((client) => client.team_id === teamId);
      return { teamInfo, clients };
    });

    // Process combined results and send messages
    for (const { teamInfo, clients } of combinedResults) {
      if (!teamInfo || clients.length === 0) {
        logWithOptionalBroadcast('warn', `Missing teamInfo or clients for team ID: ${teamInfo?.team_id || "unknown"}`);
        continue;
      }

      for (const client of clients) {
        // const payload = {
        //   messaging_product: "whatsapp",
        //   to: teamInfo.team_contact,
        //   type: "template",
        //   template: {
        //     name: "team_message",
        //     language: { code: "en" },
        //     components: [
        //       {
        //         type: "body",
        //         parameters: [
        //           { type: "text", text: client.client_name },
        //           { type: "text", text: client.address },
        //           { type: "text", text: client.client_contact },
        //           { type: "text", text: teamInfo.team_lead },
        //         ],
        //       },
        //     ],
        //   },
        // };

        const payload = {
          messaging_product: "whatsapp",
          to: teamInfo.team_contact, // Recipient's phone number
          type: "interactive",
          interactive: {
            type: "button",
            header: {
              type: "text", 
              text: `Today Service`, 
            },
            body: {
              text: `Dear ${teamInfo.team_lead},\n\nYou have a service at ${client.client_name } house ${client.address } whose ${client.client_contact} number is this. Connect them and click on the buttons below to track the service:\n\n- On the way: when you are going there.\n- Start working: when you start working.\n- Completed: when you finish the work.`,
            },
            footer: {
              text: "System By Abdul Rafay", 
            },
            action: {
              buttons: [
                {
                  type: "reply",
                  reply: {
                    id: String(client.client_contact)+" On the way",
                    title: "On the way",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: String(client.client_contact)+" Start working",
                    title: "Start working",
                  },
                },
                {
                  type: "reply",
                  reply: {
                    id: String(client.client_contact)+" Completed",
                    title: "Completed",
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
          logWithOptionalBroadcast('info',`Message sent to ${teamInfo.team_lead} for client ${client.client_name}`,true);
        } catch (error) {
          logWithOptionalBroadcast('error',
            `Error sending message to ${teamInfo.team_lead} for client ${client.client_name}:,
            ${error.response?.data || error.message}`
          );
        }
      }
    }
  } catch (error) {
    logWithOptionalBroadcast('error',`Error in WhatsApp message send cron job:", ${error.message}`);
  }
};

module.exports = { sendMessagetoteams };
