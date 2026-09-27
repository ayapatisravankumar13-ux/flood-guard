import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  Radio,
  Sliders,
  ShieldAlert,
  ArrowRight,
  Database,
  BarChart3,
  Flame,
  Volume2,
  X
} from 'lucide-react';
import { MonitoredZone } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  zones: MonitoredZone[];
  onSelectZone: (zone: MonitoredZone) => void;
  onSelectTab: (tabId: string) => void;
  onToggleSimulation: () => void;
  onTestSiren: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  zones,
  onSelectZone,
  onSelectTab,
  onToggleSimulation,
  onTestSiren,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build searchable items
  const staticCommands = [
    { id: 'cmd-dash', type: 'page', title: 'Dashboard', sub: 'Main Hydrological Command Overview', tab: 'dashboard' },
    { id: 'cmd-map', type: 'page', title: 'Interactive Risk Map', sub: 'Geospatial Topographic Elevation GIS', tab: 'risk-map' },
    { id: 'cmd-ai', type: 'page', title: 'AI Prediction Pipeline', sub: 'Scikit-learn Feature Weights & Vectors', tab: 'ai-engine' },
    { id: 'cmd-alerts', type: 'page', title: 'Early Warning Alerts', sub: 'NDMA CAP Broadcaster', tab: 'alerts' },
    { id: 'cmd-analytics', type: 'page', title: 'Telemetry Analytics', sub: 'Time-Series Hydrographs & Donut Charts', tab: 'analytics' },
    { id: 'cmd-sources', type: 'page', title: 'Data Sources & Research', sub: 'IMD, ISRO Bhuvan, CWC, NDMA', tab: 'data-sources' },
    { id: 'cmd-arch', type: 'page', title: 'Technical Architecture', sub: 'FastAPI, Scikit-learn, Firebase, Plotly Stack', tab: 'architecture' },
    { id: 'cmd-admin', type: 'page', title: 'DDMA Authority Admin', sub: 'High-Density Emergency Registry & SITREP', tab: 'admin' },
    { id: 'cmd-sim', type: 'action', title: 'Toggle Flood Simulation', sub: 'Start / Pause Cloudburst Progression', action: onToggleSimulation },
    { id: 'cmd-siren', type: 'action', title: 'Sound Emergency Warning Siren', sub: 'Synthesized 3-Second Audio Alarm', action: onTestSiren },
  ];

  const zoneCommands = zones.map((z) => ({
    id: `zone-${z.id}`,
    type: 'zone',
    title: z.name,
    sub: `${z.valley} · ${z.state} (Score: ${z.riskScore}/100 - ${z.currentRisk})`,
    zone: z,
  }));

  const allItems = [...staticCommands, ...zoneCommands];

  const filteredItems = allItems.filter((item) => {
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q);
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) {
        executeItem(current);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const executeItem = (item: any) => {
    if (item.type === 'page') {
      onSelectTab(item.tab);
    } else if (item.type === 'zone') {
      onSelectZone(item.zone);
      onSelectTab('risk-map');
    } else if (item.type === 'action') {
      item.action();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-sm p-4 pt-16 sm:pt-24"
      onClick={onClose}
    >
      <div
        className="max-w-xl w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input header */}
        <div className="relative border-b border-slate-100 dark:border-slate-800 p-3 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, valley name, or page... (use ↑↓ to navigate, Enter to select)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full pl-8 pr-10 py-1.5 text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching commands or Himalayan valleys found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-medium'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.type === 'page' ? (
                      <Compass className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-cyan-500'}`} />
                    ) : item.type === 'zone' ? (
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-blue-500'}`} />
                    ) : (
                      <Radio className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-amber-500'}`} />
                    )}

                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                        {item.sub}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 opacity-60 ${isSelected ? 'translate-x-1' : ''} transition-transform`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Navigate: <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">↓</kbd></span>
          <span>Select: <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">Enter</kbd></span>
          <span>Dismiss: <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">Esc</kbd></span>
        </div>
      </div>
    </div>
  );
};
