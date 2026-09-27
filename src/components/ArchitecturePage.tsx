import React from 'react';
import {
  Layers,
  Database,
  Cpu,
  BrainCircuit,
  MapPin,
  Radio,
  Users,
  ArrowDown,
  Code2,
  Server,
  Cloud,
  CheckCircle2,
  Flame,
  Globe2,
  Sparkles,
  BarChart2
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const pipelineFlow = [
    {
      level: 1,
      name: 'MULTI-SOURCE SENSOR INGESTION',
      sub: 'Rainfall + Weather + River + Soil + Terrain + Historical Data',
      desc: 'IMD AWS rain telemetry, Doppler radar nowcasts, CWC ultrasonic river gauges, ISRO CartoSAT DEM slope models, RISAT soil saturation vectors.',
      icon: Database,
      badge: 'Data Layer',
      color: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400',
    },
    {
      level: 2,
      name: 'DATA PROCESSING & QUALITY CONTROL',
      sub: 'Kriging Interpolation & Temporal Normalization',
      desc: 'Real-time outlier filtering, missing sensor imputation, spatial kriging to estimate rainfall in unmonitored mountain ravines, lag alignment.',
      icon: Layers,
      badge: 'ETL Pipeline',
      color: 'border-blue-500/40 bg-blue-500/5 text-blue-600 dark:text-blue-400',
    },
    {
      level: 3,
      name: 'FEATURE ENGINEERING',
      sub: 'Hydrological Physics Vectors & Index Derivation',
      desc: 'Topographic Wetness Index (TWI), Antecedent Precipitation Index (API), kinematic wave runoff velocity, catchment retention deficit computation.',
      icon: Cpu,
      badge: 'Physics Engine',
      color: 'border-indigo-500/40 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400',
    },
    {
      level: 4,
      name: 'AI/ML FLOOD-RISK MODEL',
      sub: 'Ensemble Learning: Random Forest + Gradient Boosted Trees',
      desc: 'Trained on historical flash flood cloudburst events across the Western and Eastern Himalayas to estimate breach probability and surge height.',
      icon: BrainCircuit,
      badge: 'Inference Layer',
      color: 'border-purple-500/40 bg-purple-500/5 text-purple-600 dark:text-purple-400',
    },
    {
      level: 5,
      name: 'RISK CLASSIFICATION',
      sub: 'Discrete Severity Mapping: Low / Moderate / High / Critical',
      desc: 'Calibrated probabilistic risk indexing (0–100) mapped to four statutory national emergency disaster severity tiers.',
      icon: Sparkles,
      badge: 'Classification',
      color: 'border-amber-500/40 bg-amber-500/5 text-amber-600 dark:text-amber-400',
    },
    {
      level: 6,
      name: 'RISK MAP + DASHBOARD',
      sub: 'Real-Time Spatial Geospatial Command Canvas',
      desc: 'Dynamic catchment polygons, real-time telemetry gauges, rate-of-rise trend lines, district-level emergency responder dashboards.',
      icon: MapPin,
      badge: 'Command UI',
      color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400',
    },
    {
      level: 7,
      name: 'EARLY WARNING ENGINE',
      sub: 'NDMA Common Alerting Protocol (CAP) Integration',
      desc: 'Automated XML payload compilation, cellular cell-broadcast triggers, solar siren tower activations, and emergency dispatch queues.',
      icon: Radio,
      badge: 'Alert Gateway',
      color: 'border-orange-500/40 bg-orange-500/5 text-orange-600 dark:text-orange-400',
    },
    {
      level: 8,
      name: 'COMMUNITY + EMERGENCY RESPONSE',
      sub: 'Pan-Valley Protective Action Deployment',
      desc: 'Immediate public SMS alerts to riverside residents, automated siren sounding, SDRF/NDRF tactical mobilization, highway traffic closures.',
      icon: Users,
      badge: 'Life-Safety Outcome',
      color: 'border-red-500/40 bg-red-500/5 text-red-600 dark:text-red-400',
    },
  ];

  const techStack = [
    { label: 'Frontend', value: 'React.js', icon: Globe2, desc: 'Responsive dashboard, TypeScript, Tailwind CSS, Lucide' },
    { label: 'Backend', value: 'FastAPI', icon: Server, desc: 'Asynchronous Python microservices, REST & WebSocket streaming' },
    { label: 'AI/ML', value: 'Python + Scikit-learn', icon: BrainCircuit, desc: 'Random Forest, XGBoost ensembles, Hydrologic Physics models' },
    { label: 'Database', value: 'Firebase', icon: Flame, desc: 'Firestore real-time document sync, Cloud Auth & storage' },
    { label: 'Maps', value: 'Google Maps', icon: MapPin, desc: 'Interactive GIS geospatial layer projection & GeoJSON overlays' },
    { label: 'Visualization', value: 'Plotly', icon: BarChart2, desc: 'Interactive multi-series hydrometric and probability curves' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                End-to-End System Design
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                System Architecture
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Technical Architecture & AI Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Complete multi-source pipeline transforming raw mountain sensor signals into life-saving early warnings.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg self-start md:self-auto">
            Latency Budget: &lt; 900ms
          </span>
        </div>

        {/* Visually Impressive Vertical Architecture Diagram */}
        <div className="max-w-3xl mx-auto py-4 space-y-3">
          {pipelineFlow.map((node, idx) => {
            const Icon = node.icon;
            return (
              <div key={node.level} className="relative">
                {/* Node Box */}
                <div className={`p-4 rounded-xl border ${node.color} bg-white dark:bg-slate-950 shadow-sm transition-all hover:scale-[1.01]`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            STEP {node.level}
                          </span>
                          <span className="text-slate-300 text-xs">·</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                            {node.name}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">
                          {node.sub}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                          {node.desc}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 hidden sm:inline">
                      {node.badge}
                    </span>
                  </div>
                </div>

                {/* Connecting Arrow Down */}
                {idx < pipelineFlow.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-xs">
                      <ArrowDown className="w-3.5 h-3.5 text-cyan-500" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Proposed Technical Stack Cards (Prompt Section 13) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            System Technical Architecture Specification
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Proposed Technical Stack
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Selected for high-throughput concurrency, real-time spatial streaming, and low-latency emergency alerting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.label}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {tech.label}
                  </span>
                  <Icon className="w-4 h-4 text-cyan-500" />
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                  {tech.value}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tech.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
