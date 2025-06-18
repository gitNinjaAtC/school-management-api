const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { promisePool, initializeDatabase } = require("./db");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Initialize database when starting the server
initializeDatabase()
  .then(() => {
    //Add School API
    app.post("/addSchool", async (req, res) => {
      try {
        const { name, address, latitude, longitude } = req.body;

        // Validation
        if (
          !name ||
          !address ||
          latitude === undefined ||
          longitude === undefined
        ) {
          return res.status(400).json({ error: "All fields are required" });
        }

        if (isNaN(latitude) || isNaN(longitude)) {
          return res
            .status(400)
            .json({ error: "Latitude and longitude must be numbers" });
        }

        const [result] = await promisePool.query(
          "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
          [name, address, latitude, longitude]
        );

        res.status(201).json({
          message: "School added successfully",
          schoolId: result.insertId,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add school" });
      }
    });

    // List Schools API
    app.get("/listSchools", async (req, res) => {
      try {
        const { latitude, longitude } = req.query;

        // Validation
        if (latitude === undefined || longitude === undefined) {
          return res
            .status(400)
            .json({ error: "Latitude and longitude parameters are required" });
        }

        if (isNaN(latitude) || isNaN(longitude)) {
          return res
            .status(400)
            .json({ error: "Latitude and longitude must be numbers" });
        }

        const userLat = parseFloat(latitude);
        const userLng = parseFloat(longitude);

        const [schools] = await promisePool.query(
          "SELECT id, name, address, latitude, longitude FROM schools"
        );

        // Calculate distance for each school and sort
        const schoolsWithDistance = schools.map((school) => {
          const distance = calculateDistance(
            userLat,
            userLng,
            school.latitude,
            school.longitude
          );
          return { ...school, distance };
        });

        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.json(schoolsWithDistance);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch schools" });
      }
    });

    // Haversine formula (same as before)
    function calculateDistance(lat1, lon1, lat2, lon2) {
      // ... (same implementation as before)
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
