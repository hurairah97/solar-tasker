const WebSocket = require("ws");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");
const cronpool = require("../Utils/crondb");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", async (ws) => {
  console.log("New WebSocket connection established.");

  try {
    // Fetch stored notifications
    const fetchNotificationsQuery = `SELECT message, created_at FROM ${tableName.notification} ORDER BY created_at DESC;`;
    const [notifications] = await cronpool.query(fetchNotificationsQuery);

    ws.send(
      JSON.stringify({
        type: "history",
        notifications,
      })
    );
  } catch (error) {
    console.error(`Error fetching notifications: ${error.message}`);
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Failed to fetch notifications.",
      })
    );
  }

  ws.on("close", () => {
    console.log("WebSocket connection closed.");
  });
});

const broadcastNotification = async (message) => {
  try {
    const timestamp = moment.tz("Asia/Karachi").format("YYYY-MM-DD HH:mm:ss");

    // Insert into database
    const insertQuery = `INSERT INTO ${tableName.notification} (message, created_at) VALUES (?,?);`;
    await cronpool.query(insertQuery, [message, timestamp]);

    // Broadcast new notification
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "new",
            notification: { message, created_at: timestamp },
          })
        );
      }
    });
  } catch (error) {
    console.error(`Error broadcasting notification: ${error.message}`);
  }
};

module.exports = { broadcastNotification, wss };
