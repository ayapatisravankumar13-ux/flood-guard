import React from 'react';
import { ShieldCheck, AlertCircle, Info, Activity, Gauge } from 'lucide-react';
import { RiskLevel } from '../types';
import { CalculationResult, getRiskColorClass } from '../utils/floodAlgorithm';

interface RiskScoreGaugeProps {
  calculation: CalculationResult;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ calculation }) => {
  const { score, level, confidence, explanation, primaryDrivers } = calculation;
  const riskColor = getRiskColorClass(level);

  // SVG Gauge calculations
  // Angle range: -120 deg to +120 deg (total 240 deg sweep)
  const minAngle = -120;
  const maxAngle = 120;
  const currentAngle = minAngle + (score / 100) * (maxAngle - minAngle);

  // Radius and center for SVG
  const radius = 90;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // Sweep is 240 degrees out of 360 = 2/3 of circle
  const arcLength = (240 / 360) * circumference;
  const progressOffset = arcLength - (score / 100) * arcLength;

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            AI Hydrological Assessment
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CURRENT FLOOD RISK SCORE
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Model Confidence:
          </span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            {confidence}% (Ensemble Validated)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Dial Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-64 h-52 flex items-center justify-center">
            <svg
              className="w-64 h-64 transform -rotate-90"
              viewBox="0 0 240 240"
            >
              {/* Background calibrated track */}
              <circle
                cx="120"
                cy="120"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={-((360 - 240) / 2 / 360) * circumference}
                strokeLinecap="round"
                className="text-slate-100 dark:text-slate-800"
              />

              {/* Color segments reference (subtle dotted background or active stroke) */}
              <circle
                cx="120"
                cy="120"
                r={radius}
                fill="none"
                stroke="url(#riskGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={
                  -((360 - 240) / 2 / 360) * circumference + (arcLength - (score / 100) * arcLength)
                }
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />

              <defs>
                <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="35%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Score readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 text-center pointer-events-none">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Composite Index
              </span>
              <div className="flex items-baseline">
                <span className="text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                  {score}
                </span>
                <span className="text-xl font-bold text-slate-400 ml-1">
                  / 100
                </span>
              </div>
              <span className={`text-sm font-extrabold tracking-wide uppercase px-2.5 py-0.5 rounded-full mt-1 ${riskColor.badge}`}>
                {level} RISK
              </span>
            </div>
          </div>

          {/* Scale Legend */}
          <div className="grid grid-cols-4 gap-1 w-full max-w-xs mt-[-10px] text-center text-[10px] font-mono">
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
              0–25 LOW
            </div>
            <div className="p-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold">
              26–50 MOD
            </div>
            <div className="p-1 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-semibold">
              51–75 HIGH
            </div>
            <div className="p-1 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold">
              76–100 CRIT
            </div>
          </div>
        </div>

        {/* Right: Explanation & Factor Drivers */}
        <div className="md:col-span-7 space-y-4">
          <div className={`p-4 rounded-xl border ${riskColor.border} ${riskColor.bg}`}>
            <div className="flex items-start gap-2.5">
              <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${riskColor.text}`} />
              <div className="space-y-1">
                <h3 className={`text-sm font-bold ${riskColor.text}`}>
                  Hydrological Risk Explanation
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Key Drivers Pill-free list */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Warning Triggers
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {primaryDrivers.map((driver, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    level === 'CRITICAL' ? 'bg-red-500' :
                    level === 'HIGH' ? 'bg-orange-500' :
                    level === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span className="font-medium truncate">{driver}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prototype Guidance Tag */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Algorithm: Hydrologic Runoff Index + Topographic Kinematics</span>
            <span className="font-mono">Early Warning System</span>
          </div>
        </div>
      </div>
    </div>
  );
};
