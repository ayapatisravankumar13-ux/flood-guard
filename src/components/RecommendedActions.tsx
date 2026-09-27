import React from 'react';
import {
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Siren,
  ListChecks,
  PhoneCall,
  Truck,
  Users,
  Info,
  Radio
} from 'lucide-react';
import { RiskLevel } from '../types';
import { getRiskColorClass } from '../utils/floodAlgorithm';

interface RecommendedActionsProps {
  currentRiskLevel: RiskLevel;
}

export const RecommendedActions: React.FC<RecommendedActionsProps> = ({ currentRiskLevel }) => {
  const riskColor = getRiskColorClass(currentRiskLevel);

  const actionMatrix = {
    LOW: {
      headline: 'Low Risk — Continuous Surveillance Protocols',
      items: [
        {
          title: 'Continue Active Monitoring',
          desc: 'Keep automatic weather stations (AWS) and ultrasonic river gauges on standard 15-minute polling intervals.',
          icon: CheckCircle,
        },
        {
          title: 'No Immediate Public Action Required',
          desc: 'Normal commercial transit, riverbank activities, and pilgrimage routes operate safely within standard guidelines.',
          icon: Users,
        },
        {
          title: 'Routine Drainage Maintenance',
          desc: 'Verify that road culverts, debris catchers, and storm canals in mountain passes are unobstructed.',
          icon: ListChecks,
        },
      ],
    },
    MODERATE: {
      headline: 'Moderate Risk — Preparedness & Standby Alert',
      items: [
        {
          title: 'Monitor Rainfall and River Rate of Rise',
          desc: 'Accelerate hydrological sensor telemetry polling to 5-minute intervals. Track upstream tributary rain gauges.',
          icon: AlertTriangle,
        },
        {
          title: 'Prepare Emergency Supplies & High-Altitude Shelters',
          desc: 'Inventory emergency rations, solar batteries, medical first-aid kits, and satellite communication sets at panchayat centers.',
          icon: Truck,
        },
        {
          title: 'Review Evacuation Routes & Assembly Points',
          desc: 'Verify that uphill evacuation paths are clear of minor landslips; alert village disaster nodal volunteers.',
          icon: ListChecks,
        },
      ],
    },
    HIGH: {
      headline: 'High Risk — Pre-Evacuation & Tactical Mobilization',
      items: [
        {
          title: 'Issue Local Warning & Pre-Evacuation Notice',
          desc: 'Broadcast targeted SMS warnings to settlements within 500m of the active river defile. Advise immediate packing of essentials.',
          icon: Radio,
        },
        {
          title: 'Prepare Mandatory Evacuation Logistics',
          desc: 'Station buses and 4x4 transport at designated staging areas. Halt all riverside camping and pilgrimage foot traffic.',
          icon: Truck,
        },
        {
          title: 'Alert Emergency Response Teams (NDRF / SDRF)',
          desc: 'Mobilize regional disaster response battalions to forward staging outposts with motorized inflatable rescue craft.',
          icon: PhoneCall,
        },
      ],
    },
    CRITICAL: {
      headline: 'Critical Risk — Life-Safety Emergency Evacuation Order',
      items: [
        {
          title: 'Immediate Emergency Alert & Siren Activation',
          desc: 'Sound all automated outdoor warning sirens. Broadcast high-priority Cell Broadcast (CAP) alarms to all mobile phones in the valley.',
          icon: Siren,
        },
        {
          title: 'Evacuate Vulnerable Zones Immediately',
          desc: 'Mandatory relocation of all residents from low-lying riverbanks, bridge crossings, and floodplains to designated high-ground shelters.',
          icon: AlertTriangle,
        },
        {
          title: 'Notify Emergency Authorities & Close Infrastructure',
          desc: 'Close national highways (NH-34, NH-58) and bridges subject to hydrodynamic surge overtopping. Full inter-agency coordination activated.',
          icon: PhoneCall,
        },
      ],
    },
  };

  const currentActions = actionMatrix[currentRiskLevel];

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Automated Decision Support
          </span>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Smart Recommended Actions
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Posture:</span>
          <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${riskColor.badge}`}>
            {currentRiskLevel} LEVEL
          </span>
        </div>
      </div>

      {/* Headline banner for current risk posture */}
      <div className={`p-4 rounded-xl border ${riskColor.border} ${riskColor.bg}`}>
        <h3 className={`text-sm font-bold ${riskColor.text}`}>
          {currentActions.headline}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          Dynamically adjusted based on real-time multi-source environmental scoring.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentActions.items.map((action, idx) => {
          const Icon = action.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${riskColor.bg} ${riskColor.text}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Step {idx + 1}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {action.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {action.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Priority: Tier {idx + 1}</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Standard SOP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Disclaimer (Prompt Requirement) */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
        <span>
          <strong>Prototype Disclaimer:</strong> These automated recommendations are generated for early warning simulation and operational evaluation. They do not constitute official statutory disaster management orders issued by SDMA/DDMA authorities.
        </span>
      </div>
    </div>
  );
};
