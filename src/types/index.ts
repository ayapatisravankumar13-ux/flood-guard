export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type UserRole = 'Authority' | 'Emergency Responder' | 'Analyst';

export interface EnvironmentalData {
  rainfallIntensity: number; // mm/hr (0 - 150)
  cumulativeRainfall24h: number; // mm (0 - 300)
  temperature: number; // °C (5 - 35)
  humidity: number; // % (20 - 100)
  forecastCondition: 'Clear' | 'Scattered Showers' | 'Heavy Monsoon' | 'Torrential Downpour' | 'Cloudburst Event';
  riverLevel: number; // meters (0 - 8m)
  riverRateOfRise: number; // m/hr (-1.0 to +3.0)
  riverDangerMark: number; // meters
  soilMoisture: number; // % saturation (10 - 100)
  elevation: number; // meters above sea level
  slopePercentage: number; // % gradient (5 - 70)
  previousFloodOccurrence: 'Rare' | 'Occasional' | 'Frequent';
  historicalRainfallIntensity: number; // mm/hr
}

export interface MonitoredZone {
  id: string;
  name: string;
  valley: string;
  state: string;
  latitude: number;
  longitude: number;
  elevation: number; // meters
  slope: number; // %
  currentRisk: RiskLevel;
  riskScore: number; // 0 - 100
  rainfall: number; // mm/hr
  riverLevel: number; // meters
  riverRateOfRise: number; // m/hr
  soilMoisture: number; // %
  catchmentAreaKm2: number;
  status: 'Online' | 'Telemetry Warning' | 'Maintenance';
  lastUpdated: string;
  recommendedAction: string;
  populationAtRisk: number;
}

export interface EarlyWarningAlert {
  id: string;
  level: RiskLevel;
  zoneId: string;
  locationName: string;
  timestamp: string;
  title: string;
  triggerReason: string;
  recommendedAction: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  broadcastSent?: boolean;
}

export interface TimeSeriesPoint {
  time: string; // e.g. "02:00", "04:00"
  rainfall: number;
  riverLevel: number;
  soilMoisture: number;
  riskScore: number;
}

export interface SimulationStep {
  step: number;
  phaseName: string;
  description: string;
  environmentalData: Partial<EnvironmentalData>;
}
