import React, { useState } from 'react';
import {
  ShieldAlert,
  Play,
  RotateCcw,
  Sun,
  Moon,
  Menu,
  X,
  UserCheck,
  Radio,
  Sliders,
  Bell,
  MapPin,
  Cpu,
  Database,
  Layers,
  Sparkles,
  BarChart3,
  Search,
  Keyboard,
  Key,
  Volume2,
  VolumeX
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetSimulation: () => void;
  userRole: UserRole;
  onOpenLoginModal: () => void;
  unreadAlertCount: number;
  onOpenShortcutsModal: () => void;
  onOpenCommandPalette: () => void;
  onOpenApiKeysModal: () => void;
  onToggleAudioSiren: () => void;
  isSirenActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isDarkMode,
  setIsDarkMode,
  isSimulating,
  onToggleSimulation,
  onResetSimulation,
  userRole,
  onOpenLoginModal,
  unreadAlertCount,
  onOpenShortcutsModal,
  onOpenCommandPalette,
  onOpenApiKeysModal,
  onToggleAudioSiren,
  isSirenActive,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'risk-map', label: 'Risk Map' },
    { id: 'ai-engine', label: 'AI Prediction' },
    { id: 'alerts', label: 'Alerts', badge: unreadAlertCount },
    { id: 'analytics', label: 'Analytics' },
    { id: 'data-sources', label: 'Data Sources' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'feasibility', label: 'Feasibility' },
    { id: 'impact', label: 'Impact' },
    { id: 'admin', label: 'DDMA Admin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2.5 text-left group transition-transform focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-cyan-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                FLOOD GUARD AI
              </span>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold tracking-wider uppercase mt-1">
                Autonomous Telemetry · Hilly Basin
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean unboxed text with hover underline) */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`relative py-1 transition-colors whitespace-nowrap focus-visible:outline-none ${
                currentTab === item.id
                  ? 'text-cyan-600 dark:text-cyan-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-500 text-white">
                  {item.badge}
                </span>
              )}
              {currentTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 dark:bg-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions (Command Search, Keys, Audio, Simulation, Theme, Profile) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Fast Search / Command Palette Trigger (Ctrl+K or /) */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-800 transition-colors"
            title="Fast Search & Command Palette (Ctrl+K or /)"
          >
            <Search className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-[11px] text-slate-400 font-mono">Search</span>
            <kbd className="hidden md:inline px-1 py-0.2 text-[9px] font-mono rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">
              /
            </kbd>
          </button>

          {/* Keyboard Shortcuts Guide ('?' Key) */}
          <button
            onClick={onOpenShortcutsModal}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Keyboard Shortcuts & Hotkeys (? Key)"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4 text-slate-500" />
          </button>

          {/* API & Telemetry Keys Modal */}
          <button
            onClick={onOpenApiKeysModal}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="API & Telemetry Keys (IMD, ISRO, CWC, NDMA)"
            aria-label="API Keys"
          >
            <Key className="w-4 h-4 text-slate-500" />
          </button>

          {/* Audible Emergency Warning Siren Toggle ('A' Key) */}
          <button
            onClick={onToggleAudioSiren}
            className={`p-1.5 rounded-lg transition-colors ${
              isSirenActive
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isSirenActive ? 'Stop Emergency Siren' : 'Sound Warning Siren (A Key)'}
            aria-label="Toggle Siren"
          >
            {isSirenActive ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Simulation Toggle Button */}
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              isSimulating
                ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30 animate-pulse'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-600/20'
            }`}
            title="Toggle Flash Flood Event Simulation ('S' Key)"
          >
            {isSimulating ? (
              <>
                <Radio className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Run Simulation</span>
                <span className="sm:hidden">Sim</span>
              </>
            )}
          </button>

          {isSimulating && (
            <button
              onClick={onResetSimulation}
              title="Reset Simulation ('R' Key)"
              className="p-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none"
            title={isDarkMode ? 'Switch to Light Mode (D Key)' : 'Switch to Dark Mode (D Key)'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* User Role Badge / Avatar */}
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors whitespace-nowrap focus-visible:outline-none"
            title="Switch User Role / Demo Login (L Key)"
          >
            <img
              src="/src/assets/images/responder_officer_avatar_1790498554086.jpg"
              alt="Officer avatar"
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover border border-cyan-500/50"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-[11px] font-semibold leading-tight">{userRole}</span>
              <span className="text-[9px] text-slate-400">DDMA Command</span>
            </div>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 shadow-xl space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                  currentTab === item.id
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => {
                onOpenCommandPalette();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-semibold"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Command Palette (/)</span>
            </button>
            <button
              onClick={() => {
                onOpenShortcutsModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Keys Guide (?)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Logged in as: <strong className="text-slate-900 dark:text-white">{userRole}</strong></span>
            <button
              onClick={() => {
                onOpenLoginModal();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Switch Role (L)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
