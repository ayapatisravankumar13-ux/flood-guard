import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Users,
  Radio,
  WifiOff,
  CloudOff,
  DollarSign,
  TrendingUp,
  HeartHandshake,
  Compass,
  ArrowRight,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';
import { FEASIBILITY_CHALLENGES } from '../data/mockData';

interface FeasibilityImpactPageProps {
  initialTab?: 'feasibility' | 'impact';
}

export const FeasibilityImpactPage: React.FC<FeasibilityImpactPageProps> = ({ initialTab = 'feasibility' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'feasibility' | 'impact'>(initialTab);

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-tab Switcher */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            System Operational Viability & Value Proposition
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {activeSubTab === 'feasibility' ? 'Feasibility & Engineering Viability' : 'Impact & Social Benefits'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Addressing real-world Himalayan deployment constraints, operational resilience, and life-safety impact.
          </p>
        </div>

        {/* Toggle between Feasibility & Impact */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('feasibility')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeSubTab === 'feasibility'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Feasibility & Challenges
          </button>
          <button
            onClick={() => setActiveSubTab('impact')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeSubTab === 'impact'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Impact & Benefits
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: FEASIBILITY & VIABILITY */}
      {activeSubTab === 'feasibility' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEASIBILITY_CHALLENGES.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Challenge 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {item.challenge}
                  </h3>

                  {/* Problem Description */}
                  <div className="p-3 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 text-xs text-red-800 dark:text-red-300">
                    <span className="font-bold block mb-0.5">Hurdle:</span>
                    {item.problem}
                  </div>

                  {/* Engineered Solution */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold block mb-0.5">Flood Guard AI Solution:</span>
                    {item.solution}
                  </div>
                </div>

                {/* Outcome */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Measurable Outcome:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">
                    {item.outcome}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: IMPACT & BENEFITS */}
      {activeSubTab === 'impact' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Communities */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Vulnerable Communities
                  </h3>
                  <span className="text-xs text-slate-400">Villages, Pilgrims & Riparians</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block">Earlier Flash-Flood Warnings</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Provides 30–90 minutes of actionable advance notice before peak flood waves arrive at valley settlements.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block">Better Preparedness</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Community-level alerts delivered in regional languages with clear, simple instructions on safe uphill shelters.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block">Improved Evacuation Awareness</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Pre-mapped safe corridors avoid landslide-prone defiles during self-evacuation.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Emergency Teams */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Emergency Teams
                  </h3>
                  <span className="text-xs text-slate-400">NDRF, SDRF & DDMA Authorities</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block">Faster Situational Awareness</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Unified multi-sensor dashboard replaces fragmented manual phone reports during severe monsoon storms.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block">Localized Risk Maps</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Pinpoints exact gorge constrictions and threatened bridges rather than issuing blanket district alerts.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block">Prioritized Tactical Response</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Commanders deploy rescue craft, heavy earthmovers, and medical teams directly to highest-vulnerability zones.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Long-Term Impact */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Long-Term Resilience
                  </h3>
                  <span className="text-xs text-slate-400">Infrastructure & Climate Planning</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block">Disaster Preparedness Culture</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Shifts disaster management posture from post-facto recovery to proactive predictive intervention.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block">Scalable Nationwide Deployment</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Easily extended across the Western Ghats, Northeast hills, and Himalayan river basins with minimal marginal cost.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block">Data-Driven Planning</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Historical telemetry archives inform hydraulic design of bridges, hydroelectric dams, and riverbank embankments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Slogan & Philosophy Banner (Mandatory Prompt Requirement) */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-center space-y-2 text-white shadow-xl">
            <span className="text-xs font-mono tracking-widest uppercase text-cyan-400">
              OPERATIONAL CORE MISSION
            </span>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-balance">
              PREDICT <span className="text-cyan-400">→</span> WARN <span className="text-cyan-400">→</span> RESPOND <span className="text-cyan-400">→</span> PROTECT
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Empowering Himalayan authorities and mountain communities with actionable, multi-source AI early warnings to prevent catastrophic loss of human life.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
