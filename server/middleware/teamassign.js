/*

const assignteam = async () => {
  try {
    const query = ` 
      SELECT id 
      FROM ${tableName.tasks} 
      WHERE isactive = 0 AND team_id IS NULL;
    `;

    // Get a connection from the pool
    const connection = await new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) reject(err);
        else resolve(conn);
      });
    });

    try {
      // Fetch unassigned tasks
      const tasks = await new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      const taskIds = tasks.map((row) => row.id); // Get task IDs
      const taskCount = taskIds.length;

      if (taskCount > 0) {
        const teamQuery = `
          SELECT id 
          FROM ${tableName.team} 
          WHERE isactive = 0;
        `;

        // Fetch all active teams
        const teams = await new Promise((resolve, reject) => {
          connection.query(teamQuery, (err, results) => {
            if (err) reject(err);
            else resolve(results);
          });
        });

        const teamIds = teams.map((row) => row.id); // Get team IDs
        const totalTeams = teamIds.length;

        if (totalTeams > 0) {
          // Calculate the number of teams required
          const teamsRequired = Math.min(
            Math.ceil(taskCount / 5), // Each team can handle up to 5 tasks
            totalTeams // Limit to the number of available teams
          );

          const selectedTeams = teamIds.slice(0, teamsRequired); // Select required teams
          logWithOptionalBroadcast('info',
            `Assigning ${taskCount} tasks among ${teamsRequired} teams (${selectedTeams.join(", ")}).`
          );

          // Initialize task counters for each selected team
          const teamTaskCount = Array(teamsRequired).fill(0);
          let teamIndex = 0; // Start with the first team
          const unassignedTasks = []; // Track unassigned tasks

          // Assign tasks
          for (const taskId of taskIds) {
            let assigned = false;

            // Attempt to assign the task to a team
            for (let i = 0; i < teamsRequired; i++) {
              if (teamTaskCount[teamIndex] < 5) {
                const teamId = selectedTeams[teamIndex];

                const assignQuery = `
                  UPDATE ${tableName.tasks} 
                  SET team_id = ${teamId} 
                  WHERE id = ${taskId};
                `;

                // Perform the assignment
                await new Promise((resolve, reject) => {
                  connection.query(assignQuery, (err) => {
                    if (err) {
                      logWithOptionalBroadcast('error',
                        `Error assigning task ${taskId} to team ${teamId}:`,
                        err
                      );
                      reject(err);
                    } else {
                      teamTaskCount[teamIndex]++; // Increment the count for the team
                      logWithOptionalBroadcast('info',
                        `Task ${taskId} assigned to Team ${teamId} (Tasks assigned: ${teamTaskCount[teamIndex]})`
                      );
                      assigned = true;
                      resolve();
                    }
                  });
                });

                break; // Exit loop once task is assigned
              }

              // Move to the next team
              teamIndex = (teamIndex + 1) % teamsRequired;
            }

            if (!assigned) {
              unassignedTasks.push(taskId); // Track unassigned task
            }
          }

          // Log unassigned tasks
          if (unassignedTasks.length > 0) {
            logWithOptionalBroadcast('info',
              `The following tasks could not be assigned: ${unassignedTasks.join(", ")}`
            );
          }
        } else {
          logWithOptionalBroadcast('info',"No teams available. Tasks will remain unassigned.");
        }
      } else {
        logWithOptionalBroadcast('info',"No tasks with upcoming services.");
      }
    } finally {
      connection.release(); // Ensure the connection is released
    }
  } catch (error) {
    logWithOptionalBroadcast('error',"Error in assignteam function:", error.message);
  }
};

module.exports = { assignteam };*/

