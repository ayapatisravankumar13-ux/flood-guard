import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  Radio,
  Send,
  Eye,
  X,
  Volume2,
  ShieldAlert,
  Info,
  ExternalLink
} from 'lucide-react';
import { EarlyWarningAlert, RiskLevel } from '../types';
import { getRiskColorClass } from '../utils/floodAlgorithm';

interface AlertCenterProps {
  alerts: EarlyWarningAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  onViewLocation: (zoneId: string) => void;
  onBroadcastAlert: (alertId: string) => void;
  onCreateSimulatedAlert: () => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({
  alerts,
  onAcknowledgeAlert,
  onViewLocation,
  onBroadcastAlert,
  onCreateSimulatedAlert,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [filterAcknowledged, setFilterAcknowledged] = useState<'ALL' | 'UNACK' | 'ACK'>('ALL');
  const [selectedAlertForDetails, setSelectedAlertForDetails] = useState<EarlyWarningAlert | null>(null);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesLevel = filterLevel === 'ALL' || alert.level === filterLevel;
    const matchesAck =
      filterAcknowledged === 'ALL'
        ? true
        : filterAcknowledged === 'UNACK'
        ? !alert.acknowledged
        : alert.acknowledged;
    return matchesLevel && matchesAck;
  });

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              NDMA CAP Dissemination Engine
            </span>
            {unacknowledgedCount > 0 && (
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                {unacknowledgedCount} Active Unacknowledged
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Early Warning & Alert Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Standardized Common Alerting Protocol (CAP) multi-channel broadcasts for hilly districts.
          </p>
        </div>

        {/* Dispatch Simulated Alert & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onCreateSimulatedAlert}
            className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-red-600/30 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Generate Surge Alert</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Severity Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                filterLevel === lvl
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lvl === 'ALL' ? 'All Severities' : lvl}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setFilterAcknowledged('ALL')}
            className={`px-2.5 py-1 rounded-md font-semibold ${
              filterAcknowledged === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilterAcknowledged('UNACK')}
            className={`px-2.5 py-1 rounded-md font-semibold ${
              filterAcknowledged === 'UNACK' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Pending ({unacknowledgedCount})
          </button>
          <button
            onClick={() => setFilterAcknowledged('ACK')}
            className={`px-2.5 py-1 rounded-md font-semibold ${
              filterAcknowledged === 'ACK' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Acknowledged ({alerts.length - unacknowledgedCount})
          </button>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No active alerts matching filter</h4>
            <p className="text-xs text-slate-400 mt-1">All alerts acknowledged or parameters within nominal baseline.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const color = getRiskColorClass(alert.level);
            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border ${
                  alert.acknowledged ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 opacity-80' : `${color.border} bg-white dark:bg-slate-900 shadow-sm`
                } transition-all`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Alert Content */}
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full ${color.badge}`}>
                        {alert.level} ALERT
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{alert.locationName}</span>
                      </span>
                      <span className="text-slate-400 text-xs">·</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp}</span>
                      </span>

                      {alert.acknowledged && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Acknowledged by {alert.acknowledgedBy || 'Command'}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {alert.title}
                    </h3>

                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-900 dark:text-white">Trigger Reason: </strong>
                      {alert.triggerReason}
                    </div>

                    {/* Recommended Action block */}
                    <div className={`p-3 rounded-xl border ${color.border} ${color.bg} text-xs text-slate-800 dark:text-slate-200`}>
                      <span className={`font-bold block mb-0.5 ${color.text}`}>
                        Recommended Action:
                      </span>
                      <p>{alert.recommendedAction}</p>
                    </div>
                  </div>

                  {/* Right Actions Buttons (Mandatory: Acknowledge, View Location, View Details) */}
                  <div className="flex lg:flex-col items-center gap-2 shrink-0 pt-2 lg:pt-0">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    <button
                      onClick={() => onViewLocation(alert.zoneId)}
                      className="w-full sm:w-auto px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                      <span>View Location</span>
                    </button>

                    <button
                      onClick={() => setSelectedAlertForDetails(alert)}
                      className="w-full sm:w-auto px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => onBroadcastAlert(alert.id)}
                      className={`w-full sm:w-auto px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors ${
                        alert.broadcastSent
                          ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                      title="Simulate SMS siren dispatch"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{alert.broadcastSent ? 'Siren Dispatched' : 'Broadcast Siren'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* View Details Modal */}
      {selectedAlertForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-xl w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${getRiskColorClass(selectedAlertForDetails.level).badge}`}>
                  {selectedAlertForDetails.level}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Alert Details & Protocol Spec
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlertForDetails(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-mono">Location & Valley:</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedAlertForDetails.locationName}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-mono">Trigger Diagnostics:</span>
                <p className="text-slate-700 dark:text-slate-300">
                  {selectedAlertForDetails.triggerReason}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-mono">Prescribed Action:</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {selectedAlertForDetails.recommendedAction}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div>CAP-ID: urn:ea:floodguard:{selectedAlertForDetails.id}</div>
                <div>Status: Actual · Message Type: Alert · Scope: Public</div>
                <div>Urgency: Immediate · Severity: {selectedAlertForDetails.level} · Certainty: Observed</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAlertForDetails(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onViewLocation(selectedAlertForDetails.zoneId);
                  setSelectedAlertForDetails(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Inspect on GIS Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
