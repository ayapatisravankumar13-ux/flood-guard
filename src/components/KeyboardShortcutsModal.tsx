import React from 'react';
import { Keyboard, X, Sparkles, Command, Info } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      group: 'Direct Tab Navigation',
      items: [
        { key: '1', desc: 'Jump to Dashboard' },
        { key: '2', desc: 'Open Interactive Risk Map' },
        { key: '3', desc: 'Inspect AI Prediction Pipeline' },
        { key: '4', desc: 'Open Alert Center' },
        { key: '5', desc: 'View Analytics & Time-Series Charts' },
        { key: '6', desc: 'Browse Data Sources & Research' },
        { key: '7', desc: 'Technical Architecture & Flow' },
        { key: '8', desc: 'Feasibility & Engineering Solutions' },
        { key: '9', desc: 'Impact & Societal Benefits' },
        { key: '0', desc: 'DDMA Authority Admin Console' },
      ],
    },
    {
      group: 'Simulation & Emergency Actions',
      items: [
        { key: 'S', desc: 'Toggle Flood Event Simulation (Play/Pause)' },
        { key: 'R', desc: 'Reset Simulation to Baseline' },
        { key: ']', desc: 'Advance Simulation Phase (Escalate)' },
        { key: '[', desc: 'Revert to Previous Simulation Phase' },
        { key: 'A', desc: 'Test Audible Emergency Warning Siren' },
      ],
    },
    {
      group: 'Quick Controls & Discovery',
      items: [
        { key: 'Ctrl + K  or  /', desc: 'Command Palette & Fast Valley Search' },
        { key: 'D', desc: 'Toggle Dark / Light Theme' },
        { key: 'L', desc: 'Open Demo Login & Role Selector' },
        { key: '?', desc: 'Toggle this Keyboard Shortcuts Guide' },
        { key: 'Esc', desc: 'Dismiss Active Modal or Search Drawer' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="max-w-2xl w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Keyboard Shortcuts & Hotkeys
              </h3>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                Rapid Disaster Management Command Controls
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
        <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-300 dark:border-cyan-800 text-xs text-cyan-900 dark:text-cyan-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-500 shrink-0" />
          <span>
            Every key is active anywhere on the application (except while typing inside text boxes). Press any key to test instant transitions.
          </span>
        </div>

        {/* Shortcuts Columns */}
        <div className="space-y-4">
          {shortcutGroups.map((group) => (
            <div key={group.group} className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {group.group}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between"
                  >
                    <span className="text-slate-600 dark:text-slate-300">
                      {item.desc}
                    </span>
                    <kbd className="px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">Esc</kbd> to close</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
