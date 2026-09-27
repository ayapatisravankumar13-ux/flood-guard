import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  Radio,
  FileSpreadsheet,
  Users,
  Activity,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { MonitoredZone, EarlyWarningAlert } from '../types';
import { getRiskColorClass } from '../utils/floodAlgorithm';

interface AdminMonitoringPanelProps {
  zones: MonitoredZone[];
  alerts: EarlyWarningAlert[];
  onSelectZone: (zone: MonitoredZone) => void;
  onAcknowledgeAlert: (id: string) => void;
}

export const AdminMonitoringPanel: React.FC<AdminMonitoringPanelProps> = ({
  zones,
  alerts,
  onSelectZone,
  onAcknowledgeAlert,
}) => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [exportedNotice, setExportedNotice] = useState(false);

  // Filter zones
  const filteredZones = zones.filter((zone) => {
    const matchesSearch =
      zone.name.toLowerCase().includes(search.toLowerCase()) ||
      zone.valley.toLowerCase().includes(search.toLowerCase()) ||
      zone.state.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || zone.currentRisk === riskFilter;
    const matchesStatus = statusFilter === 'ALL' || zone.status === statusFilter;
    return matchesSearch && matchesRisk && matchesStatus;
  });

  const totalMonitored = zones.length;
  const criticalCount = zones.filter((z) => z.currentRisk === 'CRITICAL').length;
  const highCount = zones.filter((z) => z.currentRisk === 'HIGH').length;
  const atRiskLocations = criticalCount + highCount;
  const activeAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  const handleExportSITREP = () => {
    const sitrep = {
      report: 'FLOOD GUARD AI — DISTRICT SITUATION REPORT (SITREP)',
      timestamp: new Date().toISOString(),
      monitoredNodes: totalMonitored,
      nodesAtRisk: atRiskLocations,
      criticalZones: criticalCount,
      activeAlerts: activeAlertsCount,
      zoneBreakdown: zones.map((z) => ({
        name: z.name,
        valley: z.valley,
        risk: z.currentRisk,
        score: z.riskScore,
        rainfall: `${z.rainfall} mm/hr`,
        riverLevel: `${z.riverLevel} m`,
        action: z.recommendedAction,
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sitrep, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SITREP_FLOOD_GUARD_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportedNotice(true);
    setTimeout(() => setExportedNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Authority Operations Center
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
              DDMA Command Grid
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            District Disaster Management Monitoring Console
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time administrative telemetry oversight, risk registry, and incident management.
          </p>
        </div>

        {/* Export Situation Report button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSITREP}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SITREP (JSON)</span>
          </button>
        </div>
      </div>

      {exportedNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Situation Report (SITREP) exported successfully for inter-agency disaster review.</span>
        </div>
      )}

      {/* 4 Authority KPI Cards (Mandatory prompt items: Total monitored locations, Locations at risk, Active alerts, Critical zones) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Total Monitored Locations
          </span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
            {totalMonitored}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Across 3 Himalayan states
          </span>
        </div>

        <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-50/30 dark:bg-orange-950/20 shadow-sm">
          <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 block mb-1">
            Locations at Elevated Risk
          </span>
          <span className="text-3xl font-extrabold font-mono text-orange-600 dark:text-orange-400 tabular-nums">
            {atRiskLocations}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            High & Critical combined
          </span>
        </div>

        <div className="p-4 rounded-xl border border-red-500/30 bg-red-50/30 dark:bg-red-950/20 shadow-sm">
          <span className="text-xs font-semibold text-red-600 dark:text-red-400 block mb-1">
            Active Unacknowledged Alerts
          </span>
          <span className="text-3xl font-extrabold font-mono text-red-600 dark:text-red-400 tabular-nums">
            {activeAlertsCount}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Pending response officer sign-off
          </span>
        </div>

        <div className="p-4 rounded-xl border border-red-500/40 bg-red-600/10 shadow-sm">
          <span className="text-xs font-semibold text-red-700 dark:text-red-300 block mb-1">
            Critical Breach Zones
          </span>
          <span className="text-3xl font-extrabold font-mono text-red-600 dark:text-red-400 tabular-nums">
            {criticalCount}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Mandatory evacuation active
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter location, river valley, state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white w-64 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400">Risk Filter:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  riskFilter === lvl
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Monitored Locations Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Catchment Telemetry Registry ({filteredZones.length} entries)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Auto-refresh: 15s
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Location & Basin</th>
                <th className="py-3 px-3">State</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Rainfall</th>
                <th className="py-3 px-3">River Stage</th>
                <th className="py-3 px-3">Soil Sat.</th>
                <th className="py-3 px-3">Telemetry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredZones.map((zone) => {
                const color = getRiskColorClass(zone.currentRisk);
                return (
                  <tr
                    key={zone.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {zone.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{zone.valley}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {zone.state}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold ${color.badge}`}>
                        {zone.currentRisk}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {zone.riskScore}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {zone.rainfall} mm/hr
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {zone.riverLevel}m ({zone.riverRateOfRise >= 0 ? `+${zone.riverRateOfRise}` : zone.riverRateOfRise})
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {zone.soilMoisture}%
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{zone.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectZone(zone)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
