import { EnvironmentalData, RiskLevel } from '../types';

export interface CalculationResult {
  score: number; // 0 - 100
  level: RiskLevel;
  confidence: number; // 0 - 100%
  primaryDrivers: string[];
  explanation: string;
  featureWeights: {
    rainfall: number;
    riverRise: number;
    soilSaturation: number;
    slopeGradient: number;
    historicalRecurrence: number;
  };
}

export function calculateFloodRisk(data: EnvironmentalData): CalculationResult {
  // 1. Rainfall Component (Weight ~ 35%)
  // Normalized: 0 mm/hr -> 0, 100+ mm/hr -> 100
  const rainfallNorm = Math.min(100, (data.rainfallIntensity / 100) * 100);

  // 2. River Level & Rate of Rise Component (Weight ~ 30%)
  // Danger mark proximity + positive surge
  const dangerRatio = Math.min(1.2, data.riverLevel / data.riverDangerMark);
  const surgeFactor = Math.max(0, data.riverRateOfRise * 20); // +1m/hr is very significant
  const riverNorm = Math.min(100, (dangerRatio * 60) + surgeFactor);

  // 3. Soil Saturation Component (Weight ~ 18%)
  // When soil is > 80% saturated, almost 100% of rain turns to direct surface runoff
  let soilNorm = 0;
  if (data.soilMoisture < 50) {
    soilNorm = data.soilMoisture * 0.4;
  } else if (data.soilMoisture < 80) {
    soilNorm = 20 + (data.soilMoisture - 50) * 1.33;
  } else {
    soilNorm = 60 + (data.soilMoisture - 80) * 2.0; // rapidly escalates
  }
  soilNorm = Math.min(100, soilNorm);

  // 4. Terrain & Slope Factor (Weight ~ 12%)
  // Steep slope (>30%) causes rapid kinetic runoff accumulation in valley floors
  const slopeNorm = Math.min(100, (data.slopePercentage / 50) * 100);

  // 5. Historical Recurrence Factor (Weight ~ 5%)
  const historyNorm = data.previousFloodOccurrence === 'Frequent' ? 85 : data.previousFloodOccurrence === 'Occasional' ? 50 : 20;

  // Composite Weighted Score
  const rawScore = (
    rainfallNorm * 0.35 +
    riverNorm * 0.30 +
    soilNorm * 0.18 +
    slopeNorm * 0.12 +
    historyNorm * 0.05
  );

  const score = Math.round(Math.max(0, Math.min(100, rawScore)));

  // Determine Risk Level
  let level: RiskLevel = 'LOW';
  if (score >= 76) {
    level = 'CRITICAL';
  } else if (score >= 51) {
    level = 'HIGH';
  } else if (score >= 26) {
    level = 'MODERATE';
  } else {
    level = 'LOW';
  }

  // Identify primary drivers
  const drivers: string[] = [];
  if (data.rainfallIntensity >= 60) {
    drivers.push(`Torrential precipitation (${data.rainfallIntensity.toFixed(0)} mm/hr)`);
  } else if (data.rainfallIntensity >= 35) {
    drivers.push(`Heavy rainfall intensity (${data.rainfallIntensity.toFixed(0)} mm/hr)`);
  }

  if (data.riverRateOfRise >= 0.5) {
    drivers.push(`Rapid river rise (+${data.riverRateOfRise.toFixed(1)} m/hr)`);
  } else if (data.riverLevel >= data.riverDangerMark * 0.85) {
    drivers.push(`River nearing danger mark (${data.riverLevel.toFixed(1)}m / ${data.riverDangerMark}m)`);
  }

  if (data.soilMoisture >= 85) {
    drivers.push(`Saturated soil profile (${data.soilMoisture.toFixed(0)}%) with zero infiltration margin`);
  }

  if (data.slopePercentage >= 40) {
    drivers.push(`High slope catchment (${data.slopePercentage}%) accelerating runoff velocity`);
  }

  if (drivers.length === 0) {
    drivers.push('Stable hydrological parameters within baseline thresholds');
  }

  // Formulate natural language explanation
  let explanation = '';
  if (level === 'CRITICAL') {
    explanation = `Critical flash flood warning triggered. Extreme risk caused by ${drivers.join(', ')}. Runoff lag time is compressed to under 45 minutes in downstream gorges. Immediate life-safety actions required.`;
  } else if (level === 'HIGH') {
    explanation = `Risk is elevated due to ${drivers.join(', ')}. Water accumulation in tributary channels is accelerating towards peak discharge.`;
  } else if (level === 'MODERATE') {
    explanation = `Moderate flood vulnerability observed. Elevated parameters (${drivers.slice(0, 2).join(' and ')}) warrant active catchment surveillance and emergency responder standby.`;
  } else {
    explanation = `Hydrological conditions are currently stable. Catchment retention capacity is nominal across surveyed river reaches with low probability of flash flooding.`;
  }

  // Simulated ML model confidence (higher with consistent signals)
  const confidence = Math.min(98, Math.max(82, Math.round(85 + (score > 80 || score < 20 ? 10 : 0) - Math.abs(rainfallNorm - riverNorm) * 0.1)));

  return {
    score,
    level,
    confidence,
    primaryDrivers: drivers,
    explanation,
    featureWeights: {
      rainfall: Math.round(rainfallNorm),
      riverRise: Math.round(riverNorm),
      soilSaturation: Math.round(soilNorm),
      slopeGradient: Math.round(slopeNorm),
      historicalRecurrence: Math.round(historyNorm),
    },
  };
}

export function getRiskColorClass(level: RiskLevel): {
  text: string;
  bg: string;
  border: string;
  badge: string;
  glow: string;
} {
  switch (level) {
    case 'CRITICAL':
      return {
        text: 'text-red-500 dark:text-red-400',
        bg: 'bg-red-500/10 dark:bg-red-950/30',
        border: 'border-red-500/40',
        badge: 'bg-red-600 text-white',
        glow: 'shadow-red-500/20',
      };
    case 'HIGH':
      return {
        text: 'text-orange-500 dark:text-orange-400',
        bg: 'bg-orange-500/10 dark:bg-orange-950/30',
        border: 'border-orange-500/40',
        badge: 'bg-orange-500 text-white',
        glow: 'shadow-orange-500/20',
      };
    case 'MODERATE':
      return {
        text: 'text-amber-500 dark:text-amber-400',
        bg: 'bg-amber-500/10 dark:bg-amber-950/30',
        border: 'border-amber-500/40',
        badge: 'bg-amber-500 text-slate-950',
        glow: 'shadow-amber-500/20',
      };
    case 'LOW':
    default:
      return {
        text: 'text-emerald-500 dark:text-emerald-400',
        bg: 'bg-emerald-500/10 dark:bg-emerald-950/30',
        border: 'border-emerald-500/40',
        badge: 'bg-emerald-600 text-white',
        glow: 'shadow-emerald-500/20',
      };
  }
}
