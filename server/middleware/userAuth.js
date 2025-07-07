const jwt = require("jsonwebtoken");
const RESPONSE = require("../GlobalResponse/RESPONSE");
const tableNames = require("../Utils/allTableNames");
const pool = require("../Utils/db");
const { logWithOptionalBroadcast } = require("../logger");
const dotenv = require("dotenv");

dotenv.config();


module.exports = async (req, res, next) => {
  try {
    
    // Get the token from the Authorization header
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "User Not Authenticated" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decodedToken = jwt.verify(token,process.env.SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Validate user in the database
    pool.getConnection((err, connection) => {
      if (err) {
        return res.status(500).json(RESPONSE("Database connection error", {}));
      }

      connection.query(
        `SELECT * FROM ${tableNames.owners} WHERE id = ?`,
        [decodedToken.id],
        (err, result) => {
          connection.release(); // Always release the connection

          if (err) {
            return res.status(500).json(RESPONSE("Error querying database", {}));
          }

          if (result.length > 0) {
            // Attach user information to the request
            req.userId = decodedToken.id;
            req.userRole = result[0].role; // Example: Attach role if needed
            next(); // Proceed to the next middleware or route
          } else {
            return res.status(401).json({ message: "User Not Authenticated" });
          }
        }
      );
    });
  } catch (error) {
    logWithOptionalBroadcast('error',"Authentication error:", error.message);
    res.status(401).json({ message: "User Not Authenticated" });
  }
};
