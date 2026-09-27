import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Flood Guard backend is working!"
    });
});

app.post("/api/predictions", (req, res) => {
    const {
        location,
        rainfall,
        waterLevel,
        soilMoisture,
        riskScore,
        riskLevel,
    } = req.body;

    console.log("=== FLOOD GUARD PREDICTION ===");
    console.log("Location:", location);
    console.log("Rainfall:", rainfall, "mm/hr");
    console.log("Water Level:", waterLevel, "m");
    console.log("Soil Moisture:", soilMoisture, "%");
    console.log("Risk Score:", riskScore);
    console.log("Risk Level:", riskLevel);

    res.json({
        success: true,
        message: "Prediction received successfully",
        data: {
            location,
            rainfall,
            waterLevel,
            soilMoisture,
            riskScore,
            riskLevel,
        },
    });
});
// --------------------------------------------------
// START FLOOD GUARD SERVER
// --------------------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("======================================");
    console.log("   FLOOD GUARD BACKEND IS RUNNING");
    console.log("======================================");
    console.log(`Backend: http://localhost:${PORT}`);
    console.log(`Health:  http://localhost:${PORT}/api/health`);
    console.log(`Prediction: http://localhost:${PORT}/api/predictions`);
    console.log("======================================");
    console.log("");
});