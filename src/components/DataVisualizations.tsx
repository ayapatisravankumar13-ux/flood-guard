import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  CloudRain,
  Waves,
  Droplets,
  Zap,
  PieChart,
  Calendar,
  Layers,
  Info
} from 'lucide-react';
import { TimeSeriesPoint, MonitoredZone } from '../types';

interface DataVisualizationsProps {
  timeSeries: TimeSeriesPoint[];
  zones: MonitoredZone[];
}

export const DataVisualizations: React.FC<DataVisualizationsProps> = ({
  timeSeries,
  zones,
}) => {
  const [activeRange, setActiveRange] = useState<'6h' | '12h' | '24h' | '48h'>('24h');
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState<string | null>(null);

  // Compute distribution of zones
  const distribution = {
    LOW: zones.filter((z) => z.currentRisk === 'LOW').length,
    MODERATE: zones.filter((z) => z.currentRisk === 'MODERATE').length,
    HIGH: zones.filter((z) => z.currentRisk === 'HIGH').length,
    CRITICAL: zones.filter((z) => z.currentRisk === 'CRITICAL').length,
  };
  const totalZones = zones.length;

  // Donut SVG parameters
  const donutData = [
    { label: 'Low', key: 'LOW', count: distribution.LOW, color: '#10b981' },
    { label: 'Moderate', key: 'MODERATE', count: distribution.MODERATE, color: '#f59e0b' },
    { label: 'High', key: 'HIGH', count: distribution.HIGH, color: '#f97316' },
    { label: 'Critical', key: 'CRITICAL', count: distribution.CRITICAL, color: '#ef4444' },
  ];

  let accumulatedPercent = 0;
  const donutSegments = donutData.map((d) => {
    const percent = d.count / totalZones;
    const startAngle = accumulatedPercent * 2 * Math.PI;
    accumulatedPercent += percent;
    const endAngle = accumulatedPercent * 2 * Math.PI;

    // SVG arc coordinates
    const r = 70;
    const cx = 90;
    const cy = 90;
    const x1 = cx + r * Math.sin(startAngle);
    const y1 = cy - r * Math.cos(startAngle);
    const x2 = cx + r * Math.sin(endAngle);
    const y2 = cy - r * Math.cos(endAngle);
    const largeArc = percent > 0.5 ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      ...d,
      percent: Math.round(percent * 100),
      pathData,
    };
  });

  // Reusable Line/Area chart builder
  const renderLineChart = (
    title: string,
    icon: React.ReactNode,
    metricKey: keyof TimeSeriesPoint,
    unit: string,
    color: string,
    fillColor: string,
    minY: number,
    maxY: number,
    thresholdValue?: number,
    thresholdLabel?: string
  ) => {
    const width = 500;
    const height = 180;
    const paddingX = 40;
    const paddingY = 25;

    const points = timeSeries.map((pt, i) => {
      const val = Number(pt[metricKey]);
      const x = paddingX + (i / (timeSeries.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((val - minY) / (maxY - minY)) * (height - 2 * paddingY);
      return { x, y, val, time: pt.time };
    });

    const pathD = points.reduce((acc, curr, i) => {
      return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    const thresholdY = thresholdValue !== undefined
      ? height - paddingY - ((thresholdValue - minY) / (maxY - minY)) * (height - 2 * paddingY)
      : null;

    const activePoint = hoveredPointIdx !== null ? points[hoveredPointIdx] : points[points.length - 1];

    return (
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{title}</h4>
              <span className="text-[10px] text-slate-400">Past 24h Telemetry</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {activePoint.val.toFixed(1)} {unit}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              @ {activePoint.time}
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-40 overflow-visible"
            onMouseLeave={() => setHoveredPointIdx(null)}
          >
            {/* Gridlines */}
            <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
            <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#334155" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="3 3" />
            <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#334155" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="3 3" />

            {/* Threshold line if applicable */}
            {thresholdY !== null && (
              <g>
                <line
                  x1={paddingX}
                  y1={thresholdY}
                  x2={width - paddingX}
                  y2={thresholdY}
                  stroke="#ef4444"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                />
                <text
                  x={width - paddingX}
                  y={thresholdY - 4}
                  fill="#ef4444"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {thresholdLabel}
                </text>
              </g>
            )}

            {/* Filled area */}
            <path d={areaD} fill={fillColor} />

            {/* Main curve */}
            <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Hover Points and Interaction Slices */}
            {points.map((p, i) => (
              <g key={i}>
                <rect
                  x={p.x - 15}
                  y={0}
                  width="30"
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPointIdx(i)}
                />
                {(hoveredPointIdx === i || (hoveredPointIdx === null && i === points.length - 1)) && (
                  <g>
                    <line x1={p.x} y1={paddingY} x2={p.x} y2={height - paddingY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={p.x} cy={p.y} r="5" fill={color} stroke="#ffffff" strokeWidth="2" />
                  </g>
                )}
              </g>
            ))}

            {/* X-axis labels */}
            {points.map((p, i) => (
              i % 2 === 0 && (
                <text
                  key={`lbl-${i}`}
                  x={p.x}
                  y={height - 8}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {p.time}
                </text>
              )
            ))}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Timeframe Filter */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Temporal Telemetry Analytics
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hydrological Data Visualizations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Synchronized time-series trends tracking storm progression and catchment response.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start md:self-auto">
          {(['6h', '12h', '24h', '48h'] as const).map((rng) => (
            <button
              key={rng}
              onClick={() => setActiveRange(rng)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeRange === rng
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {rng}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Charts: 4 Line Charts + 1 Donut Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 1. Rainfall Trend */}
        {renderLineChart(
          'Rainfall Intensity Trend',
          <CloudRain className="w-4 h-4 text-cyan-500" />,
          'rainfall',
          'mm/hr',
          '#06b6d4',
          'rgba(6, 182, 212, 0.12)',
          0,
          100,
          50,
          'Cloudburst Threshold (50 mm/hr)'
        )}

        {/* 2. River Water Level */}
        {renderLineChart(
          'River Water Level Surge',
          <Waves className="w-4 h-4 text-blue-500" />,
          'riverLevel',
          'm',
          '#3b82f6',
          'rgba(59, 130, 246, 0.12)',
          1.0,
          6.0,
          5.2,
          'Danger Mark (5.2m)'
        )}

        {/* 3. Soil Moisture Saturation */}
        {renderLineChart(
          'Soil Saturation Profile',
          <Droplets className="w-4 h-4 text-amber-500" />,
          'soilMoisture',
          '%',
          '#f59e0b',
          'rgba(245, 158, 11, 0.12)',
          30,
          100,
          80,
          'Field Capacity Threshold (80%)'
        )}

        {/* 4. Risk Score Evolution */}
        {renderLineChart(
          'Composite Risk Score Trend',
          <Zap className="w-4 h-4 text-rose-500" />,
          'riskScore',
          '/100',
          '#f43f5e',
          'rgba(244, 63, 94, 0.12)',
          10,
          100,
          75,
          'Critical Warning Boundary (76/100)'
        )}

      </div>

      {/* Risk Distribution Donut & Monitored Catchments Breakdown */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-500" />
              <span>Catchment Risk Distribution</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-valley distribution across all {totalZones} active Himalayan telemetry nodes.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total Monitored: {totalZones} Basin Zones
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Donut Chart SVG */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 180 180" className="w-full h-full transform -rotate-90">
                {donutSegments.map((segment) => (
                  <path
                    key={segment.key}
                    d={segment.pathData}
                    fill={segment.color}
                    className="transition-opacity hover:opacity-80 cursor-pointer"
                    onMouseEnter={() => setHoveredDonutSegment(segment.key)}
                    onMouseLeave={() => setHoveredDonutSegment(null)}
                  />
                ))}
                {/* Donut Hole */}
                <circle cx="90" cy="90" r="46" fill="currentColor" className="text-white dark:text-slate-900" />
              </svg>

              {/* Central Hole Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                  {totalZones}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Valleys
                </span>
              </div>
            </div>
          </div>

          {/* Donut Legend and Detailed Counts */}
          <div className="md:col-span-7 grid grid-cols-2 gap-3">
            {donutSegments.map((seg) => (
              <div
                key={seg.key}
                className={`p-3 rounded-xl border transition-all ${
                  hoveredDonutSegment === seg.key
                    ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {seg.label} Risk
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {seg.percent}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {seg.count} of {totalZones} catchments
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
