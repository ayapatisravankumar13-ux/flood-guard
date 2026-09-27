import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  CloudRain,
  Waves,
  Mountain,
  AlertTriangle,
  Zap,
  MapPin,
  ExternalLink,
  ChevronRight,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import { EnvironmentalData, RiskLevel } from '../types';

interface LandingHeroProps {
  onLaunchDashboard: () => void;
  onExploreHowItWorks: () => void;
  onRunSimulation: () => void;
  envData: EnvironmentalData;
  riskScore: number;
  riskLevel: RiskLevel;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchDashboard,
  onExploreHowItWorks,
  onRunSimulation,
  envData,
  riskScore,
  riskLevel,
}) => {
  return (
    <div className="relative overflow-hidden">
      {/* Subtle topographic background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        
        {/* Autonomous System Badge & Problem Focus */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>EARLY WARNING DISASTER PLATFORM</span>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Multi-Source Flash Flood Prediction System for Hilly Regions
          </span>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance">
                FLOOD GUARD AI
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-cyan-600 dark:text-cyan-400">
                AI-Powered Flash Flood Prediction & Early Warning System
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Predict flood risk earlier. Alert communities faster. Protect lives and infrastructure in high-altitude Himalayan valleys using multi-source sensor fusion.
            </p>

            {/* Metric proof items */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-y border-slate-200 dark:border-slate-800 py-4">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  45–90
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  min warning lead time
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-600 dark:text-cyan-400 tabular-nums">
                  92.4%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  ML model accuracy
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  8
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  monitored catchments
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchDashboard}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm shadow-md shadow-cyan-600/25 transition-all hover:translate-y-[-1px] focus-visible:outline-none"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreHowItWorks}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-sm transition-all focus-visible:outline-none"
              >
                <span>Explore How It Works</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onRunSimulation}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold text-xs transition-colors"
                title="Simulate cloudburst flash flood event"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Simulate Cloudburst Event</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Conforms to NDMA Common Alerting Protocol (CAP) and IMD nowcast standards.</span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Visual Composite */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-2xl">
              
              {/* Generated Terrain Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                <img
                  src="/src/assets/images/hero_hilly_flood_1790498512097.jpg"
                  alt="Himalayan hilly terrain during monsoon rainfall with hydrometric monitoring"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Floating telemetry pills & overlays */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-white text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono font-medium">AWS-Station 104 · Gaurikund</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-[11px] font-mono text-cyan-300">
                    <Mountain className="w-3 h-3 text-cyan-400" />
                    <span>Elevation 1,980m · Slope 48%</span>
                  </div>
                </div>

                {/* Simulated Warning Notification Card */}
                <div className="absolute top-4 right-4 max-w-[210px] p-2.5 rounded-lg bg-red-950/85 backdrop-blur-md border border-red-500/50 text-white text-xs shadow-lg animate-pulse">
                  <div className="flex items-center gap-1.5 text-red-300 font-semibold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>EARLY WARNING</span>
                  </div>
                  <p className="text-[11px] text-red-100 leading-tight">
                    Surge detected: +0.6 m/hr in narrow gorge. Evacuate low-lying trails.
                  </p>
                </div>

                {/* Multi-source Telemetry Matrix at Bottom */}
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/60">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                      <CloudRain className="w-3 h-3 text-cyan-400" />
                      <span>Rainfall</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-white tabular-nums">
                      {envData.rainfallIntensity} mm/hr
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/60">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                      <Waves className="w-3 h-3 text-blue-400" />
                      <span>River Stage</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-white tabular-nums">
                      {envData.riverLevel.toFixed(1)} m ↑
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/60">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>AI Risk Index</span>
                    </div>
                    <span className={`text-sm font-bold font-mono tabular-nums ${
                      riskLevel === 'CRITICAL' ? 'text-red-400' :
                      riskLevel === 'HIGH' ? 'text-orange-400' :
                      riskLevel === 'MODERATE' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {riskScore} / 100 ({riskLevel})
                    </span>
                  </div>
                </div>

              </div>

              {/* Sub-strip with AI Pipeline & Simulation status */}
              <div className="p-3 bg-slate-950 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    Scikit-Learn + XGBoost
                  </span>
                  <span className="hidden sm:inline">Antecedent Soil Index + Runoff Lag Model</span>
                </div>
                <button
                  onClick={onLaunchDashboard}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <span>Open GIS Map</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
