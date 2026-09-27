import React from 'react';
import {
  CloudRain,
  Waves,
  Droplets,
  Mountain,
  History,
  Thermometer,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  CloudLightning,
  SunMedium,
  CheckCircle2
} from 'lucide-react';
import { EnvironmentalData } from '../types';

interface EnvironmentalInputPanelProps {
  data: EnvironmentalData;
  onChange: (newData: EnvironmentalData) => void;
  onReset: () => void;
  onApplyPreset: (type: 'nominal' | 'heavy' | 'cloudburst') => void;
}

export const EnvironmentalInputPanel: React.FC<EnvironmentalInputPanelProps> = ({
  data,
  onChange,
  onReset,
  onApplyPreset,
}) => {
  const updateField = <K extends keyof EnvironmentalData>(key: K, value: EnvironmentalData[K]) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      {/* Header and Quick Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Multi-Source Ingestion Telemetry
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Environmental Data Inputs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Adjust synthetic input sliders to observe instantaneous risk recalculation and catchment response.
          </p>
        </div>

        {/* Quick Scenario Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Presets:</span>
          <button
            onClick={() => onApplyPreset('nominal')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Baseline Normal
          </button>
          <button
            onClick={() => onApplyPreset('heavy')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
          >
            Monsoon Downpour
          </button>
          <button
            onClick={() => onApplyPreset('cloudburst')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md border border-red-300 dark:border-red-800/80 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-1"
          >
            <CloudLightning className="w-3 h-3 text-red-500" />
            <span>Cloudburst Surge</span>
          </button>
          <button
            onClick={onReset}
            className="p-1.5 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            title="Reset to default initial values"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of multi-source input cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* 1. Rainfall Section */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-cyan-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rainfall Metrics</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
              IMD AWS
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Rainfall Intensity</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {data.rainfallIntensity} mm/hr
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              step="1"
              value={data.rainfallIntensity}
              onChange={(e) => updateField('rainfallIntensity', Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 (Dry)</span>
              <span>50 (Heavy)</span>
              <span>100+ (Cloudburst)</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">24h Cumulative Precipitation</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {data.cumulativeRainfall24h} mm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="350"
              step="5"
              value={data.cumulativeRainfall24h}
              onChange={(e) => updateField('cumulativeRainfall24h', Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 2. River / Water Level Section */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">River Hydrodynamics</h3>
            </div>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
              CWC Gauge
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Current Gauge Level</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {data.riverLevel.toFixed(1)} m
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.1"
              value={data.riverLevel}
              onChange={(e) => updateField('riverLevel', Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.5m (Base)</span>
              <span>Danger: {data.riverDangerMark}m</span>
              <span>8.0m (Extreme)</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Rate of Rise</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {data.riverRateOfRise >= 0 ? `+${data.riverRateOfRise.toFixed(1)}` : data.riverRateOfRise.toFixed(1)} m/hr
              </span>
            </div>
            <input
              type="range"
              min="-1.0"
              max="2.5"
              step="0.1"
              value={data.riverRateOfRise}
              onChange={(e) => updateField('riverRateOfRise', Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Soil Moisture Section */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Soil Saturation</h3>
            </div>
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
              ISRO RISAT
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Soil Moisture Profile</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {data.soilMoisture.toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={data.soilMoisture}
              onChange={(e) => updateField('soilMoisture', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% (Porous)</span>
              <span>75% (Field Cap)</span>
              <span>100% (Runoff 1.0)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
            <span className="font-semibold">Hydrological Insight: </span>
            {data.soilMoisture > 80
              ? 'Soil is supersaturated. Rainfall causes instantaneous 90%+ surface overland runoff.'
              : 'Soil profile has retention capacity. Infiltration cushions initial stream discharge.'}
          </div>
        </div>

        {/* 4. Weather & Atmosphere */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Weather & Forecast</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              Nowcast
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-600 dark:text-slate-400 block">Forecast Condition</label>
            <select
              value={data.forecastCondition}
              onChange={(e) => updateField('forecastCondition', e.target.value as any)}
              className="w-full text-xs font-medium p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Clear">Clear Skies / Post-Monsoon</option>
              <option value="Scattered Showers">Scattered Mountain Showers</option>
              <option value="Heavy Monsoon">Heavy Monsoon Depressions</option>
              <option value="Torrential Downpour">Torrential Downpour (&gt;50mm)</option>
              <option value="Cloudburst Event">Orographic Cloudburst Surge</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-[11px] text-slate-500 block">Temp: {data.temperature}°C</span>
              <input
                type="range"
                min="5"
                max="35"
                value={data.temperature}
                onChange={(e) => updateField('temperature', Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Humidity: {data.humidity}%</span>
              <input
                type="range"
                min="30"
                max="100"
                value={data.humidity}
                onChange={(e) => updateField('humidity', Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          </div>
        </div>

        {/* 5. Terrain & Topography */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Terrain & Gradient</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              CartoSAT DEM
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Catchment Slope Gradient</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {data.slopePercentage}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              step="1"
              value={data.slopePercentage}
              onChange={(e) => updateField('slopePercentage', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>5% (Gentle)</span>
              <span>35% (Valley)</span>
              <span>70% (Steep Ravine)</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-600 dark:text-slate-400">Elevation</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {data.elevation} m MSL
            </span>
          </div>
        </div>

        {/* 6. Historical Data */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-purple-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Historical Calibration</h3>
            </div>
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
              CWC Atlas
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-600 dark:text-slate-400 block">Past Flood Occurrence</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Rare', 'Occasional', 'Frequent'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => updateField('previousFloodOccurrence', freq)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors ${
                    data.previousFloodOccurrence === freq
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Historical Peak Intensity</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {data.historicalRainfallIntensity} mm/hr
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              value={data.historicalRainfallIntensity}
              onChange={(e) => updateField('historicalRainfallIntensity', Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
