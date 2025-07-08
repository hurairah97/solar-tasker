/*const cron = require("node-cron");
const pool = require("../Utils/db");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");

const REGION_DAY_MAPPING = {
  1: 1, // Region 1 → Monday
  2: 2, // Region 2 → Tuesday
  3: 3, // Region 3 → Wednesday
  4: 4, // Region 4 → Thursday
  5: 5, // Region 5 → Friday
  6: 6, // Region 6 → Saturday
};

// Function to calculate the next scheduled day
function calculateNextScheduledDay(date, regionDay, servicePlanDuration = 0) {
  let newDate = moment.tz(date, "Asia/Karachi").add(servicePlanDuration, "days");

  const currentDay = newDate.day(); // Current day of the week
  const daysToAdd = (regionDay - currentDay + 7) % 7; // Days to next occurrence of the region day
  newDate = newDate.add(daysToAdd || 7, "days"); // Move to the next week if needed

  return newDate.format("YYYY-MM-DD HH:mm:ss");
}

const processTasks = async () => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logWithOptionalBroadcast('info',"today==>",todayDate);
    const query = `
      SELECT t.id AS task_id, t.service_date, t.client_id, c.service_plan_duration, c.region_preference
      FROM ${tableName.tasks} AS t
      JOIN ${tableName.clients} AS c ON t.client_id = c.id
      WHERE t.isactive = 0 AND t.task_status = 3 AND t.response = 1 AND t.service_date=?;
    `;

    pool.getConnection((err, connection) => {
      if (err) {
        logWithOptionalBroadcast('error',"Error getting database connection:", err);
        return;
      }

      connection.query(query, [todayDate],(fetchErr, results) => {
        if (fetchErr) {
          logWithOptionalBroadcast('error',"Error fetching data from tasks and clients tables:", fetchErr);
          connection.release();
          return;
        }

        if (results.length > 0) {
          logWithOptionalBroadcast('info',`Processing ${results.length} tasks for rescheduling...`);

          results.forEach((task) => {
            const { task_id, service_date, service_plan_duration, region_preference, client_id } = task;

            const nextServiceDate = calculateNextScheduledDay(service_date, REGION_DAY_MAPPING[region_preference], service_plan_duration);

            const updateClientQuery = `
              UPDATE ${tableName.clients}
              SET upcoming_service_date = '${nextServiceDate}'
              WHERE id = ${client_id};
            `;

            const updateTaskQuery = `
              UPDATE ${tableName.tasks}
              SET isactive = 1
              WHERE id = ${task_id};
            `;

            // Update the client's upcoming service date
            connection.query(updateClientQuery, (clientUpdateErr) => {
              if (clientUpdateErr) {
                logWithOptionalBroadcast('error',`Error updating client ${client_id} with new service date:`, clientUpdateErr);
                return;
              }
              logWithOptionalBroadcast('info',`Client ${client_id} updated with new service date: ${nextServiceDate}`);
            });

            // Update the task to set isactive to 0
            connection.query(updateTaskQuery, (taskUpdateErr) => {
              if (taskUpdateErr) {
                logWithOptionalBroadcast('error',`Error updating task ${task_id} to inactive:`, taskUpdateErr);
                return;
              }
              logWithOptionalBroadcast('info',`Task ${task_id} marked as inactive.`);
            });
          });
        } else {
          logWithOptionalBroadcast('info',"No tasks found for rescheduling.");
        }

        connection.release();
      });
    });
  } catch (error) {
    logWithOptionalBroadcast('error',"Error in processTasks function:", error.message);
  }
};

module.exports = { processTasks };*/

const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const moment = require("moment-timezone");
const { logWithOptionalBroadcast } = require("../logger");


const REGION_DAY_MAPPING = {
  1: 1, // Region 1 → Monday
  2: 2, // Region 2 → Tuesday
  3: 3, // Region 3 → Wednesday
  4: 4, // Region 4 → Thursday
  5: 5, // Region 5 → Friday
  6: 6, // Region 6 → Saturday
  7: 7, // Region 7 → Sunday
};

// Function to calculate the next scheduled day
function calculateNextScheduledDay(date, regionDay, servicePlanDuration = 0) {
  let newDate = moment.tz(date, "Asia/Karachi").add(servicePlanDuration, "days");

  const currentDay = newDate.day(); // Current day of the week
  const daysToAdd = (regionDay - currentDay + 7) % 7; // Days to next occurrence of the region day
  newDate = newDate.add(daysToAdd || 7, "days"); // Move to the next week if needed

  return newDate.format("YYYY-MM-DD HH:mm:ss");
}

const processTasks = async (pool) => {
  try {
    const todayDate = moment().tz("Asia/Karachi").format("YYYY-MM-DD");
    logWithOptionalBroadcast('info',"today==>", todayDate);

    const selectQuery = `
      SELECT t.id AS task_id, t.service_date, t.client_id, c.service_plan_duration, c.region_preference
      FROM ${tableName.tasks} AS t
      JOIN ${tableName.clients} AS c ON t.client_id = c.id
      WHERE t.isactive = 0 AND t.task_status = 3 AND t.response = 1 AND t.service_date = ? ;
    `;

    const tasks = await performQuery({
      sql: selectQuery,
      params: [todayDate],
      pool,
    });

    if (tasks.length > 0) {
      logWithOptionalBroadcast('info',`Processing ${tasks.length} tasks for rescheduling...`);

      for (const task of tasks) {
        const { task_id, service_date, service_plan_duration, region_preference, client_id } = task;

        const nextServiceDate = calculateNextScheduledDay(
          service_date,
          REGION_DAY_MAPPING[region_preference],
          service_plan_duration
        );

        const updateClientQuery = `
          UPDATE ${tableName.clients}
          SET upcoming_service_date = ? , last_service_date = ?
          WHERE id = ?;
        `;
        await performQuery({
          sql: updateClientQuery,
          params: [nextServiceDate, service_date, client_id],
          pool,
        });
        logWithOptionalBroadcast('info',`Client ${client_id} updated with new service date: ${nextServiceDate}`,true);

        const updateTaskQuery = `
          UPDATE ${tableName.tasks}
          SET isactive = 1
          WHERE id = ?;
        `;
        await performQuery({
          sql: updateTaskQuery,
          params: [task_id],
          pool,
        });
        logWithOptionalBroadcast('info',`Task ${task_id} marked as inactive.`);
      }
    } else {
      logWithOptionalBroadcast('info',"No tasks found for rescheduling.");
    }
  } catch (error) {
    logWithOptionalBroadcast('error',`Error in processTasks function:, ${error.message}`);
  }
};

module.exports = { processTasks };
