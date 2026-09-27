const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Flood Guard backend is working!"
    });
});

// Prediction API
app.post("/api/predict", (req, res) => {
    try {
        const {
            location,
            rainfall,
            waterLevel,
            soilMoisture,
            riverRateOfRise
        } = req.body;

        console.log("Prediction received:", req.body);

        const rainfallValue = Number(rainfall) || 0;
        const waterLevelValue = Number(waterLevel) || 0;
        const soilMoistureValue = Number(soilMoisture) || 0;
        const riseRateValue = Number(riverRateOfRise) || 0;

        let riskScore =
            rainfallValue * 0.35 +
            waterLevelValue * 10 * 0.25 +
            soilMoistureValue * 0.20 +
            riseRateValue * 10 * 0.20;

        riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

        let riskLevel = "LOW";

        if (riskScore >= 75) {
            riskLevel = "CRITICAL";
        } else if (riskScore >= 50) {
            riskLevel = "HIGH";
        } else if (riskScore >= 25) {
            riskLevel = "MODERATE";
        }

        res.json({
            success: true,
            message: "Prediction received successfully.",
            data: {
                location,
                rainfall: rainfallValue,
                waterLevel: waterLevelValue,
                soilMoisture: soilMoistureValue,
                riverRateOfRise: riseRateValue,
                riskScore,
                riskLevel,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("Prediction error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to process flood prediction.",
            error: error.message
        });
    }
});

// API information
app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "Flood Guard API is online.",
        endpoints: {
            health: "GET /api/health",
            prediction: "POST /api/predict"
        }
    });
});

// Serve production frontend
const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

// React fallback
app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("======================================");
    console.log("   FLOOD GUARD BACKEND IS RUNNING");
    console.log("======================================");
    console.log(`Backend: http://localhost:${PORT}`);
    console.log(`Health:  http://localhost:${PORT}/api/health`);
    console.log("======================================");
    console.log("");
});