/*const assignteam = async () => {
  try {
    const query = `
      SELECT id 
      FROM ${tableName.tasks} 
      WHERE isactive = 0 AND team_id IS NULL;
    `;

    // Get a connection from the pool
    const connection = await new Promise((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) reject(err);
        else resolve(conn);
      });
    });

    try {
      // Fetch unassigned tasks
      const tasks = await new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      const taskIds = tasks.map((row) => row.id); // Get task IDs
      const taskCount = taskIds.length;

      if (taskCount > 0) {
        const teamQuery = `
          SELECT id 
          FROM ${tableName.team} 
          WHERE isactive = 0;
        `;

        // Fetch all active teams
        const teams = await new Promise((resolve, reject) => {
          connection.query(teamQuery, (err, results) => {
            if (err) reject(err);
            else resolve(results);
          });
        });

        const teamIds = teams.map((row) => row.id); // Get team IDs
        const totalTeams = teamIds.length;

        if (totalTeams > 0) {
          // Calculate the number of teams required
          const teamsRequired = Math.min(
            Math.ceil(taskCount / 5), // Each team can handle up to 5 tasks
            totalTeams // Limit to the number of available teams
          );

          const selectedTeams = teamIds.slice(0, teamsRequired); // Select required teams
          logWithOptionalBroadcast('info',
            `Assigning ${taskCount} tasks among ${teamsRequired} teams (${selectedTeams.join(", ")}).`
          );

          // Initialize task counters for each selected team
          const teamTaskCount = Array(teamsRequired).fill(0);
          let teamIndex = 0; // Start with the first team
          const unassignedTasks = []; // Track unassigned tasks

          // Assign tasks in proper round-robin fashion
          for (const taskId of taskIds) {
            let assigned = false;

            // Attempt to assign the task to a team
            for (let i = 0; i < teamsRequired; i++) {
              if (teamTaskCount[teamIndex] < 5) {
                const teamId = selectedTeams[teamIndex];

                const assignQuery = `
                  UPDATE ${tableName.tasks} 
                  SET team_id = ${teamId} 
                  WHERE id = ${taskId};
                `;

                // Perform the assignment
                await new Promise((resolve, reject) => {
                  connection.query(assignQuery, (err) => {
                    if (err) {
                      logWithOptionalBroadcast('error',
                        `Error assigning task ${taskId} to team ${teamId}:`,
                        err
                      );
                      reject(err);
                    } else {
                      teamTaskCount[teamIndex]++; // Increment the count for the team
                      logWithOptionalBroadcast('info',
                        `Task ${taskId} assigned to Team ${teamId} (Tasks assigned: ${teamTaskCount[teamIndex]})`
                      );
                      assigned = true;
                      resolve();
                    }
                  });
                });

                // Move to the next team
                teamIndex = (teamIndex + 1) % teamsRequired;
                break; // Exit loop once task is assigned
              }

              // Move to the next team in round-robin fashion
              teamIndex = (teamIndex + 1) % teamsRequired;
            }

            if (!assigned) {
              unassignedTasks.push(taskId); // Track unassigned task
            }
          }

          // Log unassigned tasks
          if (unassignedTasks.length > 0) {
            logWithOptionalBroadcast('info',
              `The following tasks could not be assigned: ${unassignedTasks.join(", ")}`
            );
          }
        } else {
          logWithOptionalBroadcast('info',"No teams available. Tasks will remain unassigned.");
        }
      } else {
        logWithOptionalBroadcast('info',"No tasks with upcoming services.");
      }
    } finally {
      connection.release(); // Ensure the connection is released
    }
  } catch (error) {
    logWithOptionalBroadcast('error',"Error in assignteam function:", error.message);
  }
};

module.exports = { assignteam };*/

const { performQuery } = require("../Utils/performQuery");
const tableName = require("../Utils/allTableNames");
const { logWithOptionalBroadcast } = require("../logger");


const assignteam = async (pool) => {
  try {
    const taskQuery = `
      SELECT id 
      FROM ${tableName.tasks} 
      WHERE isactive = 0 AND team_id IS NULL;
    `;

    // Fetch unassigned tasks
    const tasks = await performQuery({
      sql: taskQuery,
      params: [],
      pool,
    });

    const taskIds = tasks.map((row) => row.id); // Get task IDs
    const taskCount = taskIds.length;

    if (taskCount > 0) {
      const teamQuery = `
        SELECT id 
        FROM ${tableName.team} 
        WHERE isactive = 0;
      `;

      // Fetch all active teams
      const teams = await performQuery({
        sql: teamQuery,
        params: [],
        pool,
      });

      const teamIds = teams.map((row) => row.id); // Get team IDs
      const totalTeams = teamIds.length;

      if (totalTeams > 0) {
        // Calculate the number of teams required
        const teamsRequired = Math.min(
          Math.ceil(taskCount / 5), // Each team can handle up to 5 tasks
          totalTeams // Limit to the number of available teams
        );

        const selectedTeams = teamIds.slice(0, teamsRequired); // Select required teams
        logWithOptionalBroadcast('info',
          `Assigning ${taskCount} tasks among ${teamsRequired} teams (${selectedTeams.join(", ")}).`
        );

        // Initialize task counters for each selected team
        const teamTaskCount = Array(teamsRequired).fill(0);
        let teamIndex = 0; // Start with the first team
        const unassignedTasks = []; // Track unassigned tasks

        // Assign tasks in round-robin fashion
        for (const taskId of taskIds) {
          let assigned = false;

          // Attempt to assign the task to a team
          for (let i = 0; i < teamsRequired; i++) {
            if (teamTaskCount[teamIndex] < 5) {
              const teamId = selectedTeams[teamIndex];

              const assignQuery = `
                UPDATE ${tableName.tasks} 
                SET team_id = ? 
                WHERE id = ?;
              `;

              try {
                // Perform the assignment
                await performQuery({
                  sql: assignQuery,
                  params: [teamId, taskId],
                  pool,
                });

                teamTaskCount[teamIndex]++; // Increment the count for the team
                logWithOptionalBroadcast('info',
                  `Task ${taskId} assigned to Team ${teamId} (Tasks assigned: ${teamTaskCount[teamIndex]})`,true
                );
                assigned = true;
              } catch (err) {
                logWithOptionalBroadcast('error',
                  `Error assigning task ${taskId} to team ${teamId}:`,
                  err.message
                );
              }

              // Move to the next team
              teamIndex = (teamIndex + 1) % teamsRequired;
              break; // Exit loop once task is assigned
            }

            // Move to the next team in round-robin fashion
            teamIndex = (teamIndex + 1) % teamsRequired;
          }

          if (!assigned) {
            unassignedTasks.push(taskId); // Track unassigned task
          }
        }

        // Log unassigned tasks
        if (unassignedTasks.length > 0) {
          logWithOptionalBroadcast('info',
            `The following tasks could not be assigned: ${unassignedTasks.join(", ")}`,true
          );
        }
      } else {
        logWithOptionalBroadcast('info',"No teams available. Tasks will remain unassigned.");
      }
    } else {
      logWithOptionalBroadcast('info',"No tasks with upcoming services.");
    }
  } catch (error) {
    logWithOptionalBroadcast('error',`Error in assignteam function:", ${error.message}`);
  }
};

module.exports = { assignteam };

