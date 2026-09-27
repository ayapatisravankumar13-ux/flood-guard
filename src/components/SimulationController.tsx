import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Radio,
  AlertTriangle,
  Flame,
  CloudLightning,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { EnvironmentalData, RiskLevel } from '../types';

interface SimulationControllerProps {
  isSimulating: boolean;
  onToggleSimulating: () => void;
  onResetSimulation: () => void;
  currentPhaseIndex: number;
  onSelectPhase: (phaseIdx: number) => void;
  currentRiskLevel: RiskLevel;
  currentRiskScore: number;
}

export const SIMULATION_PHASES = [
  {
    phase: 0,
    name: 'Phase 1: Dry / Baseline',
    level: 'LOW' as RiskLevel,
    desc: 'Normal pre-monsoon baseline. Catchment retention is high and river channels operate at baseflow.',
    data: {
      rainfallIntensity: 12,
      cumulativeRainfall24h: 24,
      riverLevel: 1.8,
      riverRateOfRise: 0.0,
      soilMoisture: 42,
      forecastCondition: 'Clear' as const,
      slopePercentage: 42,
    },
  },
  {
    phase: 1,
    name: 'Phase 2: Monsoon Ingress',
    level: 'MODERATE' as RiskLevel,
    desc: 'Steady orographic showers. Soil saturation ascends past 70% with moderate tributary runoff.',
    data: {
      rainfallIntensity: 42,
      cumulativeRainfall24h: 88,
      riverLevel: 3.4,
      riverRateOfRise: 0.3,
      soilMoisture: 72,
      forecastCondition: 'Heavy Monsoon' as const,
      slopePercentage: 42,
    },
  },
  {
    phase: 2,
    name: 'Phase 3: Heavy Valley Storm',
    level: 'HIGH' as RiskLevel,
    desc: 'Torrential downpour. Soil is 88% saturated, river climbs near danger mark with rapid flow velocity.',
    data: {
      rainfallIntensity: 78,
      cumulativeRainfall24h: 165,
      riverLevel: 4.7,
      riverRateOfRise: 0.6,
      soilMoisture: 88,
      forecastCondition: 'Torrential Downpour' as const,
      slopePercentage: 42,
    },
  },
  {
    phase: 3,
    name: 'Phase 4: Cloudburst Flash Flood',
    level: 'CRITICAL' as RiskLevel,
    desc: 'Catastrophic cloudburst. 118 mm/hr rainfall, river overtopping danger mark, zero infiltration margin.',
    data: {
      rainfallIntensity: 118,
      cumulativeRainfall24h: 240,
      riverLevel: 5.7,
      riverRateOfRise: 1.2,
      soilMoisture: 98,
      forecastCondition: 'Cloudburst Event' as const,
      slopePercentage: 48,
    },
  },
];

export const SimulationController: React.FC<SimulationControllerProps> = ({
  isSimulating,
  onToggleSimulating,
  onResetSimulation,
  currentPhaseIndex,
  onSelectPhase,
  currentRiskLevel,
  currentRiskScore,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const currentPhase = SIMULATION_PHASES[currentPhaseIndex] || SIMULATION_PHASES[0];

  return (
    <aside
      aria-label="Flood Event Simulation Controller"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 transition-all duration-300"
    >
      <div className="rounded-2xl border border-cyan-500/50 bg-white/95 dark:bg-slate-950/95 text-slate-900 dark:text-white backdrop-blur-md shadow-2xl p-4 space-y-3">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                SIMULATION MODE — DEMO DATA
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Disaster Early Warning Sequence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Current Phase Details */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  {currentPhase.name}
                </span>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                  currentPhase.level === 'CRITICAL' ? 'bg-red-600 text-white' :
                  currentPhase.level === 'HIGH' ? 'bg-orange-500 text-white' :
                  currentPhase.level === 'MODERATE' ? 'bg-amber-500 text-slate-950' :
                  'bg-emerald-600 text-white'
                }`}>
                  {currentPhase.level} ({currentRiskScore}/100)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                {currentPhase.desc}
              </p>
            </div>

            {/* Stepper buttons (LOW -> MODERATE -> HIGH -> CRITICAL) */}
            <div className="grid grid-cols-4 gap-1">
              {SIMULATION_PHASES.map((p, idx) => (
                <button
                  key={p.phase}
                  onClick={() => onSelectPhase(idx)}
                  className={`py-1.5 px-1 rounded text-[10px] font-mono font-semibold transition-all ${
                    currentPhaseIndex === idx
                      ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  P{idx + 1}: {p.level.slice(0, 4)}
                </button>
              ))}
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={onToggleSimulating}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isSimulating
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                {isSimulating ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Flow</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Auto Simulation</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSelectPhase((currentPhaseIndex + 1) % SIMULATION_PHASES.length)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  title="Next Simulation Phase"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onResetSimulation}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  title="Reset Simulation to Baseline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
