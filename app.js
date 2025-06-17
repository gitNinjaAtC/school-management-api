// app.js
require("dotenv").config(); // Load environment variables
const express = require("express");
const { promisePool, initializeDatabase } = require("./db");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database and start server
initializeDatabase()
  .then(() => {
    // Your routes here...
    app.post("/addSchool", async (req, res) => {
      try {
        const { name, address, latitude, longitude } = req.body;

        // Validation and insertion logic...
      } catch (error) {
        // Error handling...
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
