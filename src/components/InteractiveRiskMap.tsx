import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  ShieldAlert,
  CloudRain,
  Waves,
  Droplets,
  Mountain,
  Navigation,
  Info,
  Clock,
  Radio,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Download,
  Activity,
  BatteryCharging,
  Wifi,
  X
} from 'lucide-react';
import { MonitoredZone, RiskLevel } from '../types';
import { getRiskColorClass } from '../utils/floodAlgorithm';

interface InteractiveRiskMapProps {
  zones: MonitoredZone[];
  selectedZone: MonitoredZone;
  onSelectZone: (zone: MonitoredZone) => void;
  onNavigateToAlerts?: () => void;
}

export const InteractiveRiskMap: React.FC<InteractiveRiskMapProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  onNavigateToAlerts,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    riskZones: true,
    riverNetwork: true,
    elevationContours: true,
    telemetryMarkers: true,
  });

  // Filtered zones
  const filteredZones = useMemo(() => {
    return zones.filter((zone) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        zone.name.toLowerCase().includes(q) ||
        zone.valley.toLowerCase().includes(q) ||
        zone.state.toLowerCase().includes(q) ||
        zone.currentRisk.toLowerCase().includes(q);
      const matchesLevel = filterLevel === 'ALL' || zone.currentRisk === filterLevel;
      return matchesSearch && matchesLevel;
    });
  }, [zones, searchQuery, filterLevel]);

  // Autocomplete search suggestions matching query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return zones.filter((z) =>
      z.name.toLowerCase().includes(q) ||
      z.valley.toLowerCase().includes(q) ||
      z.state.toLowerCase().includes(q) ||
      z.currentRisk.toLowerCase().includes(q) ||
      z.id.toLowerCase().includes(q)
    );
  }, [zones, searchQuery]);

  // Coordinate projection onto map viewbox (width: 900, height: 500)
  const projectCoords = (lat: number, lon: number) => {
    const minLat = 26.5;
    const maxLat = 33.5;
    const minLon = 76.5;
    const maxLon = 89.0;

    const x = ((lon - minLon) / (maxLon - minLon)) * 780 + 60;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 400 + 50;

    return { x, y };
  };

  // Fly / pan and zoom to a specific zone on the map
  const selectAndCenterZone = (zone: MonitoredZone) => {
    onSelectZone(zone);
    const { x, y } = projectCoords(zone.latitude, zone.longitude);
    // Center point (450, 250)
    setPanOffset({ x: Math.round(450 - x), y: Math.round(250 - y) });
    setZoomLevel(1.65);
    setIsSearchFocused(false);
    setSearchQuery(zone.name);
  };

  // Whenever selectedZone changes, smoothly center map viewport on it
  useEffect(() => {
    if (selectedZone) {
      const { x, y } = projectCoords(selectedZone.latitude, selectedZone.longitude);
      setPanOffset({ x: Math.round(450 - x), y: Math.round(250 - y) });
      setZoomLevel((prev) => Math.max(prev, 1.45));
    }
  }, [selectedZone.id]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        selectAndCenterZone(searchResults[0]);
      } else if (filteredZones.length > 0) {
        selectAndCenterZone(filteredZones[0]);
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  // Handle keyboard pan and zoom on map container
  useEffect(() => {
    const handleMapKeys = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === '=' || e.key === '+') {
        setZoomLevel((prev) => Math.min(2.5, prev + 0.2));
      } else if (e.key === '-' || e.key === '_') {
        setZoomLevel((prev) => Math.max(0.7, prev - 0.2));
      } else if (e.key === 'ArrowUp') {
        setPanOffset((prev) => ({ ...prev, y: prev.y + 20 }));
      } else if (e.key === 'ArrowDown') {
        setPanOffset((prev) => ({ ...prev, y: prev.y - 20 }));
      } else if (e.key === 'ArrowLeft') {
        setPanOffset((prev) => ({ ...prev, x: prev.x + 20 }));
      } else if (e.key === 'ArrowRight') {
        setPanOffset((prev) => ({ ...prev, x: prev.x - 20 }));
      }
    };

    window.addEventListener('keydown', handleMapKeys);
    return () => window.removeEventListener('keydown', handleMapKeys);
  }, []);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(0.7, Math.min(2.5, prev + delta)));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSearchQuery('');
    setFilterLevel('ALL');
  };

  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: zones.map((z) => ({
        type: 'Feature',
        properties: {
          name: z.name,
          valley: z.valley,
          state: z.state,
          risk: z.currentRisk,
          riskScore: z.riskScore,
          rainfall: z.rainfall,
          riverLevel: z.riverLevel,
          soilMoisture: z.soilMoisture,
          elevation: z.elevation,
          slope: z.slope,
        },
        geometry: {
          type: 'Point',
          coordinates: [z.longitude, z.latitude],
        },
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojson, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `floodguard_himalayan_zones_${Date.now()}.geojson`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const selectedColor = getRiskColorClass(selectedZone.currentRisk);

  return (
    <div className="space-y-4">
      {/* Top Map Toolbar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Geospatial Disaster Telemetry
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              Topographic GIS Prototype
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Himalayan Catchment Flood Risk Map
          </h2>
        </div>

        {/* Search & Filter & GeoJSON export */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Enhanced Location Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search valley, location, state... (/ key)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              onKeyDown={handleSearchKeyDown}
              className="text-xs pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white w-52 sm:w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  handleReset();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Instant Floating Search Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden max-h-72 overflow-y-auto min-w-[280px]">
                {searchResults.length > 0 ? (
                  <div className="py-1">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span>Matches ({searchResults.length})</span>
                      <span className="text-[9px] text-cyan-600 dark:text-cyan-400">Click or Press Enter</span>
                    </div>
                    {searchResults.map((zone) => {
                      const colorClass = getRiskColorClass(zone.currentRisk);
                      const isSelected = selectedZone.id === zone.id;
                      return (
                        <button
                          key={`search-res-${zone.id}`}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectAndCenterZone(zone);
                          }}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                            isSelected ? 'bg-cyan-50 dark:bg-cyan-950/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <MapPin className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                              zone.currentRisk === 'CRITICAL' ? 'text-red-500' :
                              zone.currentRisk === 'HIGH' ? 'text-orange-500' :
                              zone.currentRisk === 'MODERATE' ? 'text-amber-500' : 'text-emerald-500'
                            }`} />
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                {zone.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                {zone.valley} · {zone.state}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${colorClass.badge}`}>
                              {zone.currentRisk}
                            </span>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                              {zone.rainfall} mm/h · {zone.riverLevel}m
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : searchQuery.trim().length > 0 ? (
                  <div className="p-3 text-center text-xs text-slate-500">
                    <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                      No catchments matching "{searchQuery}"
                    </p>
                    <div className="text-[11px] text-slate-400 mb-1.5">Quick jump to valley:</div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {zones.slice(0, 4).map((z) => (
                        <button
                          key={`fallback-chip-${z.id}`}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectAndCenterZone(z);
                          }}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700"
                        >
                          {z.name.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 text-xs">
                    <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5 px-1">
                      Quick Valley Jump
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {zones.slice(0, 6).map((z) => (
                        <button
                          key={`quick-chip-${z.id}`}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectAndCenterZone(z);
                          }}
                          className="p-1.5 rounded text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between"
                        >
                          <span className="truncate">{z.name.split(' ')[0]}</span>
                          <span className={`text-[9px] font-bold px-1 rounded ${
                            z.currentRisk === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                            z.currentRisk === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {z.currentRisk.slice(0, 4)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterLevel === lvl
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl === 'ALL' ? 'All Zones' : lvl}
              </button>
            ))}
          </div>

          {/* GeoJSON Export Button */}
          <button
            onClick={handleExportGeoJSON}
            className="p-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
            title="Export Zones as GeoJSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GeoJSON</span>
          </button>
        </div>
      </div>

      {/* Main Map Viewport & Location Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Map Canvas (8 or 9 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden relative shadow-inner min-h-[480px] sm:min-h-[540px] flex flex-col justify-between">
          
          {/* Top Controls Overlay */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            {/* Map Legend */}
            <div className="pointer-events-auto flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-xs shadow-lg">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 hidden sm:inline">
                Risk Levels:
              </span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Low</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Mod</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] text-orange-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>High</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] text-red-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span>Crit</span>
                </span>
              </div>
            </div>

            {/* Layer Toggles */}
            <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-xs shadow-lg">
              <button
                onClick={() => setActiveLayers((p) => ({ ...p, riskZones: !p.riskZones }))}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                  activeLayers.riskZones ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Toggle Risk Zone Polygons"
              >
                Risk Zones
              </button>
              <button
                onClick={() => setActiveLayers((p) => ({ ...p, riverNetwork: !p.riverNetwork }))}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                  activeLayers.riverNetwork ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Toggle River Drainage Channels"
              >
                Drainage
              </button>
              <button
                onClick={() => setActiveLayers((p) => ({ ...p, elevationContours: !p.elevationContours }))}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                  activeLayers.elevationContours ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Toggle Topographic Elevation Contours"
              >
                Contours
              </button>
            </div>
          </div>

          {/* Interactive SVG GIS Surface */}
          <div className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center p-2">
            <svg
              viewBox="0 0 900 500"
              className="w-full h-full transition-transform duration-300"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'center center',
              }}
            >
              <defs>
                {/* Elevation relief gradient */}
                <radialGradient id="mountainRelief" cx="40%" cy="40%" r="65%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </radialGradient>

                {/* River water glow filter */}
                <filter id="waterGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background mountain terrain base */}
              <rect width="900" height="500" fill="url(#mountainRelief)" rx="12" />

              {/* Elevation Contours */}
              {activeLayers.elevationContours && (
                <g stroke="#334155" strokeWidth="0.8" fill="none" opacity="0.45" strokeDasharray="3 3">
                  <path d="M 50,150 Q 220,100 400,160 T 750,120 T 880,180" />
                  <path d="M 60,240 Q 250,190 440,250 T 780,210 T 890,260" />
                  <path d="M 80,330 Q 280,280 480,330 T 790,310 T 880,370" />
                  <path d="M 120,410 Q 310,380 520,420 T 810,400" />
                  {/* High peak topography concentric rings */}
                  <ellipse cx="230" cy="190" rx="90" ry="50" />
                  <ellipse cx="230" cy="190" rx="55" ry="30" />
                  <ellipse cx="720" cy="270" rx="80" ry="45" />
                  <ellipse cx="720" cy="270" rx="45" ry="25" />
                </g>
              )}

              {/* River Hydrographic Network */}
              {activeLayers.riverNetwork && (
                <g filter="url(#waterGlow)">
                  {/* Main Himalayan River Artery 1 (Bhagirathi / Alaknanda to Ganga) */}
                  <path
                    d="M 120,60 Q 180,140 230,190 T 290,280 T 360,340 T 420,430"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  {/* Tributary Mandakini */}
                  <path
                    d="M 280,110 Q 260,150 230,190"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  {/* Tributary Pindar */}
                  <path
                    d="M 380,210 Q 330,240 290,280"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  {/* East Himalayan River Artery 2 (Teesta Gorge) */}
                  <path
                    d="M 680,100 Q 710,180 720,270 T 750,380 T 790,460"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="3.0"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  {/* Tributary Beas (North-West reach) */}
                  <path
                    d="M 80,140 Q 120,200 160,260 T 210,360"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.4"
                    opacity="0.8"
                  />
                </g>
              )}

              {/* Risk Zone Overlays (Translucent buffer buffers) */}
              {activeLayers.riskZones &&
                zones.map((zone) => {
                  const { x, y } = projectCoords(zone.latitude, zone.longitude);
                  const isCritical = zone.currentRisk === 'CRITICAL';
                  const isHigh = zone.currentRisk === 'HIGH';
                  const isMod = zone.currentRisk === 'MODERATE';
                  const color = isCritical
                    ? '#ef4444'
                    : isHigh
                    ? '#f97316'
                    : isMod
                    ? '#f59e0b'
                    : '#10b981';

                  const radius = isCritical ? 44 : isHigh ? 36 : isMod ? 28 : 22;

                  return (
                    <g key={`zone-overlay-${zone.id}`}>
                      {/* Outer hazard pulse ring for Critical zones */}
                      {isCritical && (
                        <circle
                          cx={x}
                          cy={y}
                          r={radius * 1.5}
                          fill="none"
                          stroke={color}
                          strokeWidth="1.5"
                          opacity="0.4"
                          className="animate-ping"
                          style={{ transformOrigin: `${x}px ${y}px` }}
                        />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={radius}
                        fill={color}
                        fillOpacity={selectedZone.id === zone.id ? '0.35' : '0.18'}
                        stroke={color}
                        strokeWidth={selectedZone.id === zone.id ? '2' : '1'}
                        strokeDasharray={isCritical ? '4 2' : 'none'}
                      />
                    </g>
                  );
                })}

              {/* Sensor Station Markers */}
              {activeLayers.telemetryMarkers &&
                filteredZones.map((zone) => {
                  const { x, y } = projectCoords(zone.latitude, zone.longitude);
                  const isSelected = selectedZone.id === zone.id;
                  const isCritical = zone.currentRisk === 'CRITICAL';
                  const isHigh = zone.currentRisk === 'HIGH';
                  const isMod = zone.currentRisk === 'MODERATE';
                  const markerColor = isCritical
                    ? '#ef4444'
                    : isHigh
                    ? '#f97316'
                    : isMod
                    ? '#f59e0b'
                    : '#10b981';

                  return (
                    <g
                      key={`marker-${zone.id}`}
                      onClick={() => onSelectZone(zone)}
                      className="cursor-pointer transition-transform hover:scale-125"
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    >
                      {/* Selection halo and target crosshair */}
                      {isSelected && (
                        <g>
                          <circle
                            cx={x}
                            cy={y}
                            r="22"
                            fill="none"
                            stroke="#06b6d4"
                            strokeWidth="1.5"
                            opacity="0.8"
                            className="animate-ping"
                            style={{ transformOrigin: `${x}px ${y}px` }}
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r="16"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="2"
                            strokeDasharray="4 2"
                          />
                          {/* Crosshairs */}
                          <line x1={x - 22} y1={y} x2={x - 12} y2={y} stroke="#38bdf8" strokeWidth="1.5" />
                          <line x1={x + 12} y1={y} x2={x + 22} y2={y} stroke="#38bdf8" strokeWidth="1.5" />
                          <line x1={x} y1={y - 22} x2={x} y2={y - 12} stroke="#38bdf8" strokeWidth="1.5" />
                          <line x1={x} y1={y + 12} x2={x} y2={y + 22} stroke="#38bdf8" strokeWidth="1.5" />
                        </g>
                      )}

                      {/* Main Node */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? '9' : '7'}
                        fill={markerColor}
                        stroke="#0f172a"
                        strokeWidth="2"
                      />

                      {/* Center dot */}
                      <circle cx={x} cy={y} r="2.5" fill="#ffffff" />

                      {/* Text callout label */}
                      <text
                        x={x + 10}
                        y={y + 4}
                        fill="#ffffff"
                        fontSize={isSelected ? '11' : '10'}
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        fontFamily="monospace"
                        className="drop-shadow-md select-none pointer-events-none"
                      >
                        {zone.name.split(' ')[0]} ({zone.riskScore})
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>

          {/* Bottom Map Status Strip & Zoom controls */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            {/* Disclaimer pill & Keyboard pan hint */}
            <div className="pointer-events-auto p-2 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-[10px] text-slate-400 font-mono">
              <span>DEMO / SIMULATED DATA · Keys: <kbd className="px-1 py-0.2 bg-slate-800 rounded text-slate-300">+/-</kbd> Zoom, <kbd className="px-1 py-0.2 bg-slate-800 rounded text-slate-300">↑↓←→</kbd> Pan</span>
            </div>

            {/* Zoom / Pan Controls */}
            <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-lg">
              <button
                onClick={() => handleZoom(0.25)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Zoom In (+ Key)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom(-0.25)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Zoom Out (- Key)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Location Details Drawer (Mandatory Section 8 items) */}
        <div className="lg:col-span-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${selectedColor.badge}`}>
                  {selectedZone.currentRisk} RISK
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedZone.state}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedZone.name}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {selectedZone.valley}
              </span>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                {selectedZone.riskScore}
              </span>
              <span className="text-xs text-slate-400 block font-mono">/100</span>
            </div>
          </div>

          {/* Key Hydrological Metrics Table */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <CloudRain className="w-3.5 h-3.5 text-cyan-500" />
                <span>Rainfall Intensity</span>
              </div>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {selectedZone.rainfall} mm/hr
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Waves className="w-3.5 h-3.5 text-blue-500" />
                <span>River Stage</span>
              </div>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {selectedZone.riverLevel} m ({selectedZone.riverRateOfRise >= 0 ? `+${selectedZone.riverRateOfRise}m/h` : `${selectedZone.riverRateOfRise}m/h`})
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Droplets className="w-3.5 h-3.5 text-amber-500" />
                <span>Soil Moisture</span>
              </div>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {selectedZone.soilMoisture}%
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Mountain className="w-3.5 h-3.5 text-emerald-500" />
                <span>Terrain Gradient</span>
              </div>
              <span className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {selectedZone.slope}% slope ({selectedZone.elevation}m)
              </span>
            </div>
          </div>

          {/* Cross-section river elevation schematic preview */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>Channel Hydraulic Defile</span>
              <span>Stage: {selectedZone.riverLevel}m / Danger: 5.2m</span>
            </div>
            <div className="h-6 w-full rounded bg-slate-200 dark:bg-slate-900 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (selectedZone.riverLevel / 6.0) * 100)}%` }}
              />
              <div className="absolute top-0 bottom-0 left-[86%] w-0.5 bg-red-500" title="Danger Mark" />
            </div>
          </div>

          {/* Recommended Action Box */}
          <div className={`p-3.5 rounded-xl border ${selectedColor.border} ${selectedColor.bg} space-y-1`}>
            <span className={`text-xs font-bold ${selectedColor.text}`}>
              Recommended Action
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              {selectedZone.recommendedAction}
            </p>
          </div>

          {/* Demographic & Telemetry Meta */}
          <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between">
              <span>Population at Risk:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {selectedZone.populationAtRisk.toLocaleString()} residents
              </span>
            </div>
            <div className="flex justify-between">
              <span>Catchment Area:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {selectedZone.catchmentAreaKm2} km²
              </span>
            </div>
            <div className="flex justify-between">
              <span>Telemetry Status:</span>
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {selectedZone.status} ({selectedZone.lastUpdated})
              </span>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => setShowDiagnosticsModal(true)}
              className="py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-500" />
              <span>Full Telemetry</span>
            </button>

            {onNavigateToAlerts && (
              <button
                onClick={onNavigateToAlerts}
                className="py-2.5 px-3 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Alerts</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Sensor Node Diagnostics Modal */}
      {showDiagnosticsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="max-w-xl w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Station Diagnostics: {selectedZone.name}
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                    Station ID: AWS-CWC-{selectedZone.id.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDiagnosticsModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 flex items-center gap-1 font-mono text-[10px]">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Solar Battery</span>
                </span>
                <strong className="text-sm font-mono text-slate-900 dark:text-white block mt-1">
                  12.8 V (96%)
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 flex items-center gap-1 font-mono text-[10px]">
                  <Wifi className="w-3.5 h-3.5 text-blue-500" />
                  <span>Cellular RSSI</span>
                </span>
                <strong className="text-sm font-mono text-slate-900 dark:text-white block mt-1">
                  -68 dBm (4G LTE)
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 flex items-center gap-1 font-mono text-[10px]">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Polling Rate</span>
                </span>
                <strong className="text-sm font-mono text-slate-900 dark:text-white block mt-1">
                  15 min interval
                </strong>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Recent Sensor Telemetry Packets
              </span>
              <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800 max-h-36 overflow-y-auto">
                <div className="text-cyan-400">&gt; [LIVE_STREAM] AWS-{selectedZone.id}: Heartbeat OK</div>
                <div>[01:40] RAIN_RATE: {selectedZone.rainfall}mm/hr | STAGE: {selectedZone.riverLevel}m | RATE: +{selectedZone.riverRateOfRise}m/h</div>
                <div>[01:25] SOIL_MOISTURE: {selectedZone.soilMoisture}% | TWI_INDEX: 14.2 | TEMP: 17.5C</div>
                <div>[01:10] CAP_DISPATCH: Status nominal, mesh radio verified</div>
                <div className="text-emerald-400">&gt; INGESTION_LATENCY: 42ms (FastAPI MQTT Gateway)</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowDiagnosticsModal(false)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
              >
                Close Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
