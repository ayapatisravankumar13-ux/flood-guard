import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  X,
  Lock,
  ArrowRight,
  Info,
  Radio,
  FileCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [officerName, setOfficerName] = useState('Officer R. Verma');
  const [district, setDistrict] = useState('Rudraprayag / Chamoli DDMA');

  if (!isOpen) return null;

  const roles: { role: UserRole; title: string; desc: string; permissions: string }[] = [
    {
      role: 'Authority',
      title: 'District Disaster Management Authority (DDMA)',
      desc: 'District Magistrate & Emergency Control Room. Authorized to broadcast valley-wide siren evacuations and approve SITREPs.',
      permissions: 'Full Dissemination & Statutory Evacuation Orders',
    },
    {
      role: 'Emergency Responder',
      title: 'Tactical Rescue Force (NDRF / SDRF)',
      desc: 'Battalion Incident Commanders. Authorized to acknowledge field alerts, dispatch motorized rescue boats, and clear transit routes.',
      permissions: 'Field Acknowledgment & Asset Deployment',
    },
    {
      role: 'Analyst',
      title: 'Hydrological & AI Modeling Analyst',
      desc: 'State Water Resources & IMD Meteorological Desk. Authorized to tune feature weights, calibrate thresholds, and simulate storm scenarios.',
      permissions: 'Model Calibration & Multi-Source Sensor Diagnostics',
    },
  ];

  const handleConfirmLogin = () => {
    onSelectRole(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Welcome to Flood Guard AI
              </h3>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                Command Authentication
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prototype Authentication Notice */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Prototype Demonstration Mode:</span>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
              Production deployment links with NIC Single Sign-On and NDMA Disaster credentials. For this operational demonstration, select any role for instant sandbox access.
            </p>
          </div>
        </div>

        {/* Role Selector List */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Select Operational Persona
          </label>
          <div className="space-y-2">
            {roles.map((item) => (
              <div
                key={item.role}
                onClick={() => setSelectedRole(item.role)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedRole === item.role
                    ? 'border-cyan-500 bg-cyan-50/60 dark:bg-cyan-950/30 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.role}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                    {item.role === selectedRole ? '● Active' : '○'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  {item.desc}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10px] font-mono text-slate-400">
                  Perms: {item.permissions}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Station inputs */}
        <div className="space-y-2 pt-1 text-xs">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Officer Name</label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">Assigned Station / District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLogin}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/25 flex items-center gap-1.5 transition-colors"
          >
            <span>Demo Login as {selectedRole}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
