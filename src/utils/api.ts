const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";
export interface FloodPrediction {
    location: string;
    rainfall: number;
    waterLevel: number;
    soilMoisture: number;
    riskScore: number;
    riskLevel: string;
}

export async function sendPrediction(
    prediction: FloodPrediction
) {
    const response = await fetch(`${API_BASE_URL}/api/predictions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(prediction),
    });

    if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
    }

    return response.json();
}

export async function checkBackendHealth() {
    const response = await fetch(`${API_BASE_URL}/api/health`);

    if (!response.ok) {
        throw new Error("Backend is not available");
    }

    return response.json();
}