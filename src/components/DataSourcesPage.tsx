import React from 'react';
import {
  Database,
  Satellite,
  Waves,
  Shield,
  Mountain,
  CheckCircle2,
  Info,
  ExternalLink,
  Radio,
  Clock,
  Layers
} from 'lucide-react';
import { DATA_SOURCES } from '../data/mockData';

export const DataSourcesPage: React.FC = () => {
  const sourceIcons: Record<string, React.ReactNode> = {
    imd: <Radio className="w-5 h-5 text-cyan-500" />,
    'isro-bhuvan': <Satellite className="w-5 h-5 text-blue-500" />,
    cwc: <Waves className="w-5 h-5 text-indigo-500" />,
    ndma: <Shield className="w-5 h-5 text-emerald-500" />,
    'terrain-dem': <Mountain className="w-5 h-5 text-amber-500" />,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Multi-Agency Data Federation
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                Open Data Standards
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Data Sources & Research
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              FLOOD GUARD AI aggregates hydrological, meteorological, and geospatial feeds from premier Indian scientific agencies to model hilly flash-flood hazards.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 max-w-sm">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-0.5">
              <Info className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>Integration Protocol Notice</span>
            </div>
            <span>
              All feeds are structured according to published open API schemas. In this prototype demonstration, simulated telemetry reflects typical Himalayan monsoon dynamics.
            </span>
          </div>
        </div>

        {/* Feature Sensor In-situ Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
          <div className="md:col-span-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-[4/3] relative">
            <img
              src="/src/assets/images/catchment_sensor_basin_1790498534297.jpg"
              alt="Himalayan hydrometric river monitoring sensor basin station"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs">
              <span className="font-mono text-[10px] text-cyan-300 block">Sensor Outpost Node 04</span>
              <span className="font-semibold text-[11px]">Upper Mandakini Gorge Hydrometric Radar</span>
            </div>
          </div>

          <div className="md:col-span-8 space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Himalayan Catchment Telemetry Network Integration
            </h4>
            <p className="leading-relaxed">
              In steep hilly terrain, conventional streamflow gauges in downstream plains are insufficient because flash flood floodwaves originate within 30 to 60 minutes in narrow tributary gorges. FLOOD GUARD AI pairs in-situ low-power ultrasonic water level sensors with Doppler radar nowcasts and satellite topographic wetness layers to detect rapid discharge surges before they breach downstream inhabited valley terraces.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Sampling Latency</span>
                <strong className="text-xs font-mono text-slate-900 dark:text-white">5–15 min</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Elevation Range</span>
                <strong className="text-xs font-mono text-slate-900 dark:text-white">850m – 3,200m</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">Protocol Spec</span>
                <strong className="text-xs font-mono text-slate-900 dark:text-white">MQTT / REST JSON</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Agency Cards (Mandatory prompt requirements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DATA_SOURCES.map((source) => (
          <div
            key={source.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {sourceIcons[source.id] || <Database className="w-5 h-5 text-cyan-500" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                      {source.acronym}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {source.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Data Type */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Type of Data
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {source.type}
                </span>
              </div>

              {/* How it is used */}
              <div className="text-xs space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  How It Is Used in Flood Guard AI
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {source.howItIsUsed}
                </p>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{source.frequency}</span>
              </span>
              <span className="text-emerald-500 font-semibold font-mono">
                {source.reliability} Uptime
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
