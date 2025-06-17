// db.js
const mysql = require("mysql2");
const { dbConfig } = require("./config"); // Import the configuration

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Create promise wrapper for the pool
const promisePool = pool.promise();

// Database initialization function
async function initializeDatabase() {
  try {
    await promisePool.query(`
      CREATE DATABASE IF NOT EXISTS ${dbConfig.database}
    `);

    await promisePool.query(`
      USE ${dbConfig.database}
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      )
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

module.exports = {
  promisePool,
  initializeDatabase,
};
