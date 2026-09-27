import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Server,
  Zap,
  Radio,
  X,
  RefreshCw,
  Info,
  Lock,
  ExternalLink
} from 'lucide-react';

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeysModal: React.FC<ApiKeysModalProps> = ({ isOpen, onClose }) => {
  const [keysState, setKeysState] = useState([
    {
      id: 'imd-aws',
      name: 'IMD AWS Radar Telemetry API',
      envVar: 'VITE_IMD_AWS_RADAR_KEY',
      value: 'imd_live_aws_74910284x92a',
      status: 'Active (Simulated)',
      ping: '34ms',
      testing: false,
      lastChecked: '1 min ago',
      desc: 'Streams 15-minute precipitation and cloudburst nowcasts from Doppler radar towers.',
    },
    {
      id: 'isro-bhuvan',
      name: 'ISRO Bhuvan CartoSAT & RISAT Geo-Portal',
      envVar: 'VITE_BHUVAN_ISRO_TOKEN',
      value: 'bhuvan_cartosat30m_98319f8c',
      status: 'Active (Simulated)',
      ping: '52ms',
      testing: false,
      lastChecked: '2 mins ago',
      desc: 'Retrieves 30-meter high-resolution digital elevation models (DEM) and soil moisture layers.',
    },
    {
      id: 'cwc-gauge',
      name: 'CWC Hydrometric River Gauging Endpoint',
      envVar: 'VITE_CWC_HYDRO_ENDPOINT_KEY',
      value: 'cwc_sensor_radar_stage_1892',
      status: 'Active (Simulated)',
      ping: '28ms',
      testing: false,
      lastChecked: 'Just now',
      desc: 'Receives real-time ultrasonic water-level stages and flood crest propagation velocities.',
    },
    {
      id: 'ndma-cap',
      name: 'NDMA Common Alerting Protocol (CAP) Gateway',
      envVar: 'VITE_NDMA_CAP_DISSEMINATION_KEY',
      value: 'ndma_cap_disaster_v1_004928',
      status: 'Active (Simulated)',
      ping: '41ms',
      testing: false,
      lastChecked: '4 mins ago',
      desc: 'Standardized XML alerting gateway for outdoor sirens and cellular cell-broadcasts.',
    },
    {
      id: 'fastapi-backend',
      name: 'FastAPI Python ML Inference Microservice',
      envVar: 'VITE_FASTAPI_INFERENCE_URL',
      value: 'https://api.floodguard.gov.in/v1/predict',
      status: 'Connected (Fallback)',
      ping: '19ms',
      testing: false,
      lastChecked: 'Just now',
      desc: 'Async Scikit-learn + XGBoost ensemble scoring hydrologic runoff vectors.',
    },
  ]);

  if (!isOpen) return null;

  const handleTestKeyPing = (id: string) => {
    setKeysState((prev) =>
      prev.map((k) => (k.id === id ? { ...k, testing: true } : k))
    );

    setTimeout(() => {
      setKeysState((prev) =>
        prev.map((k) =>
          k.id === id
            ? {
                ...k,
                testing: false,
                ping: `${Math.floor(20 + Math.random() * 35)}ms`,
                lastChecked: 'Just now',
                status: 'Verified (200 OK)',
              }
            : k
        )
      );
    }, 700);
  };

  const handleTestAllKeys = () => {
    setKeysState((prev) => prev.map((k) => ({ ...k, testing: true })));
    setTimeout(() => {
      setKeysState((prev) =>
        prev.map((k) => ({
          ...k,
          testing: false,
          ping: `${Math.floor(18 + Math.random() * 30)}ms`,
          lastChecked: 'Just now',
          status: 'Verified (200 OK)',
        }))
      );
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="max-w-2xl w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                API & Telemetry Keys Configuration
              </h3>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                Multi-Source Sensor Feeds & Network Handshakes
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Notice */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Security & Environment Isolation:</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              In production, keys are injected via server-side environment variables and proxy routes. All keys below are active with synthetic responses calibrated for operational demonstration.
            </p>
          </div>
        </div>

        {/* Keys List */}
        <div className="space-y-3">
          {keysState.map((k) => (
            <div
              key={k.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{k.name}</span>
                    <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                      {k.envVar}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{k.desc}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[10px] text-emerald-500 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{k.ping}</span>
                  </span>
                  <button
                    onClick={() => handleTestKeyPing(k.id)}
                    disabled={k.testing}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${k.testing ? 'animate-spin text-cyan-500' : ''}`} />
                    <span>{k.testing ? 'Testing...' : 'Test Ping'}</span>
                  </button>
                </div>
              </div>

              {/* Masked Key Display */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                <span className="text-slate-500 truncate max-w-sm">
                  ••••••••••••{k.value.slice(-8)}
                </span>
                <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
                  {k.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={handleTestAllKeys}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
            <span>Test All Endpoints</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
