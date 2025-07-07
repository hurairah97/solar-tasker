const cron = require("node-cron");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");
const { performQuery } = require("../Utils/performQuery");
const { logWithOptionalBroadcast } = require("../logger"); // Ensure logger is imported

const deleteOldNotifications = async (pool) => {
  try {
    const timestamp = moment.tz("Asia/Karachi").format("YYYY-MM-DD HH:mm:ss");

    // Delete notifications older than 7 days
    const deleteQuery = `DELETE FROM ${tableName.notification} WHERE DATEDIFF(?, created_at) >= 1;`;

    const res = await performQuery({
      sql: deleteQuery,
      params: [timestamp],
      pool: pool,
    });

    logWithOptionalBroadcast("info", `Deleted old notifications older than 1 days.`);
  } catch (error) {
    logWithOptionalBroadcast("error", `Error in deleting old notifications: ${error.message}`);
  }
};

module.exports = { deleteOldNotifications };