/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import {
  EnvironmentalData,
  MonitoredZone,
  EarlyWarningAlert,
  TimeSeriesPoint,
  UserRole,
  RiskLevel
} from './types';
import {
  INITIAL_ENVIRONMENTAL_DATA,
  MONITORED_ZONES,
  INITIAL_ALERTS,
  HISTORICAL_TIME_SERIES
} from './data/mockData';
import { calculateFloodRisk } from './utils/floodAlgorithm';
import { playEmergencySiren, stopEmergencySiren, playChimeTone } from './utils/audioAlert';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { RiskOverviewCards } from './components/RiskOverviewCards';
import { RiskScoreGauge } from './components/RiskScoreGauge';
import { EnvironmentalInputPanel } from './components/EnvironmentalInputPanel';
import { AiPredictionPipeline } from './components/AiPredictionPipeline';
import { InteractiveRiskMap } from './components/InteractiveRiskMap';
import { AlertCenter } from './components/AlertCenter';
import { RecommendedActions } from './components/RecommendedActions';
import { DataVisualizations } from './components/DataVisualizations';
import { DataSourcesPage } from './components/DataSourcesPage';
import { ArchitecturePage } from './components/ArchitecturePage';
import { FeasibilityImpactPage } from './components/FeasibilityImpactPage';
import { AdminMonitoringPanel } from './components/AdminMonitoringPanel';
import { SimulationController, SIMULATION_PHASES } from './components/SimulationController';
import { LoginModal } from './components/LoginModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { CommandPalette } from './components/CommandPalette';
import { ApiKeysModal } from './components/ApiKeysModal';
import {
  Radio,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function App() {
  // Navigation & Theme
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('floodguard_theme');
      if (saved === 'light') return false;
      if (saved === 'dark') return true;
    }
    return true;
  });
  const [userRole, setUserRole] = useState<UserRole>('Authority');
  
  // Modals & Panels State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isApiKeysModalOpen, setIsApiKeysModalOpen] = useState<boolean>(false);
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);

  // Core Hydrological State
  const [envData, setEnvData] = useState<EnvironmentalData>(INITIAL_ENVIRONMENTAL_DATA);
  const [zones, setZones] = useState<MonitoredZone[]>(MONITORED_ZONES);
  const [selectedZone, setSelectedZone] = useState<MonitoredZone>(MONITORED_ZONES[0]);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(INITIAL_ALERTS);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>(HISTORICAL_TIME_SERIES);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simPhaseIdx, setSimPhaseIdx] = useState<number>(2); // Start in Phase 3 (High) for realistic demo
  const [isPending, startTransition] = useTransition();

  // Dynamic Risk Calculation
  const calculation = useMemo(() => {
    return calculateFloodRisk(envData);
  }, [envData]);

  // Sync dark mode class on HTML document, body, and storage
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('floodguard_theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('floodguard_theme', 'light');
    }
  }, [isDarkMode]);

  // Global Keyboard Shortcuts Listener ("Make it work all keys")
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form controls
      const activeEl = document.activeElement;
      const isInput = activeEl && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName);

      if (e.key === 'Escape') {
        setIsLoginModalOpen(false);
        setIsShortcutsModalOpen(false);
        setIsCommandPaletteOpen(false);
        setIsApiKeysModalOpen(false);
        if (isSirenActive) {
          stopEmergencySiren();
          setIsSirenActive(false);
        }
        return;
      }

      // Command palette trigger: Ctrl+K, Cmd+K, or '/' (when not already typing)
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !isInput)) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (isInput) return;

      // Single-Key Navigation Handlers
      if (e.key === '1') {
        setCurrentTab('dashboard');
        playChimeTone('nominal');
      } else if (e.key === '2') {
        setCurrentTab('risk-map');
        playChimeTone('nominal');
      } else if (e.key === '3') {
        setCurrentTab('ai-engine');
        playChimeTone('nominal');
      } else if (e.key === '4') {
        setCurrentTab('alerts');
        playChimeTone('nominal');
      } else if (e.key === '5') {
        setCurrentTab('analytics');
        playChimeTone('nominal');
      } else if (e.key === '6') {
        setCurrentTab('data-sources');
        playChimeTone('nominal');
      } else if (e.key === '7') {
        setCurrentTab('architecture');
        playChimeTone('nominal');
      } else if (e.key === '8') {
        setCurrentTab('feasibility');
        playChimeTone('nominal');
      } else if (e.key === '9') {
        setCurrentTab('impact');
        playChimeTone('nominal');
      } else if (e.key === '0') {
        setCurrentTab('admin');
        playChimeTone('nominal');
      } else if (e.key === 's' || e.key === 'S') {
        // Toggle simulation
        handleToggleSimulation();
      } else if (e.key === 'r' || e.key === 'R') {
        // Reset simulation
        handleResetSimulation();
        playChimeTone('nominal');
      } else if (e.key === ']') {
        // Step forward simulation
        setSimPhaseIdx((prev) => {
          const next = (prev + 1) % SIMULATION_PHASES.length;
          applySimulationPhase(next);
          return next;
        });
      } else if (e.key === '[') {
        // Step backward simulation
        setSimPhaseIdx((prev) => {
          const next = (prev - 1 + SIMULATION_PHASES.length) % SIMULATION_PHASES.length;
          applySimulationPhase(next);
          return next;
        });
      } else if (e.key === 'd' || e.key === 'D') {
        // Dark mode toggle
        setIsDarkMode((prev) => !prev);
      } else if (e.key === 'l' || e.key === 'L') {
        // Login / role selector
        setIsLoginModalOpen((prev) => !prev);
      } else if (e.key === 'a' || e.key === 'A') {
        // Test emergency warning siren
        handleToggleAudioSiren();
      } else if (e.key === '?' || e.key === 'h' || e.key === 'H') {
        // Open shortcuts guide
        setIsShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isSirenActive, isSimulating, simPhaseIdx]);

  // Handle Simulation Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      timer = setInterval(() => {
        setSimPhaseIdx((prev) => {
          const next = (prev + 1) % SIMULATION_PHASES.length;
          applySimulationPhase(next);
          return next;
        });
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  // Apply a Simulation Phase
  const applySimulationPhase = (phaseIndex: number) => {
    const phase = SIMULATION_PHASES[phaseIndex];
    if (!phase) return;

    setEnvData((prev) => ({
      ...prev,
      ...phase.data,
    }));

    // Update the monitored zones to reflect this phase
    setZones((prevZones) =>
      prevZones.map((zone, idx) => {
        if (idx === 0) {
          // Zone A (Primary Mandakini Upper Gorge)
          const newScore = phase.level === 'CRITICAL' ? 94 : phase.level === 'HIGH' ? 76 : phase.level === 'MODERATE' ? 48 : 22;
          return {
            ...zone,
            currentRisk: phase.level,
            riskScore: newScore,
            rainfall: phase.data.rainfallIntensity ?? zone.rainfall,
            riverLevel: phase.data.riverLevel ?? zone.riverLevel,
            riverRateOfRise: phase.data.riverRateOfRise ?? zone.riverRateOfRise,
            soilMoisture: phase.data.soilMoisture ?? zone.soilMoisture,
            lastUpdated: 'Just now',
          };
        } else if (idx === 1) {
          // Zone B
          const newLevel: RiskLevel = phase.level === 'CRITICAL' ? 'HIGH' : phase.level === 'HIGH' ? 'MODERATE' : 'LOW';
          return {
            ...zone,
            currentRisk: newLevel,
            riskScore: Math.max(15, (zone.riskScore + (phase.level === 'CRITICAL' ? 15 : -10))),
            lastUpdated: 'Just now',
          };
        }
        return zone;
      })
    );

    // Audio chime feedback
    playChimeTone(phase.level === 'CRITICAL' ? 'critical' : phase.level === 'HIGH' ? 'warning' : 'nominal');

    // If critical, trigger a new alert automatically
    if (phase.level === 'CRITICAL') {
      const newAlert: EarlyWarningAlert = {
        id: `alt-sim-${Date.now()}`,
        level: 'CRITICAL',
        zoneId: 'zone-mandakini-a',
        locationName: 'Mandakini Upper Gorge (Gaurikund)',
        timestamp: 'Just now',
        title: 'Cloudburst Surge Crest Approaching Gauging Point',
        triggerReason: 'Torrential 118 mm/hr rainfall exceeded 90-minute catchment retention threshold.',
        recommendedAction: 'Mandatory evacuation of all low-lying buildings within 500m of the gorge.',
        acknowledged: false,
        broadcastSent: true,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  };

  const handleSelectPhase = (phaseIndex: number) => {
    setSimPhaseIdx(phaseIndex);
    applySimulationPhase(phaseIndex);
  };

  const handleToggleSimulation = () => {
    if (!isSimulating) {
      setIsSimulating(true);
      applySimulationPhase(simPhaseIdx);
    } else {
      setIsSimulating(false);
    }
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimPhaseIdx(0);
    setEnvData(INITIAL_ENVIRONMENTAL_DATA);
    setZones(MONITORED_ZONES);
    setSelectedZone(MONITORED_ZONES[0]);
  };

  const handleApplyPreset = (type: 'nominal' | 'heavy' | 'cloudburst') => {
    if (type === 'nominal') {
      handleSelectPhase(0);
    } else if (type === 'heavy') {
      handleSelectPhase(2);
    } else {
      handleSelectPhase(3);
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    playChimeTone('nominal');
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              acknowledged: true,
              acknowledgedBy: `${userRole} Verified`,
              acknowledgedAt: 'Just now',
            }
          : a
      )
    );
  };

  const handleBroadcastAlert = (alertId: string) => {
    handleToggleAudioSiren();
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, broadcastSent: true } : a))
    );
  };

  const handleToggleAudioSiren = () => {
    if (isSirenActive) {
      stopEmergencySiren();
      setIsSirenActive(false);
    } else {
      setIsSirenActive(true);
      playEmergencySiren(4.0, () => {
        setIsSirenActive(false);
      });
    }
  };

  const handleViewLocationOnMap = (zoneId: string) => {
    const targetZone = zones.find((z) => z.id === zoneId) || zones[0];
    setSelectedZone(targetZone);
    setCurrentTab('risk-map');
    playChimeTone('nominal');
  };

  const handleCreateSimulatedAlert = () => {
    playChimeTone('critical');
    const newAlert: EarlyWarningAlert = {
      id: `alt-manual-${Date.now()}`,
      level: calculation.level,
      zoneId: selectedZone.id,
      locationName: selectedZone.name,
      timestamp: 'Just now',
      title: `${calculation.level} Risk Ingress Detected in ${selectedZone.valley}`,
      triggerReason: calculation.explanation,
      recommendedAction: selectedZone.recommendedAction,
      acknowledged: false,
      broadcastSent: true,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const unreadAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200`}>
      
      {/* Universal Navigation Bar adhering to 3-Zone Contract */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isSimulating={isSimulating}
        onToggleSimulation={handleToggleSimulation}
        onResetSimulation={handleResetSimulation}
        userRole={userRole}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        unreadAlertCount={unreadAlertsCount}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenApiKeysModal={() => setIsApiKeysModalOpen(true)}
        onToggleAudioSiren={handleToggleAudioSiren}
        isSirenActive={isSirenActive}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentTab === 'landing' ? (
          <div>
            <LandingHero
              onLaunchDashboard={() => {
                setCurrentTab('dashboard');
                playChimeTone('nominal');
              }}
              onExploreHowItWorks={() => {
                setCurrentTab('ai-engine');
                playChimeTone('nominal');
              }}
              onRunSimulation={() => {
                handleToggleSimulation();
                setCurrentTab('dashboard');
              }}
              envData={envData}
              riskScore={calculation.score}
              riskLevel={calculation.level}
            />

            {/* Quick feature spotlights on landing page */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => {
                    setCurrentTab('risk-map');
                    playChimeTone('nominal');
                  }}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      Geospatial GIS (Key: 2)
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    Interactive Catchment Map
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Live topographic contours, river drainage networks, and color-coded risk zones across Himalayan valleys.
                  </p>
                </div>

                <div
                  onClick={() => {
                    setCurrentTab('ai-engine');
                    playChimeTone('nominal');
                  }}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      Machine Learning (Key: 3)
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    AI Prediction Pipeline
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Physics-guided feature engineering linking rainfall intensity, kinematic water-level rise, and soil saturation deficit.
                  </p>
                </div>

                <div
                  onClick={() => {
                    setCurrentTab('alerts');
                    playChimeTone('nominal');
                  }}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      Dissemination (Key: 4)
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    NDMA CAP Early Warnings
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Standardized siren and cell-broadcast alerts providing up to 90 minutes of lead time for mountain settlements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* TAB: DASHBOARD (Unified View) */}
            {currentTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Dashboard Header (Mandatory Prompt Requirement) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      Flood Risk Monitoring Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Real-time multi-source monitoring and AI-assisted flood-risk assessment.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleSimulation}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isSimulating
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>{isSimulating ? 'Simulation Active (S)' : 'Run Flood Simulation (S)'}</span>
                    </button>
                  </div>
                </div>

                {/* Section 4: Current Risk Overview Cards */}
                <RiskOverviewCards
                  envData={envData}
                  riskScore={calculation.score}
                  riskLevel={calculation.level}
                />

                {/* Section 5: Flood Risk Score Circular Gauge */}
                <RiskScoreGauge calculation={calculation} />

                {/* Section 6: Environmental Data Inputs (Interactive sliders) */}
                <EnvironmentalInputPanel
                  data={envData}
                  onChange={setEnvData}
                  onReset={() => setEnvData(INITIAL_ENVIRONMENTAL_DATA)}
                  onApplyPreset={handleApplyPreset}
                />

                {/* Section 10: Smart Recommended Actions */}
                <RecommendedActions currentRiskLevel={calculation.level} />

                {/* Mini Preview of Risk Map with Quick Link */}
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Geospatial Viewport
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Catchment Risk Distribution Overview
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentTab('risk-map');
                        playChimeTone('nominal');
                      }}
                      className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Expand Full Interactive Map (Key: 2)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <InteractiveRiskMap
                    zones={zones}
                    selectedZone={selectedZone}
                    onSelectZone={setSelectedZone}
                    onNavigateToAlerts={() => setCurrentTab('alerts')}
                  />
                </div>
              </div>
            )}

            {/* TAB: RISK MAP */}
            {currentTab === 'risk-map' && (
              <InteractiveRiskMap
                zones={zones}
                selectedZone={selectedZone}
                onSelectZone={setSelectedZone}
                onNavigateToAlerts={() => setCurrentTab('alerts')}
              />
            )}

            {/* TAB: AI ENGINE */}
            {currentTab === 'ai-engine' && (
              <AiPredictionPipeline calculation={calculation} />
            )}

            {/* TAB: ALERTS */}
            {currentTab === 'alerts' && (
              <AlertCenter
                alerts={alerts}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onViewLocation={handleViewLocationOnMap}
                onBroadcastAlert={handleBroadcastAlert}
                onCreateSimulatedAlert={handleCreateSimulatedAlert}
              />
            )}

            {/* TAB: ANALYTICS */}
            {currentTab === 'analytics' && (
              <DataVisualizations
                timeSeries={timeSeries}
                zones={zones}
              />
            )}

            {/* TAB: DATA SOURCES */}
            {currentTab === 'data-sources' && (
              <DataSourcesPage />
            )}

            {/* TAB: ARCHITECTURE */}
            {currentTab === 'architecture' && (
              <ArchitecturePage />
            )}

            {/* TAB: FEASIBILITY */}
            {currentTab === 'feasibility' && (
              <FeasibilityImpactPage initialTab="feasibility" />
            )}

            {/* TAB: IMPACT */}
            {currentTab === 'impact' && (
              <FeasibilityImpactPage initialTab="impact" />
            )}

            {/* TAB: ADMIN MONITORING */}
            {currentTab === 'admin' && (
              <AdminMonitoringPanel
                zones={zones}
                alerts={alerts}
                onSelectZone={(zone) => {
                  setSelectedZone(zone);
                  setCurrentTab('risk-map');
                  playChimeTone('nominal');
                }}
                onAcknowledgeAlert={handleAcknowledgeAlert}
              />
            )}

          </div>
        )}
      </main>

      {/* Floating Simulation Controller Dock */}
      <SimulationController
        isSimulating={isSimulating}
        onToggleSimulating={handleToggleSimulation}
        onResetSimulation={handleResetSimulation}
        currentPhaseIndex={simPhaseIdx}
        onSelectPhase={handleSelectPhase}
        currentRiskLevel={calculation.level}
        currentRiskScore={calculation.score}
      />

      {/* Demo Login & Role Selector Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={userRole}
        onSelectRole={setUserRole}
      />

      {/* Keyboard Shortcuts Guide Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Command Palette & Fast Search Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        zones={zones}
        onSelectZone={(zone) => {
          setSelectedZone(zone);
          setCurrentTab('risk-map');
        }}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          playChimeTone('nominal');
        }}
        onToggleSimulation={handleToggleSimulation}
        onTestSiren={handleToggleAudioSiren}
      />

      {/* API & Telemetry Keys Configuration Modal */}
      <ApiKeysModal
        isOpen={isApiKeysModalOpen}
        onClose={() => setIsApiKeysModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">FLOOD GUARD AI</span>
            <span>·</span>
            <span>Disaster Management Early Warning Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Predict → Warn → Respond → Protect</span>
            <span>·</span>
            <button
              onClick={() => setIsShortcutsModalOpen(true)}
              className="hover:text-cyan-500 underline"
            >
              Shortcuts (?)
            </button>
            <span>·</span>
            <button
              onClick={() => setIsApiKeysModalOpen(true)}
              className="hover:text-cyan-500 underline"
            >
              API Keys
            </button>
          </div>

          <div className="text-right">
            <span>Designed for Himalayan Mountain Catchments & Flash Flood Risk Mitigation</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
