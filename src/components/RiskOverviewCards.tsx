import React from 'react';
import {
  ShieldAlert,
  CloudRain,
  Waves,
  Droplets,
  TrendingUp,
  TrendingDown,
  Clock,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { EnvironmentalData, RiskLevel } from '../types';
import { getRiskColorClass } from '../utils/floodAlgorithm';

interface RiskOverviewCardsProps {
  envData: EnvironmentalData;
  riskScore: number;
  riskLevel: RiskLevel;
}

export const RiskOverviewCards: React.FC<RiskOverviewCardsProps> = ({
  envData,
  riskScore,
  riskLevel,
}) => {
  const riskColor = getRiskColorClass(riskLevel);

  return (
    <div className="space-y-3">
      {/* Simulation/Demo Notice Banner */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
          <span>
            <strong>Simulated Telemetry:</strong> Multi-source synthetic parameters modeled on Uttarakhand Himalayan catchment dynamics for early warning assessment.
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 shrink-0">
          Refreshed: Live In-Memory
        </span>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Current Risk Card */}
        <div className={`p-4 rounded-xl border ${riskColor.border} bg-white dark:bg-slate-900/90 shadow-sm transition-all relative overflow-hidden`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Current Risk
            </span>
            <div className={`p-2 rounded-lg ${riskColor.bg}`}>
              <ShieldAlert className={`w-4 h-4 ${riskColor.text}`} />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${riskColor.text}`}>
              {riskLevel}
            </span>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              ({riskScore}/100)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1">
              <TrendingUp className={`w-3.5 h-3.5 ${riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'text-red-500' : 'text-slate-400'}`} />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {riskLevel === 'CRITICAL' ? 'Surge Escalating' : riskLevel === 'HIGH' ? 'Elevated Hazard' : 'Stable Margin'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <Clock className="w-3 h-3" />
              <span>Just now</span>
            </div>
          </div>
        </div>

        {/* 2. Rainfall Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rainfall Intensity
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
              {envData.rainfallIntensity.toFixed(0)}
            </span>
            <span className="text-sm font-semibold text-slate-500">mm/hr</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1">
              {envData.rainfallIntensity > 50 ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
              ) : envData.rainfallIntensity > 25 ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Minus className="w-3.5 h-3.5 text-emerald-500" />
              )}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {envData.rainfallIntensity > 65 ? 'Cloudburst Rate' : envData.rainfallIntensity > 30 ? 'Heavy Monsoon' : 'Light Infiltration'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              24h: {envData.cumulativeRainfall24h}mm
            </span>
          </div>
        </div>

        {/* 3. River Level Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              River Gauge Level
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Waves className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
              {envData.riverLevel.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-slate-500">m</span>
            <span className="text-xs font-mono font-medium text-blue-500">
              {envData.riverRateOfRise >= 0 ? `+${envData.riverRateOfRise.toFixed(1)}m/h ↑` : `${envData.riverRateOfRise.toFixed(1)}m/h ↓`}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Danger: {envData.riverDangerMark.toFixed(1)}m
            </span>
            <span className={`text-[11px] font-semibold ${
              envData.riverLevel >= envData.riverDangerMark ? 'text-red-500' : 'text-slate-400'
            }`}>
              {envData.riverLevel >= envData.riverDangerMark ? 'OVER DANGER' : `${((envData.riverLevel / envData.riverDangerMark) * 100).toFixed(0)}% Capacity`}
            </span>
          </div>
        </div>

        {/* 4. Soil Moisture Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Soil Saturation
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Droplets className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
              {envData.soilMoisture.toFixed(0)}
            </span>
            <span className="text-sm font-semibold text-slate-500">%</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {envData.soilMoisture > 85 ? 'Saturated (High Runoff)' : envData.soilMoisture > 65 ? 'High Moisture' : 'Porous Infiltration'}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              API Index: High
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
